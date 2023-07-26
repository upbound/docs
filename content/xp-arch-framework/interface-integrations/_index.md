---
title: "Interface Integrations"
weight: 40
description: "A guide for how to integrate control planes with a variety of interfaces"
---

Crossplane sits at the core of your platform. As a result, there are about six areas you may need to think about integrating with. The integrations into grouped into following:

- [Platform frontends]({{< ref "xp-arch-framework/interface-integrations/platform-frontends.md" >}})
- [Git and GitOps]({{< ref "xp-arch-framework/interface-integrations/git-and-gitops.md" >}})
- [Secret Management]({{< ref "xp-arch-framework/interface-integrations/secrets-management.md" >}})
- [Policy Engines]({{< ref "xp-arch-framework/interface-integrations/policy-engines.md" >}})
- [Platform Continuity]({{< ref "xp-arch-framework/interface-integrations/platform-continuity.md" >}})
- [Monitoring and Observability]({{< ref "xp-arch-framework/interface-integrations/monitoring-and-observability.md" >}})

## Use the power of the Kubernetes ecosystem

Crossplane has built-in capabilities for some of these areas that you can use out-of-the-box (such as secrets management). For other areas, it's up to users to bring third-party tool chains to integrate with Crossplane and address the particular use case. Because Crossplane exists in the Kubernetes ecosystem, users oftentimes find value in being able to reuse familiar Kubernetes tooling with Crossplane. You can use this to your advantage. This framework provides guidance for how to leverage built-in Crossplane capabilities where present, and integrate Crossplane with popular third-party tools when necessary.