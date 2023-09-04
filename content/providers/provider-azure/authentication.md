---
title: Authentication 
weight: 10
description: Authentication options with the Upbound Azure official provider
---

The Upbound Official Azure Provider supports multiple authentication methods.

* [Service Principal with Kubernetes Secret]()
* [System-Assigned Managed Identity]()
* [User-Assigned Managed Identity]()

## Service Principal with Kubernetes Secret

A Service Principal is an appliction within the Azure Active Directory that
passes `client_id`, `client_secret`, and `tenant_id` authentication
tokens to create and manage Azure resources. 

### Create a Service Principal using the Azure CLI tool.

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

The `azure.json` file in the command above contains the client ID, secret, and
tenant ID of your subscription.


Finally, use `kubectl` to associate your Azure credentials file with a generic
Kubernetes secret.

```shell
kubectl create secret generic azure-secret -n upbound-system --from-file=creds=./azure.json
```

## Configure your provider

Apply these changes to your `ProviderConfig` file. 

```yml
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
name, and key if you created a different secret name (`azure-secret`) or
created within a different namespace.

Apply your configuration.

```shell
kubectl apply -f
```

Now, your Kubernetes cluster can communicate with Azure securely with the
generic secret.

## System-Assigned Managed Identity

Another method for authentication is using a System-Assigned Managed Identity.
The System-Assigned Managed Identity allows you to associate the provider with
your
AKS cluster automatically without manually
managing credentials.

### Create a System-Assigned Managed Identity

A System-Assigned Managed Identity is automatically created when you create
an AKS cluster. This section will detail creating a new
cluster.

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

To switch from a service principal to a System-Assigned Managed Identity,
use the `aks update` command.

```shell
az aks update -g myResourceGroup -n myManagedCluster --enable-managed-identity
```

### Configure your provider

In your provider configuration, update the credentials `source` field.

```yml
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

## User-Assigned Managed Identity

Another method for authentication is a User-Assigned Managed Identity. The
User-Assigned Managed Identities exist indenpendant of any other Azure
resource, unlike System-Assigned Managed Identities. If your organization
needs to use a single identity across multiple resources, the User-Assigned
Managed Identity allows you to create one authentication identity with
fixed permissions.

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
