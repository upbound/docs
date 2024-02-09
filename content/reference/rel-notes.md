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

### Spaces v1.2.1

Released February 8st, 2024.

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
<!-- vale on -->
