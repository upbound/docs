---
title: Authentication 
weight: 10
description: Authentication options with the Upbound Azure official provider
---

The Upbound Official Azure Provider supports multiple authentication methods.

* [Service principal with Kubernetes secret](https://learn.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals?tabs=browser#service-principal-object)
* [System-assigned managed identity](https://learn.microsoft.com/en-us/azure/aks/use-managed-identity#enable-managed-identities-on-an-existing-aks-cluster)
* [User-assigned managed identity](https://learn.microsoft.com/en-us/azure/aks/use-managed-identity#bring-your-own-managed-identity)

## Service principal with Kubernetes secret

A service principal is an application within the Azure Active Directory that
passes `client_id`, `client_secret`, and `tenant_id` authentication
tokens to create and manage Azure resources. 

### Create a service principal using the Azure CLI tool

First, find the Subscription ID for your Azure account.

```shell
az account list
```

Note the value of the `id` in the return output. 

Next, create a service principle `Owner` role. Update the `<subscription_id>`
with the `id` from the previous command.

```shell
az ad sp create-for-rbac --sdk-auth --role Owner --scopes /subscriptions/<subscription_id> \
  > azure.json
```

The `azure.json` file in the preceding command contains the client ID, secret, and
tenant ID of your subscription.


Next, use `kubectl` to associate your Azure credentials file with a generic
Kubernetes secret.

```shell
kubectl create secret generic azure-secret -n upbound-system --from-file=creds=./azure.json
```

## Configure your provider

Apply these changes to your `ProviderConfig` file. 

```yaml {copy-lines="5-11"}
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

Your credential `source` must be `Secret` and you must specify the namespace,
name, and key if you used different values.

Apply your configuration.

## System-assigned managed identity

The system-assigned managed identity allows you to associate the provider with
your
AKS cluster automatically without manually
managing credentials.

### Create a system-assigned managed identity

A system-assigned managed identity is automatically created when you create
an AKS cluster. This section covers creating a new identity in a new cluster.

Create a resource group.

```shell
az group create --name myResourceGroup --location westus2
```

Create an AKS cluster with the `--enable-managed-identity` flag.

```shell
az aks create -g myResourceGroup -n myManagedCluster --enable-managed-identity
```

Use the `aks get-credentials` command to generate the kubeconfig file
for your AKS cluster. This file contains the authentication and connection
information for your cluster.

```shell
az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
```

To switch from a service principal to a system-assigned managed identity,
use the `aks update` command.

```shell
az aks update -g myResourceGroup -n myManagedCluster --enable-managed-identity
```

### Configure your provider

In your provider configuration, update the `source`, `subscriptionID`, and
`tenantID` in the `credentials` field. 

```yaml {copy-lines="7-9"}
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

## User-assigned managed identity

User-assigned managed identities exist independent of any other Azure
resource, unlike system-assigned managed identities. If your organization
needs to use a single identity across multiple resources, this option allows you to create one authentication identity with fixed permissions.

First, create a new managed identity with the Azure CLI. Update
`<identity_name>` with a name for your new managed identity.

```shell
az identity create -g <resource_group> --name <identity_name> --resource-group myResourceGroup
```

Next, assign the identity to your AKS cluster.

```shell
az webapp identity assign --resource-group <group-name> --name <app-name> --identities <identity-id>
```

```shell
az aks update -g MyResourceGroup -n MyManagedCluster --enable-managed-identity
--assign-identity <user_assigned_identity_resource_id>/user
```

```shell
az role assignment create --assignee <control-plane-identity-principal-id>
--role "Contributor" --scope "<custom-resource-group-resource-id>"
```
