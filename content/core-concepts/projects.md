---
title: "Control Plane Projects"
weight: 1
description: "The basic concepts to help you on your Upbound journey"
---

<!-- vale gitlab.Substitutions = NO -->
Control plane projects are source-level representations of your control plane. A control plane project is any folder that contains an `upbound.yaml` project file. At runtime, the nearest parent folder containing an `upbound.yaml` file determines the current project. Create a project with the [up project init]({{< ref
"reference/cli/command-reference" >}}) command. A control plane project houses the definition of your control plane.

## The project file

Projects require an `upbound.yaml` file which the `up project init` command
creates automatically.

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

The control plane project file defines:

- your platform API schemas, which you express as a collection of `CompositeResourceDefinitions (XRDs)`.
- the implementation of those schemas, defined as Crossplane `compositions`.
- any dependencies your control plane has, such as on providers, composition functions, or configuration packages.
- compositions functions, which are modules referenced by your compositions that define how to compose resources.
- example manifests for your API, so you can conduct testing as part of your inner-loop development.

## Project structure

When you initialize a project, the default project director structure is:

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
├── examples/ # Define example manifests for your API
│   ├── SuperBucket/
│   │   └── example.yaml
│   ├── SuperDatabase/
│   │   └── example.yaml
└── _output/ # "up project build" places the OCI image output here.
```

<!-- vale gitlab.Substitutions = YES -->
## Build and push a project

Control plane projects are source-level representations of your control plane.
Like any other software project, control plane projects require a **build
stage** to assemble all parts of your project into a versioned artifact.

Build a project with the [up project build]({{< ref
"reference/cli/command-reference" >}}) command:

```bash
up project build
```

The output artifact is an OCI image with an `.uppkg` file type. The default
build output is the `_output/` directory in your project.
The `.uppkg` file is a special kind of [Crossplane
Configuration](https://docs.crossplane.io/v1.17/concepts/packages/).

You can push the project output to any OCI-compliant registry.

To push the package to a registry on the Upbound Marketplace with the [up project push]({{< ref
"reference/cli/command-reference" >}}) command:

```bash
up project push
```

## Project templates

New projects created with the command `up project init` scaffold a project from a default template source, [github.com/upbound/project-template](https://github.com/upbound/project-template). You can use any Git repository as the template source. You can specify the template by providing either a full Git URL or a well-known template name. You can use the following well-known template names:

  - project-template `(https://github.com/upbound/project-template)`
  - project-template-ssh `(git@github.com:upbound/project-template.git)`

For more information, review the [CLI reference documentation](({{< ref
"reference/cli/command-reference" >}})