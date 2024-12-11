---
title: "Spaces v1.9.1"
version: "v1.9.1"
date: 2024-11-07
tocHidden: true
product: "spaces"
---

#### What's Changed

{{< hint "note" >}}
Due to a technical glitch there was no 1.9.0 release image, and the first one available in the 1.9.x series is 1.9.1.
{{< /hint >}}

{{< hint "warning" >}}
Starting with Spaces 1.9.x, Spaces with an  Argo CD Gitops integration must update their Argo CD ConfigMap to include `resource.respectRBAC: normal` instead of explicit `resource.exclusions`. Please check [Configure Argo CD]({{<ref "mcp/gitops.md#configure-argo-cd" >}}) section for instructions and details.
{{< /hint >}}

#### Features and Enhancements

- Added optional insecure mode for all Spaces endpoints to allow finer grain control around mTLS policies.
- Added class dimension to all control plane metrics.
- Added new alpha feature, Space Backup, to allow backing up and restoring a Space in case of DR.
- Added a configuration option for enabling Control Plane Crossplane dependency version upgrades.
- Bumped latest supported Crossplane minor version to v1.18.
- External-secrets operator Helm chart is bumped to version 0.10.4.

#### Fixed Bugs

- Added the `controlPlanes.syncer.extraSyncLabels` spaces Helm chart parameter so that any extra labels that you specify
  with a `DeploymentRuntimeConfig` for a Crossplane provider/function can be configured to properly sync in the host
  cluster for the ControlPlane. You may need this for certain workload identity-based authentication schemes for
  authenticating Crossplane provider/function workloads.
- Drop `controlPlanes.uxp.repository` from values, always use registry.
- Fixed Query API failing to define necessary custom functions due to inconsistent ordering.
- Fixed a race when restarting spaces-controller admission webhooks fail with a certificate error.
- Fixed control plane and namespace listing on the ingress if additional non-RBAC authorization is configured on the host
  Kubernetes.
- Fixed the Spaces API endpoint for namespace to make `kubectl get namespaces` work.
- Fixed an issue where SharedTelemetryConfig would endlessly reconcile.
- Fixed an issue with SharedTelemetryConfig datadog exporter failing with 413 error code.
- Move to domain-qualified finalizer for control plane provisioner reconciler, while dropping old ones allowing
  ControlPlanes deletion after Spaces upgrade.
- Respect disabled features for discovery, avoiding unnecessary noise when using kubectl.
