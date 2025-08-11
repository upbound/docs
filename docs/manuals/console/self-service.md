---
title: Crossplane WebUI
sidebar_position: 2
description: The Crossplane WebUI
---

The Crossplane Web UI is a local, read-only dashboard for inspecting and understanding the behavior of your UXP-based control plane right from within your cluster.

This dashboard provides visibility into key Crossplane resources, pipelines, and controller behavior, with a focus on helping developers and platform operators reason about what’s happening inside their control planes without requiring access to cloud-hosted systems.

Note: This is a local Web UI that runs inside the same cluster as your UXP installation. For multi-cluster or enterprise-level management, see the Upbound Console.

## Key Features of the Crossplane WebUI Include
- Local, cluster-scoped Web UI that is 1:1 with a UXP instance
- Introspect Crossplane v2 control planes and AI-powered pipelines
- View real-time structure of Operations, Agents, and Function Pipelines
- Compatible with up project run and up project test workflows
- Easily view composed resources, function server packages, and more

## Installation
The Crossplane WebUI comes pre-installed when you install your UXP 2.0 instance via a helm chart.

## Version Compatibility
Each version of the Web UI is explicitly tied to a corresponding version of UXP. Thus, upbound/crossplane-web-ui:v1.0.x works with upbound/crossplane:v1.0.x and this ensures feature parity across UXP and the dashboard.

## CLI Integration
You can launch or manage the Web UI directly from the Upbound CLI 

```
    # Open the dashboard
    up uxp web-ui open

    # Disable the dashboard
    up uxp web-ui disable

    # Re-enable the dashboard
    up uxp web-ui enable
```

When using up project run or up project test (for local ephemeral development clusters), the Web UI is automatically configured into the local cluster.

## Dashboard Views
The Crossplane Web UI provides a read-only visualization layer similar to the Control Plane Explorer in the Upbound Cloud Console, with enhancements for XPv2:

You can
- View installed controller packages and associated CRDs
- See all resources composed by Crossplane, including those with OwnerRef metadata
- Visualize Operations and inspect function pipelines: Understand how functions interact with specific XRs (Composite Resources) and MRs (Managed Resources)
 
The Crossplane WebUI is scoped to UXP clusters only. It does not support
- Spaces
- Teams or Groups
- Authentication or account-based views
