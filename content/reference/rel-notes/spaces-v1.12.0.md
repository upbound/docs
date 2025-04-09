---
title: "Spaces v1.12.0"
version: "v1.12.0"
date: 2025-04-07
tocHidden: true
product: "spaces"
version_sort_key: "0001.0012.0000"
---
<!-- vale off -->

#### What's Changed

**Warning - Breaking changes**

- This release contains breaking changes related to the vcluster dependency upgrade from v0.15.7 to v0.22.3.
  `controlPlanes.syncer` parameter tree has been renamed as `controlPlanes.vcluster`. The `controlPlanes.api` and
  `controlPlanes.controller` Helm parameter trees have been removed from the `spaces` Helm chart. Customers relying on
  these parameters can now use the `controlPlanes.vcluster` parameter tree.
- The control plane memory auto-scaler for the vcluster API server now sets memory limits on the vcluster `syncer` container
  where `kube-api-server` is now colocated. It sets a limit of 3 times the proposed memory request for the `syncer` container. 

Upgrades to Spaces v1.12.0 should be performed from v1.11.3. Spaces v1.11.2 and prior versions do not include
a synchronization mechanism for `spaces-controller`, potentially leading to upgrade issues.

#### Features and Enhancements
Spaces `v1.12.0` contains important bug fixes, security improvements, dependency updates and introduces support
for Upbound controller packages in private preview. The latest supported Crossplane version is bumped to `1.19.0-up.1`
and the shared backups feature is now enabled by default. Spaces OpenTelemetry collectors for metrics and logs now use
TLS server sockets to secure communications. It's now possible to configure the tolerations for the SharedTelemetry
log collector pods using the `observability.collector.tolerations` Helm parameter.

In order to be able to install Upbound controllers in a control plane, the private preview feature must have been enabled
with the `features.alpha.upboundControllers.enabled=true` Helm parameter and the control plane's Crossplane version must
support controller packages. We currently don't support routing requests to the services installed by
the Upbound controller packages. Support for service routing is planned for future releases.

This release bumps the vcluster dependency to `v0.22.3` which introduces the following breaking changes:
- vcluster's `kube-apiserver` & `kube-controller-manager` now run inside the `vcluster` pod's `syncer` container.
  Their deployments (`vcluster-api` and `vcluster-controller`) no longer exist.
- vcluster `syncer` has behavior changes, notably it now syncs resources from the host cluster back to the virtual cluster.
- `controlPlanes.api` and `controlPlanes.controller` Helm parameter trees have been removed from the `spaces` Helm chart.
  `controlPlanes.syncer` has been renamed as `controlPlanes.vcluster`. `controlPlanes.vcluster` parameter tree should be used instead.
- `vcluster-api` & `vcluster-controller` PDBs are removed (also from existing ControlPlanes).


**Upbound Controllers**:
- Added support for installing Upbound Controller packages as an alpha feature.

**Universal Crossplane**:
- Bumped the latest supported Universal Crossplane minor version to v1.19.

**Observability**:
- Spaces OpenTelemetry collectors for metrics and logs now use TLS server sockets.
- The Helm parameter `observability.collector.tolerations` has been introduced to be able to configure the tolerations
  for the SharedTelemetry log collector pods.

**Shared Backups**:
- Shared backups feature is now enabled by default.

**Other**:
- VCluster Helm chart is now pulled from the OCI registry `xpkg.upbound.io`.
- Added a validation to ensure the control plane name does not exceed 63 characters.

**Bug Fixes**:
- Fixed an issue causing x509 certificate validation errors while connecting a control plane using the ArgoCD plugin.
- Fixed an issue with `up alpha query` working with kinds, properly detecting cycles and setting counts for relationships queries.
- Fixed an issue in Space level telemetry where the collector pod would restart due to the healthcheck extension not being updated to the v0.116.0 configuration.
- Fixed an issue with setting annotations on groups via the Spaces API. Previously setting annotations on groups via the Spaces API were not allowed. Now there is a Spaces Helm parameter to allow setting the desired annotation keys.
- Fixed an issue with control plane restoration where a resource being deleted during backup might cause restoration to fail.
- Fixed an issue that prevents reconciliation of control planes with more than one deprecated finalizer.
- Missing HTTP metrics for internal components are restored.

<!-- vale on -->
