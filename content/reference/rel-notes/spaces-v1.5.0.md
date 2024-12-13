---
title: "Spaces v1.5.0"
version: "v1.5.0"
date: 2024-07-01
tocHidden: true
product: "spaces"
---
<!-- vale off -->

#### Highlights

- We've expanded the observability feature by adding Spaces-level logs collection configurable through helm values. We
  also added the healthcheck extension and liveness probe to the OpenTelemetry Collector.
- We have a new feature enabled by default that updates the ConfigMap `crossplane-versions-public` in the
  `upbound-system` namespace. Whenever a new security or fix release is published, the ConfigMap will be updated. You
  can disable this feature with `controller.crossplane.versionsController.enabled.false` when running in disconnected
  self-hosted Spaces.

#### What's Changed

- We now expose a metrics port on vcluster-etcd containers.
- We removed network policies that block egress from a control plane's functions.
- We removed the legacy OIDC flags authenticator deprecated in Spaces v1.3.0.

<!-- vale on -->
