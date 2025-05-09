---
title: Workload-identity for Backup and Restore
weight: 1
description: Configure Azure workload identity for Spaces Backup and Restore
---

Workload-identity authentication lets you use access policies to grant your
self-hosted Space cluster access to your cloud providers. Workload identity
authentication grants temporary Azure credentials to your Kubernetes pod based on
a service account. Assigning IAM roles and service accounts allows the pod to
assume the IAM role dynamically and much more securely than static credentials.

This guide walks you through creating an IAM trust role policy and applying it to your AKS
cluster to handle backup and restore storage.

## Prerequisites

<!-- vale gitlab.FutureTense = NO -->
To set up a workload-identity, you'll need:
<!-- vale gitlab.FutureTense = YES -->

- A self-hosted Space cluster
- Administrator access in your cloud provider
- Helm and `kubectl`

## About the backup and restore component

The `mxp-controller` component handles backup and restore workloads. It needs to
access your cloud storage to store and retrieve backups. By default, this
component runs in each control plane's host namespace. 

To configure your backup and restore workflow controller, you need to use the
Spaces Helm chart:

* `controlPlanes.mxpController.serviceAccount.annotations` - Configures service
   account annotations
* `controlPlanes.mxpController.pod.customLabels` - Sets custom labels for the
  back and restore workflow pods

## Configuration

Upbound supports workload-identity configurations in Azure with Azure's built-in
workload identity feature.

### Prepare your cluster

First, enable the OIDC issuer and workload identity in your AKS cluster:

```shell
az aks update --resource-group ${YOUR_RESOURCE_GROUP} --name ${YOUR_AKS_CLUSTER_NAME} --enable-oidc-issuer --enable-workload-identity
```

Next, find and store the OIDC issuer URL as an environment variable:

```shell
export AKS_OIDC_ISSUER="$(az aks show --name ${YOUR_AKS_CLUSTER_NAME} --resource-group ${YOUR_RESOURCE_GROUP} --query "oidcIssuerProfile.issuerUrl" --output tsv)"
```

### Create a User-Assigned Managed Identity

Create a new managed identity to associate with the billing component:

```shell
az identity create --name backup-restore-identity --resource-group ${YOUR_RESOURCE_GROUP} --location ${YOUR_LOCATION}
```

Retrieve the client ID and store it as an environment variable:

```shell
export USER_ASSIGNED_CLIENT_ID="$(az identity show --name backup-restore-identity --resource-group ${YOUR_RESOURCE_GROUP} --query clientId -otsv)"
```

Grant the managed identity you created to access your Azure Storage account:

```shell
az role assignment create \
  --role "Storage Blob Data Contributor" \
  --assignee ${USER_ASSIGNED_CLIENT_ID} \
  --scope /subscriptions/${YOUR_SUBSCRIPTION_ID}/resourceGroups/${YOUR_RESOURCE_GROUP}/providers/Microsoft.Storage/storageAccounts/${YOUR_STORAGE_ACCOUNT}
```

### Apply the managed identity role

In your control plane, pass the `--set` flag with the Spaces Helm chart
parameters for the backup and restore component:

```shell
--set controlPlanes.mxpController.serviceAccount.annotations."azure\.workload\.identity/client-id"="${YOUR_USER_ASSIGNED_CLIENT_ID}"
--set controlPlanes.mxpController.pod.customLabels."azure\.workload\.identity/use"="true"
```

### Create a Federated Identity credential

```shell
az identity federated-credential create \
  --name backup-restore-federated-identity \
  --identity-name backup-restore-identity \
  --resource-group ${YOUR_RESOURCE_GROUP} \
  --issuer ${AKS_OIDC_ISSUER} \
  --subject system:serviceaccount:${YOUR_CONTROL_PLANE_NAMESPACE}:mxp-controller
```

### Verify your configuration

After you apply the configuration use `kubectl` to verify the service account
has the correct annotation:

```shell
kubectl get serviceaccount mxp-controller -n ${YOUR_CONTROL_PLANE_NAMESPACE} -o yaml
```

Verify the `mxp-controller` pod is running correctly:

```shell
kubectl get pods -n ${YOUR_CONTROL_PLANE_NAMESPACE} | grep mxp-controller
```

### Restart workload

You must manually restart a workload's pod when you add the
`eks.amazonaws.com/role-arn key` annotation to the running pod's service
account.

This restart enables the EKS pod identity webhook to inject the necessary
environment for using IRSA.

```shell
kubectl rollout restart deployment mxp-controller
```

## Use cases

Configuring backup and restore with workload identity eliminates the need for
static credentials in your cluster and the overhead of credential rotation.
These benefits are particularly helpful in:

* Disaster recovery scenarios
* Control plane migration
* Compliance requirements
* Rollbacks after unsuccessful upgrades

## Next steps

Now that you have a workload identity configured for the backup and restore
component, visit the Backup Configuration documentation.

Other workload identity guides are:
* Billing
* Shared secrets

