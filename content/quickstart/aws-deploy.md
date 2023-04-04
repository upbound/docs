---
title: Deploy your first control plane with AWS
weight: 1
description: A guide for deploying a cloud platform on Upbound for Amazon EKS
---

This quickstart guides you through how to create your first managed control plane in Upbound, connect it to AWS, and use your control plane to create & manage EKS clusters.

## Prerequisites

This quickstart requires:

* An Upbound account. If you don't have one yet, you can create an account by going to [accounts.upbound.io](https://accounts.upbound.io) and signing up for a free trial
* An AWS account with permissions to manage IAM policies.
* A Github account with permission to authorize GitHub Apps to be installed.

## Get Started in Upbound

The very first time you sign into Upbound, you will be taken through a `Get Started` experience designed to bootstrap your environment in the matter of minutes. Go to [Upbound](https://console.upbound.io) to start the experience.

### Create an organization and start a free trial

If this is your first time in Upbound (and you are not joining somebody else's invite), Upbound will prompt you to first create an organization. Give your organization an ID and a friendly name. Click `Create Organization`.

{{<img src="quickstart/images/my-org.png" alt="Upbound Create organization screen" size="medium" quality="100" lightbox="true">}}

On the next screen, start your free trial. This trial will allow you to create up to 3 managed control planes, 3 configurations, and have a total of 10 team members trying out the trial together in this organization.

{{<img src="quickstart/images/free-trial.png" alt="Upbound Free trial entry" size="medium" quality="100" lightbox="true">}}

### Choose a Crossplane configuration to start from

Upbound offers a curated gallery of Crossplane configurations for you to choose from. These configurations provide ready-built APIs that will be installed on your control plane. You can click the `source` link to view the configuration files that define this API in Github. Select the Configuration called `EKS as a service`. 

{{<img src="quickstart/images/get-started-select-eks.png" alt="Upbound Connect to Github screen" quality="100">}}

### Connect to Github

After you've selected the Configuration, you need to connect Upbound to your Github account. Upbound will initiate Github's authorization flow and, once granted, will install a Github app into your account. Select `Connect to Github`.

{{<img src="quickstart/images/get-started-select-gh.png" alt="a marketplace search filter with Providers and Official filters set" quality="100" lightbox="true">}}

{{< hint "tip" >}}
Git connectivity is at the core of Upbound's workflows. To learn more about git integration, go to [Git integration](/concepts/git-integration/) in the `Concepts` docs.
{{< /hint >}}

After you've connected to Github, select an account owner and give your repo a name. Upbound will create a new repo under your account and clone the contents of the Configuration you selected in the previous step into your repo. Because this repo will contain the API definitions that will be installed on your control plane, name your repo `my-control-plane-api`.

{{<img src="quickstart/images/get-started-gh-repo.png" alt="Upbound Create Repo screen" quality="100" lightbox="true">}}

Click `Clone configuration to Github`.

### Create a managed control plane

After you have your APIs selected and cloned into your own repo, it's time to create a managed control plane. All that Upbound needs is a name. Name your control plane `my-control-plane`.

{{<img src="quickstart/images/get-started-name-ctp.png" alt="Upbound Create Control Plane screen" quality="100" lightbox="true">}}

Click `Create Control Plane`.

### Connect to AWS with OIDC

Your managed control plane will be created shortly. While you wait for it to create, you can follow the instructions to connect Upbound to AWS. Upbound supports using OpenID Connect (OIDC) to authenticate with AWS. OIDC allows your control plane to access resources in AWS without needing to store the AWS credentials as long-lived secrets in Upbound. Upbound provides full instructions for doing this.

{{<img src="quickstart/images/get-started-aws-oidc.png" alt="Upbound Get Started Configure OIDC screen" quality="100" lightbox="true">}}

#### Add Upbound as an Identity Provider

The first step is to open the [AWS IAM console]. In the sidenavigation bar, select `Identity providers`.

{{<img src="quickstart/images/get-started-idp.png" alt="AWS IAM main screen" quality="100" lightbox="true">}}

Click `Add Provider`.

{{<img src="quickstart/images/get-started-add-idp.png" alt="AWS IAM IDP screen" quality="100" lightbox="true">}}

Next, you will see `Add an identity provider` flow. Choose the provider type `OpenID Connect` and fill out the fields as instructed in the `Get Started` experience:

1. The **Provider URL** should be `https://proidc.upbound.io`.
2. The **Audience** should be `sts.amazonaws.com`.
3. Click `Get thumbprint`.
4. Finally, click `Add provider` at the bottom of the screen.

{{<img src="quickstart/images/get-started-aws-add-idp-confirm.png" alt="AWS IAM IDP screen" quality="100" lightbox="true" >}}

#### Create a Trust Relationship

In order for your control plane to be able to perform the actions required by this configuration, you will need to create a role with permissions and a trust policy. To do this, go back to the IAM dashboard and select `Roles` from the sidenavigation.

{{<img src="quickstart/images/get-started-idp-add-role.png" alt="AWS IAM IDP dashboard screen" quality="100" lightbox="true" >}}

Click `Create role`.

{{<img src="quickstart/images/get-started-create-role.png" alt="AWS IAM role screen" quality="100" lightbox="true">}}

Select a trusted entity type of `Custom trust policy`. Copy the trust policy provided by Upbound and paste it in the policy authoring window in the AWS IAM console. Make sure to replace `YOUR_AWS_ACCOUNT_ID` with your AWS account ID.

{{< hint "tip" >}}
You can find your AWS account ID by selecting the account dropdown in the upper right corner of the AWS console.
{{< /hint >}}

{{<img src="quickstart/images/get-started-aws-trust-policy.png" alt="AWS IAM role screen" quality="100" lightbox="true">}}

This trust policy configures this role to only grant access to the managed control plane running in your account for the Crossplane provider-aws. Click `Next`. Next, you must select the permissions to grant to this role. In production scenarios, you will want to create a custom permission policy that scopes your control plane to _only_ the APIs it needs to do its job. For this tutorial, you can the `AmazonEC2FullAccess` managed policy provided by AWS, since this covers the permissions required to allow your managed control plane to provision the resources it needs for EKS. After you've selected this policy, click `Next`.

{{<img src="quickstart/images/get-started-aws-permissions.png" alt="AWS IAM permissions screen" quality="100" lightbox="true">}}

Finally, give this role a name. Call it `my-upbound-control-plane-role` and click `Create role`. Once the role has been created, click `view role` and copy the Amazon Resource Name (ARN), as below.

{{<img src="quickstart/images/get-started-aws-copy-arn.png" alt="AWS IAM permissions screen" quality="100" lightbox="true">}}

#### Provide the ARN to Upbound

Return to Upbound and paste the ARN you copied in the previous step into the input at the bottom of the form. Click `Authenticate`. Finally, click `Confirm and Launch Control Plane`.

{{<img src="quickstart/images/get-started-confirm-launch.png" alt="Upbound Get Started Confirm and Launch screen" quality="100" lightbox="true">}}

## Welcome to the Upbound Console

After completing the `Get Started` experience, you will be launched into the Upbound Console and greeted by the Control Planes screen.

Click into your managed control plane to see a details view of your control plane. The control plane details view is designed to give users a window into what is happening on their control planes. Read the [Upbound Console concept page]({{<ref "concepts/console">}}) for a full tour of what the Console has to offer.

### Create your first resource

From the control plane instance view, click the `Portal` tab, and click `Open Control Plane Portal`.

{{<img src="quickstart/images/get-started-portal-link.png" alt="Navigate to control plane portal" quality="100" lightbox="true">}}

Click the `KubernetesCluster` resource type in the side bar and then click the `Create New` button. This will bring you to a form experience for you to fill out and create a new instance. Input the following into the fields:

- **name**: my-app-cluster
- **namespace**: select `default`
- **id**: my-app-cluster
- **count**: 1
- **size**: small

{{<img src="quickstart/images/get-started-k8s-cluster-create.png" alt="Navigate to control plane portal" quality="100" lightbox="true">}}

After filling out the form, the portal generates a Crossplane claim that will be submitted once you click `Create Instance`. Go ahead and click the `Create Instance` button.

### Observe your resource being created

Navigate back to Upbound Console and to your control plane. If you refresh the page, you will notice there is now a claim card next to the `KubernetesCluster` type card. Click the claim card and Upbound will render the full resource tree that is getting created--and now managed--by your managed control plane. 

{{<img src="quickstart/images/get-started-k8s-created.png" alt="Navigate to control plane portal" quality="100" lightbox="true">}}

Congratulations! You created your first resources with your MCP.

## Next Steps

To learn more about the core concepts of Upbound, read the [concepts]({{<ref "concepts">}}) documentation. To learn how to begin building your own platform on Upbound, read the [reference architecture]({{<ref "knowledge-base/reference-architecture">}}) knowledge base article.

<!-- Named Links -->

[accounts.upbound.io]: https://accounts.upbound.io
[cloud.upbound.io]: https://cloud.upbound.io
[AWS IAM console]: https://console.aws.amazon.com/iam