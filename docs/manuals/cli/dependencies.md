---
title: What are Project Dependencies?
description: "What are Dependencies?"
sidebar_position: 4
---

## What are Dependencies?

A control plane project dependency defines the building blocks that make up your control plane’s behavior — including the providers, functions, configurations, and other packages that get installed automatically when the control plane is deployed or initialized.

## Declaring dependencies vs installing them directly
When working with Crossplane and UXP, there are two ways to bring providers, functions, and configurations into your control plane:
1.	Install them directly into a cluster (e.g., using kubectl, up xpkg install, or the Upbound Console)

2.	Declare them as dependencies in your control plane project configuration

While direct installation might seem faster at first, declaring dependencies provides long-term consistency, maintainability, and control—especially in environments with multiple clusters or team members.

For example, declaring dependencies ensures that every time you install or bootstrap a control plane, it includes the exact same set of packages. This helps eliminate inconsistencies between environments and prevents situations where something works on one cluster but not another.

In addition, when you declare dependencies in your project configuration, those declarations live in source control. This allows you to:
- Track which packages and versions are in use
- Review and approve changes via pull requests
- Understand when and why something changed
- Roll back to a previous state if needed

Directly installing packages into a cluster bypasses this workflow, making it harder to track changes or identify when regressions were introduced.

In all, declaring dependencies makes your control plane predictable, reproducible, and easier to manage over time. Manual installation may still be useful for short-term testing or local development, but if you’re managing a real platform—or expect others to use your control plane—dependencies should always be declared.
