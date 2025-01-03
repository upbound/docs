---
title: "Spaces v1.9.5"
version: "v1.9.5"
date: 2024-12-09
tocHidden: true
product: "spaces"
---
<!-- vale off -->

### Bug Fixes

- Fixed a timeout issue in spaces-router while doing authorization checks against the host cluster for ControlPlane requests when hub RBAC is enabled via the  Helm parameter. ([#2074](https://github.com/upbound/spaces/pull/2074), [@ulucinar](https://github.com/ulucinar))
- Pin in-chart PostgreSQL cluster to 16 and wire down image pull secrets to it too. ([#2077](https://github.com/upbound/spaces/pull/2077), [@phisco](https://github.com/phisco))
- Avoid noisy restarts of apollo-syncer by retrying with backoff before erroring out. ([#2028](https://github.com/upbound/spaces/pull/2028), [@github-actions[bot]](https://github.com/apps/github-actions))
- Avoid resetting apollo syncers' passwords on every reconciliation, preventing frequent syncers restarts. ([#2036](https://github.com/upbound/spaces/pull/2036), [@github-actions[bot]](https://github.com/apps/github-actions))

### Security

- Spaces chart now installs a network policy that allows ingress traffic to the  pod's port 8443 only from the  controller pod or the connect agent pod. The namespace and the pod labels of the  controller can be specified using the  and the  Helm chart parameters, respectively. The pod labels for the connect agent can be specified using the  Helm chart parameter. ([#2045](https://github.com/upbound/spaces/pull/2045), [@ulucinar](https://github.com/ulucinar))
- Always enforce external authz for control plane requests ([#2050](https://github.com/upbound/spaces/pull/2050), [@github-actions[bot]](https://github.com/apps/github-actions))

### Enhancements

- ControlPlanes now expose the time at which they first became Available. ([#2037](https://github.com/upbound/spaces/pull/2037), [@github-actions[bot]](https://github.com/apps/github-actions))
- SpaceBackups now will only skip just created controlplanes instead of the ones not ready. ([#2044](https://github.com/upbound/spaces/pull/2044), [@github-actions[bot]](https://github.com/apps/github-actions))
- UXP images now configures registry authentication for private registry Spaces deployments([#2039](https://github.com/upbound/spaces/pull/2039), [@github-actions[bot]](https://github.com/apps/github-actions))

## Full changelog

* [Backport release-1.9] fix(apollo/syncer): retry with backoff before erroring out on connection by @github-actions in https://github.com/upbound/spaces/pull/2028
* [Backport release-1.9] feat: set ControlPlanes'  by @github-actions in https://github.com/upbound/spaces/pull/2037
* [Backport release-1.9] configure registry auth for tag listing and UXP image pulls in private registry Spaces deployments by @github-actions in https://github.com/upbound/spaces/pull/2039
* [Backport release-1.9] fix(apollo): avoid reconciling if secret didn't change by @github-actions in https://github.com/upbound/spaces/pull/2036
* [Backport release-1.9] Add network policy to allow ingress traffic to spaces-router pod only from ingress controller & connect agent by @ulucinar in https://github.com/upbound/spaces/pull/2045
* [Backport release-1.9] Never skip extauthz, it's our gatekeeper to spaces, from internet. by @github-actions in https://github.com/upbound/spaces/pull/2050
* [Backport release-1.9] feat(spacebackup): only skip just created controlplanes by @github-actions in https://github.com/upbound/spaces/pull/2044
* [Backport release-1.9] Set a timeout of 10s for gRPC requests to envoy's ext_authz HTTP filter by @ulucinar in https://github.com/upbound/spaces/pull/2074
* [Backport release-1.9] feat(apollo): pin default postgres image to 16 by @phisco in https://github.com/upbound/spaces/pull/2077

**Full Changelog**: https://github.com/upbound/spaces/compare/v1.9.4...v1.9.5
test

<!-- vale on -->
