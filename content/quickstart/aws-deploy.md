---
title: Deploy your first control plane with AWS
weight: 1
description: A guide for deploying a cloud platform on Upbound for Amazon EKS
---

This quickstart guides you through how to create your first managed control plane in Upbound. Connect Upbound to AWS, and use your control plane to create and manage EKS clusters.

## Prerequisites

You need the following:

* An Upbound account.
* An AWS account with permissions to manage IAM policies.
* A GitHub account with permission to install GitHub Apps.

{{< hint "tip" >}}
If you don't have an Upbound account, [sign up for a free trial](https://accounts.upbound.io/register).
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

Select the Configuration called **EKS as a service**. 

{{<img src="quickstart/images/get-started-select-eks.png" alt="Choose an Upbound configuration" quality="100" size="medium" lightbox="true" >}}

### Connect to GitHub

After you've selected a Configuration, you need to connect Upbound to your GitHub account. Upbound uses GitHub's authorization flow and installs a GitHub app into your account. 

Select **Connect to GitHub**.

{{<img src="quickstart/images/get-started-select-gh.png" alt="a marketplace search filter with Providers and Official filters set" quality="100" size="medium" lightbox="true">}}

{{< hint "tip" >}}
Git connectivity is at the core of Upbound's workflows. To learn more about git integration, read the [GitOps with MCP]({{<ref "/concepts/mcp/control-plane-connector" >}}) section.
{{< /hint >}}

After you've connected to GitHub, select an account owner and repository name. Upbound creates a new repository under your account and clones the contents of the Configuration into that repository. 

<!-- vale Google.FirstPerson = NO -->
<!-- allow "my" -->
Give your repository a name, like **my-control-plane-api**. 
<!-- vale Google.FirstPerson = YES -->

Select **Clone configuration to GitHub**.

{{<img src="quickstart/images/get-started-gh-repo.png" alt="Upbound Create Repository screen" quality="100" lightbox="true">}}


### Create a managed control plane

After Upbound clones the Configuration into your own repository, create a managed control plane. 

<!-- vale Google.FirstPerson = NO -->
<!-- allow "my" -->
Give your control plane a name, like **my-control-plane**.
<!-- vale Google.FirstPerson = YES -->

Select **Create Control Plane**.

{{<img src="quickstart/images/get-started-name-ctp.png" alt="Upbound Create Control Plane screen" quality="100" lightbox="true" size="medium" >}}


### Connect to AWS with OIDC

While Upbound creates your control plane, connect Upbound to AWS. 

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

Return to Upbound and paste the ARN you copied in the previous step into the input at the bottom of the form.  
Select **Authenticate**.  
Select **Confirm and Launch Control Plane**.

{{<img src="quickstart/images/get-started-confirm-launch.png" alt="Upbound Get Started Confirm and Launch screen" quality="100" lightbox="true" size="medium">}}

## Welcome to the Upbound Console

After completing the _Get Started_ experience, you are in the Upbound Console and greeted by the Control Planes screen.

{{<img src="quickstart/images/control-plane-console.png" alt="Upbound control plane console" quality="100" align="center">}}

The control plane details view gives users a view into what's happening on their control planes. 

{{< hint "tip" >}}
Read about the [Upbound Console]({{<ref "concepts/console/overview">}}) for a full tour of what the Console has to offer.
{{< /hint >}}

### Create your first resource

From the control planes view, select the **Portal** tab, and select **Open Control Plane Portal**.

{{<img src="quickstart/images/get-started-portal-link.png" alt="Navigate to control plane portal" quality="100" lightbox="true">}}

The Control Plane Portal lists the available resources that users can claim in the left-side menu.  
These resources are your abstracted APIs presented to users. 

{{<img src="quickstart/images/cp-create-kubernetescluster.png" alt="Control plane portal with a Kubernetes Cluster resource" quality="100" align="center">}}

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

{{<img src="quickstart/images/get-started-k8s-cluster-create.png" alt="Navigate to control plane portal" quality="100" lightbox="true">}}

When you **Create Instance** the portal generates a Crossplane claim.

{{<hint "note" >}}
After creating an instance, the _Events_ section are logs directly from Kubernetes.  

Crossplane commonly generates a Kubernetes error `cannot apply composite resource: cannot patch object: Operation cannot be fulfilled` that may appear as an _Event_.

{{<img src="quickstart/images/event-error-cannot-patch.png" alt="Events showing the error cannot apply composite resource: cannot patch object" quality="100" size="small" align="center">}}

You can ignore this error. For more information about what causes this, read [Crossplane issue #2114](https://github.com/crossplane/crossplane/issues/2114).
{{< /hint >}}

### Observe your resources

Navigate back to [Upbound Console](https://console.upbound.io) window and to your control plane in the **Overview** tab. 

There's now a claim card next to the `KubernetesCluster` type card. 

Select the claim and Upbound renders the full resource tree that's getting created and managed by your managed control plane. 

{{<img src="quickstart/images/get-started-k8s-created.png" alt="Navigate to control plane portal" quality="100" lightbox="true">}}

Congratulations, you created your first resources with your MCP.

## Next steps

To learn more about the core concepts of Upbound, read the [concepts]({{<ref "concepts">}}) documentation. To learn how to begin building your own platform on Upbound, read the [Crossplane Architecture Framework]({{<ref "xp-arch-framework">}}).

<!-- Named Links -->

[accounts.upbound.io]: https://accounts.upbound.io
[cloud.upbound.io]: https://cloud.upbound.io
[AWS IAM console]: https://console.aws.amazon.com/iam