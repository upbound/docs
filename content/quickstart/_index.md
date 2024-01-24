---
title: "Quickstart"
weight: -1
icon: "person-running-regular"
description: "Create your first Upbound Managed Control Plane and connect it to your cloud provider."
---

Upbound is a global platform for building, deploying, and operating cloud
platforms using managed control planes.

## The value of Upbound

As your infrastructure scales, it can be difficult to deal with tech sprawl in a
cloud native world. By offering abstract APIs, Upbound simplifies complex
infrastructure management, making it more accessible for development teams.

Upbound is useful for companies that need a unified control and management
system for their diverse cloud infrastructures. Upbound stands out by providing
fully managed control planes, a unified operating model for extensive management
across various cloud services, and GitOps-driven workflows. This combination of
features allows organizations to efficiently manage their cloud footprint,
streamline developer operations, and maintain consistency across different cloud
environments.

## Get started

This quickstart guides you through how to create your first managed control plane in Upbound. Connect Upbound to AWS, and use your control plane to create and manage EKS clusters.

## Prerequisites

You need the following:

- An Upbound account.
- An AWS, Azure, or GCP account with permissions to manage IAM policies.
- A GitHub account with permission to install GitHub Apps.

{{< hint "tip" >}}
If you don't have an Upbound account, [sign up for a free trial](https://accounts.upbound.io/register).
{{< /hint >}}

## Get started

The first time you sign in to Upbound, you are through a `Get Started` experience designed to bootstrap your environment in the matter of minutes. Go to [Upbound](https://console.upbound.io) to start the experience.

### Create an organization

Your first time in Upbound you must create an organization. Give your organization an ID and a friendly name.

Select **Create Organization**.


On the next screen, start your free trial. This trial allows you to create up to three managed control planes, three configurations, and invite a total of 10 team members in an organization.


### Choose a configuration

Upbound offers a curated gallery of Crossplane configurations for you to choose from. These configurations provide ready-built APIs that Upbound installs in your control plane. You can select the _source_ link to view the configuration files that define this API in GitHub.

Select the Configuration called **EKS as a service**.


### Connect to GitHub

After you've selected a Configuration, you need to connect Upbound to your GitHub account. Upbound uses GitHub's authorization flow and installs a GitHub app into your account.

Select **Connect to GitHub**.


{{< hint "tip" >}}
Git connectivity is at the core of Upbound's workflows. To learn more about git integration, read the [GitOps with MCP]({{<ref "/concepts/mcp/control-plane-connector.md" >}}) section.
{{< /hint >}}

After you've connected to GitHub, select an account owner and repository name. Upbound creates a new repository under your account and clones the contents of the Configuration into that repository.

<!-- vale Google.FirstPerson = NO -->
<!-- allow "my" -->

Give your repository a name, like **my-control-plane-api**.

<!-- vale Google.FirstPerson = YES -->

Select **Clone configuration to GitHub**.


### Create a managed control plane

After Upbound clones the Configuration into your own repository, create a managed control plane.

<!-- vale Google.FirstPerson = NO -->
<!-- allow "my" -->

Give your control plane a name, like **my-control-plane**.

<!-- vale Google.FirstPerson = YES -->

Select **Create Control Plane**.




## OIDC

{{< tabs >}}

{{< tab "AWS" >}}
{{< /tab >}}

{{< tab "Azure" >}}
{{< /tab >}}

{{< tab "GCP" >}}
{{< /tab >}}

{{< /tabs >}}

## Welcome to the Upbound Console

After completing the _Get Started_ experience, you are in the Upbound Console and greeted by the Control Planes screen.

{{<img src="quickstart/images/control-plane-console.png" alt="Upbound control plane console" size="small" align="center">}}

The control plane details view gives users a view into what's happening on their control planes.

{{< hint "tip" >}}
Read about the [Upbound Console]({{<ref "concepts/console">}}) for a full tour of what the Console has to offer.
{{< /hint >}}

### Create your first resource

From the control planes view, select the **Portal** tab, and select **Open Control Plane Portal**.

{{<img src="quickstart/images/get-started-portal-link.png" alt="Navigate to control plane portal" size="small" unBlur="true" lightbox="true">}}

The Control Plane Portal lists the available resources that users can claim in the left-side menu.
These resources are your abstracted APIs presented to users.

{{<img src="quickstart/images/cp-create-kubernetescluster.png" alt="Control plane portal with a Kubernetes Cluster resource" size="small" align="center">}}

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

{{<img src="quickstart/images/get-started-k8s-cluster-create.png" alt="Navigate to control plane portal"  lightbox="true">}}

When you **Create Instance** the portal generates a Crossplane claim.

{{<hint "note" >}}
After creating an instance, the _Events_ section are logs directly from Kubernetes.

Crossplane commonly generates a Kubernetes error `cannot apply composite resource: cannot patch object: Operation cannot be fulfilled` that may appear as an _Event_.

{{<img src="quickstart/images/event-error-cannot-patch.png" alt="Events showing the error cannot apply composite resource: cannot patch object" size="small" unBlur="true" align="center">}}

You can ignore this error. For more information about what causes this, read [Crossplane issue #2114](https://github.com/crossplane/crossplane/issues/2114).
{{< /hint >}}

### Observe your resources

Navigate back to [Upbound Console](https://console.upbound.io) window and to your control plane in the **Overview** tab.

There's now a claim card next to the `KubernetesCluster` type card.

Select the claim and Upbound renders the full resource tree that's getting created and managed by your managed control plane.

{{<img src="quickstart/images/get-started-k8s-created.png" alt="Navigate to control plane portal" lightbox="true">}}

Congratulations, you created your first resources with your MCP.

## Next steps

To learn more about the core concepts of Upbound, read the [concepts]({{<ref "concepts">}}) documentation. To learn how to begin building your own platform on Upbound, read the [Crossplane Architecture Framework]({{<ref "xp-arch-framework/_index.md">}}).

<!-- Named Links -->

[accounts.upbound.io]: https://accounts.upbound.io
[cloud.upbound.io]: https://cloud.upbound.io
[AWS IAM console]: https://console.aws.amazon.com/iam


## Next steps