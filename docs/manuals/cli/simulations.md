---
title: What are Simulations?
description: "What are Simulations?"
sidebar_position: 7
---

:::important
The Simulations feature is in private preview. For more information, [reach out to Upbound][reach-out-to-upbound].
:::

## What are simulations?

Simulations allow you to preview and debug how your control plane will behave when it receives a specific input—before you actually apply anything to a live cluster.

With simulations, you get visibility into all resources chances in your cluster, including:
* New resources to create
* Existing resources to change
* Existing resources to delete
* How configuration changes propagate through the system

They give you a safe, local way to “run the control plane in your terminal”. Think of it as a dry-run feature for your control plane projects.

## Simulations vs. Tests: What’s the Difference?
- Simulations are interactive previews. You give an input and inspect the real-time output.
- Tests are assertions. You define inputs and expected outputs, and Upbound verifies they match.

Simulations help you explore. Tests help you lock in correctness. Most platform teams use both together.