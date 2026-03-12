---
title: Use the Secrets Proxy
description: "Learn how to configure the Secrets Proxy to access secrets from an external Vault secret store"
sidebar_position: 50
---

The Secrets Proxy lets Crossplane providers read and write secrets directly
to HashiCorp Vault instead of storing them as Kubernetes Secrets. Providers
use the standard Kubernetes Secret API — the proxy intercepts those calls and
routes them to Vault transparently.

## Prerequisites

Before you begin, ensure you have:

* [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
* [Helm](https://helm.sh/docs/intro/install/) installed
* The [Vault CLI](https://developer.hashicorp.com/vault/docs/install) installed
* The `up` CLI installed
* A UXP cluster running version 2.2 or later and a valid license
* A HashiCorp Vault instance reachable from your cluster, with Kubernetes auth enabled

## Enable the Secrets Proxy

Enable the Secrets Proxy on your UXP installation:

```shell
helm repo add upbound-stable https://charts.upbound.io/stable && helm repo update
```

```shell
helm install crossplane \
  --namespace crossplane-system \
  --create-namespace \
  upbound-stable/crossplane \
  --devel \
  --set upbound.secretsProxy.enabled=true
```

```shell
kubectl get pods -n crossplane-system -w
```

## Configure Vault

Store the AWS credentials that providers will read. The Secrets Proxy serves
these to providers as if they were a Kubernetes Secret, using the `ini` format
expected by the AWS provider family:

```shell
vault kv put secret/crossplane-system/aws-official-creds credentials="
[default]
aws_access_key_id = <AWS_ACCESS_KEY_ID>
aws_secret_access_key = <AWS_SECRET_ACCESS_KEY>
"
```

Create a policy granting read access to secrets in `crossplane-system`:

```shell
vault policy write crossplane-policy - <<'EOF'
path "secret/data/crossplane-system/*" {
  capabilities = ["read", "list"]
}
EOF
```

## Configure Vault Kubernetes auth

Configure Vault to trust service account tokens from your UXP cluster so the
Secrets Proxy sidecar can authenticate on behalf of provider pods.

1. Create a service account for Vault token review:

    ```shell
    kubectl create serviceaccount vault-auth -n crossplane-system

    kubectl create clusterrolebinding vault-auth-delegator \
      --clusterrole=system:auth-delegator \
      --serviceaccount=crossplane-system:vault-auth
    ```

2. Generate a long-lived token for the reviewer service account:

    ```shell
    REVIEWER_JWT=$(kubectl create token vault-auth \
      -n crossplane-system --duration=8760h)
    ```

3. Retrieve the cluster CA certificate and API server URL. For local clusters
   (Kind, minikube), use the in-cluster Kubernetes service address so Vault can
   reach the API server from inside the cluster:

    ```shell
    KUBE_CA_CERT=$(kubectl config view --raw --minify --flatten \
      --output='jsonpath={.clusters[].cluster.certificate-authority-data}' \
      | base64 --decode)

    KUBE_HOST="https://kubernetes.default.svc.cluster.local"
    ```

4. Enable the Kubernetes auth method and configure it with the cluster details:

    ```shell
    vault auth enable kubernetes

    vault write auth/kubernetes/config \
      kubernetes_host="${KUBE_HOST}" \
      kubernetes_ca_cert="${KUBE_CA_CERT}" \
      token_reviewer_jwt="${REVIEWER_JWT}"
    ```

5. Create a role that binds all service accounts in `crossplane-system` to the
   policy:

    ```shell
    vault write auth/kubernetes/role/crossplane \
      bound_service_account_names="*" \
      bound_service_account_namespaces="crossplane-system" \
      bound_audiences="https://kubernetes.default.svc.cluster.local" \
      policies=crossplane-policy \
      ttl=1h
    ```

<!-- vale Google.Headings = NO -->
## Install the Secret Store add-on

Apply the add-on to deploy the Secrets Proxy backend:

```yaml title=addon.yaml
apiVersion: pkg.upbound.io/v1beta1
kind: AddOn
metadata:
  name: secret-store-vault
spec:
  package: xpkg.upbound.io/upbound/secret-store-vault-addon:v0.1.0
```

```shell
kubectl apply -f addon.yaml
```

Once the add-on is ready, create a `StoreConfig` pointing to your Vault
instance:

```yaml
apiVersion: vault.secrets.upbound.io/v1alpha1
kind: StoreConfig
metadata:
  name: vault
spec:
  address: http://vault.vault-system.svc.cluster.local:8200
  mountPath: secret
  kvVersion: KVv2
  auth:
    method: kubernetes
    kubernetes:
      role: crossplane
```

```shell
kubectl apply -f storeconfig.yaml
kubectl get storeconfigs
```

## Configure the webhook

Apply the webhook configuration to inject the Secrets Proxy sidecar into
Crossplane and provider pods. The webhook restarts all matching pods on apply:

```yaml
apiVersion: secretsproxy.upbound.io/v1alpha1
kind: WebhookConfig
metadata:
  name: crossplane-app
spec:
  objectSelector:
    matchLabels:
      app: crossplane
---
apiVersion: secretsproxy.upbound.io/v1alpha1
kind: WebhookConfig
metadata:
  name: crossplane-provider
spec:
  objectSelector:
    matchExpressions:
      - key: pkg.crossplane.io/provider
        operator: Exists
```

```shell
kubectl apply -f webhookconfig.yaml
```

## Install providers and functions

1. Install the AWS provider family and IAM provider. Provider pods start with
   the Secrets Proxy sidecar injected because the webhook matches the
   `pkg.crossplane.io/provider` label:

    ```yaml
    apiVersion: pkg.crossplane.io/v1
    kind: Provider
    metadata:
      name: upbound-provider-aws-iam
    spec:
      package: xpkg.upbound.io/upbound/provider-aws-iam:v2.2.0
      ignoreCrossplaneConstraints: true
    ---
    apiVersion: pkg.crossplane.io/v1
    kind: Provider
    metadata:
      name: upbound-provider-family-aws
    spec:
      package: xpkg.upbound.io/upbound/provider-family-aws:v2.2.0
      ignoreCrossplaneConstraints: true
    ```

    ```shell
    kubectl apply -f providers.yaml
    ```

2. Install the pipeline functions:

    ```yaml
    apiVersion: pkg.crossplane.io/v1
    kind: Function
    metadata:
      name: function-go-templating
    spec:
      package: xpkg.crossplane.io/crossplane-contrib/function-go-templating:v0.11.2
    ---
    apiVersion: pkg.crossplane.io/v1
    kind: Function
    metadata:
      name: function-auto-ready
    spec:
      package: xpkg.crossplane.io/crossplane-contrib/function-auto-ready:v0.6.0
    ```

    ```shell
    kubectl apply -f functions.yaml
    ```

<!-- vale write-good.Passive = NO -->
3. Wait for providers and functions to become healthy, then create the provider
   config. The `aws-official-creds` secret lives in Vault. The Secrets Proxy
   intercepts the Secret API call and serves it transparently:
<!-- vale write-good.Passive = YES -->

    ```yaml
    apiVersion: aws.m.upbound.io/v1beta1
    kind: ClusterProviderConfig
    metadata:
      name: default
      namespace: crossplane-system
    spec:
      credentials:
        secretRef:
          key: credentials
          name: aws-official-creds
          namespace: crossplane-system
        source: Secret
    ```

    ```shell
    kubectl apply -f provider-config.yaml
    ```

## Deploy the composition

Apply the `UserAccessKey` XRD and composition. This composition creates an IAM
user and two access keys, writing connection details back to Vault through the
Secrets Proxy:

```yaml title=comp.yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: useraccesskeys-go-templating
spec:
  compositeTypeRef:
    apiVersion: example.org/v1alpha1
    kind: UserAccessKey
  mode: Pipeline
  pipeline:
  - step: render-templates
    functionRef:
      name: function-go-templating
    input:
      apiVersion: gotemplating.fn.crossplane.io/v1beta1
      kind: GoTemplate
      source: Inline
      inline:
        template: |
          ---
          apiVersion: iam.aws.m.upbound.io/v1beta1
          kind: User
          metadata:
            annotations:
              {{ setResourceNameAnnotation "user" }}
          spec:
            forProvider: {}
          ---
          apiVersion: iam.aws.m.upbound.io/v1beta1
          kind: AccessKey
          metadata:
            annotations:
              {{ setResourceNameAnnotation "accesskey-0" }}
          spec:
            forProvider:
              userSelector:
                matchControllerRef: true
            writeConnectionSecretToRef:
              name: {{ $.observed.composite.resource.metadata.name }}-accesskey-secret-0
          ---
          apiVersion: iam.aws.m.upbound.io/v1beta1
          kind: AccessKey
          metadata:
            annotations:
              {{ setResourceNameAnnotation "accesskey-1" }}
          spec:
            forProvider:
              userSelector:
                matchControllerRef: true
            writeConnectionSecretToRef:
              name: {{ $.observed.composite.resource.metadata.name }}-accesskey-secret-1
          ---
          apiVersion: v1
          kind: Secret
          metadata:
            name: {{ dig "spec" "writeConnectionSecretToRef" "name" "" $.observed.composite.resource}}
            annotations:
              {{ setResourceNameAnnotation "connection-secret" }}
          {{ if eq $.observed.resources nil }}
          data: {}
          {{ else }}
          data:
            user-0: {{ ( index $.observed.resources "accesskey-0" ).connectionDetails.username }}
            user-1: {{ ( index $.observed.resources "accesskey-1" ).connectionDetails.username }}
            password-0: {{ ( index $.observed.resources "accesskey-0" ).connectionDetails.password }}
            password-1: {{ ( index $.observed.resources "accesskey-1" ).connectionDetails.password }}
          {{ end }}
  - step: ready
    functionRef:
      name: function-auto-ready
---
apiVersion: apiextensions.crossplane.io/v2
kind: CompositeResourceDefinition
metadata:
  name: useraccesskeys.example.org
spec:
  group: example.org
  names:
    kind: UserAccessKey
    plural: useraccesskeys
  scope: Namespaced
  versions:
  - name: v1alpha1
    served: true
    referenceable: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              writeConnectionSecretToRef:
                type: object
                properties:
                  name:
                    type: string
```

```shell
kubectl apply -f comp.yaml
```

## Create the composite resource

1. Edit `xr.yaml` and replace `<put-your-initials>` with your initials in both
   the `metadata.name` and `spec.writeConnectionSecretToRef.name` fields:

    ```yaml
    apiVersion: example.org/v1alpha1
    kind: UserAccessKey
    metadata:
      namespace: default
      name: <your-initials>-keys
    spec:
      writeConnectionSecretToRef:
        name: <your-initials>-keys-connection-details
    ```

2. Apply the resource and verify reconciliation:

    ```shell
    kubectl apply -f xr.yaml
    kubectl get managed
    kubectl get composite
    ```

    Connection details are stored in Vault, not in Kubernetes. Confirm no new
    secrets were created:

    ```shell
    kubectl get secret -n crossplane-system
    ```

## Clean up

Delete the composite resource. The garbage collector automatically removes the
associated secrets from Vault:

```shell
kubectl delete -f xr.yaml
```


