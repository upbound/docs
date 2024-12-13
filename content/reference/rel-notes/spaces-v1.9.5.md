---
title: "Spaces v1.9.5"
version: "v1.9.5"
date: 2024-12-09
tocHidden: true
product: "spaces"
---
<!-- vale off -->

#### What's Changed

#### Bugs fixed
* Fixed a timeout issue in spaces-router while doing authorization checks against the host cluster for `ControlPlane` requests when hub RBAC is enabled via the `authorization.hubRBAC` Helm parameter
* Fixed an issue causing frequent syncers restarts in `Apollo` due to password resets
* Reduced the unnecessary restarts of `Apollo` syncers in case of transient errors
* Pin in-chart PostgreSQL cluster to version 16 and pass image pull secrets, if specified.

#### Security
* Spaces chart now installs a network policy that allows ingress traffic to the spaces-router pod's port `8443` only from the ingress-nginx controller pod or the connect agent pod. The namespace and the pod labels of the ingress-nginx controller can be specified using the `ingress.namespaceLabels` and the `ingress.podLabels` Helm chart parameters, respectively. The pod labels for the connect agent can be specified using the connect.agent.podLabels Helm chart parameter

#### Enhancements
* `ControlPlane`s now expose the time at which they first became `Available` at `.status.firstAvailableAt`
* `SpaceBackups` now will only skip just created controlplanes instead of the ones not ready
* UXP images and associated registry actions are now configured with registry authentication for Spaces deployments using private registries, where the public UXP image is behind auth in the private registry.

<!-- vale on -->
