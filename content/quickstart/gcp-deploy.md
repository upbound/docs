---
title: Deploy your first control plane with GCP
weight: 1
description: A guide for deploying a cloud platform on Upbound for Google GCP
---

This quickstart guides you through how to create your first managed control plane in Upbound, connect it to GCP, and use your control plane to create & manage PostgreSQL databases.

## Prerequisites

This quickstart requires:

* An Upbound account. If you don't have one yet, you can create an account by going to [accounts.upbound.io](https://accounts.upbound.io) and signing up for a free trial
* A GCP account with permissions to manage IAM policies.
* A Github account with permission to authorize GitHub Apps to be installed.

## Get Started in Upbound

The very first time you sign into Upbound, you will be taken through a `Get Started` experience designed to bootstrap your environment in the matter of minutes. Go to [Upbound](https://console.upbound.io) to start the experience.

### Create an organization and start a free trial

If this is your first time in Upbound (and you are not joining somebody else's invite), Upbound will prompt you to first create an organization. Give your organization an ID and a friendly name. Click `Create Organization`.

{{<img src="quickstart/images/my-org.png" alt="Upbound Create organization screen" size="medium" quality="100" lightbox="true">}}

On the next screen, start your free trial. This trial will allow you to create up to 3 managed control planes, 3 configurations, and have a total of 10 team members trying out the trial together in this organization.

{{<img src="quickstart/images/free-trial.png" alt="Upbound Free trial entry" size="medium" quality="100" lightbox="true">}}

### Choose a Crossplane configuration to start from

Upbound offers a curated gallery of Crossplane configurations for you to choose from. These configurations provide ready-built APIs that will be installed on your control plane. You can click the `source` link to view the configuration files that define this API in Github. Select the Configuration called `CloudSQL as a service`. 

{{<img src="quickstart/images/cloudsql-config.png" alt="Upbound Choose Configuration screen" size="medium" quality="100" lightbox="true">}}

### Connect to Github

After you've selected the Configuration, you need to connect Upbound to your Github account. Upbound will initiate Github's authorization flow and, once granted, will install a Github app into your account. Select `Connect to Github`.

{{<img src="quickstart/images/gcp-connect-to-gh.png" alt="Upbound connect to GitHub" size="medium" quality="100" lightbox="true">}}

{{< hint "tip" >}}
Git connectivity is at the core of Upbound's workflows. To learn more about git integration, go to [Git integration](/concepts/git-integration/) in the `Concepts` docs.
{{< /hint >}}

After you've connected to Github, select an account owner and give your repo a name. Upbound will create a new repo under your account and clone the contents of the Configuration you selected in the previous step into your repo. Because this repo will contain the API definitions that will be installed on your control plane, name your repo `my-control-plane-apis`.

{{<img src="quickstart/images/gcp-gh-connect.png" alt="Upbound Create Repo screen" size="medium" quality="100" lightbox="true">}}

Click `Clone configuration to Github`.

### Create a managed control plane

After you have your APIs selected and cloned into your own repo, it's time to create a managed control plane. All that Upbound needs is a name. Name your control plane `my-control-plane`.

{{<img src="quickstart/images/gcp-create-mcp.png" alt="Upbound Create Control Plane screen" size="medium" quality="100" lightbox="true">}}

Click `Create Control Plane`.

### Connect to GCP with OIDC

Your managed control plane will be created shortly. While you wait for it to create, you can follow the instructions to connect Upbound to GCP. Upbound supports using OpenID Connect (OIDC) to authenticate with GCP. OIDC allows your control plane to access resources in GCP without you needing to store your GCP account credentials as long-lived secrets in Upbound. Upbound provides full instructions for doing this.

{{<img src="quickstart/images/gcp-identity-start.png" alt="Upbound Get Started Configure OIDC screen for GCP" size="medium" quality="100" lightbox="true">}}

#### Add Upbound as an Identity Provider

Start by selecting `Create Pool` at the top of the page. This will bring you to a form experience like below. Give your pool the name `proidc`, give it a description, and make sure the pool is set to `enabled`. Click `Continue`.

{{<img src="quickstart/images/gcp-pool.png" alt="Upbound GCP create a pool" size="medium" quality="100" lightbox="true">}}

Next, you will fill out the form as follows:

- For `Provider Name`, input `proidc`.
- For `Provider ID`, input `proidc`.
- For `Issuer (URL)`, input `https://proidc.upbound.io`.
- For `Allowed Audiences`, input `sts.googleapis.com`.

Click `Continue`.

{{<img src="quickstart/images/gcp-idp-setup.png" alt="GCP IDP configuration" size="medium" quality="100" lightbox="true">}}

Next, you will see `Add an identity provider` flow. Choose the provider type `OpenID Connect` and fill out the fields as instructed in the `Get Started` experience:

{{<img src="quickstart/images/gcp-idp-attributes.png" alt="GCP IDP configuration attributes" size="medium" quality="100" lightbox="true">}}

{{< hint "tip" >}}
The attribute condition that Upbound tells you to copy is tailored to name you gave your managed control plane when you created it. If your name is different from what was recommended in the tutorial, make sure you update the name in the attribute string as well.
{{< /hint >}}

Click `Save`.

#### Create a Service Account

In order for your control plane to be able to perform the actions required by this configuration, you will need to create a Service Account with the `roles/cloudsql.admin` role and the `roles/iam.workloadIdentityUser` role. After doing so, use the following steps to attach the Service Account to the proidc pool.

{{< hint "tip" >}}
This quickstart is scoped to helping you configure OIDC for your managed control plane to create CloudSQL instances. If you want to allow your control plane to create other resources besides database, you need to make sure you configure the Service Account with the necessary roles accordingly.
{{< /hint >}}

To create a Service Account, go back to the IAM console, select the `Service Accounts` tab in the sidenav and click `Create Service Account`. 

{{<img src="quickstart/images/gcp-sa-create.png" alt="GCP service account screen" size="medium" quality="100" lightbox="true">}}

Next, you will fill out the form as follows:

- For `Service account name`, input `my-mcp-sa`.
- For `Service account ID`, input `my-mcp-sa`.
- For `Description`, give this Service Account a description.

{{<img src="quickstart/images/gcp-sa.png" alt="GCP service account creation screen" size="medium" quality="100" lightbox="true">}}

Click `Create and Continue`. Grant this service account access to the roles that Upbound tells you to provide (`roles/cloudsql.admin` and `roles/iam.workloadIdentityUser`), then click `Continue`.

{{<img src="quickstart/images/gcp-role-add.png" alt="GCP service account role creation" size="medium" quality="100" lightbox="true">}}

#### Add the Service Account to the Pool

After you have created your Service Account, you need to add it to the `proidc` pool. Go back to the IAM console, select `Workload Identity Federation`, and select the `proidc` pool you created earlier. Click the `Grant Access` button at the top of the page.

{{<img src="quickstart/images/gcp-add-to-pool.png" alt="GCP service account add to pool" size="medium" quality="100" lightbox="true">}}

In the flyout, select the Service Account you created in the previous step (`my-mcp-sa`) and select `All identities in pool`.

{{<img src="quickstart/images/gcp-add-to-pool-p2.png" alt="GCP service account add to pool flyout" size="medium" quality="100" lightbox="true">}}

Click `Save`. When GCP pops up a `Configure your application` modal, you can simply close it.

#### Finalize in Upbound

Now that you've created a Federated Identity Pool, added an Identity Provider for Upbound, and created a Service Account with the appropriate roles, the last thing to do is to pass some of this information back to Upbound. Upbound will create a `ProviderConfig` for you on your managed control plane, using Upbound OIDC as the method of authentication.

Upbound requires three inputs. Fill them out as follows:

- For `Identifier of GCP project`, input your GCP project ID. It will look something like `your-project-id`.
- For `Name of federated identity provider`, input the full path to the federated identity provider. It will look something like `projects/1234567891234/locations/global/workloadIdentityPools/proidc/providers/proidc`. You can find the full path by looking at the pool instance screen you created earlier under the `IAM principal` property. Do not copy in `principalSet://` and replace the `*` at the end with the name you gave to the identity provider (in this case, `proidc`).
{{<img src="quickstart/images/gcp-oidc-fields.png" alt="GCP OIDC full path" size="medium" quality="100" lightbox="true">}}

- For `Attached service account email address`, input the full service account in email address format that you created earlier. It will look something like `my-mcp-sa@<your-project-id>.iam.gserviceaccount.com`.

Input these into the form in Upbound, click `Authenticate`, and then finally `Launch Control Plane`.

{{<img src="quickstart/images/gcp-oidc-finalize.png" alt="Upbound finalize OIDC" size="medium" quality="100" lightbox="true">}}

## Welcome to the Upbound Console

After completing the `Get Started` experience, you will be launched into the Upbound Console and taken straight into the instance view of your managed control plane.

{{<img src="quickstart/images/gcp-ctp.png" alt="Upbound GPC instance screen" size="medium" quality="100" lightbox="true">}}

Click into your managed control plane to see a details view of your control plane. The control plane details view is designed to give users a window into what is happening on their control planes. Read the [Upbound Console concept page]({{<ref "concepts/console">}}) for a full tour of what the Console has to offer.

### Create your first resource

From the control plane instance view, click the `Portal` tab, and click `Open Control Plane Portal`.

{{<img src="quickstart/images/get-started-portal-link.png" alt="Navigate to control plane portal" quality="100" lightbox="true">}}

Click the `PostgreSQLInstance` resource type in the side bar and then click the `Create New` button. This will bring you to a form experience for you to fill out and create a new instance. Input the following into the fields:

- **name**: my-db
- **namespace**: select `default`
- **region**: east
- **size**: small
- **storage**: 20

{{<img src="quickstart/images/gcp-db-create.png" alt="Create database form" quality="100" lightbox="true">}}

After filling out the form, the portal generates a Crossplane claim that will be submitted once you click `Create Instance`. Go ahead and click the `Create Instance` button.

### Observe your resource being created

Navigate back to Upbound Console and to your control plane. If you refresh the page, you will notice there is now a claim card next to the `PostgreSQLInstance` type card. Click the claim card and Upbound will render the full resource tree that is getting created--and now managed--by your managed control plane. 

{{<img src="quickstart/images/gcp-observe-db.png" alt="Observe created resource" quality="100" lightbox="true">}}

Congratulations! You created your first resources with your MCP.

## Next Steps

To learn more about the core concepts of Upbound, read the [concepts]({{<ref "concepts">}}) documentation. To learn how to begin building your own platform on Upbound, read the [reference architecture]({{<ref "knowledge-base/reference-architecture">}}) knowledge base article.


<!-- Named Links -->

[accounts.upbound.io]: https://accounts.upbound.io
[cloud.upbound.io]: https://cloud.upbound.io
