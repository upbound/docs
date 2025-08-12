---
title: "Platform portals with Backstage"
sidebar_position: 30
description: "A guide to use an Upbound control plane to bootstrap other platform pieces"
---

Platform portals are one of the most common user interfaces to offer to consumers of your platform. If you want your platform users to have a graphical interface to view their resources, inspect, and create new instances, you should think about deploying a portal for your platform.

[Backstage][backstage] is a popular framework for implementing your own platform portal. Backstage is a web app and must get deployed and run somewhere. This solution demonstrates deploying a sample Backstage instance to an EKS cluster, preconfigured for connectivity to an Upbound control plane. 

Backstage is just one way you can create a portal for your platform. Instead of Backstage, you can choose to build your own portal from scratch, use Upbound's built-in Consumer Portal, or use other vendor-based portals.

## Deploying Backstage

This solution uses a prebuilt Configuration, `xpkg.upbound.io/upbound/configuration-backstage`, to define a composite resource called `XBackstage` for deploying an instance of Backstage onto an EKS cluster. It includes optional integrations for managed services such as:

- AWS networking components
- AWS Load Balancer Controller
- External DNS Controller
- NGINX Ingress Controller
- Cert Manager
- EKS Pod Identity for service-level access control

In the solution, this configuration is what gets applied to the _frontend_ `XEnvironment` control plane. This control plane purpose is to provision the backing infrastructure outlined above along with a deployment of Backstage.

## Preconfigured Backstage

The Backstage instance that gets deployed comes from a private Upbound source repository containing a typical Backstage application scaffold, but tuned for integration with an Upbound control plane. This tuning includes:

- Upbound authentication to communicate with the corresponding control plane
- A plugin to automatically ingest control plane APIs and generate Backstage resource templates
- A plugin to automatically ingest Crossplane resources on the control plane and register them the Backstage entity catalog
- Theming to match the rest of the Upbound product experience

Because Backstage is connected to an Upbound control plane, whenever you deploy new Configuration packages to the control plane, Backstage gets automatically updated to have generated resource templates. No coding is required.

## Customize Backstage

Commercial customers of Upbound may be granted access to the source code for this Backstage app so they can customize it to their needs.


[backstage]: https://backstage.io/
