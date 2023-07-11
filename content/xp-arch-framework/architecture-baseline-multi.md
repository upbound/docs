---
title: "Architecture | Multi-Control Planes"
weight: 12
description: "A guide for how to build with control planes"
---

This reference architecture provides a recommended baseline architecture for deploying and operating many Crossplane control planes.  When users choose to adopt a control plane architecture that involves multiple control planes, those control planes usually have specialized roles. There are two things that need to be considered when running many control planes:

1. What are the boundaries that cause you to specialize a control plane's role?
2. How do you bootstrap and manage the infrastructure that supports each control plane? 

In a multi-control plane architecture, we recommend a hub-and-spoke model: use a central (hub) control plane whose job is to create specialized control planes (spokes). This pattern is also sometimes called “control plane of control planes”.

Just like the baseline single control plane architecture, your solution must be influenced by your business requirements, and as a result it can vary depending on what you are trying to achieve. It should be considered as your starting point for pre-production and production stages.

{{< hint "note" >}}
💡 An implementation of this architecture is available on GitHub: <link to a configuration on Marketplace>. You can use it as a starting point and are encouraged to tweak it according to your needs.
{{< /hint >}}

## Diagram 

{{<img src="xp-arch-framework/images/cp-of-cp-arch.png" alt="Control Plane of Control Planes Architecture" size="medium" quality="100" align="center">}}

## Central (hub) control plane

The multi-control plane architecture involves creating a control plane to serve as a hub whose exclusive job is to manage the specialized control planes (spokes). This architecture is a hub-and-spoke pattern and you will somestimes hear it called “control plane of control planes”. The hub control plane follows the [single control plane](../architecture-baseline-single) baseline architecture.

### Configuration

The hub control plane should be configured in the following ways:

- its only APIs are to create other control planes. To do this, it should be able to create new Kubernetes clusters, install Crossplane into them, and create credentials for each control plane.
- if you plan to deploy control planes into multiple cloud accounts, it needs to be configured accordingly to have access to do this.

The hub control plane otherwise follows the standard architecture we encourage for baseline control planes: 

- the control plane configuration definition should be sourced from git, built as a package and deployed via GitOps engine.
- claims, which should be created for each specialized (spoke) control plane, should be sourced from git and deployed to the hub control plane via a GitOps engine. 

## Specialized (spoke) control planes

When you create multiple control planes, each control plane's role is usually specialized based on some business requirements. We have documented below the main reasons you may want to consider using multiple control planes and associated tradeoffs:

- [Cross-environment requirements](#specialize-control-planes-by-environment)
- [Cross-cloud requirements](#specialize-control-planes-by-cloud)
- [Segment by organizational unit](#specialize-control-planes-by-organizational-unit)
- [Cloud account segmentation](#specialize-control-planes-by-cloud-account)
- [Performance requirements](#performance-requirements)
- [Isolation requirements](#tenancy-requirements)

{{< hint "tip" >}}
If you are unsure of whether you need to create multiple control planes, our recommendation is to start simple and try to operate with just a [single control plane](../architecture-baseline-single#configuration). You should only begin to look at a multi-control plane architecture when you have strong business requirements to do so or your usage exceeds the capacity of a single control plane.
{{< /hint >}}

### Specialize control planes by environment

This approach means you create a control plane on a per software environment basis. For users who follow software development best practices and deploy their software across non-prod and prod environments, we recommend deploying an instance of Crossplane for each of your environments (dev, staging, prod, etc). Each control plane has a specialized responsibility to only manage resources in its designated environment.

### Specialize control planes by Cloud

This approach means you create control planes on a per hyperscale cloud provider basis. For example, if you needed your platform to operate in both AWS and Azure, you would create at least two control planes:

- a control plane whose responsibility is for handling AWS-related resources
- a control plane whose responsibility is for handling Azure-related resources

This is only applicable for organizations whose cloud usage spans multiple cloud providers. The reason you might want to consider this is if one cloud provider (and your control planes) are suffering from a disaster scenario, you will maintain a point of control for your other cloud services.

### Specialize control planes by Organizational Unit

This approach means you designate a control plane to an organizational unit boundary. Many organizations have their own approach to defining their org structure; when we say "organizational unit", we mean some grouping of application teams. For example:

- Teams Alpha, Bravo, Charlie use _control-plane-x_
- Teams Delta, Echo, Foxtrot use _control-plane-y_

The reasons you may want to specialize control planes in this way is explained in [tenancy requirements](#tenancy-requirements) below.

### Specialize control planes by Cloud Account

This approach means you create a control plane on per cloud account basis. By cloud account, we mean a specific billing account (i.e. AWS Account, GCP Project, Azure Tenant, etc). Crossplane is able to communicate with external APIs only after a Crossplane provider has been installed in the control plane. Crossplane providers themselves rely on `ProviderConfig` objects to configure & provide authentication details for how to interact with the external service. It is possible for a single control plane to have multiple ProviderConfigs--each configured to point to a single cloud account--and use that to provision resources across multiple accounts.

However, it is possible to specialize control planes and configure them so they can only talk to resources associated with:

- a single cloud account
- a group of designated cloud accounts

### Performance Requirements

This use case is driven by necessity rather than strict business requirements. A single Crossplane control plane has inherent performance characteristics and limitations which are documented in the [baseline single control plane architecture](../architecture-baseline-single). If your platform usage will cause you to exceed those performance boundaries, you will have no other choice than to distribute the load across multiple control planes. 

### Tenancy Requirements

Sharing control planes can save cost and simplify administrative overhead. However, much like a shared Kubernetes cluster, shared control planes introduce potential security and performance concerns. 

{{< hint "tip" >}}
Best Practice: If you have security requirements to ensure certain teams are only able to create resources in certain cloud accounts, we strongly recommend adopting a multi-control plane architecture that confines teams to their own control planes. Discrete control planes will always be a stronger isolation boundary than namespaces.
{{< /hint >}}

The Kubernetes documentation on [multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/) does a thorough job covering this topic for Kubernetes generally. We will cover how it maps to Crossplane specifically:

#### Control Plane APIs

In Crossplane, Composite Resources are always cluster-scoped. While you _can_ limit whether a Composite Resource is claimable, this only limits the ability for tenants in a namespace to create a resource. If a composite resource is claimable, then _all_ tenants across all namespaces can create resource claims against that composite resource. It's not possible in Crossplane to install APIs for only some teams using your control plane. 

#### Managed Resources

In Crossplane, Managed Resources are also cluster-scoped. While we recommend against exposing managed resources to your consumer teams (instead, you should always use claimable composite resources), if you give users RBAC to manage the managed resource objects directly, you are giving them the ability to use any credentials to do so (since managed resources tell your Crossplane provider which `ProviderConfig` to use to resolve requests).

#### ProviderConfigs

A Crossplane provider's `ProviderConfig` is a cluster-scoped resource. That means if you have `ProviderConfig-team-A` and `ProviderConfig-team-B` on a control plane--each associated with different cloud accounts--, it is conceivable that teams in different namespaces could inadvertantly create resource requests using ProviderConfigs they're not supposed to (whether if you gave them RBAC over managed resources directly or you create a field in your XRD that allows users to request a certain ProviderConfig directly).

## Configuration

For each individual control plane, this architecture applies the same recommendations as what you can find in the [baseline single control plane architecture](../architecture-baseline-single). The difference is that once you have your hub control plane created, you can use it to declaratively create all ensuing specialized control planes.
