---
title: "Architecture"
weight: 30
description: "A guide for how to build with control planes"
---

Crossplane is a framework that gives users the ability to create their own Kubernetes-style APIs without needing to write code. When a user creates an instance of Crossplane and installs their custom APIs on it, it's called this a `control plane`. The user now has an entity they can use to perform controlling actions--creating, reading, updating, or deleting resources exposed by its APIs.

## Architecture overview

How you choose to architect a solution on Crossplane varies depending on multiple things. What are your business goals, platform requirements, or where you want to offer services powered by Crossplane? This framework provides two reference architectures:

1. A baseline architecture for a single control plane
2. A baseline architecture for running control planes at scale (`N > 1`)

The single control plane baseline architecture provides a recommended baseline for how to build a solution on Crossplane, scoped to a single control plane. It provides guidance for integrating it with a set of common third-party interfaces. 

Your business requirements may lead you to wanting to deploy multiple control planes for various reasons. These reasons are often because you need to "specialize" control planes for certain purposes. Even if you intend to deploy multiple control planes, the single control plane baseline is still applicable. The difference is you end up deploying it `N` times. You must also consider how to manage your multi-control plane architecture. This framework outlines an architecture for control planes at scale and builds on the foundations of the single control plane baseline architecture.

## Specializing control planes

The following are popular reasons to pursue a multi-control plane architecture:

- You may need a control plane per environment
- You may need a control plane per cloud provider
- You may need a control plane per organizational unit
- You may need a control plane to own designated cloud accounts in a provider
- You may need multiple control planes based on performance and scalability characteristics
- You may need multiple control planes due to your tenancy and isolation requirements

In any of the preceding cases, you are "specializing" the responsibilities of a control plane based on a set of business requirements.

## Next steps

Read the [Baseline Control Plane]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md" >}}) architecture for recommendations for how to set up a single instance of Crossplane.