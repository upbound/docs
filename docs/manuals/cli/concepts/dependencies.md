---
title: What are project dependencies?
description: "What are project dependencies?"
sidebar_position: 5
---

This document explains the basics of project dependencies and how they work in
control plane projects. Dependencies define the building blocks that make up
your control plane's behavior and ensure consistent deployments across
environments.

A **project dependency** defines the building blocks that make up your control
plane's behavior. This includes the providers, functions, configurations, and
other packages that install automatically when you deploy or initialize the
control plane.

## Use cases

When working with Crossplane and UXP, you have two ways to bring providers,
functions, and configurations into your control plane:

1. Install them directly into a cluster (using kubectl, up xpkg install, or the Upbound Console)
2. Declare them as dependencies in your control plane project configuration 

Declaring dependencies provides better long-term consistency, maintainability,
and control in environments with multiple clusters or team members. Declaring
dependencies is the Upbound recommended way of adding dependencies to your
project.

Declaring dependencies ensures that every time you install or bootstrap a
control plane, it includes the exact same set of packages. This helps remove 
inconsistencies between environments and prevents situations where something
works on one cluster but not another.

When you declare dependencies in your project configuration, those declarations
live in source control. This allows you to:

* Track which packages and versions you use
* Review and approve changes via pull requests
* Understand when and why something changed
* Roll back to a previous state if needed

Installing packages directly into a cluster bypasses this workflow and makes it
more difficult to track changes or identify when you introduced regressions.

## Comparison of dependency management approaches

Declaring dependencies makes your control plane predictable, reproducible, and
easier to manage over time. Manual installation is useful for short-term testing
or local development, but for a real platform or other users, you should always
declare dependencies.
