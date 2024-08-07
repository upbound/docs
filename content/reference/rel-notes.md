---
title: Release Notes
weight: 150
description: "Release notes for Upbound Spaces" 
---

Find below the changelog for Upbound the product and release notes for self-hosted feature of Upbound, [Spaces]({{< ref "spaces" >}}).

<!-- vale off -->

## Spaces release notes

### Spaces v1.5.0

Released July 1st, 2024.

#### Highlights

- We've expanded the observability feature by adding Spaces-level logs collection configurable through helm values. We also added the healthcheck extension and liveness probe to the OpenTelemetry Collector.
- We have a new feature enabled by default that updates the ConfigMap `crossplane-versions-public` in the `upbound-system` namespace. Whenever a new security or fix release is published, the ConfigMap will be updated. You can disable this feature with `controller.crossplane.versionsController.enabled.false` when running in disconnected self-hosted Spaces.

#### What's Changed

- We now expose a metrics port on vcluster-etcd containers.
- We removed network policies that block egress from a control plane's functions.
- We removed the legacy OIDC flags authenticator deprecated in Spaces v1.3.0.

### Spaces v1.4.2

Released June 26th, 2024.

#### What's Changed

- We updated the configuration of memory limits on a Space core component to avoid OOMs.
- We updated Kubernetes API, Controller and Manager to `v1.28.6`.

### Spaces v1.4.1

Released June 20th, 2024.

#### What's Changed

- We added missing RBAC permissions for `up migration import` to work against a Spaces MCP.
- We improved the reliability of group creation in a connected self-hosted space.
- We fixed a bug impacting hub authorization when a Space is deployed on a Google Kubernetes Engine (GKE) cluster.

### Spaces v1.4.0

Released June 7th, 2024.

#### Highlights

- We've introduced a new alpha feature of Upbound IAM: Upbound RBAC. Upbound RBAC allows for a unified authentication and authorization model across Upbound. Users who operate single-tenant Cloud or Disconnected Spaces can continue to use the Kubernetes-native RBAC. Upbound RBAC allows users to control access in the Upbound Console down to the local Space. The new `ObjectRoleBinding` API type represents these Upbound RBAC role bindings in the Space locally.
- We've extended the alpha observability feature which shipped in Spaces `v1.3.0`. Observability is now also available at the Space level, which lets users observe Spaces machinery. To enable this feature, set the `features.alpha.observability.enabled` flag to `true` when installing Spaces.

#### What's Changed

- We enabled the Crossplane [Usages](https://docs.crossplane.io/latest/concepts/usages/) alpha feature in managed control planes.
- Space admins can now pass custom service account annotations to Crossplane service account.
- We fixed some bugs related to authentication and single-tenant Spaces when in Disconnected mode.
- We now allow scaling up core control plane components via helm values.
- The latest supported Crossplane minor version in Spaces was bumped to 1.16.
- Spaces prereq providers have had version bumps to allow for incorporating new metrics emissions from these providers. Provider-kubernetes is bumped to `v0.14.0` and provider-helm to `v0.19.0`.
- Kube-native Hub authentication and authorization has been enabled by default.

### Spaces v1.3.1

Released May 7th, 2024.

#### Highlights

- This release fixes some Identity and Access Management related issues.

### Spaces v1.3.0

Released April 30th, 2024.

#### Highlights

- Control Plane Groups: Introducing Control Plane groups and Shared APIs for managing multiple control planes and related resource types, streamlining operations across environments.
- Automated Crossplane Upgrades: Implementing release channels for automated upgrades of Crossplane versions, ensuring Control planes remains up-to-date by getting latest patches automatically.
- Unified IAM: Unified identity and access management experience to manage access controls to everything within Spaces.
- Performance and Stability Improvements: Enhancements to system performance and stability to ensure a smoother and more reliable experience.

#### Alpha Features

- Aggregate Query API: Enchanced experience for querying one or more Control Planes with Aggregate Query API.
- External Secret Stores: Introducing the SharedSecretStore API, supporting external secret management.
- Upbound Policy: Introducing SharedUpboundPolicy API for centralized policy management across control planes.
- Observability: ShareTelemetryConfig API enabling exporting one or more telemetry for one or more control planes to the desired observability backends.
- Backup and Restore: Implementing SharedBackup and SharedBackupSchedule APIs to provide robust backup and restore functionality control planes.
- Importing/Exporting Control Planes: Enabling migrating in or out from Spaces control planes.

### Spaces v1.2.4

Released March 13th, 2024.

#### What's Changed

- Tweaked the control plane API autoscaler configuration per recent performance testing.
- Fixed an issue causing the kube-state-metrics pods being restarted per CRD deployed in the control plane.
- Optimized the control plane deletion process to reduce the time it takes to delete a control plane.
- Fixed an issue breaking `kubectl logs` command against the control plane API.

### Spaces v1.2.3

Released March 1st, 2024.

#### What's Changed

- This release fixes an issue that affected control planes' ability to provision in non-kind cluster environments.

### Spaces v1.2.2

Released March 1st, 2024.

#### What's Changed

- This release contains several improvements to improve control plane orchestration performance. It addresses an issue where control plane provisioning time degraded when multiple control planes were provisioned in parallel.
- The latest supported minor Crossplane version is now `v1.15`.

### Spaces v1.2.1

Released February 8th, 2024.

#### What's Changed

- Fixed an issue causing the `controlplane` resources having a benign `crossplane.io/external-create-failed` annotation.
- Fixed an issue causing hotlooping version controller when a `controlplane` is deleted.
- Other stability and performance improvements.

### Spaces v1.2.0

Released February 1st, 2024.

#### What's Changed

- We introduced a new concept called `control plane groups` within a Space. Technically, all `kind: controlplane` resources are now namespace-scoped objects (as opposed to previously being cluster-scoped).
- Control planes now offer auto-upgrade channels (`rapid`, `stable`, `patch`, and `none`), giving users control over what pace their control plane's Crossplane version automatically upgrades to. `None` gives users total control over when to upgrade the Crossplane version in a managed control plane.
- Alpha suppport for a new aggregate query API that can be used to query state across one or more control planes in a group.
- Alpha support for built-in multi-control plane secrets management. Define new `SharedSecrets` and `SharedSecretStores` within a control plane group to selectively provision secrets from an external store--such as Vault--into the control planes in the group.
- Support for OIDC auhentication flows when interacting directly with a managed control plane in a Space.
- new `up` CLI commands to migrate open soure Crossplane or UXP instances into a managed control plane in a Space.

### Spaces v1.1.0

Released October 10th, 2023.  

#### What's Changed

- Alpha support for enabling External Secrets Operator in a control plane.
- Control plane api-server autoscaling based on CRD count.
- Universal Crossplane was bumped from `v1.13.2-up.1` to `v.1.13.2-up.2` for all control planes.
- new `up` CLI commands to interact with managed control planes in a Space.

### Spaces v1.0.1

Released August 31st, 2023.

#### What's Changed

- Export mxp-gateway metrics via otlp-collector

### Spaces v1.0.0

Released August 28th, 2023.  

#### What's Changed

- controllers: patch against original object
- Promote APIs to v1beta1
- apis: clarify resource descriptions
- apis/mxp: minimize unused xr fields
- Stop routing internal traffic in the hub hostcluster through the ingress-controller
- XManagedControlPlane and hub XHostCluster XRs to v1beta1
- Introduce CRD lifecycle management through mxe-apis
- Add external-name to xhostclusterservices composed resource
- Stop logging bearer token at debug
- Clean up misc items
- Update XHostClusterServices resource
- Minor adjustments to destroy process
- Enable git source by default and keep it optional
- kube-control-plane: bump to kube 1.28
- ArgoCD controller to register ControlPlane as target
- vcluster: bump memory limit to 400Mi after seeing 270Mi in reality
- mxp-gateway: use client-go's transport cache
- Bring vcluster-k8s in tree
- Return error instead of panic if ctp connection secret ref is unset
- vcluster: disable its liveness probe pointing to kube-apiserver
- Observability networkpolicy fixes
- Fix ssh auth with known_hosts and sub-directory discovery
- git: fix commit ref bugs
- git: run through cleanup even if controlplane is not ready
- Fix otlp-collector networkpolicy ports

## Control plane connector release notes

### MCP connector v0.6.1

Released June 29th, 2024.

#### What's Changed

- Fixed a regression where connector makes only a single kind for a given group/version available to the application cluster.

### MCP connector v0.6.0

Released June 15th, 2024.

#### What's Changed

- We started shipping the helm chart as an OCI artifact in the Upbound registry, available at `oci://xpkg.upbound.io/spaces-artifacts/mcp-connector`.
- This the latest release where we will publish the helm chart to the Upbound helm repository, please migrate to the OCI artifact.

### MCP connector v0.5.0

Released June 6th, 2024.

#### What's Changed

- Support for auth with Upbound Identity.
- Upgraded Kubernetes library dependencies from 1.26 to 1.29.

### MCP connector v0.4.0

Released April 29th, 2024.

#### What's Changed

- Add ability to set memory and cpu limits.

### MCP connector v0.3.8

Released March 21st, 2024.

#### What's Changed

- Configured burst and QPS for kube clients to prevent excessive rate limiting.

### MCP connector v0.3.7

Released March 21st, 2024.

#### What's Changed

- Fixed regular expression for managed control plane check for older versions of the Spaces API.

### MCP connector v0.3.6

Released March 15th, 2024.

#### What's Changed

- Updated managed control plane check to support the recent changes in the Spaces API.

<!-- vale on -->