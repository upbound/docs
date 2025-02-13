---
title: Store configurations
weight: 10
description: Product documentation for using the Repositories feature in Upbound.
---

Upbound repositories lets you centrally store control plane artifacts, extensions, and build dependencies as part of an integrated Upbound experience.

This guide shows you how to:

- Create a repository on Upbound
- Build and push a control plane project's artifact (a Configuration) to the repository
- Deploy the artifact to a managed control planes

## Prerequisites

For this guide, you’ll need:

- The [up CLI]({{<ref "reference/cli">}})  installed
- An account on Upbound

## Create a repository

Create a repository to store the Configuration created as part of this guide.

{{< tabs >}}
{{< tab "up" >}}
1. Run the following command to create a new repository named quickstart-project-repo:
```ini
up repository create quickstart-project-repo
```

2. Run the following command to verify that your repository was created:
```ini
up repository list
```
{{< /tab >}}

{{< tab "Console" >}}
1. Open the Repositories page in the Upbound Console.
2. Click `Create Repository`.
3. Name the repository _quickstart-project-repo_.
4. Click Create.

The repository is added to the repository list.
{{< /tab >}}
{{< /tabs >}}

## Build a Configuration

Use the up CLI to scaffold a control plane project and build it to produce a Configuration.

1. Run the following command to create a new control plane project. A new folder is created in your current working directory:
```ini
up project init quickstart-project
```

2. Change your current directory to `quickstart-project`. Run the following comamnd in your terminal:
```ini
cd quickstart-project
```

3. Run the following command to build the project and produce a Configuration package. A Configuration package is built and stored in `_output` directory:
```ini
up project build
```

## Push the Configuration

Now you can push the Configuration to your repository. Run the following command to push the configuration package to your repository:
```ini
up project push --repository=quickstart-project-repo
```

{{< hint type="Tip" >}}
Upbound automatically tags your package with a [semver](https://semver.org/) tag. You can override this with the `--tag=""` option of the push command.
{{< /hint >}}

## Install the Configuration from the repository 

To install the Configuration from your repository onto a control plane, apply the following manifest to a control plane:

{{< editCode >}}
```yaml
apiVersion: pkg.crossplane.io/v1
kind: Configuration
metadata:
  name: quickstart-project
spec:
  package: "xpkg.upbound.io/$@<org-name>$@/quickstart-project"
```
{{< /editCode >}}

