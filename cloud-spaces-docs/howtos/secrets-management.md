---
title: Secrets Management
sidebar_position: 20
description: A guide for how to configure synchronizing external secrets into control
  planes in a Space.
---

Upbound's _Shared Secrets_ is a built in secrets management feature that
provides an integrated way to manage secrets across your platform. It allows you
to store sensitive data like passwords and certificates for your managed control
planes as secrets in an external secret store.

This feature is a wrapper around the [External Secrets Operator (ESO)][external-secrets-operator-eso] that pulls secrets from external vaults and distributes them across your platform.


## Benefits

The Shared Secrets feature allows you to:

* Access secrets from a variety of external secret stores without operation overhead
* Configure synchronization for multiple control planes in a group
* Store and manage all your secrets centrally
* Use Shared Secrets across all Upbound environments(Cloud and Disconnected Spaces)
* Synchronize secrets across groups of control planes while maintaining clear security boundaries
* Manage secrets at scale programmatically while ensuring proper isolation and access control

## Understanding the Architecture

The Shared Secrets feature uses a hierarchical approach to centrally manage
secrets and effectively control their distribution.

![Shared Secrets workflow diagram](/img/shared-secrets-workflow.png)

1. The flow begins at the group level, where you define your secret sources and distribution rules
2. These rules automatically create corresponding resources in your control planes
3. In each control plane, specific namespaces receive the secrets
4. Changes at the group level automatically propagate through this chain

## Component configuration

Upbound Shared Secrets consists of two components:

1. **SharedSecretStore**: Defines connections to external secret providers
2. **SharedExternalSecret**: Specifies which secrets to synchronize and where

<!-- vale Google.Headings = NO -->
### Connect to an External Vault
<!-- vale Google.Headings = YES -->

The `SharedSecretStore` component is the connection point to your external
secret vaults. It provisions ClusterSecretStore resources into control planes
within the group.

<!-- vale Google.Headings = NO -->
#### AWS Secrets Manager
<!-- vale Google.Headings = YES -->

<!-- vale gitlab.FutureTense = NO -->
In this example, you'll create a `SharedSecretStore` to connect to AWS
Secrets Manager in `us-west-2`. Then apply access to all control planes labeled with
`environment: production`, and make these secrets available in the `default` and
`crossplane-system` namespaces.
<!-- vale gitlab.FutureTense = YES -->

You can configure access to AWS Secrets Manager using static credentials or
workload identity.

:::important
While the underlying ESO API supports more auth methods, static credentials are currently the only supported auth method in Cloud Spaces.
:::

##### Static credentials

1. Use the AWS CLI to create access credentials.


2. Create your access credentials.
```ini
# Create a text file with AWS credentials
cat > aws-credentials.txt << EOF
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_HERE>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY_HERE>
EOF
```

3. Next,store the access credentials in a secret in the namespace you want to have access to the `SharedSecretStore`.
```shell
kubectl create secret \
  generic aws-credentials \
  -n default \
  --from-file=creds=./aws-credentials.txt
```

4. Create a `SharedSecretStore` custom resource file called `secretstore.yaml`.
   Paste the following configuration:
```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: aws-secrets
spec:
  # Define which control planes should receive this configuration
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          environment: production

  # Define which namespaces within those control planes can access secrets
  namespaceSelector:
    names:
      - default
      - crossplane-system

  # Configure the connection to AWS Secrets Manager
  provider:
    aws:
      service: SecretsManager
      region: us-west-2
      auth:
        secretRef:
          accessKeyIDSecretRef:
            name: aws-credentials
            key: access-key-id
          secretAccessKeySecretRef:
            name: aws-credentials
            key: secret-access-key
```

<!-- vale off -->
#### Azure Key Vault
<!-- vale on -->

:::important
While the underlying ESO API supports more auth methods, static credentials are currently the only supported auth method in Cloud Spaces.
:::

##### Static credentials

1. Use the Azure CLI to create a service principal and authentication file.
2. Create a service principal and save credentials in a file:
```json
{
  "appId": "myAppId",
  "displayName": "myServicePrincipalName",
  "password": "myServicePrincipalPassword",
  "tenant": "myTentantId"
}
```

3. Store the credentials as a Kubernetes secret:
```shell
kubectl create secret \
  generic azure-secret-sp \
  -n default \
  --from-file=creds=./azure-credentials.json
```

4. Create a SharedSecretStore referencing these credentials:
```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: azure-kv
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
  controlPlaneSelector:
    names:
    - <control-plane-name>
  namespaceSelector:
    names:
    - default
```

<!-- vale off -->
#### Google Cloud Secret Manager
<!-- vale on -->

You can configure access to Google Cloud Secret Manager using static credentials. See the [ESO provider API][eso-provider-api] for more information.

:::important
While the underlying ESO API supports more auth methods, static credentials are currently the only supported auth method in Cloud Spaces.
:::

##### Static credentials

1. Use the [GCP CLI][gcp-cli] to create access credentials.
2. Save the output in a file called `gcp-credentials.json`.
3. Store the access credentials in a secret in the same namespace as the `SharedSecretStore`.
    ```shell {label="kube-create-secret",copy-lines="all"}
    kubectl create secret \
    generic gcpsm-secret \
    -n default \
    --from-file=creds=./gcp-credentials.json
    ```

4. Create a `SharedSecretStore`, referencing the secret created earlier. Replace `projectID` with your GCP Project ID:
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
            key: creds
      projectID: <your-gcp-project>
  controlPlaneSelector:
    names:
    - <control-plane-name>
  namespaceSelector:
    names:
    - default
```

:::tip
The example above maps a Shared Secret Store into a single namespace of a single control plane. Read [control plane selection][control-plane-selection] and [namespace selection][namespace-selection] to learn how to map into one or more namespaces of one or more control planes.
:::

### Manage your secret distribution

After you create your SharedSecretStore, you can define which secrets to
distribute using SharedExternalSecret:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: database-credentials
  namespace: default
spec:
  # Select the same control planes as your SharedSecretStore
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          environment: production

  externalSecretSpec:
    refreshInterval: 1h
    secretStoreRef:
      name: aws-secrets  # References the SharedSecretStore name
      kind: ClusterSecretStore
    target:
      name: db-credentials
    data:
    - secretKey: username
      remoteRef:
        key: prod/database/credentials
        property: username
    - secretKey: password
      remoteRef:
        key: prod/database/credentials
        property: password
```

#### Control plane selection

To configure which control planes in a group you want to project a SecretStore into, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane matches if any of the label selectors match.

#### Namespace selection

To configure which namespaces **within each matched control plane** to project the secret store into, use `spec.namespaceSelector` field.

## Best practices

**Use consistent labeling schemes** across your control planes for predictable
and manageable secret distribution.

**Organize your secrets** in your external provider using a hierarchical
structure that mirrors your control plane organization.

**Set appropriate refresh intervals** based on your security requires and the
nature of the secrets.

**Use namespace selection sparingly** to limit secret distribution to only the
namespaces that need them.

**Use separate tokens for each environment.** Keep them in distinct
SharedSecretStores.

**Document your secret management architecture**, including which control planes
should receive which secrets.

[control-plane-selection]: #control-plane-selection
[namespace-selection]: #namespace-selection

[external-secrets-operator-eso]: https://external-secrets.io
[eso-provider-api]: https://external-secrets.io/latest/provider/google-secrets-manager/
[gcp-cli]: https://cloud.google.com/iam/docs/creating-managing-service-account-keys
[eso-documentation]: https://external-secrets.io/latest/introduction/getting-started/
