---
title: Deploy your first multicloud control plane
weight: 4
description: A guide for deploying a multicloud Cluster-as-a-Service platform on Upbound
---

This quickstart guides you through how to create your first managed control plane in Upbound with configuration-caas. Connect Upbound to AWS, GCP, and Azure to provision and manage fully configured Kubernetes Service clusters. They're composed using cloud service primitives from the Upbound Official Providers.

## Prerequisites

To deploy Upbound's configuration-caas, you need:

* An Upbound account.
* A GitHub account with permission to install GitHub Apps.
* At least one of the following:
	* An AWS account with permissions to manage IAM policies.
 	* An Azure account with permissions to manage IAM policies.
 	* A GCP account with permissions to manage IAM policies.

{{< hint "tip" >}}
If you don't have an Upbound account, [sign up for a free trial](https://accounts.upbound.io/register/a).
{{< /hint >}}
## Get started

The first time you sign in to Upbound, you are through a `Get Started` experience designed to bootstrap your environment in the matter of minutes. Go to [Upbound](https://console.upbound.io) to start the experience.

### Create an organization

Your first time in Upbound you must create an organization. Give your organization an ID and a friendly name. 

Select **Create Organization**.

{{<img src="quickstart/images/my-org.png" alt="Upbound Create organization screen" size="original" quality="100" align="center" >}}

On the next screen, start your free trial. This trial allows you to create up to three managed control planes, three configurations, and invite a total of 10 team members in an organization.

{{<img src="quickstart/images/free-trial.png" alt="Upbound Free trial entry" size="original" quality="100" align="center" >}}

### Choose a configuration

Upbound offers a curated gallery of Crossplane configurations for you to choose from. These configurations provide ready-built APIs that Upbound installs in your control plane. You can select the _source_ link to view the configuration files that define this API in GitHub. 

Select the Configuration called **Cluster as a Service**. 

{{<img src="quickstart/images/caas-fre-step1.png" alt="Choose an Upbound configuration" quality="100" size="medium" lightbox="true" >}}

### Connect to GitHub

Now that you've selected a Configuration, you need to connect Upbound to your GitHub account. Upbound uses GitHub's authorization flow and installs a GitHub app into your account. 

Select **Connect to GitHub**.

{{< hint "tip" >}}
Git connectivity is at the core of Upbound's workflows. To learn more about git integration, read the [GitOps with Control Planes]({{<ref "/concepts/mcp/control-plane-connector.md" >}}) section.
{{< /hint >}}

Once you've connected to GitHub, select an account owner and repository name. Upbound creates a new repository under your account and clones the contents of the Configuration into that repository. 

<!-- vale Google.FirstPerson = NO -->
<!-- allow "my" -->
Give your repository a name, like **my-control-plane-api**. 
<!-- vale Google.FirstPerson = YES -->

Select **Clone configuration to GitHub**.

{{<img src="quickstart/images/caas-fre-step2.png" alt="Upbound Create Repository screen" quality="100" lightbox="true">}}

### Create a managed control plane

After Upbound clones the Configuration into your own repository, create a managed control plane. 

<!-- vale Google.FirstPerson = NO -->
<!-- allow "my" -->
Give your control plane a name, like **my-control-plane**.
<!-- vale Google.FirstPerson = YES -->

Select **Create Control Plane**.

{{<img src="quickstart/images/caas-fre-step3.png" alt="Upbound Create Control Plane screen" quality="100" lightbox="true" size="medium" >}}

### Complete the flow

On the final screen of the _Get Started_ experience, review your work. Observe the configuration you've cloned and the control plane you've created. This screen shows information about the providers that you need to authenticate with after launching your new control plane.
{{<img src="quickstart/images/caas-fre-step4.png" alt="Upbound Get Started Experience final step" quality="100" lightbox="true" size="medium" >}}

## Welcome to the Upbound Console

After completing the _Get Started_ experience, you are in the Upbound control plane explorer. The console shows a message with pointers for what to do next. 

{{<img src="quickstart/images/caas-getting-started-guide.png" alt="Getting Started Guide" quality="100" align="center">}}

You can reopen this guide at any time by selecting the Getting Started Guide button in the upper right corner of the control plane explorer.

{{<img src="quickstart/images/caas-ctp-explorer.png" alt="Upbound control plane explorer" quality="100" align="center">}}

The control plane details view gives you a view into what's happening on your control plane. 

{{< hint "tip" >}}
Read about the [Upbound Console]({{<ref "concepts/console">}}) for a full tour of what the Console has to offer.
{{< /hint >}}

## Authenticate with Providers
Next, configure provider-upbound and connect your managed control plane to each cloud service provider you wish to use in your CaaS offering. You must configure provider-upbound via the CLI, but you can authenticate with cloud service providers from within the Upbound Console UI.

{{< hint "tip" >}}
You should wait until your Configuration has finished installing into your control plane before creating any ProviderConfigs.
{{< /hint >}}

### Configure provider-upbound

Provider Upbound needs a valid Upbound token to authenticate. You can fetch one in multiple ways, but the simplest option is to log in with [Up CLI]({{<ref "reference/cli">}}) to get a session token. 

Log in with the `up login` command to save a token to `~/.up/config.json`

Then, create a Secret object that contains the token.

```shell {copy-lines="1"}
kubectl -n crossplane-system create secret generic up-creds --from-file=creds=$HOME/.up/config.json
```

Next, create a ProviderConfig object that references the Secret object you just created. The following command creates a ProviderConfig object that references the Secret object you just created.

```shell
cat <<EOF | kubectl apply -f -
apiVersion: upbound.io/v1alpha1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: up-creds
      key: creds
EOF
```
### Connect to AWS with OIDC
Upbound recommends using OpenID Connect (OIDC) to authenticate to AWS without exchanging any private information. 

#### Add Upbound as an OpenID Connect provider
1. Open the **[AWS IAM console](https://console.aws.amazon.com/iam)**.
2. Under the AWS IAM services, select **[Identity Providers > Add Provider](https://console.aws.amazon.com/iamv2/home#/identity_providers/create)**.  
3. Select **OpenID Connect** and use  
 **https://proidc.upbound.io** as the Provider URL and   
 **sts.amazonaws.com** as the Audience.  
  Select **Get thumbprint**.  
  Select **Add provider**.  
{{<img src="quickstart/images/get-started-aws-add-idp-confirm.png" alt="Configure an Identity Provider in AWS" quality="100" align="center" >}}

#### Create an AWS IAM Role for Upbound
1. Create an [AWS IAM Role](https://console.aws.amazon.com/iamv2/home#/roles) with a **Custom trust policy** for the OIDC connector.
{{<img src="quickstart/images/aws-custom-trust-policy.png" alt="IAM Role with a custom trust policy" quality="100" align="center">}}
{{<hint "important" >}}
Provide your [AWS account ID](https://docs.aws.amazon.com/signin/latest/userguide/console_account-alias.html), Upbound organization and control plane names in the JSON Policy below.

You can find your AWS account ID by selecting the account dropdown in the upper right corner of the AWS console.
{{< /hint >}}
{{< editCode >}}
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Principal": {
				"Federated": "arn:aws:iam::$@YOUR_AWS_ACCOUNT_ID$@:oidc-provider/proidc.upbound.io"
			},
			"Action": "sts:AssumeRoleWithWebIdentity",
			"Condition": {
				"StringEquals": {
					"proidc.upbound.io:sub": "mcp:$@ORG_NAME/CONTROL_PLANE_NAME$@:provider:provider-aws",
					"proidc.upbound.io:aud": "sts.amazonaws.com"
				}
			}
		}
	]
}
```
{{< /editCode >}}
1. Attach the **AmazonEC2FullAccess** permission policy.
{{<img src="quickstart/images/aws-ec2fullaccess-policy.png" alt="Applying the AmazonEC2FullAccess policy to the role" quality="100" align="center">}}
1. Name the role **upbound-eks-role** and select **Create role**.
{{<img src="quickstart/images/aws-eks-role-name.png" alt="Naming the role upbound-eks-role" quality="100" align="center">}}
1. View the new role and copy the role ARN.
{{<img src="quickstart/images/aws-upbound-eks-role-arn.png" alt="Viewing the role ARN" quality="100" align="center">}}

#### Provide the ARN to Upbound

Return to Upbound and head to the Providers tab within the control plane explorer. Find provider-family-aws and select the ProviderConfigs tab. Then, select **Create ProviderConfig**

{{<img src="quickstart/images/providers-tab.png" alt="Providers tab" quality="100" lightbox="true" size="medium">}}

On the screen that displays, give the ProviderConfig a name. Entering the name `default` sets this as the default ProviderConfig for this provider in this control plane.

Next, paste the roleARN you copied from AWS into the input at the bottom of the form.  

Select **Create** to finish authenticating with AWS.  

### Connect to Azure with OIDC

Upbound recommends using OpenID Connect (OIDC) to authenticate to Azure without exchanging any private information. 

#### Create an identity pool
1. Open the **[Azure portal](https://portal.azure.com/)**.
2. Select **[Azure Active Directory](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview)**.
3. If this is your first time registering Upbound as an identity provider in Azure Active Directory, select **App registrations**
4. At the top of the page, select **New registration**.
5. Name the pool, like **upbound-oidc-provider**.
6. In the _Supported account types_ section select **Accounts in this organizational directory only**.
7. In the _Redirect URI_ section select **Web** and leave the URL field blank.
8. Select **Register**.
{{<img src="quickstart/images/azure-identity-start.png" alt="Upbound Get Started Configure OIDC screen for Azure" quality="100" align="center" size="medium" >}}

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
mcp:$@<your-org>/<your-control-plane-name>$@:provider-provider-azure
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

{{<img src="quickstart/images/azure-registration-config.png" alt="Azure configure app registration" quality="100" align="center" size="medium">}}

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

{{<img src="quickstart/images/azure-identity-setup.png" alt="Azure grant permissions to service principal" quality="100" align="center" size="medium" >}}

#### Finish configuring the Upbound identity provider

Return to Upbound and head to the Providers tab within the control plane explorer. Find provider-family-azure and select the ProviderConfigs tab. Then, select **Create ProviderConfig**

{{<img src="quickstart/images/providers-tab-aks.png" alt="Providers tab" quality="100" lightbox="true" size="medium">}}

On the screen that displays, give the ProviderConfig a name. Entering the name `default` sets this as the default ProviderConfig for this provider in this control plane.

Next, scroll to the bottom of the form.  

In the _clientID_ field enter your **Application (client) ID**.  

For the _tenant ID_ field, enter your **Directory (tenant) ID**. You can find this by selecting your Application under Azure Active Directory -> Application Registrations.

In the _subscriptionID_ field, enter your **Subscription ID**. You can find this by selecting your Subscription in the Azure portal.

Select **Create** to finish authenticating with Azure. 

### Connect to GCP with OIDC

While Upbound creates your control plane, connect Upbound to GCP. 

Upbound recommends using OpenID Connect (OIDC) to authenticate to GCP without exchanging any private information. 

{{< hint "warning" >}}
GCP doesn't authenticate a second OIDC pool in the same project connecting to Upbound.

Add a new [Service Account]({{<ref "#create-a-gcp-service-account" >}}) to the existing pool instead.
{{< /hint >}}

#### Create an identity pool
1. Open the **[GCP IAM Admin console](https://console.cloud.google.com/iam-admin/iam)**.
2. Select **[Workload Identity Federation](https://console.cloud.google.com/iam-admin/workload-identity-pools)**.
3. If this is your first Workload Identity Federation configuration select **Get Started**
4. At the top of the page, select **Create Pool**.
5. Name the pool, like **upbound-oidc-pool**.
6. Enter a description like **An identity provider for Upbound**.
7. **Enable** the pool.
8. Select **Continue**
{{<img src="quickstart/images/gcp-identity-start.png" alt="Upbound Get Started Configure OIDC screen for GCP" quality="100" align="center" >}}

#### Add Upbound to the pool

Under the _Add a provider to pool_ configuration under _Select a provider_ use **OpenID Connect (OIDC)** 

_Provider Name_: **upbound-oidc-provider**  
_Provider ID_: **upbound-oidc-provider-id**  
_Issuer (URL)_: **https://proidc.upbound.io** 

Select **Allowed audiences**  
For _Audience 1_ enter **sts.googleapis.com**

Select **Continue**.

{{<img src="quickstart/images/gcp-provider-to-pool.png" alt="GCP add a provider to pool configuration" quality="100" align="center" >}}

#### Configure provider attributes
The provider attributes restrict which remote entities you allow access to your resources. 
When Upbound authenticates to GCP it provides an OIDC subject (`sub`) in the form:

`mcp:<account>/<mcp-name>:provider:<provider-name>`

Configure the _google.subject_ attribute as **assertion.sub**

Under _Attribute Conditions_ select **Add Condition**.

<!-- vale gitlab.Uppercase = NO -->
<!-- ignore CEL -->
To authenticate any managed control plane in your organization, in the _Conditional CEL_ input box put
<!-- vale gitlab.Uppercase = YES -->

{{<editCode >}}
```console
google.subject.contains("mcp:$@ORGANIZATION_NAME$@")
```
{{< /editCode >}}

{{< hint "warning" >}}
Not providing a CEL condition allows any Upbound managed control plane to access your GCP account if they know the project ID and service account name.
{{< /hint >}}

Select **Save**.

{{<img src="quickstart/images/gcp-idp-attributes.png" alt="GCP configure provider attributes configuration" quality="100" align="center" >}}

#### Create a GCP Service Account

GCP requires Upbound to use a [Service Account](https://cloud.google.com/iam/docs/service-account-overview). The required GCP _roles_ of the service account depend on the services managed by your control plane.

1. Open the **[GCP IAM Admin console](https://console.cloud.google.com/iam-admin/iam)**.
2. Select **[Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)**.
3. From the top of the page, select **Create Service Account**.

#### Service account details
<!-- vale Google.WordList = NO -->
<!-- ignore account name -->
<!-- vale Google.FirstPerson = NO -->
Under _Service account details_ enter
_Service account name_: **upbound-service-account**  
_Service account ID_: **upbound-service-account-id**  
_Description_: **Upbound managed control planes service account**  
<!-- vale Google.WordList = YES -->
<!-- vale Google.FirstPerson = YES -->

Select **Create and Continue**.

{{<img src="quickstart/images/gcp-sa.png" alt="GCP service account creation screen" quality="100" align="center" >}}

#### Grant this service account access to project
For the _CloudSQL as a service_ configuration the service account requires the roles:  
**Cloud SQL Admin**  
**Workload Identity User**

Select **Done**.

{{<img src="quickstart/images/gcp-role-add.png" alt="GCP service project access screen" quality="100" align="center">}}

#### Record the service account email address

At the list of service accounts copy the service account **email**.  
Upbound requires this to authenticate your managed control plane.

{{<img src="quickstart/images/gcp-sa-email.png" alt="list of GCP service accounts" size="medium" quality="100" >}} 

#### Add the service account to the identity pool

Add the service account to the Workload Identity Federation pool to authenticate to Upbound with OIDC. 
1. Return to the **[Workload Identity Federation](https://console.cloud.google.com/iam-admin/workload-identity-pools)** page and select the [**upbound-oidc-pool**](https://console.cloud.google.com/iam-admin/workload-identity-pools/pool/upbound-oidc-pool).
2. Near the top of the page select **Grant Access**.
3. Select the new service account, **upbound-service-account**.
4. Under _Select principals_ use **All identities in the pool**.
{{<img src="quickstart/images/gcp-add-to-pool.png" alt="Pool select service account screen" quality="100" align="center">}}
Select **Save**.  
In the _Configure your application_ window, select **Dismiss**.

<!-- vale Microsoft.Terms = NO -->
<!-- vale Google.Headings = NO -->
<!-- allow "Cloud". It matches the label on the page --> 

<!-- vale Microsoft.HeadingAcronyms = NO -->
<!-- allow "SQL" -->
#### Enable the Cloud SQL Admin GCP API
GCP requires explicitly enabling the Cloud SQL Admin API. 


Go to the [Cloud SQL Admin API](https://console.cloud.google.com/apis/library/sqladmin.googleapis.com) page in the GCP console.


Select **Enable**.

{{<img src="quickstart/images/enable-cloud-sql-api.png" alt="Enable the Cloud SQL Admin API in the GCP console" size="original" quality="100" >}}
<!-- vale Google.Headings = YES -->
<!-- vale Microsoft.Terms = YES -->

#### Finish configuring the Upbound identity provider

Return to Upbound and head to the Providers tab within the control plane explorer. Find provider-family-gcp and select the ProviderConfigs tab. Then, select **Create ProviderConfig**

On the screen that displays, give the ProviderConfig a name. Entering the name `default` sets this as the default ProviderConfig for this provider in this control plane.

Next, scroll past the instructions to the bottom of the form.  



For the _providerID_ field, enter the following after editing your _GCP Project ID_:
{{< editCode >}}
```yaml
projects/$@<GCP Project ID>$@/locations/global/workloadIdentityPools/upbound-oidc-pool/providers/upbound-oidc-provider
```
{{< /editCode >}}

<br />

{{<hint "note" >}}
The identity provider format is:
`projects/<GCP_PROJECT_ID>/locations/global/workloadIdentityPools/<OIDC_POOL_NAME>/providers/<OIDC_POOL_PROVIDER_NAME>`
{{< /hint >}}

<br />

In the _service Account_ field enter the **service account email**.

In the _projectID_ field enter your **[GCP project ID](https://support.google.com/googleapi/answer/7014113)**.  

Select **Create** to finish authenticating with GCP.


## Create your first resource

From the control planes view, select the **Self Service** tab, and select **Open Control Plane Portal**.

{{<img src="quickstart/images/self-service-portal.png" alt="Navigate to control plane portal" quality="100" lightbox="true">}}

The Control Plane Portal lists the available resources that users can claim in the left-side menu. These resources are your abstracted APIs presented to users. 

Select a **Cluster** resource and then select the **Create New** button at the top of the page. 

The form dynamically generates from the parameters defined in your custom API. Fill in the required fields.

{{<img src="quickstart/images/caas-portal-form.png" alt="Create a cluster with the Portal form" quality="100" lightbox="true">}}

When you **Create Instance** the portal generates a Crossplane claim.

{{<hint "note" >}}
After creating an instance, the _Events_ section displays logs directly from Kubernetes.  

Crossplane commonly generates a Kubernetes error `cannot apply composite resource: cannot patch object: Operation cannot be fulfilled` that may appear as an _Event_.

{{<img src="quickstart/images/event-error-cannot-patch.png" alt="Events showing the error cannot apply composite resource: cannot patch object" quality="100" size="small" align="center">}}

You can ignore this error. For more information about what causes this, read [Crossplane issue #2114](https://github.com/crossplane/crossplane/issues/2114).
{{< /hint >}}

## Observe your resources

Navigate back to [Upbound Console](https://console.upbound.io) window and to your control plane in the **Overview** tab. 

There's now a claim card next to the `Cluster` type card. 

Select the claim and Upbound renders the full resource tree that's getting created and managed by your managed control plane. 

{{<img src="quickstart/images/caas-ctp-graph.png" alt="Viewing a claim in the graph" quality="100" lightbox="true">}}

Congratulations, you created your first resources with your MCP.

## Next steps

To learn more about the core concepts of Upbound, read the [concepts]({{<ref "concepts">}}) documentation. To learn how to begin building your own platform on Upbound, read the [Crossplane Architecture Framework]({{<ref "xp-arch-framework/_index.md">}}).

<!-- Named Links -->

[accounts.upbound.io]: https://accounts.upbound.io
[cloud.upbound.io]: https://cloud.upbound.io
[AWS IAM console]: https://console.aws.amazon.com/iam