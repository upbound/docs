---
title: Provider Authentication
sidebar_position: 2
description: Authentication options for Upbound Official Providers
---

This guide covers authentication methods for Upbound Official Providers. Each provider supports multiple authentication approaches to fit different deployment scenarios and security requirements.

## Quick reference

| Provider | Authentication Methods |
|----------|----------------------|
| AWS | [Upbound OIDC](#aws-upbound-oidc), [Access Keys](#aws-access-keys), [WebIdentity](#aws-webidentity), [IRSA](#aws-irsa) |
| Azure | [Upbound OIDC](#azure-upbound-oidc), [Service Principal](#azure-service-principal), [Managed Identity](#azure-managed-identity) |
| GCP | [Upbound OIDC](#gcp-upbound-oidc), [Service Account Keys](#gcp-service-account-keys), [Workload Identity](#gcp-workload-identity) |
| Kubernetes | [Upbound Identity](#kubernetes-upbound-identity), [Injected Identity](#kubernetes-injected-identity) |

## AWS authentication

The Upbound Official AWS Provider supports multiple authentication methods suitable for different environments.

### AWS Upbound OIDC {#aws-upbound-oidc}

:::note
This method is only supported in control planes running on [Upbound Cloud Spaces][upbound-cloud-spaces].
:::

Upbound authentication uses OpenID Connect (OIDC) to authenticate to AWS without storing credentials in Upbound.

#### Add Upbound as an OpenID Connect provider

1. Open the **[AWS IAM console][aws-iam-console]**.
2. Under AWS IAM services, select **[Identity Providers > Add Provider][identity-providers-add-provider]**.
3. Select **OpenID Connect** and use **https://proidc.upbound.io** as the Provider URL and **sts.amazonaws.com** as the Audience.
4. Select **Get thumbprint**.
5. Select **Add provider**.

#### Create an AWS IAM Role for Upbound

1. Create an [AWS IAM Role][aws-iam-role] with a **Custom trust policy** for the OIDC connector.

:::tip
Provide your [AWS account ID][aws-account-id], Upbound organization and control plane names in the JSON Policy below.
:::

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:oidc-provider/proidc.upbound.io"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "proidc.upbound.io:sub": "mcp:ORG_NAME/CONTROL_PLANE_NAME:provider:provider-aws",
          "proidc.upbound.io:aud": "sts.amazonaws.com"
        }
      }
    }
  ]
}
```

2. Attach the permission policies you want for the control plane assuming this role.
3. Name and create the role.
4. View the new role and copy the role ARN.

#### Create a ProviderConfig

Create a ProviderConfig to set the provider authentication method to `Upbound`.

```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Upbound
    upbound:
      webIdentity:
        roleARN: <roleARN-for-provider-identity>
```

### AWS Access Keys {#aws-access-keys}

Using AWS access keys requires storing the AWS keys as a Kubernetes secret.

Create or [download your AWS access key][download-your-aws-access-key] ID and secret access key. The format of the text file is:

```ini
[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

#### Create a Kubernetes secret

Create the Kubernetes secret with `kubectl create secret generic`:

```shell
kubectl create secret generic \
aws-secret \
-n crossplane-system \
--from-file=my-aws-secret=./aws-credentials.txt
```

#### Create a ProviderConfig

```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: aws-secret
      key: my-aws-secret
```

### AWS WebIdentity {#aws-webidentity}

When running in an Amazon managed Kubernetes cluster (EKS), the Provider may use [AssumeRoleWithWebIdentity][assumerolewithwebidentity] for authentication.

:::tip
WebIdentity is only supported with Crossplane running in Amazon managed Kubernetes clusters (EKS).
:::

#### Create an IAM OIDC provider

Follow the [AWS instructions][aws-instructions] to create an IAM OIDC provider with your EKS OIDC provider URL.

#### Edit the IAM role

The trust policy references the OIDC provider ARN and the provider AWS service account. Add a trust policy with the following structure:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::111122223333:oidc-provider/oidc.eks.us-east-2.amazonaws.com/id/5C64F628ACFB6A892CC25AF3B67124C5"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringLike": {
          "oidc.eks.us-east-2.amazonaws.com/id/5C64F628ACFB6A892CC25AF3B67124C5:sub": "system:serviceaccount:crossplane-system:provider-aws-*"
        }
      }
    }
  ]
}
```

#### Create a ProviderConfig

```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: WebIdentity
    webIdentity:
      roleARN: "arn:aws:iam::111122223333:role/my-custom-role"
```

### AWS IRSA {#aws-irsa}

When running in Amazon EKS, the Provider may use [IAM roles for service accounts][aws-iam-roles-for-service-accounts] (IRSA) for authentication.

#### Create a DeploymentRuntimeConfig

IRSA relies on an annotation on the service account attached to a pod. Create a DeploymentRuntimeConfig to apply the annotation:

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: irsa-runtimeconfig
spec:
  serviceAccountTemplate:
    metadata:
      annotations:
        eks.amazonaws.com/role-arn: arn:aws:iam::622346257358:role/my-custom-role
```

#### Apply the DeploymentRuntimeConfig

Install or update the provider with a `runtimeConfigRef`:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v1.17.0
  runtimeConfigRef:
    name: irsa-runtimeconfig
```

#### Create a ProviderConfig

```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: IRSA
```

## Azure authentication

The Upbound Official Azure Provider supports multiple authentication methods.

### Azure Upbound OIDC {#azure-upbound-oidc}

:::note
This method is only supported in control planes running on [Upbound Cloud Spaces][upbound-cloud-spaces].
:::

#### Create an identity pool

1. Open the **[Azure portal][azure-portal]**.
2. Select **[Microsoft Entra ID][microsoft-entra-id]**.
3. Select **App registrations**.
4. Select **New registration**.
5. Name the pool **upbound-oidc-provider**.
6. In _Supported account types_ select **Accounts in this organizational directory only**.
7. Leave _Redirect URI_ blank.
8. Select **Register**.

#### Create a federated credential

1. Select **Certificates and secrets** in the left navigation.
2. Select **Federated credentials** tab.
3. Select **Add credential**.
4. In _Federated credential scenario_ select **Other Issuer**.
5. In _Issuer_ enter **https://proidc.upbound.io**.
6. In _Subject identifier_ enter: `mcp:<your-org>/<your-control-plane-name>:provider:provider-azure`
7. In _Audience_ leave **api://AzureADTokenExchange**.
8. Select **Add**.

#### Grant permissions to the service principal

Grant appropriate permissions to the Application Service Principal through Azure RBAC.

#### Create a ProviderConfig

```yaml
apiVersion: azure.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Upbound
  clientID: <client ID>
  tenantID: <tenant ID>
  subscriptionID: <subscription ID>
```

### Azure Service Principal {#azure-service-principal}

A service principal passes `client_id`, `client_secret`, and `tenant_id` authentication tokens to create and manage Azure resources.

#### Create a service principal using Azure CLI

Find your Subscription ID:

```shell
az account list
```

Create a service principal with Owner role:

```shell
az ad sp create-for-rbac --sdk-auth --role Owner --scopes /subscriptions/<subscription_id> \
  > azure.json
```

#### Create a Kubernetes secret

```shell
kubectl create secret generic azure-secret -n upbound-system --from-file=creds=./azure.json
```

#### Create a ProviderConfig

```yaml
apiVersion: azure.upbound.io/v1beta1
metadata:
  name: default
kind: ProviderConfig
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: upbound-system
      name: azure-secret
      key: creds
```

### Azure Managed Identity {#azure-managed-identity}

Azure managed identities allow authentication without manually managing credentials.

#### System-assigned managed identity

Create an AKS cluster with managed identity enabled:

```shell
az aks create -g myResourceGroup -n myManagedCluster --enable-managed-identity
```

Create a ProviderConfig:

```yaml
apiVersion: azure.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: SystemAssignedManagedIdentity
  subscriptionID: <subscription_ID>
  tenantID: <tenant_ID>
```

#### User-assigned managed identity

Create user-assigned managed identities:

```shell
az identity create --name <controlplane_identity_name> --resource-group <resource_group>
az identity create --name <kubelet_identity_name> --resource-group <resource_group>
```

Create an AKS cluster with the identities:

```shell
az aks create \
    --resource-group <resource_group> \
    --name <cluster_name> \
    --enable-managed-identity \
    --assign-identity <controlplane_identity_resource_id> \
    --assign-kubelet-identity <kubelet_identity_resource_id>
```

Create a ProviderConfig:

```yaml
apiVersion: azure.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: UserAssignedManagedIdentity
  clientID: <kubelet_identity_id>
  subscriptionID: <subscription_ID>
  tenantID: <tenant_ID>
```

## GCP authentication

The Upbound Official GCP Provider supports multiple authentication methods.

### GCP Upbound OIDC {#gcp-upbound-oidc}

:::note
This method is only supported in control planes running on [Upbound Cloud Spaces][upbound-cloud-spaces].
:::

#### Create an identity pool

1. Open the **[GCP IAM Admin console][gcp-iam-admin-console]**.
2. Select **[Workload Identity Federation][workload-identity-federation]**.
3. Select **Create Pool**.
4. Name the pool **upbound-oidc-pool**.
5. **Enable** the pool.
6. Select **Continue**.

#### Add Upbound to the pool

- _Provider Name_: **upbound-oidc-provider**
- _Issuer (URL)_: **https://proidc.upbound.io**
- _Audience 1_: **sts.googleapis.com**

Configure the google.subject attribute as **assertion.sub**.

Add an Attribute Condition:

```console
google.subject.contains("mcp:ORGANIZATION_NAME")
```

#### Create a GCP Service Account

1. Open the **[GCP IAM Admin console][gcp-iam-admin-console]**.
2. Select **[Service Accounts][service-accounts]**.
3. Select **Create Service Account**.
4. Grant appropriate roles (e.g., **Cloud SQL Admin**, **Workload Identity User**).

#### Add the service account to the identity pool

1. Return to **[Workload Identity Federation][workload-identity-federation]**.
2. Select **Grant Access**.
3. Select your service account.
4. Use **All identities in the pool**.

#### Create a ProviderConfig

```yaml
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  projectID: <project-id>
  credentials:
    source: Upbound
    upbound:
      federation:
        providerID: projects/<project-id>/locations/global/workloadIdentityPools/<identity-pool>/providers/<identity-provider>
        serviceAccount: <service-account-name>@<project-name>.iam.gserviceaccount.com
```

### GCP Service Account Keys {#gcp-service-account-keys}

Using GCP service account keys requires storing the GCP account keys JSON file as a Kubernetes secret.

#### Create a Kubernetes secret

```shell
kubectl create secret generic \
gcp-secret \
-n crossplane-system \
--from-file=my-gcp-secret=./gcp-credentials.json
```

#### Create a ProviderConfig

```yaml
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  projectID: <project-id>
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: gcp-secret
      key: my-gcp-secret
```

### GCP Workload Identity {#gcp-workload-identity}

When running in Google Kubernetes Engine (GKE), the Provider may use [workload identity][workload-identity] for authentication.

:::tip
Workload identity is only supported with Crossplane running in GKE.
:::

#### Configure the GCP service account

Enable workload identity and link the GCP IAM service account:

```shell
gcloud iam service-accounts add-iam-policy-binding \
  <Service_Account_Email_Address> \
--role  roles/iam.workloadIdentityUser    \
--member "serviceAccount:<Project_Name>.svc.id.goog[crossplane-system/<Kubernetes_Service_Account>]" \
--project <Project_Name>
```

#### Create a ControllerConfig

```yaml
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controller-config
  annotations:
    iam.gke.io/gcp-service-account: <GCP_IAM_service_account_email>
spec:
  serviceAccountName: <Kubernetes_service_account_name>
```

#### Apply the ControllerConfig

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-gcp-storage
spec:
  package: xpkg.upbound.io/upbound/provider-gcp-storage:v1.10.0
  controllerConfigRef:
    name: my-controller-config
```

#### Create a ProviderConfig

```yaml
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  projectID: <Project_Name>
  credentials:
    source: InjectedIdentity
```

## Kubernetes authentication

The Upbound Official Kubernetes Provider supports multiple authentication methods.

### Kubernetes Upbound Identity {#kubernetes-upbound-identity}

:::note
This method is only supported in control planes running on [Upbound Cloud Spaces][upbound-cloud-spaces].
:::

Use this method to interact with [Upbound APIs][upbound-apis] using provider-kubernetes.

#### Create an access token

Create a robot and generate a token:

```shell
up login
up robot create "provider-kubernetes" --description="Robot for provider-kubernetes auth"
export UPBOUND_TOKEN=$(up robot token create "provider-kubernetes" "token-name" --file - | jq -r '.token')
```

#### Generate a kubeconfig for Upbound APIs

```shell
up ctx org/space/group/control-plane
up ctx . -f - > upbound-context.yaml
export CONTROLPLANE_CONFIG=upbound-context.yaml
```

#### Create secrets

```shell
kubectl -n crossplane-system create secret generic cluster-config --from-file=kubeconfig=$CONTROLPLANE_CONFIG
kubectl -n crossplane-system create secret generic upbound-credentials --from-literal=token=$UPBOUND_TOKEN
```

#### Create a ProviderConfig

```yaml
apiVersion: kubernetes.crossplane.io/v1alpha1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    secretRef:
      key: kubeconfig
      name: cluster-config
      namespace: crossplane-system
    source: Secret
  identity:
    secretRef:
      key: token
      name: upbound-credentials
      namespace: crossplane-system
    source: Secret
    type: UpboundTokens
```

### Kubernetes Injected Identity {#kubernetes-injected-identity}

Use this method for a control plane to manage resources in itself using a `cluster-admin` role.

#### Create a ProviderConfig

```yaml
apiVersion: kubernetes.crossplane.io/v1alpha1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: InjectedIdentity
```

#### Create a DeploymentRuntimeConfig

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: provider-kubernetes
spec:
  serviceAccountTemplate:
    metadata:
      name: provider-kubernetes
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: provider-kubernetes-cluster-admin
subjects:
  - kind: ServiceAccount
    name: provider-kubernetes
    namespace: crossplane-system
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```

Reference this DeploymentRuntimeConfig in the Provider:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-kubernetes
spec:
  package: xpkg.upbound.io/upbound/provider-kubernetes:v0.16.0
  runtimeConfigRef:
    apiVersion: pkg.crossplane.io/v1beta1
    kind: DeploymentRuntimeConfig
    name: provider-kubernetes
```

[upbound-cloud-spaces]: /manuals/spaces/overview
[aws-iam-console]: https://console.aws.amazon.com/iam
[identity-providers-add-provider]: https://console.aws.amazon.com/iamv2/home#/identity_providers/create
[aws-iam-role]: https://console.aws.amazon.com/iamv2/home#/roles
[aws-account-id]: https://docs.aws.amazon.com/signin/latest/userguide/console_account-alias.html
[download-your-aws-access-key]: https://aws.github.io/aws-sdk-go-v2/docs/getting-started/#get-your-aws-access-keys
[assumerolewithwebidentity]: https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html
[aws-instructions]: https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html
[aws-iam-roles-for-service-accounts]: https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html
[azure-portal]: https://portal.azure.com/
[microsoft-entra-id]: https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview
[gcp-iam-admin-console]: https://console.cloud.google.com/iam-admin/iam
[workload-identity-federation]: https://console.cloud.google.com/iam-admin/workload-identity-pools
[service-accounts]: https://console.cloud.google.com/iam-admin/serviceaccounts
[workload-identity]: https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity
[upbound-apis]: /manuals/spaces/howtos/self-hosted/gitops/#gitops-for-upbound-resources
