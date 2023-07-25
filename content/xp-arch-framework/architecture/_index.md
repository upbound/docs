---
title: "Architecture"
weight: 30
description: "A guide for how to build with control planes"
---

Crossplane is a framework that gives users the ability to create their own Kubernetes-style APIs without needing to write code. When a user creates an instance of Crossplane and installs their custom APIs on it, we call this a `control plane` because the user now has an entity they can use to perform controlling actions--creating, reading, updating, or deleting resources exposed by its APIs.

## Overview

How you choose to architect and implement a solution on Crossplane varies wildly depending on your business goals, platform requirements, where you want to offer services powered by Crossplane, and more. This framework provides two reference architectures:

1. A baseline architecture for a single control plane
2. A baseline architecture for running control planes at scale (`N > 1`)

The single control plane baseline architecture provides a minimum recommended baseline for how to build a solution on Crossplane--scoped to a single control plane--and integrate it with a set of common third-party integrations. 

Your business requirements may lead you to wanting to deploy multiple control planes for various reasons. We usually see these reasons as needing to "specialize" control planes for certain purposes. If you intend to deploy multiple control planes, we believe the single control plane baseline is still applicable--the difference is you will end up deploying it `N` times and you will also need to consider how to manage your multi-control plane architecture. This framework outlines an architecture that can be applied for control planes at scale and builds on the foundations of the single control plane baseline architecture.

## Specializing Control Planes

The following are popular reasons we see users pursue a multi-control plane architecture:

- You may need a control plane per environment
- You may need a control plane per cloud provider
- You may need a control plane per organizational unit
- You may need a control plane to own designated cloud accounts in a provider
- You may need multiple control planes based on perf and scalability characteristics
- You may need multiple control planes due to your tenancy and isolation requirements

In any of the above cases, you are "specializing" the responsibilities of a control plane based on a set of business requirements.

## Next Steps

Read the [Baseline Control Plane]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md" >}}) architecture for our recommendations for how to set up a single instance of Crossplane.