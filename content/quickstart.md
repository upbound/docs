---
title: "Quickstart"
weight: 0
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

## Prerequisites

You need the following:

- An Upbound account.
- An AWS, Azure, or GCP account with permissions to manage IAM policies.
- A GitHub account with permission to install GitHub Apps.

{{< hint "tip" >}}
If you don't have an Upbound account, [sign up for a free trial](https://accounts.upbound.io/register).
{{< /hint >}}

## Get started

This quickstart guides you through how to create your first managed control
plane in Upbound. Connect Upbound to your cloud provider, and use your control plane to create
and manage infrastructure.

After you register your Upbound account, walk through the interactive "Get
Started" demo below.

<div style="position: relative; padding-bottom: calc(75.92682926829268% + 42px); height: 0;"><iframe src="https://app.supademo.com/demo/clvydptrx0ty8phe2252uwuzz" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

### Your connection string

In your terminal, your connection string is in the following format:

```shell
up login --profile=${yourOrganization} --account=${yourAccount}
```

After you login, connect directly to your control plane, use the `up ctx` command:

```shell
up ctx ${yourOrganization}/${yourCloudRegion}/default/${yourControlPlane}
```

## Next steps

To learn more about the core concepts of Upbound, read the [concepts]({{<ref "concepts">}}) documentation. To learn how to begin building your own platform on Upbound, read the [Crossplane Architecture Framework]({{<ref "xp-arch-framework/_index.md">}}).
