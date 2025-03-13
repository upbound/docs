---
title: "Spaces v1.10.2"
version: "v1.10.2"
date: 2025-02-13
tocHidden: true
product: "spaces"
version_sort_key: "0001.0010.0002"
---
<!-- vale off -->

#### What's Changed

- Fixed an issue where SharedTelemetryConfig would not get reconciled when a secret from its spec.configPatchSecretRefs
  would be modified.
- Added missing network policies for space level telemetry
- Fixed a regression causing x509 certificate validation errors while connecting a control using ArgoCD plugin.

<!-- vale on -->
