---
title: "Interface Integrations"
weight: 40
description: "A guide for how to integrate control planes with a variety of interfaces"
---

Crossplane sits at the core of your platform. As a result, there are about ten areas you may need to think about integrating with. We've broken integrations into the following:

- [Platform frontends](platform-frontends)
- [Git and GitOps](git-and-gitops)
- [Secret Management](secrets-management)
- [Policy Engines](policy-engines)
- [Platform Continuity](platform-continuity)
- [Monitoring & Observability](monitoring-and-observability)

## Use the power of the Kubernetes ecosystem

Crossplane has built-in capabilities for some of these areas that you can out-of-the-box (such as secrets management). For other areas, it is up to users to bring 3rd party toolchains to integrate with Crossplane and address the particular use case. Because Crossplane exists in the Kubernetes ecosystem, users oftentimes find value in being able to reuse familiar Kubernetes tooling with Crossplane--you can use this to your advantage. In this framework, we will provide guidance for how to leverage built-in functionality where present, and integrate Crossplane with popular 3rd party tools when necessary.