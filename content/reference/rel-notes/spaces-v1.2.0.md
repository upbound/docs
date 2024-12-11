---
title: "Spaces v1.2.0"
version: "v1.2.0"
date: 2024-02-01
tocHidden: true
product: "spaces"
---

#### What's Changed

- We introduced a new concept called `control plane groups` within a Space. Technically, all `kind: controlplane`
  resources are now namespace-scoped objects (as opposed to previously being cluster-scoped).
- Control planes now offer auto-upgrade channels (`rapid`, `stable`, `patch`, and `none`), giving users control over
  what pace their control plane's Crossplane version automatically upgrades to. `None` gives users total control over
  when to upgrade the Crossplane version in a managed control plane.
- Alpha suppport for a new aggregate query API that can be used to query state across one or more control planes in a
  group.
- Alpha support for built-in multi-control plane secrets management. Define new `SharedSecrets` and `SharedSecretStores`
  within a control plane group to selectively provision secrets from an external store--such as Vault--into the control
  planes in the group.
- Support for OIDC auhentication flows when interacting directly with a managed control plane in a Space.
- new `up` CLI commands to migrate open soure Crossplane or UXP instances into a managed control plane in a Space.
