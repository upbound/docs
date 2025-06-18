---
title: (deprecated) Control Plane Configurations
weight: 4
description: An introduction to how Configurations work in Upbound
aliases:
    - /deploy/legacy-spaces/control-plane-configurations
    - /concepts/control-plane-configurations
---

:::important
This feature is deprecated, no longer available in Cloud or Connected Spaces, and only available in Upbound Legacy Spaces.
:::


Control planes expose a set of APIs for users to interact with their control planes. Configurations define these APIs.

Configurations are a [Crossplane package][crossplane-package] that bundles a set of API definitions. Every Crossplane Configuration in the Upbound environment has its source synced directly from a Git repository. Users choose from this selection of Configurations in their Upbound environment when they want to install a set of APIs on a control plane.

## How configurations work on Upbound

All control planes on Upbound install configurations from a definition stored in a Version Control Service. Configurations in Upbound are special objects that you can create directly from the Console or via the `up` CLI. When you create a Configuration choose to either:

- start from a gallery of existing Configurations curated by Upbound
- start from a scratch configuration, which is an empty configuration with a placeholder `crossplane.yaml` file

Upbound automatically creates a Git repository in your version control service provider on your behalf. After Upbound creates your repository, it watches for new commits to the `main` branch. For every commit, Upbound automatically attempts to build the Configuration package for you. If it's successful, you can then upgrade the definition on your control planes.
<!--- TODO(tr0njavolta): link --->
![Illustration of a Configuration stored in Git](/img/Git-Integration_Marketecture_Dark_1440w.png)

Because Git is the source of truth for a control plane's APIs, users can use typical Git workflows. Upbound deploys API changes out to their control planes once merged without users handling any of the package building processes.

:::tip
The relationship of Configurations-to-control planes is one-to-many. A control plane can only install from one (1) Configuration source. One Configuration source can be installed on many control planes (and they can have different versions of the same Configuration installed).
:::

### Anatomy of a configuration

Creating a configuration in Upbound creates a Git repository. Configurations from the Upbound gallery contain:

- `crossplane.yaml` - this file is where you name your configuration, declare dependencies on Crossplane providers, and other Configurations
- `apis` folder - this folder is where you should define your XRDs and compositions.
- `.up/examples` folder - this folder contains example claims that invoke APIs defined in the Configuration

If you choose to make a blank configuration, Upbound creates a `crossplane.yaml` file.

:::tip
Configurations can declare dependencies on other Configurations. This lets you scope configurations to modular chunks based on a well-defined boundary, like grouping a set of related API definitions together.
:::

## Version control service integration

All Configurations in Upbound sync from Git.

## Building an API

Upbound attempts to build a new version of your configuration for every commit to the main `branch` of the repository that backs your configuration. It's your responsibility to push content to the repository which builds into a valid Crossplane configuration package.

:::important
If you push a new commit to your repo but Upbound does not show a new configuration is available to update to, that is usually an indication the configuration failed to build. Check the build status in GitHub to confirm this (see below).
:::

### Build status

Upbound uses a GitHub app to read your configuration's repository contents. Upbound builds a configuration package for you and pushes it to Upbound. Then, you can deploy the latest configuration package your control planes. For each commit, the app reports a build status. While the configuration is building, you can see a status like below in GitHub:
<!--- TODO(tr0njavolta): link --->
![example of an in-progress configuration build on GitHub](/img/git-building.png)

When the repository contents finishes building, the Upbound GitHub app reports a green checkmark and status like below:

![example of a successful configuration build on GitHub](/img/git-success.png)

When the repository contents fail to build a configuration, the Upbound GitHub app reports a failure and brief message explaining why. Hover over the status text on GitHub to see the full message:

![example of a failed configuration build on GitHub](/img/git-fail.png)

### Apply an update in Upbound

When a repository builds into a configuration, Upbound shows the image as available for each control plane that has installed that configuration. You can find the `update available` prompt in the control plane explorer view.

![showing a new configuration is available for a control plane](/img/git-update-available.png)

Select the text to begin an update on the control plane. Confirm the update operation to kickoff the install. Notice the version string of the configuration image is a SemVer-formatted string appended with the ID of the associated commit.

![showing a new configuration is available for a control plane](/img/git-build-version.png)


[crossplane-package]: https://docs.crossplane.io/latest/concepts/packages/#configuration-packages
