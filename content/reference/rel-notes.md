---
title: Release Notes
weight: 1
description: "Release notes for Upbound Spaces"
---

Find below the changelog for Upbound the product and release notes for self-hosted feature of Upbound, [Spaces]({{< ref "spaces" >}}).

<!-- vale off -->

## Spaces release notes

### Spaces v1.8.0

Released October 8th, 2024

#### What's Changed

**Warning**

Please be aware of the following changes:

- Spaces is no longer published to Google Artefact Registry and can only be accessed via xpkg.upbound.io.
- We've removed the following unused fields from the ControlPlane CRD:
    - spec.managementPolicies
    - spec.deletionPolicy
    - spec.publishConnectionDetailsTo
- User name, groups, uid and extra keys of `user.Info` originating from the host cluster (i.e. any host cluster identity) are all now prefixed with `upbound:spaces:host:` when that identity is used within a control plane. In Spaces v1.7 and below, no such prefix was added to groups from host cluster client certificates and tokens, so **any RBAC rules within a control plane that refers to a user group from a host cluster identity need to be updated to add that prefix.**

#### Features and Enhancements

- **MCPs**: 
  - Crossplane v1.17 is added to the list of supported MCP versions.
  - Dropped the HEALTHY and added more details to MESSAGE column in the control plane get/list output to better communicate the status of the control planes.
    
- **Query API**: 
    - Added ability to deploy and wire a CloudNativePG-powered Postgres Cluster for Query API directly from the helm chart.
      
- **IAM**:
    - The `controlPlanes.mxpController.pod.customLabels` Helm parameter was added to help configure workload identities for shared secrets on EKS, AKS & GKE clusters.
    - The `controlPlanes.sharedSecrets.serviceAccount.customAnnotations` and `controlPlanes.sharedSecrets.pod.customLabels`  Helm parameters was added to help configure workload identities for shared secrets on EKS, AKS & GKE clusters.
    - Support was added for workload identity-based authentication schemes for Spaces billing on EKS, AKS & GKE clusters.
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
  - Added control plane state metrics to track the number of all / synced / ready / healthy / deleting / degraded and stuck in provisioning or deleting control planes.
  
#### Fixed Bugs

- Added missing priorityClass for telemetry-spaces-logs daemonset.
- Fixed an issue where SharedTelemetryConfig would endlessly reconcile.
- Fixed an issue with SharedTelemetryConfig Datadog exporter failing with 413. The issue is not fully fixed but has been remediated by removing the metrics that were too big for Datadog to handle.

### Spaces v1.7.2

Released September 13th, 2024.

#### What's Changed

- Fixed a bug in Spaces Chart's pre-upgrade hook where the backOffLimit was incorrectly declared.

### Spaces v1.7.1

Released September 12th, 2024.

#### What's Changed

- Fixed a bug in Apollo where the right column for owners query was not displayed correctly.
- Fixed a bug in Apollo to ensure that requests do not fail when debug output encounters an issue.
- Fixed a bug in MXP-Gateway to prevent logging of PII, and granted admins & editors the privilege to view logs for controlplane pods.
- Fixed a bug in Spaces Chart related to the pre-upgrade hook.
- Fixed a bug in Crossplane-Versions-Public configmap to allow public querying.

### Spaces v1.7.0

Released September 2nd, 2024.

#### API Changes
- Added v1alpha2 of the Query API, which supports a richer set of filters.

#### What's New
- **OCI Artifact Support in Upbound Registry**: We are excited to announce that the Spaces Helm Chart and images are now shipped as OCI artifacts by default, hosted in the Upbound central registry. You can access these at `xpkg.upbound.io/spaces/artifacts`.

  **Important**: To pull the Helm Chart and images from the new OCI location, you will need to obtain a new pull token from your Upbound account representative.

  To update your pull secret, follow these steps:

  1. **Delete the existing pull secret**:
     ```bash
     kubectl delete -n upbound-system upbound-pull-secret
     ```
  2. **Re-create the upbound-pull-secret**:
     ```bash
     kubectl -n upbound-system create secret docker-registry upbound-pull-secret \
     --docker-server=https://xpkg.upbound.io \
     --docker-username="$(jq -r .accessId $SPACES_TOKEN_PATH)" \
     --docker-password="$(jq -r .token $SPACES_TOKEN_PATH)"
     ```

  **Start the Helm-Chart upgrade**:

  1. **Log in to the OCI Registry**:
     ```bash
     jq -r .token $SPACES_TOKEN_PATH | helm registry login xpkg.upbound.io -u $(jq -r .accessId $SPACES_TOKEN_PATH) --password-stdin
     ```
  2. **Upgrade Spaces software from the new location**:
     ```bash
     helm -n upbound-system upgrade --install spaces \
       oci://xpkg.upbound.io/spaces-artifacts/spaces \
       --version "${SPACES_VERSION}" \
       --set "ingress.host=${SPACES_ROUTER_HOST}" \
       --set "clusterType=${SPACES_CLUSTER_TYPE}" \
       --set "account=${UPBOUND_ACCOUNT}" \
       --set "authentication.hubIdentities=true" \
       --set "authorization.hubRBAC=true"
     ```

- **Helm Repository Deprecation**: This release marks the final time the Spaces Helm Chart will be published to the Upbound Helm repository. All users are encouraged to migrate to the new OCI artifact format to ensure uninterrupted access to future updates.

  If you need additional time to prepare for this transition, you can still use the old registry with this release. To do so, you must explicitly set the registry:

  ```bash
  helm -n upbound-system upgrade --install spaces \
    oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
    --version "${SPACES_VERSION}" \
    --set "registry=us-west1-docker.pkg.dev/orchestration-build/upbound-environments" \
    --set "ingress.host=${SPACES_ROUTER_HOST}" \
    --set "clusterType=${SPACES_CLUSTER_TYPE}" \
    --set "account=${UPBOUND_ACCOUNT}" \
    --set "authentication.hubIdentities=true" \
    --set "authorization.hubRBAC=true"
  ```

  **Note**: This will be the last version that supports the old registry. We will discontinue publishing updates to it after Spaces 1.8.0.

---

We appreciate your cooperation and understanding during this transition. Should you have any questions or require further assistance, please reach out to your Upbound account representative.


- **Simplified Installation Requirements**: This release simplifies the installation process for the Spaces Helm Chart. You no longer need to have Crossplane installed with the provider-helm and provider-kubernetes on your HostCluster. If you were only using this Crossplane setup for Spaces, you can safely remove the remaining artifacts by running the following commands:

  ```bash
  kubectl delete xhostclusters.internal.spaces.upbound.io space-hub
  kubectl patch xhostclusters.internal.spaces.upbound.io space-hub --type=json -p='[{"op": "remove", "path": "/metadata/finalizers"}]'
  ```

  Once these steps are completed, you may proceed to uninstall Crossplane, provider-kubernetes, and provider-helm according to your original installation method.

  **Note**: The `upbound-system` namespace must not be removed, as it is still required for Spaces operations.

#### Other Improvements
- ControlPlane viewers can now list `events.events.k8s.io` resources and can get secrets.
- ControlPlane editors can no longer write ESO and kyverno resources.
- ControlPlane admins can now write kyverno `cleanuppolicies`, `clustercleanuppolicies`, `policyexceptions` and `events.events.k8s.io`.
- ControlPlane Admins can now also update CRDs.

#### Fixed Bugs
- Add priorityClass for telemetry-spaces-logs daemonset
- Cleanup control plane resources out of the system namespace when a control plane is deleted.
- Fix Backup's expired TTL resulting in deadlock.
- Fixed a bug preventing scraping control plane etcd metrics
- Fixed duplicate port warning printed during installation of the Spaces helm chart.
- Observability: fixed an issue where network policies didnt allow the OTEL Collector's Prometheus to scrape some pods for metrics.
- We have optimized our controllers and tested hosting up to 500 control planes with a single Spaces installation.

### Spaces v1.6.1

Released August 14th, 2024.

#### What's Changed

- We fixed a bug with SharedTelemetryConfig that caused panics in the Spaces controller.
- We fixed Backup's expired TTL resulting in deadlock.
- We fixed a bug preventing scraping of metrics from the control plane etcd pods.
- We've added a configuration option to enable Crossplane [SSA Claims alpha feature](https://docs.crossplane.io/latest/concepts/server-side-apply/) in managed control planes.

### Spaces v1.6.0

Released August 6th, 2024.

#### API Changes

- The alpha `spec.source` ControlPlane field has been removed. It's no longer supported.

#### Highlights

- It is now possible to pause and resume control planes through the `spec.crossplane.state` field.
- We optimized control plane provisioning, reducing time to readiness significantly and supporting up to 500 control planes with a single Spaces installation
- We've added alpha support for Query API, allowing performant querying of resources across multiple control planes.
- We've added a new feature that allows you to configure the OpenTelemetry Collector to collect logs from control planes.

#### What's Changed

- We upgraded Kubernetes used internally in spaces components to v1.30. v1beta1 of Structured Authentication Configuration can now be used.
- Starting from Spaces v1.6, users must upgrade sequentially all the minor versions. A pre-upgrade job is added to enforce this requirement.
- Various bug fixes and performance improvements.

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

### MCP connector v0.8.0

Released November 1st, 2024.

#### What's Changed

- Ability to override app cluster id via `clusterID` helm value for migration scenarios.

### MCP connector v0.7.0

Released August 16th, 2024.

#### What's Changed

- Support for server-side apply
- This release ships the helm chart as an OCI artifact in the Upbound registry only, available at `oci://xpkg.upbound.io/spaces-artifacts/mcp-connector`.
- The helm chart will not be available at the Upbound helm repository anymore, please migrate to the OCI artifact.

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
