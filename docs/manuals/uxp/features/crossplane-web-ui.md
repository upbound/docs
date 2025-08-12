---
title: Web UI for Crossplane
description: "Learn how to use the Crossplane Web UI"
sidebar_position: 2
draft: true
---

The UXP Web UI is a local, read-only dashboard to inspect and review your
control plane. This dashboard gives you insight into key Crossplane resources,
pipelines, and AddOn behavior.

The Web UI runs in your UXP control plane. For multi-cluster or Enterprise-level
management, review the [Upbound Console][console] documentation. 

With the WebUI you can:

- Review UXP control planes and AI-powered pipelines
- View real-time actions of Operations, Agents, and Function Pipelines
- View composed resources, function server packages, and more

:::note
The UXP WebUI is pre-installed with your UXP instance via Helm chart
:::

## Version compatibility

:::important
The WebUI dashboard is for UXP clusters only. It doesn't support Spaces Teams
or Groups Authentication or account-based views.
:::

The version of WebUI installed in your cluster is tied to it's corresponding UXP
version.

For example, `upbound/crossplane-web-ui:v1.0.x` is compatible with 
`upbound/crossplane:v1.0.x` and ensures feature parity across UXP and the
dashboard.

## Launch the dashboard

Use the `up` CLI to launch the Web UI:

```shell
up uxp web-ui open
```


To stop the Web UI service use:

```shell
up uxp web-ui enable
```


When using up project run or up project test (for local ephemeral development
clusters), the Web UI is automatically configured into the local cluster.

## Dashboard views 
<!-- `todo -->
<!-- Image of views for: -->
<!-- View installed controller packages and associated CRDs -->

<!-- See all resources composed by Crossplane, including those with OwnerRef metadata -->

<!-- Visualize Operations and inspect function pipelines -->

<!-- Understand how functions interact with specific XRs (Composite Resources) and MRs (Managed Resources) -->
<!-- ` -->
[console]: /manuals/console/
