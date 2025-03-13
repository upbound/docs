---
title: "Spaces v1.6.1"
version: "v1.6.1"
date: 2024-08-14
tocHidden: true
product: "spaces"
version_sort_key: "0001.0006.0001"
---
<!-- vale off -->

#### What's Changed

- We fixed a bug with SharedTelemetryConfig that caused panics in the Spaces controller.
- We fixed Backup's expired TTL resulting in deadlock.
- We fixed a bug preventing scraping of metrics from the control plane etcd pods.
- We've added a configuration option to enable
  Crossplane [SSA Claims alpha feature](https://docs.crossplane.io/latest/concepts/server-side-apply/) in managed
  control planes.

<!-- vale on -->
