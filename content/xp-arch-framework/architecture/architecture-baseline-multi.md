---
title: "Multi-Control Plane Architecture"
weight: 12
description: "A guide for how to build with control planes"
---

This reference architecture provides a recommended baseline architecture for deploying and operating multiple Crossplane control planes. When users choose to adopt a control plane architecture that involves multiple control planes, those control planes often have specialized roles. Two things to consider when running multiple control planes are:

1. What are the boundaries that cause you to specialize a control plane's role?
2. How do you bootstrap and manage the infrastructure that supports each control plane? 

In a multi-control plane architecture, the default recommendation is a hub-and-spoke model. Use a central (hub) control plane whose job is to create specialized control planes (spokes). This pattern is also sometimes called "control plane of control planes."

Like the baseline single control plane architecture, the solution you arrive upon depends on your business requirements. As a result, it can vary depending on what you are trying to achieve. The architecture and recommendations in this doc are a starting point for you to branch off of.

{{< hint "note" >}}
💡 An implementation of this architecture is coming soon! You will be able to use it as a starting point and will be encouraged to tweak it according to your needs.
{{< /hint >}}

## Diagram 

{{<img src="xp-arch-framework/images/cp-of-cp-arch.png" alt="Control Plane of Control Planes Architecture" size="large" unBlur="true" align="center">}}

## Central (hub) control plane

The multi-control plane architecture involves creating a control plane to serve as a hub. It's exclusive job is to manage the specialized control planes (spokes). This architecture is a hub-and-spoke pattern. You may hear it called "control plane of control planes." The hub control plane follows the [single control plane]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md" >}}) baseline architecture.

### Configure the hub control plane

Configure the hub control plane in the following ways:

- **APIs:** only install APIs required for creating other control planes (and the infrastructure to back them). To do this, it should be able to create new Kubernetes clusters, install Crossplane into them, and create credentials for each control plane.
- **cloud account access**: if you plan to deploy control planes into multiple cloud accounts, configure it accordingly to have access to do this.

The hub control plane otherwise follows the standard architecture encouraged for [baseline control planes]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md" >}}):

- Store the control plane configuration definition in Git, built as a package and deployed via a GitOps engine.
- Create claims for each specialized (spoke) control plane. Source these claims from Git and deploy them to the hub control plane via a GitOps engine. 

## Specialized (spoke) control planes

When you create multiple control planes, specialize each control plane's role based on your business requirements. The main reasons you may want to consider using multiple control planes and their associated tradeoffs are:

- [Cross-environment requirements]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md#specialize-control-planes-by-environment" >}})
- [Cross-cloud requirements]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md#specialize-control-planes-by-cloud" >}})
- [Segment by organizational unit]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md#specialize-control-planes-by-organizational-unit" >}})
- [Cloud account segmentation]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md#specialize-control-planes-by-cloud-account" >}})
- [Performance requirements]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md#performance-requirements" >}})
- [Isolation requirements]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md#tenancy-requirements" >}})

It's important to note you may combine approaches from this list. For example, you may have cross-environment _and_ tenant isolation requirements. 

{{< hint "tip" >}}
If after reading this, you are unsure of whether you need to create multiple control planes, our recommendation is to start simple and try to operate with just a [single control plane]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md#configure-your-control-plane" >}}). You should only begin to look at a multi-control plane architecture when you have strong business requirements to do so or your usage exceeds the capacity of a single control plane.
{{< /hint >}}

### Specialize control planes by environment

This approach means you create a control plane on a per software environment basis. This would mean 1 control plane for a development environment, 1 control plane for staging, 1 control plane for production, etc. Each control plane has a specialized responsibility to only manage resources in its designated environment.

**Reasons to apply this approach:**

- you want to follow software development best practices.
- you deploy software--and cloud resources--across non-prod and prod environments.

**Tradeoffs:**

- Your control plane footprint increases linearly for each environment you want to support.

### Specialize control planes by cloud

This approach means you create control planes on a per hyper scale cloud provider basis. For example, if you needed your platform to operate in both AWS and Azure, you would create at least two control planes:

- a control plane whose responsibility is for handling AWS-related resources
- a control plane whose responsibility is for handling Azure-related resources

**Reasons to apply this approach:**

- your organization's cloud consumption spans multiple cloud providers.
- your disaster recovery plans for your platform require sustained operation if one hyper scale provider suffers from an outage.

**Tradeoffs:**

- Your control plane footprint effectively doubles.
- By nature of this specialization, you don't treat your control plane as being multi-cloud resource capable (which Crossplane is capable of doing). Depending on the hyper scale provider you want to interact with, you need to change control plane contexts.

### Specialize control planes by organizational unit

This approach means you specialize a control plane to an organizational unit boundary. Most organizations have their own approach to defining their org structure. "Organizational unit" in this context means some grouping of individual application teams. For example:

- Teams Alpha, Bravo, Charlie use _control-plane-x_
- Teams Delta, Echo, Foxtrot use _control-plane-y_

**Reasons to apply this approach:**

- It's done for tenancy reasons. Find the explanation for [tenancy requirements]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md#tenancy-requirements" >}}) below.

**Tradeoffs:**

- Your control plane footprint scales with the number of organizational units you onboard. Depending on the size of your org, this could bring considerable operational overhead.

### Specialize control planes by cloud account

This approach means you create a control plane on per cloud account basis. By cloud account, it means a specific billing account (AWS Account, GCP Project, Azure Tenant, etc). Crossplane is able to communicate with external APIs only after you install a Crossplane provider in the control plane. 

Crossplane providers themselves rely on `ProviderConfig` objects to configure and provide authentication details for how to interact with the external service. It's explained in [tenancy requirements]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md#tenancy-requirements" >}}) below the ways you can set up ProviderConfigs on a control plane. You can configure them to control and give tenants access to provision resources in single or multiple cloud accounts.

**Reasons to apply this approach:**

- You have business requirements to ensure a tenant is _only_ able to provision or interact with resources from a designated set of cloud accounts.
- You have security requirements to lock down control planes to designated cloud accounts.

**Tradeoffs:**

- It's hard to estimate how this impacts your control plane footprint, since that's dependent on how strongly your organization has adopted cloud accounts to group/segment your cloud resource usage.

### Performance requirements

This use case comes out of a necessity rather than strict business requirements. A single Crossplane control plane has inherent performance characteristics and limitations. If your platform usage causes you to exceed those performance boundaries, you must distribute the load across multiple control planes. 

**Reasons to apply this approach:**

- you expect to serve more tenants on a control plane than Upbound has measured it can handle.

**Tradeoffs:**

- You need to create a strategy and method to shard usage across your control planes.

### Tenancy requirements

Sharing control planes can save cost and simplify administrative overhead. But, much like a shared Kubernetes cluster, shared control planes introduce potential security and performance concerns. The [single control plane architecture]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md#tenancy-on-your-control-plane" >}}) explains what tenancy means in Crossplane. Do you have security requirements to ensure certain teams are only able to create resources in certain cloud accounts? If so, it's recommended you adopt a multi-control plane architecture that segments teams to their own control planes.

## Configuration

For each individual control plane, this architecture applies the same recommendations as what you can find in the [baseline single control plane architecture]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md" >}}). The difference is that once you have your hub control plane created, you can use it to declaratively create all ensuing specialized control planes.
