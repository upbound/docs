---
title: Migrate to Upbound Crossplane
description: Adopt Upbound Crossplane from OSS Crossplane
sidebar_position: 2
---

Upbound Crossplane (UXP) is the AI-native distribution of [Crossplane][crossplane] by Upbound. UXP is based on Crossplane v2.0 and fully compatible with upstream Crossplane.

## Migrate from upstream Crossplane

:::warning

If you're migrating from Crossplane v1.X, read the [breaking changes][breaking-changes] section below before performing the migration from Crossplane v1.X to Upbound Crossplane. 

**Upbound Crossplane is backward compatible with Crossplane v1.X**, provided you're not using these deprecated features.

:::

In order to upgrade from open-source Crossplane, the target UXP version has to match the Crossplane version until the `-up.N` suffix. For example, you can upgrade from Crossplane `v1.2.1` only to a UXP version that looks like `v1.2.1-up.N` but not to a `v1.3.0-up.N`. In that scenario, you'd need to upgrade to open-source Crossplane `v1.3.0` and then UXP `v1.3.0-up.N`.

:::important

Before upgrading to Upbound Crossplane, please ensure all your Packages are using fully qualified images that explicitly specify a registry (`registry.example.com/repo/package:tag`).

Run `kubectl get pkg` to look for any packages that aren’t fully qualified, then update or rebuild any Packages to use fully qualified images as needed.

:::

Update your kubecontext to point at the cluster where you have Crossplane installed. Run the following command:

<Tabs>
<TabItem value="Helm" label="Helm">

```bash
helm upgrade crossplane --namespace crossplane-system upbound-stable/universal-crossplane --devel
```

</TabItem>
<TabItem value="up CLI" label="up CLI">

```bash
up uxp upgrade
```

</TabItem>
</Tabs>

## Breaking changes

For users coming from Crossplane v1.X, Crossplane v2.0 makes breaking changes you should be aware of:

- It removes native patch and transform composition.
- It removes the `ControllerConfig` type.
- It removes support for external secret stores.
- It removes the default registry for Crossplane Packages.

Crossplane deprecated native patch and transform composition in Crossplane v1.17. It’s replaced by composition functions.

Crossplane deprecated the ControllerConfig type in v1.11. It’s replaced by the DeploymentRuntimeConfig type.

Crossplane added external secret stores in v1.7. External secret stores have remained in alpha for over two years and are now unmaintained.

Crossplane v2.0 drops the `--registry` flag that allowed users to specify a default registry value and now requires users to always specify a fully qualified URL when installing packages, both directly via `spec.package` and indirectly as dependencies. Using fully qualified images was already a best practice, but it’s now enforced to avoid confusion and unexpected behavior, to ensure users are aware of the registry used by their packages.

[crossplane]: https://crossplane.io
[breaking-changes]: #breaking-changes

## Migrate to V2 Crossplane features

Crossplane v2.0 supports legacy v1-style XRs and MRs. Most users will be able to upgrade from v1.x to Crossplane v2.0 without breaking changes.
