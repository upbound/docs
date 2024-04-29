---
title: Control Plane Configurations (Legacy)
weight: 4
description: An introduction to how Configurations work in Upbound
---

{{< hint "important" >}}
This feature is depricated as of `v1.3.0`.
{{< /hint >}}


Managed control planes expose a set of APIs for users to interact with their control planes. Configurations define these APIs.

Configurations are a [Crossplane package](https://docs.crossplane.io/latest/concepts/packages/#configuration-packages) that bundles a set of API definitions. Every Crossplane Configuration in the Upbound environment has its source synced directly from a Git repository. Users choose from this selection of Configurations in their Upbound environment when they want to install a set of APIs on a managed control plane.

## How configurations work on Upbound

All managed control planes on Upbound install configurations from a definition stored in a Version Control Service. Configurations in Upbound are special objects that you can create directly from the Console or via the `up` CLI. When you create a Configuration choose to either:

- start from a gallery of existing Configurations curated by Upbound
- start from a scratch configuration, which is an empty configuration with a placeholder `crossplane.yaml` file

Upbound automatically creates a Git repository in your version control service provider on your behalf. After Upbound creates your repository, it watches for new commits to the `main` branch. For every commit, Upbound automatically attempts to build the Configuration package for you. If it's successful, you can then upgrade the definition on your managed control planes.

{{<img src="concepts/images/Git-Integration_Marketecture_Dark_1440w.png" alt="Illustration of a Configuration stored in Git" lightbox="true">}}

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

All Configurations in Upbound sync from Git.

## Building an API

Upbound attempts to build a new version of your configuration for every commit to the main `branch` of the repository that backs your configuration. It's your responsibility to push content to the repository which builds into a valid Crossplane configuration package.

{{< hint "important" >}}
If you push a new commit to your repo but Upbound does not show a new configuration is available to update to, that is usually an indication the configuration failed to build. Check the build status in GitHub to confirm this (see below).
{{< /hint >}}

### Build status

Upbound uses a GitHub app to read your configuration's repository contents. Upbound builds a configuration package for you and pushes it to Upbound. Then, you can deploy the latest configuration package your control planes. For each commit, the app reports a build status. While the configuration is building, you can see a status like below in GitHub:

{{<img src="concepts/images/git-building.png" alt="example of an in-progress configuration build on GitHub" lightbox="true" >}}

When the repository contents finishes building, the Upbound GitHub app reports a green checkmark and status like below:

{{<img src="concepts/images/git-success.png" alt="example of a successful configuration build on GitHub" lightbox="true">}}

When the repository contents fail to build a configuration, the Upbound GitHub app reports a failure and brief message explaining why. Hover over the status text on GitHub to see the full message:

{{<img src="concepts/images/git-fail.png" alt="example of a failed configuration build on GitHub" lightbox="true">}}

### Apply an update in Upbound

When a repository builds into a configuration, Upbound shows the image as available for each control plane that has installed that configuration. You can find the `update available` prompt in the control plane explorer view.

{{<img src="concepts/images/git-update-available.png" alt="showing a new configuration is available for a control plane" size="small" lightbox="true">}}

Select the text to begin an update on the control plane. Confirm the update operation to kickoff the install. Notice the version string of the configuration image is a SemVer-formatted string appended with the ID of the associated commit.

{{<img src="concepts/images/git-build-version.png" alt="showing a new configuration is available for a control plane" lightbox="true">}}