---
title: Secrets Management
weight: 150
description: A guide for how to configure synchronizing external secrets into managed control planes in a Space.
aliases:
    - /spaces/secrets-management
    - /disconnected-spaces/secrets-management
---

{{< hint "important" >}}
This feature is in preview. It is enabled by default in Cloud Spaces. To enable it in a Disconnected Space, set `features.alpha.sharedSecrets.enabled=true` when installing the Space:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.sharedSecrets.enabled=true" \
```

{{< /hint >}}

Upbound's _Shared Secrets_ is a built-in secrets management feature that lets you store sensitive data such as passwords and certificates used by managed control planes as secrets in an external secret store. This guide explains how you can use Shared Secrets to access secrets stored in your external store and project them into managed control planes.

The Shared Secrets feature derives from the open source [External Secrets Operator (ESO)](https://external-secrets.io). Upbound offers:

1. `SharedSecretStore` and `SharedExternalSecret` APIs to manage syncing external secrets into groups of managed control planes.
2. Each managed control plane has built-in support for External Secrets Operator (ESO) APIs.

## Benefits

The Shared Secrets feature provides the following benefits:

* Access secrets from a variety of external secret stores without any operational overhead
* Configure synchronization for multiple managed control planes in a group
* Store and manage all your secrets centrally
* Use Shared Secrets across all Upbound environments (Cloud and Disconnected Spaces)

## Prerequisites

Make sure you've enabled the Shared Secrets feature in whichever Space you plan to run your managed control plane in. All Upbound-managed Cloud Spaces have this feature enabled by default. If you want to use these APIs in your own Connected Space, your Space administrator must enable them with the `features.alpha.sharedSecrets.enabled=true` setting.

<!-- vale Google.Headings = NO -->
## Configure a Shared Secret Store
<!-- vale Google.Headings = YES -->

[SharedSecretStore](https://docs.upbound.io/reference/space-api/#SharedSecretStore-spec) is a [group-scoped]({{<ref "mcp/groups" >}}) resource that you create in a group containing one or more managed control planes. It provisions [ClusterSecretStore](https://external-secrets.io/latest/api/clustersecretstore/) resources into control planes within its group.

### Secret store provider

The `spec.provider` field configures the provider of the external secret store to sync secrets from. Only one provider is settable. See the [Space API reference](https://docs.upbound.io/reference/space-api/#SharedSecretStore-spec-provider) for supported providers.

#### AWS Secrets Manager

{{< hint "important" >}}
While the underlying ESO API supports more auth methods, static credentials are currently the only supported auth method in Cloud Spaces.
{{< /hint >}}

Example configuration:

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

See the [ESO provider API](https://external-secrets.io/latest/provider/aws-secrets-manager/) for more information.

<!-- vale off -->
#### Azure Key Vault
<!-- vale on -->

{{< hint "important" >}}
While the underlying ESO API supports more auth methods, static credentials are currently the only supported auth method in Cloud Spaces.
{{< /hint >}}

Example configuration:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: azure-sm
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

See the [ESO provider API](https://external-secrets.io/latest/provider/azure-key-vault/) for more information.

<!-- vale off -->
#### Google Cloud Secret Manager
<!-- vale on -->

{{< hint "important" >}}
While the underlying ESO API supports more auth methods, static credentials are currently the only supported auth method in Cloud Spaces.
{{< /hint >}}

Example configuration:

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

See the [ESO provider API](https://external-secrets.io/latest/provider/google-secrets-manager/) for more information.

### Control plane selection

To configure which managed control planes in a group you want to project a SecretStore into, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane matches if any of the label selectors match.

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

To configure which namespaces **within each matched managed control plane** to project the secret store into, use `spec.namespaceSelector` field. The projected secret store only appears in the namespaces matching the provided selector. You can either use `labelSelectors` or the `names` of namespaces directly. A control plane matches if any of the label selectors match.

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

## Configure a shared external secret

[SharedExternalSecret](https://docs.upbound.io/reference/space-api/#SharedExternalSecret-spec) is a [group-scoped]({{<ref "mcp/groups" >}}) resource that you create in a group containing one or more managed control planes. It provisions [ClusterSecretStore](https://external-secrets.io/latest/api/clusterexternalsecret/) resources into control planes within its group.

The `spec.externalSecretSpec` field configures the spec of the corresponding External Cluster Secret to project into managed control planes. Its shape depends on the referenced secret store.

Example projecting a secret from AWS Secret Manager:

{{< hint "tip" >}}
The `secretStoreRef` is of `kind: ClusterSecretStore` because a Shared Secret Store projects a `kind: ClusterSecretStore` into each matching managed control plane, which is what you reference in your Shared External Secret.
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

Use `spec.controlPlaneSelector` and `spec.namespaceSelector` to configure which control planes and namespaces to project the external secret into, same as for Shared Secret Stores.

## Usage example

This example uses a fake secret store provider to walk you through enabling secrets management.

1. Create two managed control planes in the default group and label them:

```bash
up ctp create ctp1
up ctp create ctp2

kubectl label controlplane ctp1 label=foo
kubectl label controlplane ctp2 label=bar
```

2. Create a Shared Secret Store using the [fake provider](https://external-secrets.io/latest/provider/fake/):

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

3. Create a Shared External Secret:

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
      name: fake-store
      kind: ClusterSecretStore
    data:
      - secretKey: "foo"
        remoteRef:
          key: "/foo/bar"
          version: "v1"
EOF
```

<!-- vale off -->
4. Verify the secret is projected in both control planes:
<!-- vale on -->

```bash
up ctx ./ctp1
kubectl get secret fake-secret
kubectl get clustersecretstore
kubectl get clusterexternalsecret

up ctx ../ctp2
kubectl get secret fake-secret
kubectl get clustersecretstore
kubectl get clusterexternalsecret
```

## Configure secrets directly in a control plane

<!-- vale off -->
The above explains using group-scoped resources to project secrets into multiple control planes. You can also use ESO API types directly in a control plane as you would in standalone Crossplane or Kubernetes.
<!-- vale on -->

See the [ESO documentation](https://external-secrets.io/latest/introduction/getting-started/) for a full guide on using the API types.