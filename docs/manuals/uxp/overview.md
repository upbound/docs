---
title: UXP Overview
sidebar_label: Overview
sidebar_position: 1
description: Upbound Crossplane is the AI-native distribution of Crossplane by Upbound
---

Upbound Crossplane (UXP) is the AI-native distribution of [Crossplane][crossplane] by Upbound. Crossplane is a framework for building your own [control plane][control-plane].

:::tip

Upbound Crossplane is a key ingredient in building out a platform powered by an **intelligent control plane architecture.** Learn about how UXP safely brings AI intelligence into your control plane's reconcile loop with [Intelligent Control Planes][intelligent-control-planes].

:::

## Concepts

Because Upbound Crossplane is a distribution of upstream Crossplane, you'll find UXP shares the same concepts as upstream. UXP also introduces brand new concepts, such as AI-powered [Intelligent Control Planes][intelligent-control-planes] and [Add-Ons][add-ons]. 

Learn about UXP concepts by reading the [concept documentation][concepts].

## Features

Upbound Crossplane comes with a number of features that help you start, run, and scale your control plane. Learn about the features in UXP by reading the [feature documentation][features].

UXP is available to any users under Upbound's Community plan. Commercial licenses are available. Some features are available for Community plan users, while others require a commercial license. See [license management][licensing] for more details.

## Commercial-only Features

Users on a **Standard Plan** or greater have access to commercial features that enhance the reliability, efficiency, and supportability of their control planes. For more information, see our [pricing plans][pricing] or [contact our sales team][contact-sales].

| Feature | Benefit |
|---------|---------|
| [Backup and Restore][backup-restore] | Automatically schedule control plane snapshots for disaster recovery and seamless upgrades. |
| [Function Scale-to-Zero][function-scale-to-zero] | Reduce resource consumption by automatically scaling composition functions to zero when idle. |
| [Official Package Patch Releases][official-package-support] | Access patch releases of Official Providers with security fixes and bug patches. |
| [Provider Pod Autoscaling][provider-vpa] | Dynamically adjust CPU and memory for provider pods to handle performance spikes. |

## How-tos 

To learn about Crossplane and UXP features, read the [how-to guides][guides].

## Deploy and run UXP

Upbound runs UXP for you in our control planes-as-a-service Spaces hosting environment. Users can also [deploy][self-managed-uxp] a self-managed installation of UXP directly on a Kubernetes cluster.

## Get Started

Read the [Get Started][get-started] guide to learn how to use UXP to build your own control plane.

[crossplane]: https://docs.crossplane.io
[control-plane]: /getstarted/#what-is-upbound
[self-managed-uxp]: /manuals/uxp/howtos/uxp-deployment
[licensing]: /manuals/uxp/howtos/license-management
[intelligent-control-planes]: /manuals/uxp/concepts/intelligent-control-planes
[add-ons]: /manuals/uxp/concepts/add-ons
[concepts]: /manuals/uxp/concepts/composition/overview
[features]: /manuals/uxp/concepts/intelligent-control-planes
[guides]: /manuals/uxp/howtos/uxp-deployment
[get-started]: /getstarted
[backup-restore]: /manuals/uxp/features/backup-and-restore
[function-scale-to-zero]: /manuals/uxp/howtos/function-scale-to-zero
[official-package-support]: /manuals/uxp/features/official-package-support
[provider-vpa]: /manuals/uxp/howtos/provider-vpa
[pricing]: https://www.upbound.io/pricing
[contact-sales]: https://www.upbound.io/contact-us
