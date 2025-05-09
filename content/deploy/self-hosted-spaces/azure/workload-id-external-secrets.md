---
title: Workload-identity for Shared Secrets
weight: 1
description: Configure Azure workload identity for Spaces Shared Secrets
---

Workload-identity authentication lets you use access policies to grant your
self-hosted Space cluster access to your cloud providers. Workload identity
authentication grants temporary Azure credentials to your Kubernetes pod based on
a service account. Assigning IAM roles and service accounts allows the pod to
assume the IAM role dynamically and much more securely than static credentials.

This guide walks you through creating an IAM trust role policy and applying it to your AKS
cluster for shared secrets in your Space cluster.

## Prerequisites

<!-- vale gitlab.FutureTense = NO -->
To set up a workload-identity, you'll need:
<!-- vale gitlab.FutureTense = YES -->

- A self-hosted Space cluster
- Administrator access in your cloud provider
- Helm and `kubectl`

## About the shared secrets component

The External Secrets Operator (ESO) component runs in each control plane's host
namespace as `external-secrets-controller`. It synchronizes secrets from
external APIs into Kubernetes secrets. Shared secrets allow you to manage
credentials outside your Kubernetes cluster while making them available to your
application


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
az identity create --name secrets-identity --resource-group ${YOUR_RESOURCE_GROUP} --location ${YOUR_LOCATION}
```

Retrieve the client ID and store it as an environment variable:

```shell
export USER_ASSIGNED_CLIENT_ID="$(az identity show --name secrets-identity --resource-group ${YOUR_RESOURCE_GROUP} --query clientId -otsv)"
```

Grant the managed identity you created to access your Azure Storage account:

```shell
az keyvault set-policy --name ${YOUR_KEY_VAULT_NAME} \
  --resource-group ${YOUR_RESOURCE_GROUP} \
  --object-id $(az identity show --name secrets-identity --resource-group ${YOUR_RESOURCE_GROUP} --query principalId -otsv) \
  --secret-permissions get list
```


In your control plane, pass the `--set` flag with the Spaces Helm chart
parameters for the billing component:

```shell
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."azure\.workload\.identity/client-id"="${USER_ASSIGNED_CLIENT_ID}"
--set controlPlanes.sharedSecrets.pod.customLabels."azure\.workload\.identity/use"="true"
```

Next, create a federated credential to establish trust between the managed identity
and your AKS OIDC provider:

```shell
az identity federated-credential create \
  --name secrets-federated-identity \
  --identity-name secrets-identity \
  --resource-group ${YOUR_RESOURCE_GROUP} \
  --issuer ${AKS_OIDC_ISSUER} \
  --subject system:serviceaccount:${YOUR_CONTROL_PLANE_NAMESPACE}:external-secrets-controller
```

### Verify your configuration

After you apply the configuration use `kubectl` to verify the service account
has the correct annotation:

```shell
kubectl get serviceaccount external-secrets-controller -n ${YOUR_CONTROL_PLANE_NAMESPACE} -o yaml
```

Verify the External Secrets Operator pod is running correctly:


```shell
kubectl get pods -n ${YOUR_CONTROL_PLANE_NAMESPACE} | grep external-secrets
```

### Restart workload

You must manually restart a workload's pod when you add the
`eks.amazonaws.com/role-arn key` annotation to the running pod's service
account.

This restart enables the EKS pod identity webhook to inject the necessary
environment for using IRSA.


```shell
kubectl rollout restart deployment external-secrets
```

## Use cases

Using workload identity authentication for shared secrets eliminates the need for static
credentials in your cluster as well as the overhead of credential rotation.
These benefits are particularly helpful in:

* Secure application credentials management
* Database connection string storage
* API token management
* Compliance with secret rotation security standards


## Next steps

Now that you have workload identity configured for the shared secrets component, visit
the Shared Secrets guide for more information.

Other workload identity guides are:
* Backup and restore 
* Billing

