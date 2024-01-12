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
tokens to create and manage Azure resources. As an alternative, it can also authenticate
with a `client_certificate` instead of a `client_secret`

### Create a service principal with client secret credentials using the Azure CLI tool

{{< hint "tip" >}}
If you don't have the Azure CLI, use the [install guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
{{< /hint >}}

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

### Create a service principal with client certificate credentials using the Azure CLI tool
You can create Azure service principals with a client certificate instead of a client secret as credentials.
When creating the service principal, Azure CLI provides the options to generate client certificate 
automatically or set your own custom certificate. 

#### Create a service principal with a generated client certificate:
The following command creates a service principal with your custom certificate
```shell
# set your subscription ID
AZ_SUBSCRIPTION_ID="11111111-1111-1111-1111-1111111111111"
az ad sp create-for-rbac --sdk-auth \
                         --role Owner \
                         --scopes /subscriptions/"${AZ_SUBSCRIPTION_ID}" \
                         --create-cert > azure_credentials.json
```
The `azure_credentials.json` file in the preceding command contains:
- the client ID, 
- the path of the generated client certificate file in your local machine
- tenant ID of your subscription

It looks like the following:
```json
{
  "clientId": "1111111-2222-3333-4444-555555555555",
  "clientCertificate": "/path/to/generatedcert.pem",
  "subscriptionId": "22222222-3333-4444-5555-666666666666",
  "tenantId": "33333333-4444-5555-6666-777777777777",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```
The generated certificate looks like the following:
```
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```

To use this configuration with the Upbound Azure Provider, you should replace `clientCertificate`
field with the certificate content. You should first convert the certificate to `PKCS12` format,
then encode it with `base64`.

```shell
# extract the path of the generated PEM certificate
AZ_CLIENT_CERT_PEM_PATH="$(jq -r '.clientCertificate' azure_credentials.json)"

# convert PEM to PKCS12 using openssl tool
openssl pkcs12 -export \
               -out azure_sp_cert.pkcs12 \
               -in "${AZ_CLIENT_CERT_PEM_PATH}" \
               -inkey "${AZ_CLIENT_CERT_PEM_PATH}" \
               -passout pass:

# encode the certificate
base64 -i azure_sp_cert.pkcs12 | tr -d '\n' > azure_sp_cert_pkcs12_base64encoded

# replace clientCertificate field in azure_credentials.json with base64-encoded certificate content
jq --rawfile certcontent azure_sp_cert_pkcs12_base64encoded \
    '.clientCertificate=$certcontent' azure_credentials.json > azure_credentials_withcert.json
```
The preceding command snippet should generate the file `azure_credentials_withcert.json` that looks like following: 
```json
{
  "clientId": "1111111-2222-3333-4444-555555555555",
  "clientCertificate": "XXXXX......XXX",
  "subscriptionId": "22222222-3333-4444-5555-666666666666",
  "tenantId": "33333333-4444-5555-6666-777777777777",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```
Next, use `kubectl` to associate your Azure credentials file with a generic
Kubernetes secret.

```shell
kubectl create secret generic azure-secret -n upbound-system --from-file=creds=./azure_credentials_withcert.json
```


#### Create a service principal with your own client certificate:
Azure service principals accept custom certificates in an `ASCII` format such as `PEM`, `CER`, or `DER`. 
When using a certificate with `PEM` format, the certificate file should include both the certificate and private key appended.
See [Microsoft Azure Service Principal Documentation](https://learn.microsoft.com/en-us/cli/azure/azure-cli-sp-tutorial-3#create-a-service-principal-using-an-existing-certificate)
for reference

The following command creates a service principal with your custom certificate. You can choose one of the options.
First option lets you specify cert from a file, the second option lets you directly specify the cert content as a string.

```shell
# option 1 - load cert from file 
az ad sp create-for-rbac --sdk-auth \
                         --role Owner \
                         --scopes /subscriptions/"${AZ_SUBSCRIPTION_ID}" \
                         --cert @/path/to/yourcert.pem > azure_credentials.json

# option 2 - set cert directly from string
az ad sp create-for-rbac --sdk-auth \
                         --role Owner \
                         --scopes /subscriptions/"${AZ_SUBSCRIPTION_ID}" \
                         --cert "-----BEGIN CERTIFICATE-----\n...-----END CERTIFICATE-----" > azure_credentials.json
```

The preceding command generates the `azure_credentials.json` file, which has the following content.
Since you used a custom certificate, note that `clientCertificate` is `null` in the output.

```json
{
  "clientId": "1111111-2222-3333-4444-555555555555",
  "clientCertificate": null,
  "subscriptionId": "22222222-3333-4444-5555-666666666666",
  "tenantId": "33333333-4444-5555-6666-777777777777",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```
Upbound Azure Provider accepts certificates in base64-encoded `PKCS12` format.
Convert your certificate to `PKCS12` format, then encode it with `base64` for provider usage.
Add the resulting string to the `clientCertificate` field of `azure_credentials.json`

In the snippet below, you can find example commands for `PEM` certificate to `PKCS12` conversion using `openssl`. 
If your certificate is in other formats than `PEM`, you can convert it to PEM, then use 
following commands for `PKCS12` conversion. 
Other alternative conversions are out-of-scope for this document and left to the user.
If you already have your certificate in `PKCS12` format, you can skip the conversion and move to `base64` encode step.
```shell
# convert PEM to PKCS12 using openssl tool
openssl pkcs12 -export \
               -out azure_sp_cert.pkcs12 \
               -in "/path/to/your/cert.pem" \
               -inkey "/path/to/your/key.pem" \
               -passout pass:

# encode 
base64 -i azure_sp_cert.pkcs12 | tr -d '\n' >  azure_sp_cert_pkcs12_base64encoded

# replace clientCertificate field in azure_credentials.json with base64-encoded certificate content
jq --rawfile certcontent azure_sp_cert_pkcs12_base64encoded \
    '.clientCertificate=$certcontent' azure_credentials.json > azure_credentials_withcert.json
```

The preceding command snippet should generate the file `azure_credentials_withcert.json` 
that looks like the following:

If you have a password-protected PKCS12 certificate, you should also set `clientCertificatePassword` 
field in the `azure_credentials_withcert.json`, if not you can omit.
```json
{
  "clientId": "1111111-2222-3333-4444-555555555555",
  "clientCertificate": "XXXXX......XXX",
  "clientCertificatePassword": "YourClientCertificatePassword",
  "subscriptionId": "22222222-3333-4444-5555-666666666666",
  "tenantId": "33333333-4444-5555-6666-777777777777",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

Use `kubectl` to associate your Azure credentials file with a generic
Kubernetes secret.

```shell
kubectl create secret generic azure-secret -n upbound-system --from-file=creds=./azure_credentials_withcert.json
```

## Configure your provider

Apply these changes to your `ProviderConfig` file. 

```yaml {label="secretPC", copy-lines="5-11"}
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
Azure Kubernetes Service (`AKS`) cluster automatically without manually
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

```yaml {label="sysPC", copy-lines="7-9"}
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

{{< hint "note" >}}

You must use the user-assigned managed identity as the `kubelet` identity of your
AKS cluster.
{{< /hint >}}

First, create a new control plane identity with the Azure CLI. Update
`<controlplane_identity_name>` with a name for your new managed identity.

```shell
az identity create --name <controlplane_identity_name> --resource-group <resource_group>
```

Your output should return the following fields:

```json
{
  "clientId": "<client_id>",
  "clientSecretUrl": "<clientSecretUrl>",
  "id": "/subscriptions/<subscriptionid>/resourcegroups/<resource_group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<controlplane_identity_name>", 
  "location": "<location>",
  "name": "<identity_name>",
  "principalId": "<principal_id>",
  "resourceGroup": "<resource_group>",                       
  "tags": {},
  "tenantId": "<tenant_id>",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

Capture the `id` field output as your control plane identity.

Next, create a `kubelet` managed identity.

```shell
az identity create --name <kubelet_identity_name> --resource-group <resource_group>
```

Capture the `id` field output as your `kubelet` identity.

Next, create an AKS cluster with the identities you created in the preceding
command.

```shell
az aks create \
    --resource-group <resource_group> \
    --name <cluster_name> \
    --network-plugin azure \
    --vnet-subnet-id <subnet_id> \
    --docker-bridge-address <docker_bridge_address> \
    --dns-service-ip <dns_ip> \
    --service-cidr <service_cidr> \
    --enable-managed-identity \
    --assign-identity <controlplane_identity_resource_id> \ 
    --assign-kubelet-identity <kubelet_identity_resource_id>
```

### Configure your provider

In your provider configuration, update the `source`, `subscriptionID`, and
`tenantID` in the `credentials` field. Update the `clientID` field with the
user-assigned managed identity you used as the `kubelet` identity.

```yaml {label="userPC", copy-lines="7-10"}
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
