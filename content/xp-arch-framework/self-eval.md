---
title: "Crossplane Architectural Evaluation"
weight: 1
description: "A self-evaluation to steer you in the direction for build with Crossplane"
---

This self-evaluation outlines the process for how to go about architecting a custom cloud platform with Crossplane. The goal is to make it easy for you to create your cloud platforms in a simple, fun and high velocity way while checking the relevant boxes to meet your organizational, governance and technical requirements. For this exercise, grab a pencil and paper so you can record your answers to these questions.

## Architecture Questions

### 1. Who will use your platform?

As an architect of a custom cloud platform, it helps us to remind ourselves that we are building this platform for end users and in most cases multiple personas.

{{< hint "important" >}}
**Action**: Write down all the teams that you anticipate using your platform.
{{< /hint >}}

### 2. What causes toil for your users?

These teams likely have current ways to satisfy their infrastructure resource lifecycle management needs. Which tools do they use? Which things hold them back? How much energy do they spend?

{{< hint "important" >}}
**Action**: Find out how your users are currently satisfying their needs and which problems they want to solve along with their expected outcomes.
{{< /hint >}}

### 3. What will your interface look like?

Your custom cloud platform has an API. This application programming interface will define how your users are interact with the platform. It allows you to innovate behind the API. This is a great way for cloud platform teams to provide behind the scenes governance and security. One such security feature can be to always encrypt all data at rest and perhaps in transit without any additional work on behalf of your users. Another example may be to create and persist secrets in a corporate secrets store of choice for your custom platform.

The innovation behind the API approach also allows us to apply corporate standards. You might offer your application teams your own platform regions, for example US, EMEA, APAC. You may choose to map those to specific cloud provider regions for latency, cost or other optimizations. Perhaps also to straddle multiple specific provider regions into your defined cloud regions.

{{< hint "important" >}}
**Action**: Determine what the application programming interface for your platform should look like.
{{< /hint >}}

### 4. What inputs does your interface need to provide?

Think about the most simple API that will provide real benefit to at least one major user of your platform when you start out. Use short feedback loops to find out if you are going down a path of energy well spent for your organization.

A good first step is to identify resource dependencies that will always exist, and resources that will never have any dependencies on each other. 

Next would be the minimum set of parameters that a user of the API needs to provide to achieve meaningful resource lifecycle management create, read / observe, update, delete (CRUD) operations.

{{< hint "important" >}}
**Action**: Identify which of your customer teams have which needs that your API should reflect in its parameters, resource distinctions, and lifecycle versions.
{{< /hint >}}

Example: An Architecture for an organization with a Network, Database, Security, Governance, IT, Finance, Cloud Platform, SRE, and 3 Application Teams with a Service Owner Responsibility Model.

## The arc of going into production with Crossplane

Upon concluding this exercise, you should now have a stronger sense for the platform you want to build and are starting to form an opinion around what type of APIs you need to provide as part of this platform. We believe the arc of going into production with Crossplane can be broken out into three major areas:

1. First, you will need to transition from the abstract idea of what APIs you need to build to concrete implementations; you need APIs built with Crossplane that _actually_ do something. In [Building APIs](../building-apis), the framework will lay out best practices for using Crossplane's  building blocks to make real custom APIs for Crossplane.
2. As you finalize the shape of your custom Crossplane APIs, you need to determine how to architect with Crossplane: how many control planes do you need, how do you configure resources that back your control planes, how do you deploy resources to your control planes, and more. In [Control Plane Architecture](../architecture), we have defined a baseline architecture that you can adapt for deploying Crossplane with all the important integrations.
3. As you go to deploy Crossplane, there are likely other parts of your platform that you will need to integrate with. In [Interface Integrations](../interface-integrations), we explain the most common integrations we see with Crossplane and provide best practices where appropriate around each of them.

{{<img src="xp-arch-framework/images/framework-parts.png" alt="Key parts of the Crossplane Architecture Framework" size="small" quality="100">}}

## Next Steps

Are you ready to get started? We recommend reading [Building APIs](../building-apis) as the next step.
