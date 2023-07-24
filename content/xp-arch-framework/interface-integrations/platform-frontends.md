---
title: "Platform Frontends"
weight: 4
description: "A guide for how to integrate control planes with a variety of interfaces"
---

Just like Kubernetes, the default interface to a new Crossplane instance is the [Kubernetes-based API](https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/), typically interacted with via a tool like [kubectl](https://kubernetes.io/docs/reference/kubectl/). Alternatively, users can use any http client such as `curl` to directly access the REST API of their Crossplane's API server.

Most users don't want to directly expose their Crossplane's API server to users. Commandline terminals can be an unfriendly user interface for some, so users may have an interest in connecting their own frontend to their control plane. You are welcome to use any frontend that you like with Crossplane such as if you have built a home-grown web app, or you can integrate frontends like [Backstage](https://backstage.io/) or [Port](https://www.getport.io/).

## Integrating a platform frontend

One of the most common use cases we see users building with Crossplane is an internal developer platform (IDP). A typical IDP has a GUI-based frontend which often provides UI-based form experiences that allows developers to self-service infrastructure and resources.

The job of integrating a platform frontend with your control plane is therefore usually about translating a set of inputs collected from a form and sending that to a control plane. As mentioned above, you could configure your platform frontend to communicate directly with the API server of your control plane. However, we believe the better practice is to instead use your platform frontend to:

1. Collect the inputs you need to build a claim against your API
2. Create the claim .YAML and submit that to the git repo syncing to your control plane
3. A CD engine will apply the claim to your control plane and your control plane will react to the claim.

## Diagram

{{<img src="xp-arch-framework/images/platform-frontend-flow.png" alt="A diagram demonstrating how a platform frontend generically integrates with Crossplane" size="medium" quality="100" align="center">}}

In this flow, your platform doesn't communicate directly with your control plane; instead, it all operates via git, aligned to the recommendations we suggested in the [consuming your control plane API]({{< ref "xp-arch-framework/architecture/architecture-baseline-single#consume-control-plane-apis.md" >}}) section of the architectural guidance.