---
title: "Quickstart"
weight: -1
icon: "star"
description: "Create your first Upbound Managed Control Plane and connect it to your cloud provider."
---

Upbound is a global platform for building, deploying, and operating cloud platforms using managed control planes. This guide provides an overview of how Upbound works and how it can help you use the power of control planes to power your own cloud platforms.

{{<img src="quickstart/images/Product_Marketecture_Dark_1440w.png" alt="an architecture of XP with Upbound" quality="100">}}

## Why Upbound?

As organizations embrace cloud services such as managed databases, managed Kubernetes, or serverless platforms to supplement their existing infrastructure footprint and accelerate the velocity of their business, they often find themselves with technology sprawl. Organizations find themselves trying to put together all this infrastucture in a way that is consumable by application teams. While some organizations allow application teams to directly access infrastructure, this is typically an anti-pattern. Instead, organizations end up creating what looks like an intermediate platform--a place where they can set configuration, policy, and expose a set of abstractions that hide away the details of their complex infrastructure requirements--and exposes an interface that is more consumable by their application teams.

Organizations end up building their own bespoke platforms--and sometimes, even multiple teams compete internally to design their own custom system to solve the same problems. More and more organizations are realizing the inherent complexity of this problem and are moving toward control planes powered by Crossplane to solve these challenges. With Crossplane, organizations get both the single point of control to power their platforms & enforce desired infrastructure state (that is, the control plane) and the framework--the set of technology building blocks--that gives them the flexibility they need to define their own APIs for their platform.

**Building the exertise in-house to operate control planes at scale is challenging; Operating Crossplane at scale introduces a lot of toil on the platform team.** Organizations want to use the power of Crossplane, but they don't want to think about the hosting of the infrastructure to power Crossplane, how to handle control plane upgrades, or how to design and scale Crossplane to provide a highly reliable experience that powers their entire platform for the rest of their organization's infrastructure needs.

For example:

- a **software and internet company** that offers an internal platform to manage their entire internal infrastructure needs to power their software as a service (SaaS) model needs a single point of control from which they can manage their infrastructure in different environments (development, staging, and production)
- a **major consumer goods retailer** that wants to provide "golden paths" to help their developers bootstrap new environments much faster.
- An **automotive company** that wants to give their developers platform abstractions for managed services that look the same, whether they are running that infrastructure in one public cloud or another. The developers shouldn't care about which public cloud is providing the infrastructure, it all looks the same for them
- a **financial institution** is building a unified platform through which their entire cloud footprint will be managed and will also interface with internal, organization-specific componentry that has been built over the years.

Each of these organizations are building these platforms on control planes. Upbound is suitable for each of these organizations because it provides a complete product experience that includes:

- fully managed control planes powering each of these platforms
- A unified operating model from which platform teams can manage, inspect, and debug their entire platform--across any number of connected cloud services, public or private. 
- GitOps driven workflows that integrate with their managed control planes and allows developers to interact with their platform's APIs through git-centric workflows.

## Next Steps

Get started with Upbound in one of two ways:

* [Deploy your first managed control plane with AWS services]({{<ref "aws-deploy" >}}) - Using the Amazon AWS Official Provider from Upbound.
* [Deploy your first managed control plane with GCP services]({{<ref "gcp-deploy" >}}) - Using the Google GCP Official Provider from Upbound.