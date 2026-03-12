---
title: Use the Secrets Proxy
description: "Learn how to configure the Secrets Proxy to access secrets from an external Vault secret store"
sidebar_position: 50
---

This guide explains how to configure the Secrets Proxy on an existing UXP
instance to retrieve secrets from an external HashiCorp Vault.

The Secret Store add-on securely stores your secrets instead of storing them as
a Kubernetes secret in the cluster.

The example composition creates IAM users and access keys. Rather than writing
connection secrets to Kubernetes, the Secrets Proxy transparently reads and
writes them to Vault.

## Prerequisites

Before you begin, ensure you have:

* A running UXP instance with the Secrets Proxy feature enabled
* A running HashiCorp Vault instance
* [kubectl](https://kubernetes.io/docs/tasks/tools/) configured to point to your UXP cluster
* The [Vault CLI](https://developer.hashicorp.com/vault/docs/install) installed with `VAULT_ADDR` and `VAULT_TOKEN` set
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) configured with credentials that can manage IAM resources

:::note
To enable the Secrets Proxy on an existing UXP installation, upgrade with
`--set upbound.secretsProxy.enabled=true`.
:::

## Bootstrap a test Vault instance

If you don't have a Vault instance, you can deploy one in dev mode into your
cluster using the official Helm chart. Dev mode starts with a pre-configured
root token and KV v2 secrets engine enabled at `secret/`. It's not persistent
and is only suitable for testing.

<!-- vale gitlab.SubstitutionWarning = NO -->
1. Add the HashiCorp Helm repo and install Vault in dev mode:
<!-- vale gitlab.SubstitutionWarning = YES -->

    ```shell
    helm repo add hashicorp https://helm.releases.hashicorp.com
    helm repo update

    helm install vault hashicorp/vault \
      --namespace vault-system \
      --create-namespace \
      --set server.dev.enabled=true \
      --set server.dev.devRootToken=root
    ```

2. Wait for the Vault pod to be ready, then set your CLI environment variables:

    ```shell
    kubectl wait pod/vault-0 -n vault-system --for=condition=Ready --timeout=60s

    kubectl port-forward svc/vault 8200:8200 -n vault-system &
    export VAULT_ADDR=http://127.0.0.1:8200
    export VAULT_TOKEN=root
    ```

    The Secrets Proxy sidecar reaches Vault in-cluster at
    `http://vault.vault-system.svc.cluster.local:8200`.

<!-- vale write-good.Passive = NO -->
:::warning
Dev mode Vault is in-memory only. All data is lost when the pod restarts.
:::
<!-- vale write-good.Passive = YES -->

## Configure Vault

Store the AWS credentials that Crossplane providers use to manage resources,
and create a policy granting the Secrets Proxy read access.

1. Store the AWS credentials in Vault. The Secrets Proxy serves these to
   providers as if they were a Kubernetes Secret, using the AWS credentials `ini`
   format expected by the provider family:

    ```shell
    vault kv put secret/crossplane-system/aws-official-creds credentials="
    [default]
    aws_access_key_id = <AWS_ACCESS_KEY_ID>
    aws_secret_access_key = <AWS_SECRET_ACCESS_KEY>
    "
    ```

2. Create a Vault policy that grants read access to secrets in the
   `crossplane-system` scope:

    ```shell
    vault policy write crossplane-policy - <<'EOF'
    path "secret/data/crossplane-system/*" {
      capabilities = ["read", "list"]
    }
    EOF
    ```

## Register your cluster with Vault

Configure Vault's Kubernetes auth method to trust service accounts running in
your UXP cluster. This allows the Secrets Proxy sidecar to authenticate to
Vault and read secrets on behalf of provider pods.

1. Create a service account for Vault token review and grant it permission to
   validate tokens cluster-wide:

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

3. Retrieve the cluster CA certificate and API server URL:

    ```shell
    KUBE_CA_CERT=$(kubectl config view --raw --minify --flatten \
      --output='jsonpath={.clusters[].cluster.certificate-authority-data}' \
      | base64 --decode)

    KUBE_HOST=$(kubectl config view --raw --minify --flatten \
      --output='jsonpath={.clusters[].cluster.server}')
    ```

4. Enable the Kubernetes auth method in Vault and configure it with the cluster
   details:

    ```shell
    vault auth enable kubernetes

    vault write auth/kubernetes/config \
      kubernetes_host="${KUBE_HOST}" \
      kubernetes_ca_cert="${KUBE_CA_CERT}" \
      token_reviewer_jwt="${REVIEWER_JWT}"
    ```

5. Create a Vault role that binds all service accounts in `crossplane-system`
   to the policy:

    ```shell
    vault write auth/kubernetes/role/crossplane \
      bound_service_account_names="*" \
      bound_service_account_namespaces="crossplane-system" \
      policies=crossplane-policy \
      ttl=1h
    ```
<!-- vale Google.Headings = NO -->
## Install the Secret Store add-on

Apply the Secret Store add-on to deploy the `secret-store-vault` component that
connects the Secrets Proxy to your Vault instance:

```yaml
apiVersion: pkg.upbound.io/v1beta1
kind: AddOn
metadata:
  name: secret-store-vault
spec:
  package: xpkg.upbound.io/upbound/secret-store-vault-addon:v0.1.0
  packagePullPolicy: Always
---
apiVersion: pkg.upbound.io/v1beta1
kind: AddOnRuntimeConfig
metadata:
  name: default
spec:
  helm:
    values:
      imagePullSecrets:
      - name: ecr-pull-secret
```

```shell
kubectl apply -f secretstore.yaml
```

## Configure the Secrets Proxy webhook

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

1. Install the AWS provider family and IAM provider. Because the webhook matches
   pods with the `pkg.crossplane.io/provider` label, provider pods start with
   the Secrets Proxy sidecar already injected:

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
   config. The `aws-official-creds` secret is stored in Vault. The Secrets
   Proxy intercepts the Secret API call and serves it transparently:
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

```shell
kubectl apply -f comp.yaml
```

## Create the composite resource

1. Edit `xr.yaml` and replace `<put-your-initials>` with your initials in both
   the `metadata.name` and `spec.writeConnectionSecretToRef.name` fields to
   create a unique name:

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
