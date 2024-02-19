---
title: Deploy your first control plane with Azure
weight: 2   
description: A guide for deploying a cloud platform on Upbound for Microsoft Azure
---

This quickstart guides you through how to create your first managed control plane in Upbound. Connect Upbound to Azure, and use your control plane to create and manage AKS clusters.

## Prerequisites

You need the following:

* An Upbound account.
* An Azure account with permissions to manage IAM policies.
* A GitHub account with permission to install GitHub Apps.

{{< hint "tip" >}}
If you don't have an Upbound account, [sign up for a free trial](https://accounts.upbound.io/register).
{{< /hint >}}

## Get started

The first time you sign in to Upbound, you walk through a Getting Started experience designed to bootstrap your environment in the matter of minutes. 

Go to [Upbound](https://console.upbound.io) to get started.

### Create an organization

Your first time in Upbound you must create an organization. Give your organization an ID and a friendly name. 

Select **Create Organization**.

{{<img src="quickstart/images/my-org.png" alt="Upbound Create organization screen" size="small" align="center" unBlur="true" >}}

On the next screen, start your free trial. This trial allows you to create up to three managed control planes, three configurations, and invite a total of 10 team members in an organization.

{{<img src="quickstart/images/free-trial.png" alt="Upbound Free trial entry" size="small" align="center" unBlur="true">}}

### Choose a configuration

Upbound offers a curated gallery of Crossplane configurations for you to choose from. These configurations provide ready-built APIs that Upbound installs in your control plane. You can select the _source_ link to view the configuration files that define this API in GitHub. 

Select the Configuration called **AKS as a service**. 

{{<img src="quickstart/images/azure-config.png" alt="Upbound Azure configuration" >}}
### Connect to GitHub

After you've selected a Configuration, you need to connect Upbound to your GitHub account. Upbound uses GitHub's authorization flow and installs a GitHub app into your account. 

Select **Connect to GitHub**.

{{<img src="quickstart/images/azure-connect-to-gh.png" alt="Upbound connect to GitHub"  unBlur="true">}}

{{< hint "tip" >}}
Git connectivity is at the core of Upbound's workflows. To learn more about git integration, read the [GitOps with MCP]({{<ref "/concepts/mcp/control-plane-connector.md" >}}) section.
{{< /hint >}}

After you've connected to GitHub, select an account owner and repository name. Upbound creates a new repository under your account and clones the contents of the Configuration into that repository. 

<!-- vale Google.FirstPerson = NO -->
Give your repository a name, like **my-control-plane-apis**. 
<!-- vale Google.FirstPerson = YES -->

Select **Clone configuration to GitHub**.

{{<img src="quickstart/images/azure-gh-connect.png" alt="Upbound Create Repository screen" >}}

### Create a managed control plane

After Upbound clones the Configuration into your own repository, create a managed control plane. 

<!-- vale Google.FirstPerson = NO -->
Give your control plane a name, like **my-control-plane**.
<!-- vale Google.FirstPerson = YES -->

Select **Create Control Plane**.

{{<img src="quickstart/images/get-started-name-ctp.png" alt="Upbound Create Control Plane screen" align="center" unBlur="true">}}

### Connect to Azure with OIDC

While Upbound creates your control plane, connect Upbound to Azure. 

Upbound recommends using OpenID Connect (OIDC) to authenticate to Azure without exchanging any private information. 

#### Create an identity pool
1. Open the **[Azure portal](https://portal.azure.com/)**.
2. Select **[Microsoft Entra ID](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview)**.
3. If this is your first time registering Upbound as an identity provider in Microsoft Entra ID, select **App registrations**
4. At the top of the page, select **New registration**.
5. Name the pool, like **upbound-oidc-provider**.
6. In the _Supported account types_ section select **Accounts in this organizational directory only**.
7. In the _Redirect URI_ section select **Web** and leave the URL field blank.
8. Select **Register**.
{{<img src="quickstart/images/azure-identity-start.png" alt="Upbound Get Started Configure OIDC screen for Azure"  align="center" unBlur="true" size="small" >}}

#### Create a federated credential 

To allow the `upbound-oidc-provider` registration created in the previous step to trust the Upbound Control Plane, do the following in the resource view.

1. Select **Certificates and secrets** in the left navigation.
2. Select **Federated credentials** tab.
3. Select **Add credential**.
4. In _Federated credential scenario_ select **Other Issuer**.
5. In _Issuer_ enter **https://proidc.upbound.io**.
6. In _Subject identifier_ enter:

{{< editCode >}}
```yaml
mcp:$@<your-org>/<your-control-plane-name>$@:provider:provider-azure
```
{{< /editCode >}}

7. In _Credential details name_ enter:

{{< editCode >}}
```yaml
upbound-$@<your-org>-<your-control-plane-name>$@-provider-azure
```
{{< /editCode >}}

8. In _Credential details description_ enter:

{{< editCode >}}
```yaml
upbound MCP $@<your-org>/<your-control-plane-name>$@ Provider provider-azure
```
{{< /editCode >}}

9. Leave _Audience_ unmodified with **api://AzureADTokenExchange**.
10. Select **Add**.

{{<img src="quickstart/images/azure-registration-config.png" alt="Azure configure app registration" align="center" size="small" unBlur="true">}}

#### Grant permissions to the service principal

For your control plane to be able to perform actions required by this configuration, you need to grant permissions to the Application Service Principal. Assign a role to the Application Service Principal by following instructions at Assign a role to the application.

1. Open the **[Azure portal](https://portal.azure.com/)**
2. Select **[Subscriptions](https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade)**.
3. Select your subscription.
4. Select **Access control (IAM)** in the left navigation.
5. Select **Add** and select **Add role assignment**.
6. Find and select the **Contributor** role on the **Privileged administrator roles** tab.
7. Select **Next**.
8. In _Assign access to_ select **User, group, or service principal**.
9. Select **Select members**.
10. Find your application by entering **upbound-oidc-provider** in the search field.
11. Select **Select**.
12. Select **Review + assign**.
13. Make sure everything is correct and press **Review + assign** again.

{{<img src="quickstart/images/azure-identity-setup.png" alt="Azure grant permissions to service principal" align="center" size="small" unBlur="true" >}}

### Finish configuring the Upbound identity provider

Back in Upbound, finish configuring the identity provider.

In the _Application (client) ID_ field enter your **Application (client) ID**.  

For the _Directory (tenant) ID_ field, enter your **Directory (tenant) ID**. You can find this by selecting your Application under Microsoft Entra ID -> Application Registrations.

In the _Azure Subscription ID_ field, enter your **Subscription ID**. You can find this by selecting your Subscription in the Azure portal.

{{<img src="quickstart/images/azure-oidc-finalize.png" alt="Upbound configuration to connect to Azure with OIDC" size="small" align="center" unBlur="true">}}

Select **Authenticate**.  
Select **Launch Control Plane**.

## Welcome to the Upbound Console

After completing the _Get Started_ experience, you are in the Upbound Console and greeted by the Control Planes screen.

{{<img src="quickstart/images/control-plane-console.png" alt="Upbound Azure control plane instance screen" align="center" size="small" unBlur="true">}}

The control plane details view gives users a view into what's happening on their control planes. 

{{< hint "tip" >}}
Read about the [Upbound Console]({{<ref "concepts/console">}}) for a full tour of what the Console has to offer.
{{< /hint >}}

### Create your first resource

From the control planes view, select the **Portal** tab, and select **Open Control Plane Portal**.

{{<img src="quickstart/images/get-started-portal-link.png" alt="Navigate to control plane portal" unBlur="true">}}

The Control Plane Portal lists the available resources that users can claim in the left-side menu.  
These resources are your abstracted APIs presented to users. 

{{<img src="quickstart/images/cp-create-kubernetescluster.png" alt="Control plane portal with a Kubernetes Cluster resource" align="center" unBlur="true">}}

Select the **KubernetesCluster** resource and then select the **Create New** button at the top of the page. 

The form are the parameters defined in your custom API. Fill-in the form with the following:

<!-- vale Google.FirstPerson = NO -->
<!-- allow "my" -->
- _name_: **my-app-cluster**
- _namespace_: **default**
- _id_: **my-app-cluster**
- _count_: **1**
- _size_: **small**
<!-- vale Google.FirstPerson = YES -->

{{<img src="quickstart/images/get-started-k8s-cluster-create.png" alt="Navigate to control plane portal" >}}

When you **Create Instance** the portal generates a Crossplane claim.

{{<hint "note" >}}
After creating an instance, the _Events_ section are logs directly from Kubernetes.  

Crossplane commonly generates a Kubernetes error `cannot apply composite resource: cannot patch object: Operation cannot be fulfilled` that may appear as an _Event_.

{{<img src="quickstart/images/event-error-cannot-patch.png" alt="Events showing the error cannot apply composite resource: cannot patch object" align="center" unBlur="true">}}

You can ignore this error. For more information about what causes this, read [Crossplane issue #2114](https://github.com/crossplane/crossplane/issues/2114).
{{< /hint >}}

### Observe your resources

Navigate back to [Upbound Console](https://console.upbound.io) window and to your control plane in the **Overview** tab. 

There's now a claim card next to the `KubernetesCluster` type card. 

Select the claim and Upbound renders the full resource tree that's getting created and managed by your managed control plane. 

{{<img src="quickstart/images/get-started-k8s-created.png" alt="Navigate to control plane portal" >}}

Congratulations, you created your first resources with your control plane.

## Next steps

To learn more about the core concepts of Upbound, read the [concepts]({{<ref "concepts">}}) documentation. To learn how to begin building your own platform on Upbound, read the [Crossplane Architecture Framework]({{<ref "xp-arch-framework/_index.md">}}).

<!-- Named Links -->

[accounts.upbound.io]: https://accounts.upbound.io
[cloud.upbound.io]: https://cloud.upbound.io
