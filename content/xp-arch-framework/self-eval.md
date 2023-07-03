---
title: "Crossplane Architectural Evaluation"
weight: 1
icon: "popsicle"
description: "A self-evaluation to steer you in the direction for build with Crossplane"
---

This article outlines the process for how to go about architecting a custom cloud platform with Crossplane. The goal is to make it easy for teams to create their cloud platforms in a simple, fun and high velocity way while checking the relevant boxes to meet their organizational, governance and technical requirements.

## Architecture Questions

### Who will use your platform?

As an architect of a custom cloud platform, it helps us to remind ourselves that we are building this platform for end users and in most cases multiple personas.

{{< hint "note" >}}
**Action**: Write down all the teams that you anticipate using your platform
{{< /hint >}}

### What causes toil for your users?

These teams likely have current ways to satisfy their infrastructure resource lifecycle management needs. Which tools do they use? Which things hold them back? How much energy do they spend?

{{< hint "note" >}}
**Action**: Find out how your users are currently satisfying their needs and which problems they want to solve along with their expected outcomes.
{{< /hint >}}

### What will your interface look like?

Your custom cloud platform has an API. This application programmers interface defines how your users are using the platform. It allows you to innovate behind the API. This is a great way for cloud platform teams to provide behind the scenes governance and security. One such security feature can be to always encrypt all data at rest and perhaps in transit without any additional work on behalf of your users. Another example may be to create and persist secrets in the corporate secrets store of choice for your custom platform.

The innovation behind the API approach also allows us to apply corporate standards. You might offer your application teams your own platform regions, for example US, EMEA, APAC. You may choose to map those to specific cloud provider regions for latency, cost or other optimizations. Perhaps also to straddle multiple specific provider regions into your defined cloud regions.

{{< hint "note" >}}
**Action**: Determine what the application programmers interface for your platform should look like.
{{< /hint >}}

### What inputs does your interface need to provide?

Think about the most simple API that will provide real benefit to at least one major user of your platform when you start out. Use short feedback loops to find out if you are going down a path of energy well spent for your organization.

A good first step is to identify resource dependencies that will always exist, and resources that will never have any dependencies on each other. 

Next would be the minimum set of parameters that a user of the API needs to provide to achieve meaningful resource lifecycle management create, read / observe, update, delete (CRUD) operations.

{{< hint "note" >}}
**Action**: Identify which of your customer teams have which needs that your API should reflect in its parameters, resource distinctions, and lifecycle versions.
{{< /hint >}}

Example: An Architecture for an organization with a Network, Database, Security, Governance, IT, Finance, Cloud Platform, SRE, and 3 Application Teams with a Service Owner Responsibility Model.

… Add Example Approach to Define the important aspects of the custom cloud API …

### What constitutes an MVP Milestone?

Open questions:

- How do we get to an MVP that can be elevated to meet milestones with user focus and short feedback loops?
- What are the components involved in creating a custom platform with Crossplane?
- Control Planes
- Definitions
- Compositions
- Claims
- GitOps CI/CD
- What do we need to take into consideration when using the Crossplane components?
- Compliance
- Governance
- Security
- Environments
- Which limitations and workarounds are vital to consider for the design?
- Composition function capabilities
- Kubernetes quirks
- Are there areas we need to satisfy and extend?
- Custom providers
- Which roles should be available for creating the custom platform and which skill requirements can be omitted when using Crossplane versus a platform creation from scratch?
- Product
- Architecture
- Design
- Engineering
- Production
- Do we need to worry about cyclomatic complexity when architecting our Crossplane based infrastructure resource lifecycle management?
- How do we keep things maintainable by geo distributed teams at high velocity?
