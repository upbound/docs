---
title: "Spaces v1.13.1"
version: "v1.13.1"
date: 2025-11-06
tocHidden: true
product: "spaces"
version_sort_key: "0001.0013.0001"
---
<!-- vale off -->

#### What's Changed

**Warning - Breaking changes**

- This release contains breaking changes related to the Universal Crossplane version support. The latest supported Crossplane version is now `1.20`, which means the oldest supported version is `1.18`. If you have control planes pinned to `1.17.x`, please update them before upgrading, otherwise they'll be set as degraded.
- The ESO version used for SharedSecretStore feature is updated to `v0.16.2` and with this version bumps the `ExternalSecret`, `ClusterSecretStore` and all External Secrets provider versions to `v1`.
- `controlPlanes.api`, `controlPlanes.controller` and `controlPlanes.syncer` parameter trees have been dropped from the Helm chart interface. The `controlPlanes.vcluster` parameter tree should be used instead to align with the latest vcluster version's combined pod architecture.
- Control plane vCluster memory limits are now unset. Previously, memory limits were set and managed by the autoscaler, but sudden surges of CRDs could cause the vCluster pod to run out of memory before the autoscaler could react.

#### Features and Enhancements

Spaces `v1.13.1` contains important bug fixes, security improvements, dependency updates and architectural simplifications. The latest supported Crossplane version is bumped to `1.20` and SharedSecrets is now considered GA and enabled by default. Several components including CoreDNS, mxp-gateway, and xgql have been moved out of the control plane and onto the host cluster for improved performance and reliability.

This release bumps the vcluster dependency to `v0.24.1` with no API changes introduced through this upgrade. The vCluster memory management approach has been revised to prevent out-of-memory issues during CRD surges by unsetting memory limits while continuing to monitor vCluster improvements.

**Universal Crossplane**:
- Bumped the latest supported Universal Crossplane minor version to v1.20.

**SharedSecrets**:
- SharedSecrets is now considered GA and enabled by default.
- ESO version updated to `v0.16.2` with provider versions bumped to `v1`.

**Upbound Controllers**:
- Upbound controllers package metadata and the ControllerRuntimeConfig spec now support Go text templating. The "ingressHost" template variable is substituted with the Spaces ingress hostname, "controlPlaneName" and "controlPlaneNamespace" are substituted with the associated control plane's name and group name, respectively.

**Observability**:
- SharedTelemetry - removed control plane system components (Spaces internals, etcd...) telemetry from SharedTelemetry. Self-hosted Spaces admins can still turn it back on by setting the `observability.collectors.includeSystemTelemetry` flag to true.

**Architecture Improvements**:
- Moved CoreDNS and xgql out of the control plane and onto the host cluster.
- Removed the mxp-gateway and mxp-bootstrapper to simplify the communication architecture.

**Other**:
- Added the `externalTLS` Helm parameter tree to facilitate easier configuration for a custom external certificate.
- Allow control-plane editors and admins to delete pods.
- Expose runtime latest versions information in crossplane-versions-public configmap.

**Bug Fixes**:
- Added validation to ensure the control plane name does not exceed 63 characters.
- Fixed a bug in how the envoy within spaces-router was configured that could result in non-deterministic behavior. Now envoy will allocate workers based on the CPU limits it is provided.
- Spaces-controller now runs with leader-election enabled even if it's not configured in HA mode with multiple replicas.

<!-- vale on -->

