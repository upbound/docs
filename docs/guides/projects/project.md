---
title: Create a new project 
sidebar_position: 1
description: The source of your control plane configurations. A control plane project
  contains the `upbound.yaml` file and any dependencies for your project.
---
<!-- vale gitlab.HeadingContent = NO -->
# Overview
<!-- vale gitlab.HeadingContent = YES -->

<!-- vale gitlab.Substitutions = NO -->
Control plane projects are source-level representations of your control plane. A
control plane project is any folder that contains an `upbound.yaml` project
file.

## Create a new project

Create a project with the [up project init][up-project-init] command. A control plane project houses
the definition of your control plane.

```ini
up project init
initialized project "new-project" in directory "new-project" from https://github.com/upbound/project-template (main)
```

To learn more about the details of Control Plane Projects, read the [Control Plane Project] manual in our documentation.

## Project Directory

Change into your new project directory.

```shell
cd new-project
```

The `up project init` command creates:
* An `upbound.yaml` project configuration file
* An `apis/` directory for composition definitions
* An `examples/` directory for example claims
* `.github/` and `.vscode/` directories for CI/CD and local development

A typical `upbound.yaml` file looks like the following:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: platform-api
spec:
  dependsOn:
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/upbound/platform-api
  source: github.com/upbound/project-template
```

## Project structure
When you initialize a project, the default project directory structure is:

```bash
.
├── upbound.yaml # Your control plane project is defined here
├── apis/ # Each API (XRD and composition) are defined here
│   ├── SuperBucket/
│   │   ├── definition.yaml
│   │   └── composition.yaml
│   ├── SuperDatabase/
│   │   ├── definition.yaml
│   │   └── composition.yaml
├── functions/ # Define reusable function modules used by compositions
│   ├── bucketFunction/
│   │   └── main.k
│   ├── databaseFunction/
│   │   └── main.py
├── tests/ # Define test suites for your API
│   ├── e2etest-SuperBucket/
│   │   └── main.k
│   ├── test-SuperBucket/
│   │   └── main.py
├── examples/ # Define example manifests for your API
│   ├── SuperBucket/
│   │   └── example.yaml
│   ├── SuperDatabase/
│   │   └── example.yaml
└── _output/ # "up project build" places the OCI image output here.
```

<!-- vale gitlab.Substitutions = YES -->
## Project templates
New projects created with the command `up project init` scaffold a project from a default template source, [github.com/upbound/project-template][github-com-upbound-project-template]. You can use any Git repository as the template source. You can specify the template by providing either a full Git URL or a well-known template name. You can use the following well-known template names:

  - project-template `(https://github.com/upbound/project-template)`
  - project-template-ssh `(git@github.com:upbound/project-template.git)`

For more information, review the [CLI reference documentation][cli-reference-documentation].

## Next steps

Next, you need to add the necessary dependencies to enable Upbound communication
with your cloud providers and services. Proceed to the [add dependencies to your
project][add-dependencies-to-your-project] guide.


[up-project-init]: /reference/cli-reference
[cli-reference-documentation]: /reference/cli-reference
[add-dependencies-to-your-project]: /guides/projects/adding-dependencies
[github-com-upbound-project-template]: https://github.com/upbound/project-template
