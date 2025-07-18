---
title: Deploy self-managed UXP
description: "Learn best practices for UXP in your production environment"
sidebar_position: 1
---

Upbound Crossplane requires a Kubernetes cluster. You can run Upbound Crossplane in any Kubernetes environment, whether that is a managed Kubernetes service as well as in bare-metal environments. Upbound recommends using Helm to install a self-managed instance of Upbound Crossplane.

:::tip

Looking for a managed Crossplane experience? Read about running Upbound Crossplane in a [Spaces environment][spaces]

:::

## Install Upbound Crossplane

<Tabs>
<TabItem value="Helm" label="Helm">


1. Add the `upbound-stable` chart repository:
```bash
helm repo add upbound-stable https://charts.upbound.io/stable && helm repo update
```
2. Install Upbound Crossplane:
```bash
helm install crossplane --namespace crossplane-system --create-namespace upbound-stable/universal-crossplane --devel
```

:::note

Helm requires the use of `--devel` flag for versions with suffixes, like `v2.0.0-up.1`. The Helm repository Upbound uses is the stable repository, so use of that flag is only a workaround. You will always get the latest stable version of Upbound Crossplane.

:::

</TabItem>
<TabItem value="up CLI" label="up CLI">

Make sure you have the up CLI installed and that your current kubeconfig context is pointed at the desired Kubernetes cluster, then run the following command:
```bash
up uxp install
```

</TabItem>
</Tabs>

## Upgrade from open-source Crossplane

In order to upgrade from open-source Crossplane, the target UXP version has to match the Crossplane version until the `-up.N` suffix. For example, you can upgrade from Crossplane `v1.2.1` only to a UXP version that looks like `v1.2.1-up.N` but not to a `v1.3.0-up.N`. In that scenario, you'd need to upgrade to open-source Crossplane `v1.3.0` and then UXP `v1.3.0-up.N`.

<Tabs>
<TabItem value="Helm" label="Helm">

```bash
helm upgrade crossplane --namespace crossplane-system upbound-stable/universal-crossplane --devel
```

</TabItem>
<TabItem value="up CLI" label="up CLI">

```bash
up uxp upgrade -n crossplane-system
```

</TabItem>
</Tabs>

## Add a license to enable commercial features

Read [license management][license-management] to learn how to add a license to unlock commercial features in Upbound Crossplane.

[spaces]: /manuals/spaces/overview
[license-management]: license-management
