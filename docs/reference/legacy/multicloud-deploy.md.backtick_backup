---
title: (deprecated) Quickstart
weight: 1
description: A guide for deploying a multicloud Cluster-as-a-Service platform on Upbound in a legacy Space.
aliases:
    - /deploy/legacy-spaces/multicloud-deploy
---


:::important
This quickstart is deprecated and only applicable to users running in Upbound's
Legacy Space. Follow the link to the [new quickstart](get-started) to try the new Upbound experience.
:::
This quickstart guides you through how to create your first control plane in Upbound with configuration-caas. Connect Upbound to AWS, GCP, and Azure to provision and manage fully configured Kubernetes Service clusters. They're composed using cloud service primitives from the Upbound Official Providers.

## Prerequisites

To deploy Upbound's configuration-caas, you need:

* An Upbound account.
* A GitHub account with permission to install GitHub Apps.
* At least one of the following:
	* An AWS account with permissions to manage IAM policies.
 	* An Azure account with permissions to manage IAM policies.
 	* A GCP account with permissions to manage IAM policies.

:::tip
If you don't have an Upbound account, [sign up for a free trial][sign-up-for-a-free-trial].
:::
## Get started

The first time you sign in to Upbound, you are through a `Get Started` experience designed to bootstrap your environment in the matter of minutes. Go to [Upbound][upbound] to start the experience.

## Get started

This quickstart guides you through how to create your first managed control
plane in Upbound. Connect Upbound to your cloud provider, and use your control plane to create
and manage infrastructure.

After you register your Upbound account, walk through the interactive "Get
Started" demo below.

<!-- <div style="position: relative; padding-bottom: calc(75.92682926829268% + 42px); height: 0;"><iframe src="https://app.supademo.com/embed/clt694nsi0bz4pez12bste3s2" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div> -->


Select the Configuration called **Cluster as a Service**.

<!-- vale Google.FirstPerson = NO -->
<!-- allow "my" -->
Give your repository a name, like **my-control-plane-api**.
<!-- vale Google.FirstPerson = YES -->

Select **Create Control Plane**.

### Complete the flow

On the final screen of the _Get Started_ experience, review your work. Observe the configuration you've cloned and the control plane you've created. This screen shows information about the providers that you need to authenticate with after launching your new control plane.
![Upbound Get Started Experience final step](/img/caas-fre-step4.png)

## Welcome to the Upbound Console

After completing the _Get Started_ experience, you are in the Upbound control plane explorer. The console shows a message with pointers for what to do next.

![Getting Started Guide](/img/caas-getting-started-guide.png)

You can reopen this guide at any time by selecting the Getting Started Guide button in the upper right corner of the control plane explorer.

![Upbound control plane explorer](/img/caas-ctp-explorer.png)

The control plane details view gives you a view into what's happening on your control plane.

## Authenticate with Providers
Next, configure provider-upbound and connect your control plane to each cloud service provider you wish to use in your CaaS offering. You must configure provider-upbound via the CLI, but you can authenticate with cloud service providers from within the Upbound Console UI.

:::tip
You should wait until your Configuration has finished installing into your control plane before creating any ProviderConfigs.
:::

### Configure provider-upbound

Provider Upbound needs a valid Upbound token to authenticate. You can fetch one in multiple ways, but the simplest option is to log in with [Up CLI][up-cli] to get a session token.

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
1. Open the **[AWS IAM console][aws-iam-console]**.
2. Under the AWS IAM services, select **[Identity Providers > Add Provider][identity-providers-add-provider]**.
3. Select **OpenID Connect** and use
 **https://proidc.upbound.io** as the Provider URL and
 **sts.amazonaws.com** as the Audience.
  Select **Get thumbprint**.
  Select **Add provider**.
![Configure an Identity Provider in AWS](/img/-aws-add-idp-confirm.png)

#### Create an AWS IAM Role for Upbound
1. Create an [AWS IAM Role][aws-iam-role] with a **Custom trust policy** for the OIDC connector.
![IAM Role with a custom trust policy](/img/aws-custom-trust-policy.png)
:::warning
Provide your [AWS account ID][aws-account-id], Upbound organization and control plane names in the JSON Policy below.

You can find your AWS account ID by selecting the account dropdown in the upper right corner of the AWS console.
:::

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
1. Attach the **AmazonEC2FullAccess** permission policy.
![Applying the AmazonEC2FullAccess policy to the role](/img/aws-ec2fullaccess-policy.png)
1. Name the role **upbound-eks-role** and select **Create role**.
![Naming the role upbound-eks-role](/img/aws-eks-role-name.png)
1. View the new role and copy the role ARN.
![Viewing the role ARN](/img/aws-upbound-eks-role-arn.png)

#### Provide the ARN to Upbound

Return to Upbound and head to the Providers tab within the control plane explorer. Find provider-family-aws and select the ProviderConfigs tab. Then, select **Create ProviderConfig**

![Providers tab](/img/providers-tab.png)

On the screen that displays, give the ProviderConfig a name. Entering the name `default` sets this as the default ProviderConfig for this provider in this control plane.

Next, paste the roleARN you copied from AWS into the input at the bottom of the form.

Select **Create** to finish authenticating with AWS.

### Connect to Azure with OIDC

Upbound recommends using OpenID Connect (OIDC) to authenticate to Azure without exchanging any private information.

#### Create an identity pool
1. Open the **[Azure portal][azure-portal]**.
2. Select **[Microsoft Entra ID][microsoft-entra-id]**.
3. If this is your first time registering Upbound as an identity provider in Microsoft Entra ID, select **App registrations**
4. At the top of the page, select **New registration**.
5. Name the pool, like **upbound-oidc-provider**.
6. In the _Supported account types_ section select **Accounts in this organizational directory only**.
7. In the _Redirect URI_ section select **Web** and leave the URL field blank.
8. Select **Register**.
![Upbound Get Started Configure OIDC screen for Azure](/img/azure-identity-start.png)

#### Create a federated credential

To allow the `upbound-oidc-provider` registration created in the previous step to trust the Upbound Control Plane, do the following in the resource view.

1. Select **Certificates and secrets** in the left navigation.
2. Select **Federated credentials** tab.
3. Select **Add credential**.
4. In _Federated credential scenario_ select **Other Issuer**.
5. In _Issuer_ enter **https://proidc.upbound.io**.
6. In _Subject identifier_ enter:

```yaml
mcp:$@<your-org>/<your-control-plane-name>$@:provider:provider-azure
```

7. In _Credential details name_ enter:

```yaml
upbound-$@<your-org>-<your-control-plane-name>$@-provider-azure
```

8. In _Credential details description_ enter:

```yaml
upbound MCP $@<your-org>/<your-control-plane-name>$@ Provider provider-azure
```

9. Leave _Audience_ unmodified with **api://AzureADTokenExchange**.
10. Select **Add**.

![Azure configure app registration](/img/azure-registration-config.png)

#### Grant permissions to the service principal

For your control plane to be able to perform actions required by this configuration, you need to grant permissions to the Application Service Principal. Assign a role to the Application Service Principal by following instructions at Assign a role to the application.

1. Open the **[Azure portal][azure-portal-1]**
2. Select **[Subscriptions][subscriptions]**.
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

![Azure grant permissions to service principal](/img/azure-identity-setup.png)

#### Finish configuring the Upbound identity provider

Return to Upbound and head to the Providers tab within the control plane explorer. Find provider-family-azure and select the ProviderConfigs tab. Then, select **Create ProviderConfig**

![Providers tab](/img/providers-tab-aks.png)

On the screen that displays, give the ProviderConfig a name. Entering the name `default` sets this as the default ProviderConfig for this provider in this control plane.

Next, scroll to the bottom of the form.

In the _clientID_ field enter your **Application (client) ID**.

For the _tenant ID_ field, enter your **Directory (tenant) ID**. You can find this by selecting your Application under Azure Active Directory -> Application Registrations.

In the _subscriptionID_ field, enter your **Subscription ID**. You can find this by selecting your Subscription in the Azure portal.

Select **Create** to finish authenticating with Azure.

### Connect to GCP with OIDC

While Upbound creates your control plane, connect Upbound to GCP.

Upbound recommends using OpenID Connect (OIDC) to authenticate to GCP without exchanging any private information.

:::warning
GCP doesn't authenticate a second OIDC pool in the same project connecting to Upbound.

Add a new [Service Account][service-account] to the existing pool instead.
:::

#### Create an identity pool
1. Open the **[GCP IAM Admin console][gcp-iam-admin-console]**.
2. Select **[Workload Identity Federation][workload-identity-federation]**.
3. If this is your first Workload Identity Federation configuration select **Get Started**
4. At the top of the page, select **Create Pool**.
5. Name the pool, like **upbound-oidc-pool**.
6. Enter a description like **An identity provider for Upbound**.
7. **Enable** the pool.
8. Select **Continue**
![Upbound Get Started Configure OIDC screen for GCP](/img/gcp-identity-start.png)

#### Add Upbound to the pool

Under the _Add a provider to pool_ configuration under _Select a provider_ use **OpenID Connect (OIDC)**

_Provider Name_: **upbound-oidc-provider**
_Provider ID_: **upbound-oidc-provider-id**
_Issuer (URL)_: **https://proidc.upbound.io**

Select **Allowed audiences**
For _Audience 1_ enter **sts.googleapis.com**

Select **Continue**.

![GCP add a provider to pool configuration](/img/gcp-provider-to-pool.png)

#### Configure provider attributes
The provider attributes restrict which remote entities you allow access to your resources.
When Upbound authenticates to GCP it provides an OIDC subject (`sub`) in the form:

`mcp:<account>/<mcp-name>:provider:<provider-name>`

Configure the _google.subject_ attribute as **assertion.sub**

Under _Attribute Conditions_ select **Add Condition**.

<!-- vale gitlab.Uppercase = NO -->
<!-- ignore CEL -->
To authenticate any control plane in your organization, in the _Conditional CEL_ input box put
<!-- vale gitlab.Uppercase = YES -->

<!--- TODO(tr0njavolta): editcode --->
```console
google.subject.contains("mcp:$@ORGANIZATION_NAME$@")
```

:::warning
Not providing a CEL condition allows any Upbound control plane to access your GCP account if they know the project ID and service account name.
:::

Select **Save**.

![GCP configure provider attributes configuration](/img/gcp-idp-attributes.png)

#### Create a GCP Service Account

GCP requires Upbound to use a [Service Account][service-account]. The required GCP _roles_ of the service account depend on the services managed by your control plane.

1. Open the **[GCP IAM Admin console][gcp-iam-admin-console-2]**.
2. Select **[Service Accounts][service-accounts]**.
3. From the top of the page, select **Create Service Account**.

#### Service account details
<!-- vale Google.WordList = NO -->
<!-- ignore account name -->
<!-- vale Google.FirstPerson = NO -->
Under _Service account details_ enter
_Service account name_: **upbound-service-account**
_Service account ID_: **upbound-service-account-id**
_Description_: **Upbound control planes service account**
<!-- vale Google.WordList = YES -->
<!-- vale Google.FirstPerson = YES -->

Select **Create and Continue**.

![GCP service account creation screen](/img/gcp-sa.png)

#### Grant this service account access to project
For the _CloudSQL as a service_ configuration the service account requires the roles:
**Cloud SQL Admin**
**Workload Identity User**

Select **Done**.

![GCP service project access screen](/img/gcp-role-add.png)

#### Record the service account email address

At the list of service accounts copy the service account **email**.
Upbound requires this to authenticate your control plane.

![list of GCP service accounts](/img/gcp-sa-email.png)

#### Add the service account to the identity pool

Add the service account to the Workload Identity Federation pool to authenticate to Upbound with OIDC.
1. Return to the **[Workload Identity Federation][workload-identity-federation-3]** page and select the [**upbound-oidc-pool**][upbound-oidc-pool].
2. Near the top of the page select **Grant Access**.
3. Select the new service account, **upbound-service-account**.
4. Under _Select principals_ use **All identities in the pool**.
![Pool select service account screen](/img/gcp-add-to-pool.png)
Select **Save**.
In the _Configure your application_ window, select **Dismiss**.

<!-- vale Microsoft.Terms = NO -->
<!-- vale Google.Headings = NO -->
<!-- allow "Cloud". It matches the label on the page -->

<!-- vale Microsoft.HeadingAcronyms = NO -->
<!-- allow "SQL" -->
#### Enable the Cloud SQL Admin GCP API
GCP requires explicitly enabling the Cloud SQL Admin API.


Go to the [Cloud SQL Admin API][cloud-sql-admin-api] page in the GCP console.


Select **Enable**.

![Enable the Cloud SQL Admin API in the GCP console](/img/enable-cloud-sql-api.png)
<!-- vale Google.Headings = YES -->
<!-- vale Microsoft.Terms = YES -->

#### Finish configuring the Upbound identity provider

Return to Upbound and head to the Providers tab within the control plane explorer. Find provider-family-gcp and select the ProviderConfigs tab. Then, select **Create ProviderConfig**

On the screen that displays, give the ProviderConfig a name. Entering the name `default` sets this as the default ProviderConfig for this provider in this control plane.

Next, scroll past the instructions to the bottom of the form.



For the _providerID_ field, enter the following after editing your _GCP Project Number_:
```yaml
projects/$@<GCP Project Number>$@/locations/global/workloadIdentityPools/upbound-oidc-pool/providers/upbound-oidc-provider
```


:::hint
The identity provider format is:
`projects/<GCP_PROJECT_Number>/locations/global/workloadIdentityPools/<OIDC_POOL_NAME>/providers/<OIDC_POOL_PROVIDER_NAME>`
:::


In the _service Account_ field enter the **service account email**.

In the _projectID_ field enter your **[GCP project ID][gcp-project-id]**.

Select **Create** to finish authenticating with GCP.


## Create your first resource

From the control planes view, select the **Self Service** tab, and select **Open Control Plane Portal**.

![Navigate to control plane portal](/img/self-service-portal.png)

The Control Plane Portal lists the available resources that users can claim in the left-side menu. These resources are your abstracted APIs presented to users.

Select a **Cluster** resource and then select the **Create New** button at the top of the page.

The form dynamically generates from the parameters defined in your custom API. Fill in the required fields.

![Create a cluster with the Portal form](/img/caas-portal-form.png)

When you **Create Instance** the portal generates a Crossplane claim.

:::hint
After creating an instance, the _Events_ section displays logs directly from Kubernetes.

Crossplane commonly generates a Kubernetes error `cannot apply composite resource: cannot patch object: Operation cannot be fulfilled` that may appear as an _Event_.

![Events showing the error cannot apply composite resource: cannot patch object](/img/event-error-cannot-patch.png)

You can ignore this error. For more information about what causes this, read [Crossplane issue #2114][crossplane-issue-2114].
:::

## Observe your resources

Navigate back to [Upbound Console][upbound-console] window and to your control plane in the **Overview** tab.

There's now a claim card next to the `Cluster` type card.

Select the claim and Upbound renders the full resource tree that's getting created and managed by your control plane.

![Viewing a claim in the graph](/img/caas-ctp-graph.png)

Congratulations, you created your first resources with your control plane.

[accounts.upbound.io]: https://accounts.upbound.io
[cloud.upbound.io]: https://cloud.upbound.io
[AWS IAM console]: https://console.aws.amazon.com/iam


[up-cli]: /operate/cli
[service-account]: /img/#create-a-gcp-service-account
[get-starated]: /learn/

[sign-up-for-a-free-trial]: https://accounts.upbound.io/register
[upbound]: https://console.upbound.io
[aws-iam-console]: https://console.aws.amazon.com/iam
[identity-providers-add-provider]: https://console.aws.amazon.com/iamv2/home#/identity_providers/create
[aws-iam-role]: https://console.aws.amazon.com/iamv2/home#/roles
[aws-account-id]: https://docs.aws.amazon.com/signin/latest/userguide/console_account-alias.html
[azure-portal]: https://portal.azure.com/
[microsoft-entra-id]: https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview
[azure-portal-1]: https://portal.azure.com/
[subscriptions]: https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade
[gcp-iam-admin-console]: https://console.cloud.google.com/iam-admin/iam
[workload-identity-federation]: https://console.cloud.google.com/iam-admin/workload-identity-pools
[service-account]: https://cloud.google.com/iam/docs/service-account-overview
[gcp-iam-admin-console-2]: https://console.cloud.google.com/iam-admin/iam
[service-accounts]: https://console.cloud.google.com/iam-admin/serviceaccounts
[workload-identity-federation-3]: https://console.cloud.google.com/iam-admin/workload-identity-pools
[upbound-oidc-pool]: https://console.cloud.google.com/iam-admin/workload-identity-pools/pool/upbound-oidc-pool
[cloud-sql-admin-api]: https://console.cloud.google.com/apis/library/sqladmin.googleapis.com
[gcp-project-id]: https://usage/support.google.com/googleapi/answer/7014113
[crossplane-issue-2114]: https://github.com/crossplane/crossplane/issues/2114
[upbound-console]: https://console.upbound.io
