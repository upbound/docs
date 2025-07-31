---
title: What are Control Plane Projects?
description: "What are Control Plane Projects?"
sidebar_position: 2
---

UXP supports local development with the `up` CLI to run and test your control plane projects.

## Requirements

To use local control plane development tools, make sure you have:

* [up][up] CLI installed
* A Docker-compatible container runtime installed and running on your system

## What is a Control Plane Project?

A control plane project is the source-level code representation of your control plane. 

Projects require an `upbound.yaml` file. The command `up project init` by default uses an Upbound-provided template, which creates a predefined `upbound.yaml`. If you choose to override the default template with your own, make sure your template contains an `upbound.yaml` in the root directory.

Project files define the constraints and dependencies of your control plane. The project file also contains metadata about your project, such as the maintainers of the project and which template it's derived from.

Inside of your control plane, you can define
- your platform API schemas as a collection of `CompositeResourceDefinitions (XRDs)`.
- the implementation of those schemas as Crossplane `compositions`.
- any dependencies your control plane has, such as on providers, functions, or configuration packages.
- compositions functions, which are modules referenced by your compositions that define how to compose resources.
- test suites for your API, so you can conduct testing as part of your inner-loop development.
- and more.