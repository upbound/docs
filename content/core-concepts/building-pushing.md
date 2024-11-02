---
title: "Building and pushing your Control Plane Projects"
weight: 6
description: "How to build and push your control plane project to the Upbound Marketplace"
---

Building and deploying a control plane project is easy as running a couple of commands on your CLI. 

## Building your control plane project
All dependencies and metadata within your `upbound.yaml` file can be built into a single OCI image in `.uppkg` format, via the [up project build]() command. In addition, the [up project build]() command will generate Python and KCL schemas, and bake it into the outputed package for you. A new build updates the dependency cache of the control plane project, as [up dependency update-cache]() command would.

```shell
up project build
```

The outputed file should now be available at `_output/<userProject>.uppkg`.

## Pushing your control plane project to the Upbound Marketplace
First, login to Upbound.

```shell
up login
```

Once you are logged in, run the following command.

```shell
up project push
```

Your package is now pushed to the Upbound Marketplace! 

If you never created a repository in the marketplace, the [up project push]() command will create the repository based on the `spec.repository` field in your `upbound.yaml` file automatically for you. In addition, any embedded functions you created will be pushed to its own subrepository automatically as well.