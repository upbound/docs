---
title: "Quickstart"
weight: -1
icon: "star"
description: "Create your first Upbound Managed Control Plane and connect it to your cloud provider."
---

Upbound is a global platform for building, deploying, and operating cloud platforms using managed control planes.

{{<img src="quickstart/images/Product_Marketecture_Dark_1440w.png" alt="an architecture of XP with Upbound" quality="100">}}

## The value of Upbound

As organizations embrace cloud services to supplement their existing infrastructure and increase the velocity of their business, they often find themselves with technology sprawl. Organizations are trying to put together all this infrastructure in a way that's consumable by application teams. Organizations create an internal developer platform where they can set configuration and policy and expose a set of abstract APIs. These abstractions that hide away the details of their complex infrastructure requirements.

Organizations end up building their own bespoke platforms. Sometimes, multiple teams compete internally to design their own custom system to solve the same set of problems. More companies are realizing the inherent complexity of building internal platforms and are moving to control planes powered by Crossplane to solve these challenges. 

Crossplane gives platform teams the single point of control to power their platform and enforce the desired state of the infrastructure. Crossplane gives them the flexibility they need to define their own abstracted APIs for their platform.

Building the expertise in-house to operate control planes at scale is hard. Operating Crossplane at scale introduces a lot of toil on the platform team.

 Organizations don't want to think about the infrastructure, lifecycle management or scaling of Crossplane required to provide a highly reliable experience for developers.

Some examples from Upbound customers:

- A **software and internet company** that offers an internal platform to manage their entire infrastructure powering their software as a service offering. They need a single point of control to manage their infrastructure across development, staging, and production environments.

- A **major consumer goods retailer** that wants to provide "golden paths" to help their developers bootstrap new environments much faster.

- An **automotive company** that wants to give their developers platform abstractions for managed services that look the same regardless of which public cloud it's running on.
  
- A **financial institution** is building a single platform to manage their entire cloud footprint and internal tools and infrastructure.

Each of these organizations are building these platforms on control planes. Upbound is suitable for each of these organizations because it provides a complete product experience that includes:

- fully managed control planes powering each of these platforms
- A unified operating model from which platform teams can manage, inspect, and debug their entire platform--across any number of connected cloud services, public or private. 
- GitOps driven workflows that integrate with their managed control planes and allows developers to interact with their platform's APIs through Git-centric workflows.

## Next steps

Get started with Upbound in one of two ways:

* [Deploy your first managed control plane with AWS services]({{<ref "aws-deploy" >}}) - Using the Amazon AWS Official Provider family from Upbound.
* [Deploy your first managed control plane with GCP services]({{<ref "gcp-deploy" >}}) - Using the Google GCP Official Provider family from Upbound.
* [Deploy your first managed control plane with Azure services]({{<ref "azure-deploy" >}}) - Using the Microsoft Azure Official Provider family from Upbound.