---
title: "Spaces v1.6.0"
version: "v1.6.0"
date: 2024-08-06
tocHidden: true
product: "spaces"
---
<!-- vale off -->

#### API Changes

- The alpha `spec.source` ControlPlane field has been removed. It's no longer supported.

#### Highlights

- It is now possible to pause and resume control planes through the `spec.crossplane.state` field.
- We optimized control plane provisioning, reducing time to readiness significantly and supporting up to 500 control
  planes with a single Spaces installation
- We've added alpha support for Query API, allowing performant querying of resources across multiple control planes.
- We've added a new feature that allows you to configure the OpenTelemetry Collector to collect logs from control
  planes.

#### What's Changed

- We upgraded Kubernetes used internally in spaces components to v1.30. v1beta1 of Structured Authentication
  Configuration can now be used.
- Starting from Spaces v1.6, users must upgrade sequentially all the minor versions. A pre-upgrade job is added to
  enforce this requirement.
- Various bug fixes and performance improvements.

<!-- vale on -->
