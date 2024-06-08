---
title: Secrets Management
weight: 150
description: A guide for how to configure synchronizing external secrets into maanged control planes in a Space.
---

{{< hint "important" >}}
This feature is in preview.
{{< /hint >}}

Upbound's _Shared Secrets_ is a built-in secrets management feature. Shared Secrets lets you store sensitive data such as passwords and certificates used by managed control planes as secrets in an external secret store. This page explains how you can use Shared Secrets to access the secrets stored in your external secret store and synchronize them into managed control planes.

The Shared Secrets feature is derived from the open source [External Secrets Operator (ESO)](https://external-secrets.io). Upbound offers:

1. `SharedSecretStore` and `SharedExternalSecret` APIs to manage syncing external secrets into groups of managed control planes.
2. Each managed control planes has built-in support for External Secrets Operator (ESO) APIs.

## Benefits

The Shared Secrets feature provides the following benefits:

* You can access secrets from a variety of external secret stores from within Upbound without any operational overhead.
* You can configure synchronization for multiple managed control planes in a group.
* You can store and manage all your secrets centrally.
* Shared secrets are supported across all hosting environments of Upbound (Disconnected, Connected or Cloud Spaces).

## Prerequisites

Make sure the Shared Secrets feature is enabled in whichever Space you plan to run your managed control plane in. The feature is enabled by default in all Upbound-managed Cloud Spaces. If you want to use these APIs in your Connected Space, your admin must [enable them]({{<ref "../disconnected-spaces/secrets-management" >}}) in the Connected Space.

<!-- vale Google.Headings = NO -->
## Configure a Shared Secret Store
<!-- vale Google.Headings = YES -->

[SharedSecretStore]({{<ref "reference/space-api/#SharedSecretStore-spec" >}}) is a group-scoped resource and is created in a group containing one or more managed control planes. This resource provisions [ClusterSecretStore](https://external-secrets.io/latest/api/clustersecretstore/) resources into control planes within its corresponding group.

### Secret store provider

The `spec.provider` field configures the provider of the corresponding external Secret Store you want to sync external secrets from. Only one provider may be set. For a full list of supported providers, read the [Space API reference]({{<ref "reference/space-api/#SharedSecretStore-spec-provider" >}}).

#### AWS Secrets Manager

{{< hint "important" >}}
While the underlying ESO API for this provider may support more auth methods, static credentials are currently the only supported auth method in Cloud Spaces. 
{{< /hint >}}

Below is an example of how to configure a Shared Secret Store for AWS Secrets Manager:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: aws-sm
spec:
  provider:
    aws:
      service: SecretsManager
      role: iam-role
      region: eu-central-1
      auth:
        secretRef:
          accessKeyIDSecretRef:
            name: awssm-secret
            key: access-key
          secretAccessKeySecretRef:
            name: awssm-secret
            key: secret-access-key
```

Check out the [ESO provider API](https://external-secrets.io/latest/provider/aws-secrets-manager/) for more information.

#### Azure Key Vault

{{< hint "important" >}}
While the underlying ESO API for this provider may support more auth methods, static credentials are currently the only supported auth method in Cloud Spaces. 
{{< /hint >}}

Below is an example of how to configure a Shared Secret Store for Azure Key Vault:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: aws-sm
spec:
  provider:
    azurekv:
      tenantId: "<your-tenant-id>"
      vaultUrl: "<your-vault-url>"
      authSecretRef:
        clientId:
          name: azure-secret-sp
          key: ClientID
        clientSecret:
          name: azure-secret-sp
          key: ClientSecret
```

Check out the [ESO provider API](https://external-secrets.io/latest/provider/azure-key-vault/) for more information.

#### Google Cloud Secret Manager

{{< hint "important" >}}
While the underlying ESO API for this provider may support more auth methods, static credentials are currently the only supported auth method in Cloud Spaces. 
{{< /hint >}}

Below is an example of how to configure a Shared Secret Store for Google Cloud Secret Manager:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: gcp-sm
spec:
  provider:
    gcpsm:
      auth:
        secretRef:
          secretAccessKeySecretRef:
            name: gcpsm-secret             
            key: secret-access-credentials  
      projectID: <your-gcp-project>             
```

Check out the [ESO provider API](https://external-secrets.io/latest/provider/google-secrets-manager/) for more information.

### Control plane selection

To configure which managed control planes in a group you want to project a SecretStore into, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane is matched if any of the label selectors match. 

This example matches all control planes in the group that have `environment: production` as a label:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          environment: production
```

You can use the more complex `matchExpressions` to match labels based on an expression. This example matches control planes that have label `environment: production` or `environment: staging`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchExpressions:
        - { key: environment, operator: In, values: [production,staging] }
```

You can also specify the names of control planes directly:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  controlPlaneSelector:
    names:
    - controlplane-dev
    - controlplane-staging
    - controlplane-prod
```

### Namespace selection

To configure which namespaces **within each matched managed control plane** to project the secret store into, use `spec.namespaceSelector` field. The projected secret store can be consumed only within the namespaces matching the provided selector. You can either use `labelSelectors` or the `names` of namespaces directly. A control plane is matched if any of the label selectors match. 

**For all control planes matched by** `spec.controlPlaneSelector`, This example matches all namespaces in each selected control plane that have `team: team1` as a label:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  namespaceSelector:
    labelSelectors:
      - matchLabels:
          team: team1
```

You can use the more complex `matchExpressions` to match labels based on an expression. This example matches namespaces that have label `team: team1` or `team: tean2`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  namespaceSelector:
    labelSelectors:
      - matchExpressions:
        - { key: team, operator: In, values: [team1,team2] }
```

You can also specify the names of namespaces directly:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  namespaceSelector:
    names:
    - team1-namespace
    - team2-namespace
```

<!-- vale Google.Headings = NO -->
## Configure a Shared External Secret
<!-- vale Google.Headings = YES -->

[SharedExternalSecret]({{<ref "reference/space-api/#SharedExternalSecret-spec" >}}) is a group-scoped resource and is created in a group containing one or more managed control planes. This resource provisions [ClusterSecretStore](https://external-secrets.io/latest/api/clusterexternalsecret/) resources into control planes within its corresponding group.

<!-- vale Google.Headings = NO -->
### External secret spec
<!-- vale Google.Headings = YES -->

The `spec.externalSecretSpec` field configures the spec of the corresponding External Cluster Secret you want to project into managed control planes. The shape of this spec depends on the Secret Store you want to reference from.

Below is an example of how to project a secret from AWS Secret Manager:

{{< hint "tip" >}}
Observe how the `secretStoreRef` is of `kind: ClusterSecretStore`. That's because a Shared Secret Store projects a `kind: ClusterSecretStore` into each matching managed control plane, and this is what you must reference in your Shared External Secret.
{{< /hint >}}

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: my-secret
  namespace: default
spec:
  externalSecretSpec:
    refreshInterval: 1h
    secretStoreRef:
      name: aws-sm
      kind: ClusterSecretStore
    target:
      name: my-secret
    data:
    - secretKey: secret-access-key
      remoteRef:
        key: my-secret
```

### Control plane selection

To configure which managed control planes in a group you want to project a ClusterExternalSecret into, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane is matched if any of the label selectors match. 

This example matches all control planes in the group that have `environment: production` as a label:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: my-secret
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          environment: production
```

You can use the more complex `matchExpressions` to match labels based on an expression. This example matches control planes that have label `environment: production` or `environment: staging`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: my-secret
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchExpressions:
        - { key: environment, operator: In, values: [production,staging] }
```

You can also specify the names of control planes directly:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: my-secret
spec:
  controlPlaneSelector:
    names:
    - controlplane-dev
    - controlplane-staging
    - controlplane-prod
```

### Namespace selection

To configure which namespaces **within each matched managed control plane** to project the Cluster External Secret into, use `spec.namespaceSelector` field. The projected secret can be consumed only within the namespaces matching the provided selector. You can either use `labelSelectors` or the `names` of namespaces directly. A control plane is matched if any of the label selectors match. 

**For all control planes matched by** `spec.controlPlaneSelector`, This example matches all namespaces in each selected control plane that have `team: team1` as a label:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: my-secret
spec:
  namespaceSelector:
    labelSelectors:
      - matchLabels:
          team: team1
```

You can use the more complex `matchExpressions` to match labels based on an expression. This example matches namespaces that have label `team: team1` or `team: tean2`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: my-secret
spec:
  namespaceSelector:
    labelSelectors:
      - matchExpressions:
        - { key: team, operator: In, values: [team1,team2] }
```

You can also specify the names of namespaces directly:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: my-secret
spec:
  namespaceSelector:
    names:
    - team1-namespace
    - team2-namespace
```

## Usage

This section demonstrates how to put into practice what's described above. It uses a fake Secret Store provider and fake secret to illustrate secret projection. 

Connect to a Cloud Space in your organization:

```bash
up login
up ctx <your-org>/upbound-gcp-us-west-1
```

Create two managed control planes in the default control plane group:

```bash
up ctp create ctp1
up ctp create ctp2
```

Label the first managed control plane `label: foo` and the second managed control plane `label: bar`:

```bash
kubectl label controlplane ctp1 label=foo
kubectl label controlplane ctp2 label=bar
```

Create a Shared Secret Store in the same group. This example uses [fake provider](https://external-secrets.io/latest/provider/fake/).

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: fake-store
  namespace: default
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  namespaceSelector:
    names:
      - default
  provider:
    fake:
      data:
        - key: "/foo/bar"
          value: "HELLO1"
          version: "v1"
        - key: "/foo/bar"
          value: "HELLO2"
          version: "v2"
        - key: "/foo/baz"
          value: '{"john": "doe"}'
          version: "v1"
EOF
```

Create a Shared External Secret in the same group:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: fake-secret
  namespace: default
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  namespaceSelector:
    names:
      - default
  externalSecretSpec:
    refreshInterval: 1h
    secretStoreRef:
      # refer the projected store
      name: fake-store
      kind: ClusterSecretStore
    data:
      - secretKey: "foo"
        remoteRef:
          key: "/foo/bar"
          version: "v1"
```

Wait for the managed control planes to become ready:

```bash
up ctp list

GROUP     NAME         CROSSPLANE    SYNCED   READY   MESSAGE   AGE
default   ctp1         1.16.0-up.1   True     True               5m
default   ctp2         1.16.0-up.1   True     True               5m
```

Connect to managed control plane `ctp1`:

```bash
up ctx ./ctp1
```

Check if Kubernetes secret `fake-secret` is available in the default namespace:

```bash
kubectl get secret fake-secret

NAME          TYPE     DATA   AGE
fake-secret   Opaque   1      20s
```

Verify the projected Cluster Secret Store and Cluster External Secret.

```bash
kubectl get clustersecretstore

NAME         AGE     STATUS   CAPABILITIES   READY
fake-store   5m18s   Valid    ReadOnly       True

kubectl get clusterexternalsecret

NAME          STORE   REFRESH INTERVAL   READY
fake-secret   fake                       True
```

Perform the same check on managed control plane `ctp2`.

```bash
up ctx ../ctp2
```

## Configure external secrets in a managed control plane

<!-- vale off -->
The sections above explain how to use the group-scoped `kind: SharedSecretStore` and `kind: SharedExternalSecret` resources to project secrets into multiple control planes in a group. You can also use ESO API types in a managed control plane as you would in a standalone Crossplane instance or Kubernetes cluster. 

For a full guide on using ESO API types and how to connect it to various external secret stores, read the [ESO documentation](https://external-secrets.io/latest/introduction/getting-started/).
<!-- vale on -->