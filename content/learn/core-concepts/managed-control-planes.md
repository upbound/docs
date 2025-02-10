---
title: Managed Control Planes
weight: 2
description: Fully isolated Crossplane control plane instances that Upbound manages for you
aliases:
    - concepts/mcp
---

Managed control planes (MCPs) are fully isolated Crossplane control plane instances that Upbound manages for you. This means:

- the underlying lifecycle of infrastructure (compute, memory, and storage) required to power your instance.
- scaling of the infrastructure,
- the maintenance of the core Crossplane components that make up a managed control plane.

This lets users focus on building their APIs and operating their control planes, while Upbound handles the rest. Each managed control plane has its own dedicated API server connecting users to their control plane.