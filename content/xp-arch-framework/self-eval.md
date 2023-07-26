---
title: "Crossplane Architectural Evaluation"
weight: 1
description: "A self-evaluation to steer you in the direction for build with Crossplane"
---

This self-evaluation outlines the process for how to architect a custom cloud platform with Crossplane. The goal is to simplify the process for you to create your cloud platforms in a fun and high velocity way. It also helps ensure you are checking the relevant boxes to meet your organizational, governance and technical requirements. For this exercise, grab a (virtual) pencil and paper so you can record your answers to these questions.

## Architecture questions

### Who uses your platform

As an architect of a custom cloud platform, it's helpful to remember you are building this platform for end users. These end users are often multiple personas.

{{< hint "important" >}}
**Action**: Write down all the teams that you anticipate using your platform.
{{< /hint >}}

### What causes toil for your users

These teams often have current ways to achieve their infrastructure resource lifecycle management needs. Which tools do they use? Which things hold them back? How much energy do they spend?

{{< hint "important" >}}
**Action**: Find out how your users are currently satisfying their needs and which problems they want to solve along with their expected outcomes.
{{< /hint >}}

### What's your interface

Your custom cloud platform has an API. This application programming interface defines how your users are interact with the platform. It allows you to innovate behind the API. It's great way for cloud platform teams to provide behind the scenes governance and security. One such security feature can be to always encrypt all data at rest. And, perhaps in transit without any extra work on behalf of your users. Another example may be to create and persist secrets in a corporate secrets store of choice for your custom platform.

The innovation behind the API approach also allows you to apply corporate standards. You might offer your application teams your own platform regions, for example `US`, `EMEA`, `APAC`. You may choose to map those to specific cloud provider regions for latency, cost or other optimizations. Perhaps also to straddle multiple specific provider regions into your defined cloud regions.

{{< hint "important" >}}
**Action**: Determine what the application programming interface for your platform should look like.
{{< /hint >}}

### What inputs does your interface need to provide

Think about the most basic API that provides real benefit to at least one major user of your platform when you start out. Use short feedback loops to find out if you are going down a path of energy well spent for your organization.

A good first step is to identify resource dependencies that always exist, and resources that never have any dependencies on each other. 

Next would be the smallest set of parameters that a user of the API needs to provide to achieve meaningful resource lifecycle management. Examples include create, read / observe, update, delete (CRUD) operations.

{{< hint "important" >}}
**Action**: Identify which of your customer teams have which needs that your API should reflect in its parameters, resource distinctions, and lifecycle versions.
{{< /hint >}}

Example: An Architecture for an organization with:

- Network
- Database
- Security
- Governance
- IT
- Finance
- Cloud Platform
- SRE
- 3 Application Teams 

all with a Service Owner Responsibility Model.

### With which organizations does your team collaborate

Platform teams co-exist with other verticals. Depending on
the organic growth of your organization, there may be
departments with shared, overlapping, and mutually exclusive
responsibilities. Before you continue into the next couple of
self evaluation areas, be clear about:

- who to consult and
inform
- who is responsible and accountable for the various
aspects of the requirements that flow into creating your
platform.

{{< hint "important" >}}
**Action**: Write down which departments are responsible,
accountable, consultable and who needs to be informed for
which aspect of your platform features.
{{< /hint >}}

You may find that almost every department
in your company influences aspects of your platform. Platform
teams often are front and center players. The more successful
ones interact with their partners, customers,
and their vendors frequently. They ask questions, building an
agreed and aligned roadmap. They orchestrate, iterate,
develop, test, secure, fix, and celebrating together.

The more common partners include the following:
- Communications
- Finance
- Governance
- IT
- Legal
- Procurement
- Security
- Training

### Which compliance requirements are critical

Your business may be compliant with certain
standards and regulations or
strive to be compliant in the future.
Write down which governance and compliance requirements to apply
when building your platform. The landscape is wide and deep. For
the purposes of this self evaluation, it's focused
on one specific example.

A SOC 2 Type II compliance report assures your customers of the correct design and effective operation of your security program. It's to
safeguard data against threat actors. It shows that you are 
responsible with the following aspects.

- Process Monitoring
- Encryption Control
- Intrusion Detection
- User Access Authentication
- Disaster Recovery

Focusing on encryption as an example. You may offer a persistent storage claim
to your users. Perhaps you base the implementation on an Amazon AWS S3
bucket. In that case, you would want to write a composition that maps
your persistent storage platform API to multiple things:

- a Bucket
- a BucketServerSideEncryptionConfiguration
- a BucketPublicAccessBlock 

You do this to assign fine grained access
and the proper encryption on behalf of your users without
them needing to worry about it. You also do this with your
platform to maintain the desired level of compliance.

{{< hint "important" >}}
**Action**: Learn and document which compliance requirements need to be met.
{{< /hint >}}

### What corporate standards apply

Like the compliance aspects of your platform,
your company has corporate standards. This
is like a travel policy. Pick options for flights,
hotels, cars, meals that follow the guidelines. Except
in this case, these are guidelines related to claiming and running
cloud resources.

You may want to assess typical use cases for your user teams
and map them to the corporate guidelines. For instance,
your application teams typically need 1 of 3 flavors of
database setups. At your platform API you offer them
flavor A, B and C. When you map your API to a cloud
provider's resources, you map those flavors to specific
initial number of things:

- database instance types
- geographic spread
- a variety of other implied resources and attributes all
the way to backups, monitoring and alerting, and any other
require configurations. 

By doing so, your users automatically adhere to the corporate standards.

There may be a role
based access control (RBAC) protected break glass option. This passes through a variety of fine grained parameters from your API to a cloud provider and data center backends. It's
in case a critical ad-hoc business need requires it.

{{< hint "important" >}}
**Action**: Learn and document which corporate standards need to be met.
{{< /hint >}}

### Which governance controls to build

Like compliance and corporate standards,
governance refers to overseeing the control and
direction of your cloud platform with all its
resources and processes. Access and cost control are
to popular aspects that fall under cloud governance.

Crossplane offers multiple layers of segregation and
access control. Identify:

- which are claimable resources
- which you must resources dedicate
- which are mutually exclusive
- which API to offer to your users
- how to map it in a composition to
cloud, data center, and service providers.

Governance most often includes controls to achieve
a healthy ratio of cloud resource cost to their value
for your business. With Crossplane, you can design and
map infrastructure patterns that scale your cloud
resources accordingly when configuring the right
provider options. One such option may be the use
of an auto scaling group and horizontal Kubernetes
pod autoscalers.

Write down the governance controls that are
important to your organization and learn how
your providers can help you create them. Then
create your compositions with that in mind.

{{< hint "important" >}}
**Action**: Learn and document which governance controls need to be in place.
{{< /hint >}}

### What qualifies as an MVP milestone

Building cloud platforms is
a multi year journey for most companies and teams.
There's always a new
feature or a way to create higher efficiencies,
greater security, reduce cognitive load, improve
the status quo. Yesterday's most loved improvement pales compared to
today's needs.

Don't overthink it and don't overengineer it.
Most importantly define achievable roof shots that reduce your risk to get closer to your north star.
Somewhere between a handful of roof shots and the north star
are a couple of moon shots--your major milestones.
The first of them is a MVP that
benefits your users and your team can be proud of.

Throw everything out that's nice to have. Limit
yourself to critical path items. What's in and
what's out depends on your business. But, a good
approach is to pick a specific use case that can coexist
with your current technology stacks and processes. Something
that enables your platform team and its users to get familiar,
and to benefit with quick wins but without taking short cuts.
For every decision you make, the number of options should grow
after you made that decision, not shrink.

That means a scoped MVP is better than one with runaway costs. Consider:

- an MVP to offer persistent storage to a couple of teams, and to meet governance, compliance and corporate standards.
- provide Kubernetes compute clusters in 3 clouds with run away cost, a big surface area due to poor unintentional security lock down and varying degrees of application team and developer satisfaction because of bugs.

Which is a better approach? The first one.

Even better, image when the persistent storage API is extendable to fast block storage? That can then be
a future building block of higher value layers on top
of this solid foundation.

{{< hint "important" >}}
**Action**: Identify and write down a satisfying narrow use case that can be a building block for future expansion. Ensure that what you will offer is needed and will be used.
{{< /hint >}}

Frequently talk to your application teams before, during and after building the MVP.

## The arc of going into production with Crossplane

Upon concluding this exercise, you should now have a stronger sense for the platform you want to build. You should be starting to form an opinion around what APIs you need to provide as part of this platform. The arc of going into production with Crossplane breaks out into three major areas:

1. First, you need to transition from the abstract idea of what APIs you need to build to concrete implementations; you need APIs built with Crossplane that _actually_ do something. In [Building APIs](../building-apis), the framework lays out best practices for using Crossplane's building blocks to make real custom APIs for Crossplane.
2. As you define the shape of your custom Crossplane APIs, you need to determine how to architect with Crossplane: what number of control planes do you need, how do you configure resources that back your control planes, how do you deploy resources to your control planes, and more. In [Control Plane Architecture](../architecture), it defines a baseline architecture that you can adapt for deploying Crossplane with all the important integrations.
3. As you go to deploy Crossplane, there are probably other parts of your platform that you need to integrate with. In [Interface Integrations](../interface-integrations), it explains the most common integrations seen with Crossplane and provide best practices where appropriate around each of them.

{{<img src="xp-arch-framework/images/framework-parts.png" alt="Key parts of the Crossplane Architecture Framework" size="small" quality="100">}}

## Next steps

Are you ready to get started? It's recommended you read [Building APIs](../building-apis) as the next step.