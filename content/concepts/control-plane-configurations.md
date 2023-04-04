---
title: Control Plane Configurations
weight: 4
description: An introduction to how Configurations work in Upbound
---

Managed control planes expose a set of APIs for users to interact with their control planes. These APIs must be defined and installed from somewhere. This is what Configurations are for. 

Configurations are a type of [Crossplane package](https://docs.crossplane.io/latest/concepts/packages/#configuration-packages) that bundles a set of API definitions. Every Crossplane Configuration in the Upbound environment has its source synced directly from a Git repo. Users choose from this selection of Configurations in their Upbound environment when they want to install a set of APIs on a managed control plane. 

## How configurations work on Upbound

All managed control planes on Upbound ultimately install configurations from a definition stored in a Version Control Service. Configurations in Upbound are special objects that you can create directly from the Console or via the `up` CLI. When you create a Configuration, you are given the choice to:

- start from a gallery of existing Configurations curated by Upbound
- start from a scratch configuration, which is an empty configuration that has only a placeholder `crossplane.yaml` file

Upbound automatically creates a Git repo in your Version Control Service provider on your behalf. After Upbound creates your repo, it will continually watch for new commits to the `main` branch. For every commit, Upbound will automatically attempt to build the Configuration package for you. If it is successful, you can then upgrade the definition on your managed control plane(s).

{{<img src="concepts/images/Git-Integration_Marketecture_Dark_1440w.png" alt="Illustration of a Configuration stored in Git" quality="100" lightbox="true">}}

Because the source of truth for a control plane's APIs are defined in git, this lets users PR and review API changes with typical git workflows, and then roll API changes out to their control planes once merged--all without needing to handle any of the package building or storing processes.

{{< hint "tip" >}}
The relationship of Configurations-to-MCPs is one-to-many. An MCP can only install from one (1) Configuration source. One Configuration source can be installed on many MCPs (and they can have different versions of the same Configuration installed).
{{< /hint >}}

### Anatomy of a Configuration

When you use Upbound to create a Configuration, a git repo is scaffolded. If you choose to create a Configuration from the gallery, you will notice this scaffolding:

- `crossplane.yaml` - this file is where you name your configuration, declare dependencies on Crossplane providers, and other Configurations
- `apis` folder - this folder is where you should define your XRDs and compositions.
- `.up/examples` folder - this folder contains example claims that can be used to invoke the API(s) defined in the Configuration

If you choose to make a Configuration from scratch, Upbound only scaffolds a basic `crossplane.yaml` file; the rest is up to you.

{{< hint "tip" >}}
Yes, Configurations _can_ declare dependencies on other Configurations. This lets you scope Configurations to modular chunks based on a well-defined boundary (like grouping a set of related API definitions together).
{{< /hint >}}

## Version Control Service Integration

All Configurations in Upbound sync from Git. To learn more about how Upbound integrates with Version Control Services, read [Git integration]({{<ref "git-integration.md">}}).

## Building an API

To see a guide for how to build an API with Upbound and publish it to a control plane, read the [Knowledge Base]({{<ref "knowledge-base/reference-architecture.md">}}) documentation.