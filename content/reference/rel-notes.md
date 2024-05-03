---
title: Release Notes
weight: 150
description: "Release notes for Upbound Spaces" 
---

Find below the changelog for Upbound the product and release notes for self-hosted feature of Upbound, [Spaces]({{< ref "spaces" >}}).

<!-- vale off -->

## Upbound product changelog

### Product update 2023-10-24

#### What's Changed

- Improved the control plane dashboard and configuration list by making the table headers sticky, allowing users to scroll through longer lists without losing context.
- Resolved an issue affecting Configurations with dependencies on the latest releases of family providers that prevented users from creating new ProviderConfigs via the UI.
- The console now shows UI create hints on the control plane and configuration list screens for organizations with no control planes or configurations created.
- We fixed the background color of the main navigation tabs to match the page.
- The UI tabs in a managed control plane dashboard now link via url hash. For example, the settings tab renders as `console.upbound.io/org/controlPlanes/org:ctp-name#resources`

## Spaces release notes

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

#### What's Changed

- Controller unification and move to crossplane-runtime logging
- Bump provider kubernetes Objects to v1alpha2
- mxp-xgql: parameterize empty secret creation
- mxe-apollo: add events relation
- fix hotlooping version controller in mxe-controller when a controlplane is deleted
- Fix external create failed annotation by checking Crossplane version in Observe
- Remove hardcoded namespace in xgql configmap
- Remove mxp-xgql empty TLS secret
- Add mxp-gateway support for extra env vars
- Use new mxp-gateway service account bearer token to authorize xgql
- mxe-router/extauth: validate token audience to match controlplane
- mxe-apollo: fix context use
- examples/postgres: fix pgbouncer config not storing instance dependent SCRAM passwords
- Add mxe-api proxying spaces.upbound.io/v1alpha1+v1beta1 and namespaces to kube
- Explicitly deny creates and deletes of workload related resources
- Wire apollo as aggregated apiserver
- mxe-router: add upbound.io as wildcard audience
- Add an auth filter for incoming mxe-api tokens
- Wrap OIDC token to extract audiences
- Enable configuring OIDC against a IdP that is using a self-signed certificate
- Remove Identifier type
- Apollo: misc improvements
- Fix auth when both mxe-api auth and OIDC is used
- Allow for xgql to be toggled on
- Wrap xgql-tls in conditional
- pgbouncer: wire mutual tls with mxe-apollo and vcluster-kine
- Wire klog with a filter to show only client- or server-side throttling
- mxe-api: sanitize objects
- includeTLSSecret is referenced at the incorrect level
- mxe-api: do not filter out status
- Control plane orchestration performance improvements
- Bump the latest supported Crossplane minor to 1.15
- Fix composition templating when backups are not enabled
- mxe-api: add mutating namespace filter
- mxe-apollo: category filters
- xpkgs: fix how kubeFlavor is passed through after perf changes
- Quote annotations in mxp-control-plane templates
- Update GKE Postgres example to use mTLS
- Tweak autoscaling config of controlplane api server and make it configurable
- mxe-api: add missing meta-data
- mxe-api: add generate name to returned objects
- apis: source API types from up-sdk-go
- Fix build issue with licenses and ignore modified files in Kyverno helm chart. 
- Use a recent and pinned image for openssl
- Refactor kube-state-metrics reconciler to watch providers
- mxe-apis: do not filter queries
- Orphan controlplane API resources on delete
- Split mxe-apis/mxe-api/mxe-controller clients between hub and Spaces API
- Misc logger polishing for shared secrets and policy controllers
- Upgrade vCluster to 0.15.7
- Point mxp-gateway back to vcluster syncer
- mxe-controller/initiaize: remove old controlplane rule from mxe-controller mutating webhook
- mxe-api: re-work error handling and filtering
- mxe-apis: fix missing Mutator code and omit more empty fields
- Remove CSA field manager on mxe-controller.upbound.io webhook configuration
- Enable xgql by default so that connected spaces have it
- mxe-api: use * for resources in clusterrole
- fix(mxp-controller): skip sharing shared secret resources when feature is disabled
- Configurable cert manager namespace and HPA version bump
- mxe-api: Accept json patch content-types
- mxp-controller: add native kine/categories
- feat: spaces backup and restore API
- mxe-apollo: fix paging expression to be literals
- mxe-api: expose spaces version information
- mxe-controller: use right client when installing webhooks
- Update xgql and fix version propagation
- Control planes: Disable vcluster telemetry
- Move license building to just on artifact publish
- Spaces Router: Pass down control plane container resource config
- Configure vcluster etcd storage class
- Improve argocd plugin
- Installation: Always use mxe-router-tls for incluster kubeconfig CA
- feat: ControlPlane restore
- feat: move configuration to backups instead of controlpane
- mxe-api: drop all filter and mutation code
- Exclude Spaces-managed resources from backups
- Bump up-sdk-go
- Setup observability pipeline and space level configuration
- fix: bump up-sdk-go and allow passing prefix to backup config
- feat: expose oidc ca bundle secret ref and set env var
- Move /test subdir to project root
- fix: use right condition in webhook for backupschedule
- fix: avoid applying deletion policy for not completed backups
- Tilt: Add helper resource to propagate config and fine grained image building
- Remove secure-registry image build step
- ObjectRoleBinding controller
- Bump kubectl and kube in kind to 1.29.2
- Allow kube native client certificate auth to work with requests to the spaces-router
- mxe-api: fix studdering URL
- allow proxying openapi requests
- Move crd-gates back to dfe7bd2
- Allow mxe-api to back up controlplanes
- setup envoy forwarding for openapi/v3
- Clean up mxe-router extraArgs
- Add support for structured authentication from k/k
- mxe-controller+mxe-api: filter groups
- Introduce ingress-public configmap for referencing the ingress host
- Add authorization group to handlers, discovery, and cleanup API registration
- Skip cabundle reads if the path is unset
- Adds GitHub issue template for feature epics
- Use composite key for cache key in requests to control planes
- Add SpaceObjectRoleBinding API, validation and labels
- Add configuration of vcluster syncer resources
- Delegate to hub api-server for hub identities
- feat(backup): set conditions for all errors
- Remove mxe-hostcluste-gc job
- Bump syncer resource limits
- Bump dependencies to recent versions
- fix: set mxp-healthcheck readiness to false explicitly
- feat: mxp-healthcheck using pod instead of deployment
- Move spaces-composer and function-auto-ready to Helm chart
- mxe-router: add cloud route for cloud-apis
- fix: use patch to update shared backups annotations
- tests: restore scenario
- ci: export kind logs too
- fix: ignore mxp-healthcheck for now
- Revert "Move spaces-composer and function-auto-ready to Helm chart"
- mxe-router: add cache and schema to the hubMgr
- Add support for Postgres account schemas
- Integrate Upbound Identity
- Add backwards support for mxe-api token sent from connect agent
- Default postgres schema to public if unset on MXP
- stability: define and use PriorityClasses for system critical components
- feat(mirror): configure more images to pull from own registry
- feat(kyverno): set kyverno image registry globally to our own gcp-reg
- feat(chartmuseum): add kube-state-metrics to chartmuseum image
- propagate pull secret for coredns
- Composable admission
- mxe-controller: fix admission webhooks to access the Space API, not hub
- SharedTelemetryConfig controller
- Convert vector buffer fields to int
- feat(uxp): switch uxp to v1.15.x and implement registry flag for proxied environments
- feat(chartmuseum): set vector and velero to chartmuseum
- Observability: fix telemetry config template indent
- fix(apollo): client cert secret using right name
- Statically define Upbound IAM auth config
- feat(chartmuseum): switch chartmuseum install to manifests
- fix spaces and connect integration
- Set groups claimMappings for upboundiam and legacyoidc authenticators
- ObjectRoleBinding feature gate and clean up hub authorization toggling
- add cloud-api path handling
- Add extraArgs, extraEnvs, extraVolumes, and extraVolumeMounts to api, controller, and router
- mxe-webhooks: add logical cluster context to request for authorization
- Authentication refactor in spaces-router
- mxe-api: transparently create workspaces on api call
- CAContentProvider interface not nil
- set spacesApiServer.external in all cases
- Observability: otel-collector to use SA with imagePullSecrets
- Policy: add imagePullSecrets to Kyverno release

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