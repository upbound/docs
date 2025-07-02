---
title: Managed Control Planes
sidebar_position: 1
description: Fully isolated Crossplane control plane instances that Upbound manages
  for you
draft: true
---

Control planes are fully isolated Crossplane control plane instances that Upbound manages for you. This means:

- The underlying lifecycle of infrastructure (compute, memory, and storage) required to power your instance.
- Scaling of the infrastructure,
- The maintenance of the core Crossplane components that make up a control plane.

This lets users focus on building their APIs and operating their control planes,
while Upbound handles the rest. Each control plane has its own dedicated
API server connecting users to their control plane.

For more information, review the[control plane documentation][control-plane-documentation].


[control-plane-documentation]: /operate/control-planes
