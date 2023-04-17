---
title: Control Plane Configurations
weight: 4
description: An introduction to how Configurations work in Upbound
---

Managed control planes expose a set of APIs for users to interact with their control planes. Configurations define these APIs.

Configurations are a [Crossplane package](https://docs.crossplane.io/latest/concepts/packages/#configuration-packages) that bundles a set of API definitions. Every Crossplane Configuration in the Upbound environment has its source synced directly from a Git repository. Users choose from this selection of Configurations in their Upbound environment when they want to install a set of APIs on a managed control plane. 

## How configurations work on Upbound

All managed control planes on Upbound install configurations from a definition stored in a Version Control Service. Configurations in Upbound are special objects that you can create directly from the Console or via the `up` CLI. When you create a Configuration choose to either:

- start from a gallery of existing Configurations curated by Upbound
- start from a scratch configuration, which is an empty configuration with a placeholder `crossplane.yaml` file

Upbound automatically creates a Git repository in your version control service provider on your behalf. After Upbound creates your repository, it watches for new commits to the `main` branch. For every commit, Upbound automatically attempts to build the Configuration package for you. If it's successful, you can then upgrade the definition on your managed control planes.

{{<img src="concepts/images/Git-Integration_Marketecture_Dark_1440w.png" alt="Illustration of a Configuration stored in Git" quality="100" lightbox="true">}}

Because Git is the source of truth for a control plane's APIs, users can use typical Git workflows. Upbound deploys API changes out to their control planes once merged without users handling any of the package building processes.

{{< hint "tip" >}}
The relationship of Configurations-to-MCPs is one-to-many. An MCP can only install from one (1) Configuration source. One Configuration source can be installed on many MCPs (and they can have different versions of the same Configuration installed).
{{< /hint >}}

### Anatomy of a configuration

Creating a configuration in Upbound creates a Git repository. Configurations from the Upbound gallery contain:

- `crossplane.yaml` - this file is where you name your configuration, declare dependencies on Crossplane providers, and other Configurations
- `apis` folder - this folder is where you should define your XRDs and compositions.
- `.up/examples` folder - this folder contains example claims that invoke APIs defined in the Configuration

If you choose to make a blank configuration, Upbound creates a `crossplane.yaml` file.

{{< hint "tip" >}}
Configurations can declare dependencies on other Configurations. This lets you scope configurations to modular chunks based on a well-defined boundary, like grouping a set of related API definitions together.
{{< /hint >}}

## Version control service integration

All Configurations in Upbound sync from Git. To learn more about how Upbound integrates with Version Control Services, read [Git integration]({{<ref "git-integration.md">}}).

## Building an API

To see a guide for how to build an API with Upbound and publish it to a control plane, read the [Knowledge Base]({{<ref "knowledge-base/reference-architecture.md">}}) documentation.