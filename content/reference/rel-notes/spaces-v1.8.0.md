---
title: "Spaces v1.8.0"
version: "v1.8.0"
date: 2024-10-08
tocHidden: true
product: "spaces"
---
<!-- vale off -->

#### What's Changed

**Warning**

Please be aware of the following changes:

- Spaces is no longer published to Google Artefact Registry and can only be accessed via xpkg.upbound.io.
- We've removed the following unused fields from the ControlPlane CRD:
    - spec.managementPolicies
    - spec.deletionPolicy
    - spec.publishConnectionDetailsTo
- User name, groups, uid and extra keys of `user.Info` originating from the host cluster (i.e. any host cluster
  identity) are all now prefixed with `upbound:spaces:host:` when that identity is used within a control plane. In
  Spaces v1.7 and below, no such prefix was added to groups from host cluster client certificates and tokens, so **any
  RBAC rules within a control plane that refers to a user group from a host cluster identity need to be updated to add
  that prefix.**

#### Features and Enhancements

- **MCPs**:
    - Crossplane v1.17 is added to the list of supported MCP versions.
    - Dropped the HEALTHY and added more details to MESSAGE column in the control plane get/list output to better
      communicate the status of the control planes.

- **Query API**:
    - Added ability to deploy and wire a CloudNativePG-powered Postgres Cluster for Query API directly from the helm
      chart.

- **IAM**:
    - The `controlPlanes.mxpController.pod.customLabels` Helm parameter was added to help configure workload identities
      for shared secrets on EKS, AKS & GKE clusters.
    - The `controlPlanes.sharedSecrets.serviceAccount.customAnnotations` and
      `controlPlanes.sharedSecrets.pod.customLabels`  Helm parameters was added to help configure workload identities
      for shared secrets on EKS, AKS & GKE clusters.
    - Support was added for workload identity-based authentication schemes for Spaces billing on EKS, AKS & GKE
      clusters.
    - Added support for authenticating Host Kubernetes ServiceAccounts in Spaces API and Control Planes
    - Filter lists of namespaces and controlplanes in Spaces API to those the user has access to.
    - Mxp-gateway now uses the original user of the request being forwarded to a ControlPlane or xgql.
    - There is no more any need to populate the `upbound.io/aud` userinfo extra in structured auth config for OIDC.

- **Backup & restore**:
    - Deletion policy `Delete` for `Backups` using `Secrets` for credentials will now be respected.

- **Shared Secrets**:
    - External-secrets operator Helm chart is bumped to version 0.9.20.

- **Administration**:
    - Health checks were added to the spaces-controller pods.
    - Added control plane state metrics to track the number of all / synced / ready / healthy / deleting / degraded and
      stuck in provisioning or deleting control planes.

#### Fixed Bugs

- Added missing priorityClass for telemetry-spaces-logs daemonset.
- Fixed an issue where SharedTelemetryConfig would endlessly reconcile.
- Fixed an issue with SharedTelemetryConfig Datadog exporter failing with 413. The issue is not fully fixed but has been
  remediated by removing the metrics that were too big for Datadog to handle.

<!-- vale on -->
