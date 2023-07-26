---
title: "Platform Frontends"
weight: 4
description: "A guide for how to integrate control planes with a variety of interfaces"
---

Just like Kubernetes, the default interface to a new Crossplane instance is the [Kubernetes-based API](https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/), typically interacted with via a tool like [kubectl](https://kubernetes.io/docs/reference/kubectl/).

Most users don't want to directly expose their Crossplane's API server to users. Command line terminals can be an unfriendly interfaces for some, so users may want to connect their own frontend to their control plane. You can integrate any frontend with Crossplane, such as a home-grown web app, [Backstage](https://backstage.io/) or [Port](https://www.getport.io/).

## Integrating a platform frontend

One of the most common use cases Crossplane users have is to build an internal developer platform (IDP). A typical IDP has a GUI-based frontend which often provides UI-based form experiences that allows developers to self-service infrastructure and resources.

Integrating a platform frontend with your control plane requires translating a set of inputs collected from a form and sending that to a control plane. You _could_ configure your platform frontend to communicate directly with the API server of your control plane. It's a better practice to instead use your platform frontend to:

1. Collect the inputs you need to build a claim against your API
2. Create the claim .YAML and submit that to the Git repository syncing to your control plane
3. A CD engine applies the claim to your control plane and your control plane responds to the claim.

## Diagram

{{<img src="xp-arch-framework/images/platform-frontend-flow.png" alt="A diagram demonstrating how a platform frontend generically integrates with Crossplane" size="medium" quality="100" align="center">}}

Your platform doesn't communicate directly with your control plane. Instead, it all operates through Git, aligned to the recommendations found in [consuming your control plane API]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md#consume-control-plane-apis" >}}) section of the architectural guidance.