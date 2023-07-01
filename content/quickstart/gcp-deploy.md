---
title: Deploy your first control plane with GCP
weight: 1
description: A guide for deploying a cloud platform on Upbound for Google GCP
---

This quickstart guides you through how to create your first managed control plane in Upbound. Connect Upbound to GCP, and use your control plane to create and manage PostgreSQL databases.
## Prerequisites

You need the following:

* An Upbound account.
* A GCP account with permissions to manage IAM policies.
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

{{<img src="quickstart/images/my-org.png" alt="Upbound Create organization screen" size="medium" quality="100" align="center">}}

On the next screen, start your free trial. This trial allows you to create up to three managed control planes, three configurations, and invite a total of 10 team members in an organization.

{{<img src="quickstart/images/free-trial.png" alt="Upbound Free trial entry" size="medium" quality="100" align="center" >}}

### Choose a configuration

Upbound offers a curated gallery of Crossplane configurations for you to choose from. These configurations provide ready-built APIs that Upbound installs in your control plane. You can select the _source_ link to view the configuration files that define this API in GitHub. 

Select the Configuration called **CloudSQL as a service**. 

{{<img src="quickstart/images/cloudsql-config.png" alt="Upbound connect to GitHub screen" quality="100">}}
### Connect to GitHub

After you've selected a Configuration, you need to connect Upbound to your GitHub account. Upbound uses GitHub's authorization flow and installs a GitHub app into your account. 

Select **Connect to GitHub**.

{{<img src="quickstart/images/gcp-connect-to-gh.png" alt="Upbound connect to GitHub" size="medium" quality="100" lightbox="true">}}

{{< hint "tip" >}}
Git connectivity is at the core of Upbound's workflows. To learn more about git integration, read the [GitOps with MCP]({{<ref "/concepts/control-plane-connector" >}}) section.
{{< /hint >}}

After you've connected to GitHub, select an account owner and repository name. Upbound creates a new repository under your account and clones the contents of the Configuration into that repository. 

<!-- vale Google.FirstPerson = NO -->
Give your repository a name, like **my-control-plane-apis**. 
<!-- vale Google.FirstPerson = YES -->

Select **Clone configuration to GitHub**.

{{<img src="quickstart/images/gcp-gh-connect.png" alt="Upbound Create Repository screen" size="medium" quality="100" lightbox="true">}}

### Create a managed control plane

After Upbound clones the Configuration into your own repository, create a managed control plane. 

<!-- vale Google.FirstPerson = NO -->
Give your control plane a name, like **my-control-plane**.
<!-- vale Google.FirstPerson = YES -->

Select **Create Control Plane**.

{{<img src="quickstart/images/get-started-name-ctp.png" alt="Upbound Create Control Plane screen" quality="100" align="center">}}

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

### Create a GCP Service Account

GCP requires Upbound to use a [Service Account](https://cloud.google.com/iam/docs/service-account-overview). The required GCP _roles_ of the service account depend on the services managed by your control plane.

1. Open the **[GCP IAM Admin console](https://console.cloud.google.com/iam-admin/iam)**.
2. Select **[Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)**.
3. From the top of the page, select **Create Service Account**.

##### Service account details
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

##### Grant this service account access to project
For the _CloudSQL as a service_ configuration the service account requires the roles:  
**Cloud SQL Admin**  
**Workload Identity User**

Select **Done**.

{{<img src="quickstart/images/gcp-role-add.png" alt="GCP service project access screen" quality="100" align="center">}}

##### Record the service account email address

At the list of service accounts copy the service account **email**.  
Upbound requires this to authenticate your managed control plane.

{{<img src="quickstart/images/gcp-sa-email.png" alt="list of GCP service accounts" size="medium" quality="100" >}} 

### Add the service account to the identity pool

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
### Enable the Cloud SQL Admin GCP API
GCP requires explicitly enabling the Cloud SQL Admin API. 


Go to the [Cloud SQL Admin API](https://console.cloud.google.com/apis/library/sqladmin.googleapis.com) page in the GCP console.


Select **Enable**.

{{<img src="quickstart/images/enable-cloud-sql-api.png" alt="Enable the Cloud SQL Admin API in the GCP console" size="medium" quality="100" >}}
<!-- vale Google.Headings = YES -->
<!-- vale Microsoft.Terms = YES -->

### Finish configuring the Upbound identity provider

Back in Upbound, finish configuring the identity provider.

In the _Identifier of GCP project_ field enter your **[GCP project ID](https://support.google.com/googleapi/answer/7014113)**.  

For the _Name of federated identity provider_, edit your _GCP Project ID_ and enter:
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

In the _Name of federated identity provider_ field.  

In the _Attached service account email address_ field enter the **service account email**.

{{<img src="quickstart/images/gcp-oidc-finalize.png" alt="Upbound configuration to connect to GCP with OIDC" size="medium" quality="100" lightbox="true">}}

Select **Authenticate**.  
Select **Launch Control Plane**.

## Welcome to the Upbound Console

After completing the _Get Started_ experience, you are in the Upbound Console and greeted by the Control Planes screen.

{{<img src="quickstart/images/gcp-ctp.png" alt="Upbound GCP instance screen" quality="100" align="center">}}

The control plane details view gives users a view into what's happening on their control planes. 

{{< hint "tip" >}}
Read about the [Upbound Console]({{<ref "concepts/console">}}) for a full tour of what the Console has to offer.
{{< /hint >}}

### Create your first resource

From the control planes view, select the **Portal** tab, and select **Open Control Plane Portal**.

{{<img src="quickstart/images/get-started-portal-link.png" alt="Navigate to control plane portal" quality="100" lightbox="true">}}

Select the **PostgreSQLInstance** resource.  
Select the **Create New** button at the top-right of the page. 

The form are the parameters defined in your custom API. Fill-in the form with the following:

<!-- vale Google.FirstPerson = NO -->
<!-- allow "my" -->
- _name_: **my-db**
- _namespace_: **default**
- _region_: **east**
- _size_: **small**
- _storage_: **20**
<!-- vale Google.FirstPerson = YES -->


{{<img src="quickstart/images/gcp-db-create.png" alt="Create database form" quality="100" lightbox="true">}}


When you **Create Instance** the portal generates a Crossplane claim.

{{<hint "note" >}}
After creating an instance, the _Events_ section are logs directly from Kubernetes.  

Crossplane commonly generates a Kubernetes error `cannot apply composite resource: cannot patch object: Operation cannot be fulfilled` that may appear as an _Event_.

{{<img src="quickstart/images/gcp-event-error-cannot-patch.png" alt="Events showing the error cannot apply composite resource: cannot patch object" quality="100" align="center">}}

You can ignore this error. For more information about what causes this, read [Crossplane issue #2114](https://github.com/crossplane/crossplane/issues/2114).
{{< /hint >}}


### Observe your resource

Navigate back to [Upbound Console](https://console.upbound.io) window and to your control plane in the **Overview** tab. 

There's now a claim card next to the `PostgreSQLInstance` type card. 

Select the claim and Upbound renders the full resource tree that's getting created and managed by your managed control plane. 

{{<img src="quickstart/images/gcp-observe-db.png" alt="Observe created resource" quality="100" lightbox="true">}}

Congratulations, you created your first resources with your MCP.

## Next steps

To learn more about the core concepts of Upbound, read the [concepts]({{<ref "concepts">}}) documentation. To learn how to begin building your own platform on Upbound, read the [reference architecture]({{<ref "knowledge-base/reference-architecture">}}) knowledge base article.


<!-- Named Links -->

[accounts.upbound.io]: https://accounts.upbound.io
[cloud.upbound.io]: https://cloud.upbound.io
