---
title: Control Plane Topologies
sidebar_position: 15
description: Configure scheduling of composites to remote control planes
draft: true
---


:::important
This feature is in private preview for select customers in Upbound Spaces. If you're interested in this deployment mode, please [contact us](https://www.upbound.io/support/contact).
:::

:::note
Control Plane Topologies is not yet available for Cloud Spaces. This feature is currently available for Connected and Disconnected (Self-Hosted) Spaces only.
:::

Upbound's _Control Plane Topology_ feature lets you build and deploy a platform
of multiple control planes. These control planes work together for a unified platform
experience.


With the _Topology_ feature, you can install resource APIs that are
reconciled by other control planes and configure the routing that occurs between
control planes. You can also build compositions that reference other resources
running on your control plane or elsewhere in Upbound.

This guide explains how to use Control Plane Topology APIs to install, configure
remote APIs, and build powerful compositions that reference other resources.

## Benefits

The Control Plane Topology feature provides the following benefits:

* Decouple your platform architecture into independent offerings to improve your platform's software development lifecycle.
* Install composite APIs from Configurations as CRDs which are fulfilled and reconciled by other control planes.
* Route APIs to other control planes by configuring an _Environment_ resource, which define a set of routable dimensions.
<!-- vale gitlab.HeadingContent = NO -->
## How it works
<!-- vale gitlab.HeadingContent = YES -->

Imagine the scenario where you want to let a user reference a subnet when creating a database instance. To your control plane, the `kind: database` and `kind: subnet` are independent resources. To you as the composition author, these resources have an important relationship. It may be that:

- you don't want your user to ever be able to create a database without specifying a subnet.
- you want to let them create a subnet when they create the database, if it doesn't exist.
- you want to allow them to reuse a subnet that got created elsewhere or gets shared by another user.

In each of these scenarios, you must resort to writing complex composition logic
to handle each case. The problem is compounded when the resource exists in a
context separate from the current control plane's context. Imagine a scenario
where one control plane manages Database resources and a second control plane
manages networking resources. With the _Topology_ feature, you can offload these
concerns to Upbound machinery.


![Control Plane Topology feature arch](/img/topology-arch.png)

For full documentation, see the [Self-Hosted Spaces Control Plane Topologies guide](/cloud-spaces/howtos/control-plane-topologies/).
