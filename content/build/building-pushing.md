---
title: "Building and pushing your Control Plane Projects"
weight: 6
description: "How to build and push your control plane project to the Upbound Marketplace"
---

<!--- TODO(tr0njavolta): update CLI links --->

Upbound enables you to build and deploy control plane projects with the Upbound CLI.

## Build your control plane project

You can build the dependencies and metadata in your Upbound project as a single
OCI image with the [up project build]({{< ref "reference/cli/command-reference"
>}}) command. This command generates the Python
and KCL schemas and packages them into a single `.uppkg` file. New builds update
the control plane project dependency cache in the same way running the [up
dependency update-cache]({{< ref "reference/cli/command-reference" >}}) command does.

```shell
up project build
```

This command builds the image in your control plane project directory in `_output/<userProject>.uppkg`.

## Pushing your control plane project to the Upbound Marketplace

First, login to Upbound.

```shell
up login
```

After you log in, run `up project push` to push your package to the Upbound
Marketplace.

```shell
up project push
```
<!-- vale gitlab.SentenceLength = NO -->
If you don't have a Marketplace repository, the [up project push]({{< ref
"reference/cli/command-reference" >}}) command automatically creates the
repository based on the `spec.repository` field in your `upbound.yaml` file.
When you push a project with embedded functions, Upbound automatically creates
sub-repositories for these functions.
<!-- vale gitlab.SentenceLength = YES -->