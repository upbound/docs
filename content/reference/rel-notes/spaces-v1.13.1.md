---
title: "Spaces v1.13.1"
version: "v1.13.1"
date: 2025-11-06
tocHidden: true
product: "spaces"
version_sort_key: "0001.0013.0001"
---
<!-- vale off -->

> [!WARNING]
> Latest Crossplane version supported is now 1.20, this means the oldest supported version is 1.18, so if you have Controlplanes pinned to `1.17.x`, please update them before upgrading, otherwise they'll be set as degraded.

## Important changes

- Bump UXP supported version to 1.20.
- The ESO version we use for SharedSecretStore feature is updated to `v0.16.2` and with this version bumps the `ExternalSecret`, `ClusterSecretStore` and all External Secrets provider versions to `v1`.
- SharedSecrets is now considered GA and enabled by default.
- SharedTelemetry - removed control plane system components(Spaces internals, etcd...) telemetry from SharedTelemetry. Self-hosted Spaces admins can still turn it back on by setting the  `observability.collectors.includeSystemTelemetry` flag to true. ([#2620]
(https://github.com/upbound/spaces/pull/2620), [@lsviben](https://github.com/lsviben))

### Vcluster changes
VCluster has been upgraded from v0.22.3 to v0.24.1. There are no API changes introduced through this upgrade.

Control Plane vCluster memory limits are now unset. In v1.12 release, we bumped the vCluster version and that caused the 3 vcluster system pods (syncer, api-server, and controller) to merge into just one pod. Previously, we used to not memory limit the api-server and use the autoscaler to manage its memory requests. With 1.12, as all the vCluster components were running in 1 pod, 1 container, we limited the memory
 and had the autoscaler also manage the memory limits, based on the number of CRDs in the control plane.

  In the meantime, we noticed that if there is a sudden surge of CRDs, the vCluster pod can run out of memory(including the api-server) before the autoscaler can react to the rise of CRDs, thus making it unable to get the CRD number and autoscale.

  This is why we are now unsetting the vCluster memory limits and will monitor further vCluster improvements.

## Features

- Added the `externalTLS` Helm parameter tree to facilitate easier configuration for a custom external certificate.
- Allow control-plane editors and admins to delete pods.
- Expose runtime latest versions information in crossplane-versions-public configmap.
- Moved CoreDNS out of the control plane and onto the host cluster
- Moved mxp-gateway and xgql out of the control plane and onto the host cluster
- Upbound controllers package metadata and the ControllerRuntimeConfig spec now support Go text templating. The "ingressHost" template variable is substituted with the Spaces ingress hostname, "controlPlaneName" and "controlPlaneNamespace" are substituted with the associated control plane's name and group name, respectively. ([#2528](https://github.com/upbound/spaces/pull/2528), [@ulucinar](https://github.com/ulucin
ar))


## Bugs

- Added validation to ensure the control plane name does not exceed 63 characters.
- Fixed a bug in how the envoy within spaces-router was configured that could result in non-deterministic behavior. Now envoy will allocate workers based on the CPU limits it is provided.
- Spaces-controller now runs with leader-election enabled even if it's not configured in HA mode with multiple replicas.

## Chores

- Dropped `controlPlanes.api`, `controlPlanes.controller` and `controlPlanes.syncer` parameter trees in the helm chart interface and introduced `controlPlanes.vcluster` to align with the latest vcluster version's combined pod architecture.
- Mxp-bootstrapper is now removed.
- Removed the mxp-gateway component to simplify the communication architecture.

<!-- vale on -->
