---
title: "Control Plane Projects"
weight: 3
description: "The source of your control plane configurations. A control plane project contains the `upbound.yaml` file and any dependencies for your project."
aliases:
    - /core-concepts/projects
    - core-concepts/projects
---

<!-- vale gitlab.Substitutions = NO -->
Control plane projects are source-level representations of your control plane. A
control plane project is any folder that contains an `upbound.yaml` project
file.

## Create a new project

Create a project with the [up project init]({{< ref
"reference/cli/command-reference" >}}) command. A control plane project houses
the definition of your control plane.

```ini
up project init
initialized project "new-project" in directory "new-project" from https://github.com/upbound/project-template (main)
```

Change into your new project directory.

```shell
cd new-project
```

The `up project init` command creates:
* An `upbound.yaml` project configuration file
* An `apis/` directory for composition definitions
* An `examples/` directory for example claims
* `.github/` and `.vscode/` directories for CI/CD and local development

## The project file

Projects require an `upbound.yaml` file. The command `up project init` by default uses an Upbound-provided template, which creates a predefined `upbound.yaml`. If you choose to override the default template with your own, make sure your template contains an `upbound.yaml` in the root directory.

Project files define the constraints and dependencies of your control plane. The project file also contains metadata about your project, such as the maintainers of the project and which template it's derived from.

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

The control plane project defines:

- your platform API schemas, which you express as a collection of
  `CompositeResourceDefinitions (XRDs)`.
- the implementation of those schemas, defined as Crossplane `compositions`.
- any dependencies your control plane has, such as on providers, functions, or
  configuration packages.
- compositions functions, which are modules referenced by your compositions that
  define how to compose resources.
- test suites for your API, so you can conduct testing as part of your
  inner-loop development.
- example manifests for your API.

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
│   ├── bucketFunction/
│   │   └── main.k
│   ├── databaseFunction/
│   │   └── main.py
├── examples/ # Define example manifests for your API
│   ├── e2etest-SuperBucket/
│   │   └── example.yaml
│   ├── test-SuperBucket/
│   │   └── example.yaml
└── _output/ # "up project build" places the OCI image output here.
```

<!-- vale gitlab.Substitutions = YES -->
## Project templates
New projects created with the command `up project init` scaffold a project from a default template source, [github.com/upbound/project-template](https://github.com/upbound/project-template). You can use any Git repository as the template source. You can specify the template by providing either a full Git URL or a well-known template name. You can use the following well-known template names:

  - project-template `(https://github.com/upbound/project-template)`
  - project-template-ssh `(git@github.com:upbound/project-template.git)`

For more information, review the [CLI reference documentation]({{< ref
"reference/cli/command-reference" >}}).

## Next steps

Next, you need to add the necessary dependencies to enable Upbound communication
with your cloud providers and services. Proceed to the [add dependencies to your
project]({{<ref "adding-dependencies" >}}) guide.
