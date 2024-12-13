---
title: "Spaces v1.4.0"
version: "v1.4.0"
date: 2024-06-07
tocHidden: true
product: "spaces"
---
<!-- vale off -->

#### Highlights

- We've introduced a new alpha feature of Upbound IAM: Upbound RBAC. Upbound RBAC allows for a unified authentication
  and authorization model across Upbound. Users who operate single-tenant Cloud or Disconnected Spaces can continue to
  use the Kubernetes-native RBAC. Upbound RBAC allows users to control access in the Upbound Console down to the local
  Space. The new `ObjectRoleBinding` API type represents these Upbound RBAC role bindings in the Space locally.
- We've extended the alpha observability feature which shipped in Spaces `v1.3.0`. Observability is now also available
  at the Space level, which lets users observe Spaces machinery. To enable this feature, set the
  `features.alpha.observability.enabled` flag to `true` when installing Spaces.

#### What's Changed

- We enabled the Crossplane [Usages](https://docs.crossplane.io/latest/concepts/usages/) alpha feature in managed
  control planes.
- Space admins can now pass custom service account annotations to Crossplane service account.
- We fixed some bugs related to authentication and single-tenant Spaces when in Disconnected mode.
- We now allow scaling up core control plane components via helm values.
- The latest supported Crossplane minor version in Spaces was bumped to 1.16.
- Spaces prereq providers have had version bumps to allow for incorporating new metrics emissions from these providers.
  Provider-kubernetes is bumped to `v0.14.0` and provider-helm to `v0.19.0`.
- Kube-native Hub authentication and authorization has been enabled by default.

<!-- vale on -->
