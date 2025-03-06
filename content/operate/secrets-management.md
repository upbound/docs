---
title: Secrets Management
weight: 150
description: A guide for how to configure synchronizing external secrets into managed control planes in a Space.
aliases:
    - /all-spaces/secrets-management
    - /spaces/secrets-management
    - /disconnected-spaces/secrets-management
    - /self-hosted-spaces/secrets-management
    - all-spaces/secrets-management
---

{{< hint "important" >}}
This feature is in preview. It is enabled by default in Cloud Spaces. To enable it in a Disconnected Space, set `features.alpha.sharedSecrets.enabled=true` when installing the Space:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.sharedSecrets.enabled=true" \
```

{{< /hint >}}

Upbound's _Shared Secrets_ is a built in secrets management feature that
provides an integrated way to manage secrets across your platform. It allows you
to store sensitive data like passwords and certificates for your managed control
planes as secrets in an external secret store.

This feature is a wrapper around the [External Secrets Operator(ESO)](https://external-secrets.io) that pulls secrets from external vaults and distributes them across your platform.

## Benefits

The Shared Secrets feature allows you to:

* Access secrets from a variety of external secret stores without operation overhead
* Configure synchronization for multiple managed control planes in a group
* Store and manage all your secrets centrally
* Use Shared Secrets across all Upbound environments(Cloud and Disconnected Spaces)
* Synchronize secrets across groups of control planes while maintaining clear security boundaries
* Manage secrets at scale programmatically while ensuring proper isolation and access control

## Understanding the Architecture

The Shared Secrets feature uses a hierarchical approach to centrally manage
secrets and effectively control their distribution.

1. The flow begins at the group level, where you define your secret sources and distribution rules
2. These rules automatically create corresponding resources in your control planes
3. In each control plane, specific namespaces receive the secrets
4. Changes at the group level automatically propagate through this chain

## Prerequisites

Make sure you've enabled the Shared Secrets feature in whichever Space you plan to run your managed control plane in. All Upbound-managed Cloud Spaces have this feature enabled by default. If you want to use these APIs in your own Connected Space, your Space administrator must enable them with the `features.alpha.sharedSecrets.enabled=true` setting.

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
```

## Component Overview

Upbound Shared Secrets consists of two components:

1. **SharedSecretStore**: Defines connections to external secret providers
2. **SharedExternalSecret**: Specifies which secrets to synchronize and where


<!-- vale Google.Headings = NO -->
### Connect to an External Vault
<!-- vale Google.Headings = YES -->

The `SharedSecretStore` component is the connection point to your external
secret vaults. It provisions ClusterSecretStore resources into control planes
within the group.

In this example, you'll create a `SharedSecretStore` that will connect to an AWS
Secrets Manager in `us-west-2`, apply access to all control planes labeled with
`environment: production`, and make these secrets available in the `default` and
`crossplane-system` namespaces.

You can configure access to AWS Secrets Manager using static credentials or
workload identity.

#### Static Credentials

First, use the AWS CLI to create access credentials:


1. First, create your access credentials.

<!--- TODO(tr0njavolta): code --->

2. Next,store the access credentials in a secret in the namespace you want to have access to the `SharedSecretStore`.

<!--- TODO(tr0njavolta): code --->

3. Create a `SharedSecretStore` custom resource file called `secretstore.yaml`.
   Paste the following configuration:

<!--- TODO(tr0njavolta): code --->

#### Workload Identity with IRSA

You can also use AWS IAM Roles for Service Accounts (IRSA) depending on your
organizations needs:

1. Ensure you have deployed the Spaces softwre into an IRSA-enabled EKS cluster.
2. Follow the AWS instructions to create an IAM OIDC provider with your EKS OIDC
   provider URL.
3. Determine the Spaces-generated `controlPlaneID` of your control plane:

<!--- TODO(tr0njavolta): code --->

4. Create an IAM trust policy in your AWS account to match the control plane.
<!--- TODO(tr0njavolta): code--->

5. Update your Spaces deployment to annotate the SharedSecrets service account
   with the role ARN.

6. Create a SharedSecretStore and reference the SharedSecrets service account:
<!--- TODO(tr0njavolta): code--->



When you create a `SharedSecretStore` the underlying mechanism:

1. Applies at the group level
2. Determines which control planes should receive this configuration by the `controlPlaneSelector`
3. Automatically creates a ClusterSecretStore inside each identified control plane
4. Maintains a connection in each control plane with the ClusterSecretStore
   credentials and configuration from the parent SharedSecretStore

Upbound automatically generates a ClusterSecretStore in each matching control
plane when you create a SharedSecretStore.

<!--- TODO(tr0njavolta): nocopy --->
```
# Automatically created in each matching control plane
apiVersion: external-secrets.io/v1beta1
kind: ClusterSecretStore
metadata:
  name: aws-secrets  # Name matches the parent SharedSecretStore
spec:
  provider:
   upboundspaces:
      storeRef:
        name: aws-secret
```



When you create the SharedSecretStore controller, it replaces the provider with
a special provider called `upboundspaces`. This provider references the
SharedSecretStore object in the Spaces API. This avoids copying the actual cloud
credentials from Spaces to each control plane.

This workflow allows you to configure the store connection only once at the
group level and automatically progates to each control plane. Individual control
planes can use the store without exposure to the group-level configuration and
updates all child ClusterSecretStores when updated.

### Manage your secret distribution

Once you create your SharedSecretStore, you can define which secrets should be
distributed using SharedExternalSecret:

<!--- TODO(tr0njavolta): code --->

This configuration:

* Pulls database credentials from your external secret provider
* Creates secrets in all production control planes
* Refeshes the secrets every hour
* Creates a secret called `db-credentials` in each control plane

When you create a SharedExternalSecret at the group level, Upbound's system
creates a template for the corresponding ClusterExternalSecrets in each selected
control plane. 

The heirarchy in this configuration is:

1. SharedExternalSecret (group leve) defines what secrets to distribute
2. ClusterExternalSecret (control plane level) manages the distribution within
   each control plane
3. Kubernetes Secrets (namespace level) are created in specified namespaces

## Best Practies

When you implement secrets management in your Upbound environment, keep the
following best practices in mind:

**Use consistent labeling schemes** across your control planes for predictable
and manageble secret distribution.

**Organize your secrets** in your external provider using a hierarchical
structure that mirrors your control plane organization.

**Set appropriate refresh intervals** based on your security requries and the
nature of the secrets.

**Use namespace selection carefully** to limit secret distribution to only the
namespaces that need them.

**Use separate tokens for different environments** and reference them in
distinct SharedSecretStores. Since MCPs don't restrict native ESO resource
creation, users could directly create a ClusterExternalSecret, potentially
gaining access to all secrets available to that token while bypassing the
SharedExternalSecret resource and its selectors.

**Document your secret management architecture**, including which control planes
should receive which secrets.

### AWS Secrets Manager



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

[SharedExternalSecret](https://docs.upbound.io/reference/space-api/#SharedExternalSecret-spec) is a [group-scoped]({{<ref "operate/groups" >}}) resource that you create in a group containing one or more managed control planes. It provisions [ClusterExternalSecret](https://external-secrets.io/latest/api/clusterexternalsecret/) resources into control planes within its group.

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

## Configure secrets directly in a control plane

<!-- vale off -->
The above explains using group-scoped resources to project secrets into multiple control planes. You can also use ESO API types directly in a control plane as you would in standalone Crossplane or Kubernetes.
<!-- vale on -->

See the [ESO documentation](https://external-secrets.io/latest/introduction/getting-started/) for a full guide on using the API types.
