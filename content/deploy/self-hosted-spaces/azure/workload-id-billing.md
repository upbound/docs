---
title: Workload-identity for Billing
weight: 1
description: Configure Azure workload identity for Spaces Billing
---

Workload-identity authentication lets you use access policies to grant your
self-hosted Space cluster access to your cloud providers. Workload identity
authentication grants temporary Azure credentials to your Kubernetes pod based on
a service account. Assigning IAM roles and service accounts allows the pod to
assume the IAM role dynamically and much more securely than static credentials.

This guide walks you through creating an IAM trust role policy and applying it to your AKS
cluster for billing in your Space cluster.

## Prerequisites

<!-- vale gitlab.FutureTense = NO -->
To set up a workload-identity, you'll need:
<!-- vale gitlab.FutureTense = YES -->

- A self-hosted Space cluster
- Administrator access in your cloud provider
- Helm and `kubectl`

## About the billing component

The `vector.dev` component handles billing metrics collection in spaces. It
stores account data in your cloud storage. By default, this component runs in
each control plane's host namespace.

## Configuration

Upbound supports workload-identity configurations in Azure with Azure's built-in
workload identity feature.


First, enable the OIDC issuer and workload identity in your AKS cluster:

```shell
az aks update --resource-group ${YOUR_RESOURCE_GROUP} --name ${YOUR_AKS_CLUSTER_NAME} --enable-oidc-issuer --enable-workload-identity
```

Next, find and store the OIDC issuer URL as an environment variable:

```shell
export AKS_OIDC_ISSUER="$(az aks show --name ${YOUR_AKS_CLUSTER_NAME} --resource-group ${YOUR_RESOURCE_GROUP} --query "oidcIssuerProfile.issuerUrl" --output tsv)"
```


Create a new managed identity to associate with the billing component:

```shell
az identity create --name billing-identity --resource-group ${YOUR_RESOURCE_GROUP} --location ${YOUR_LOCATION}
```

Retrieve the client ID and store it as an environment variable:

```shell
export USER_ASSIGNED_CLIENT_ID="$(az identity show --name billing-identity --resource-group ${YOUR_RESOURCE_GROUP} --query clientId -otsv)"
```

Grant the managed identity you created to access your Azure Storage account:

```shell
az role assignment create --role "Storage Blob Data Contributor" --assignee $USER_ASSIGNED_CLIENT_ID --scope /subscriptions/${YOUR_SUBSCRIPTION_ID}/resourceGroups/${YOUR_RESOURCE_GROUP}/providers/Microsoft.Storage/storageAccounts/${YOUR_STORAGE_ACCOUNT}
```


In your control plane, pass the `--set` flag with the Spaces Helm chart
parameters for the billing component:

```shell
--set "billing.enabled=true"
--set "billing.storage.provider=azure"
--set "billing.storage.azure.storageAccount=${SPACES_BILLING_STORAGE_ACCOUNT}"
--set "billing.storage.azure.container=${SPACES_BILLING_STORAGE_CONTAINER}"
--set "billing.storage.secretRef.name="
--set controlPlanes.vector.serviceAccount.customAnnotations."azure\.workload\.identity/client-id"="${SPACES_BILLING_APP_ID}"
--set controlPlanes.vector.pod.customLabels."azure\.workload\.identity/use"="true"
```


Create a federated credential to establish trust between the managed identity
and your AKS OIDC provider:

```shell
az identity federated-credential create \
  --name billing-federated-identity \
  --identity-name billing-identity \
  --resource-group ${YOUR_RESOURCE_GROUP} \
  --issuer ${AKS_OIDC_ISSUER} \
  --subject system:serviceaccount:${YOUR_CONTROL_PLANE_NAMESPACE}:vector
```

### Verify your configuration

After you apply the configuration use `kubectl` to verify the service account
has the correct annotation:

```shell
kubectl get serviceaccount vector -n ${YOUR_CONTROL_PLANE_NAMESPACE} -o yaml
```

Verify the `vector` pod is running correctly:


```shell
kubectl get pods -n ${YOUR_CONTROL_PLANE_NAMESPACE} | grep vector
```

### Restart workload

You must manually restart a workload's pod when you add the
`eks.amazonaws.com/role-arn key` annotation to the running pod's service
account.

This restart enables the EKS pod identity webhook to inject the necessary
environment for using IRSA.


```shell
kubectl rollout restart deployment vector 
```

## Use cases

Using workload identity authentication for billing eliminates the need for static
credentials in your cluster as well as the overhead of credential rotation.
These benefits are particularly helpful in:

* Resource usage tracking across teams/projects
* Cost allocation for multi-tenant environments
* Financial auditing requirements
* Capacity billing and resource optimization
* Automated billing workflows

## Next steps

Now that you have workload identity configured for the billing component, visit
the Billing guide for more information.
