---
title: "At-scale Implementation"
weight: 100
description: A guide for implementing an Internal Developer Platform on Upbound at scale
---

The at-scale architecture solves for the limitations of the [baseline architecture]({{<ref "platform-engineering/baseline-implementation">}}). The baseline architecture's [limitations section]({{<ref "platform-engineering/baseline-implementation#limitations">}}) explains how choosing to use a single managed control plane to power your platform exposes you to various limitations. Those limitations concerned the development lifecycle of the control plane with special consideration for more than one platform teams collaborating together, permissions, and geolocation considerations.

Whereas the baseline architecture recommends a single managed control plane to power your platform, the at-scale architecture explains how to decouple responsibilities. You should subdivide the responsibilities of your control plane into a topology of specialized control planes. This architecture requires the use of the [Control Plane Meshes]({{<ref "all-spaces/control-plane-mesh">}}) feature.

## Architecture guidance

The following diagram illustrates an at-scale platform architecture.

{{<img src="platform-engineering/images/at-scale-diagram.png" alt="A screenshot of the Upbound Console space selector dropdown">}}

### Decouple the architecture

A common attribute of the most successful cloud platforms like AWS, Azure, or GCP is their unified experience for consumers. Consider GCP: the GCP cloud console gives users a unified experience for browsing all available 150+ products. In reality, hundreds of lower-level control planes power the GCP experience. Each control plane:

- owns a slice of the GCP experience. GKE for example is responsible for managed Kubernetes instances.
- Works in tandem to deliver rich experiences. A GKE cluster is composed of compute engine VMs, networking resources, etc.
- Operates in several regions around the globe
- Is built and maintained by several different teams

Concretely, this means transforming from:

- a single managed control plane where you define and manage all composite resources.

into:

- a topology of independent control planes each responsible for a specific capability.

This architecture lets you to present a unified experience to the consumers of your platform while positioning your platform to scale to support up to hundreds of platform teams offering services on the platform.

### Define your topology

Every platform on Upbound should have:

- a top-level control plane, the **platform control plane.** This control plane's job is to drive experiences for your platform interfaces. This is the control plane which the Consumer portal in Upbound is connected to.
- One or more lower-level control planes, which we'll refer to as **service control planes**. The number of service control planes depends on how many offerings you want your platform to have and often follows organizational structures. We define an **offering** on your platform as a collection of one or more related composite resources built with Crossplane and offered as a managed service experience. Examples: accounts-as-a-service, databases-as-a-service, VPCs-as-a-service, etc.

Each offering should be powered by its own service control plane. Each platform team must be responsible for only their slice of the total platform experience. To decouple your architecture, follow these recommendations:

- **Identify offering boundaries.** Apply domain-driven design principles to identify bounded contexts in your platform. Each bounded context represents a logical boundary and can be a candidate for a separate offering powered by a service-level control plane. Offerings that represent distinct business functions and have fewer dependencies are good candidates for decoupling.
- **Evaluate offering benefits.** Focus on offerings that benefit most from independent scaling. Decoupling these offerings enables more efficient resource management, supports independent deployments, and reduces the risk of affecting other parts of the platform during updates or changes.
- **Assess technical feasibility.** Examine the current architecture to identify technical constraints and dependencies that might affect the decoupling process. Plan how data is managed and shared across offerings.
- **Decouple composites.** Define clear APIs to enable the newly extracted offerings to interact with composites defined by other offerings.
- **Operate separate deployment pipelines for each service control plane.** Separate deployment pipelines let each offering to be updated at its own pace. If different platform teams or organizations within your company own different offerings, having separate deployment pipelines gives each platform team control over their own deployments. Use continuous integration and continuous delivery (CI/CD) tools like GitHub Actions or Argo CD to set up these pipelines.

## Deployment guidance 

### Control plane project layout

As with the previous architecture, each service control plane and the platform control plane should have their own source-level control planes projects defining them. In the GCP example above, this means you'd have six total control plane projects, one for the platform control plane and one for each service control plane offering.

### Control plane environments

Zooming into a particular group (cloud-storage in the example above), you can see the service control plane(s) corresponding to that offering. Following software best practices, Upbound recommends the creation of control plane instances mapping to software environments. This gives the platform team responsible for the offering the necessary environments to properly develop, test, and rollout their offering.

## Identity and Access management

Upbound offers a Configuration package that defines a baseline set of resources (namely, kind: Account) you can install into the platform control plane. This resource is a flexible container that you can incorporate into the APIs defined on your service control planes. You can then define RBAC on the platform control plane which restricts which consumers are allowed to have access to which accounts.

When a request arrives at a service control plane, it can resolve the Account associated with the request and decide how it wants to translate that into an associated ProviderConfig to handle the resource CRUD request.

## Platform interfaces
todo

### GitOps

As in the prior architecture, setting up GitOps is also a fully compatible flow for the at-scale architecture. GitOps interactions should happen through the front door of your platform, which is the role of the platform control plane.

### CLI

Likewise, kubectl is a Kubernetes CLI that you can use to interact with your platform in this architecture.
