---
title: Learn
weight: -1
description: "Learn how Upbound works and how it can work for you."
hideFromHomepage: true
aliases:
    - "/getstarted-devex"
---

Upbound is a scalable infrastructure management service built on Crossplane. The advantage of Crossplane and Upbound is the universal control plane. Control planes continuously reconcile your desired state with actual resources, allowing teams to self-serve their infrastructure needs.

## Why control planes

Upbound uses control planes to manage resources through custom APIs. The control plane constantly monitors your cloud resources to meet the state you define in your custom APIs. You define your resources with Custom Resource Definitions (CRDs), which Upbound parses, connects with the service, and manages on your behalf.

## Why Upbound

Upbound offers several advantages for managing complex infrastructure. As your infrastructure grows, managing cloud environments, scaling, and security can become more challenging. Other infrastructure as code tools often require more hands-on intervention to avoid drift and deploy consistently across providers.

By adopting Upbound, you gain:

- Integrated drift protection and continuous reconciliation
- Scalability across providers
- Self-service deployment workflows
- Enhanced security posture and reduced blast radius
- Consistent deployment using GitOps principles

## Try it out
<!-- vale gitlab.FutureTense = NO -->
In the next guide, you'll learn how to provision cloud resources in your
preferred provider. Follow [the guide]({{< ref "./control-plane-project" >}}) to
learn the full capabilities of Upbound's cross-cloud infrastructure management.
<!-- vale gitlab.FutureTense = YES -->

