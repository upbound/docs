---
title: Repositories
weight: 10
description: Product documentation for using the Repositories feature in Upbound.
aliases:
    - /repositories/_index
---

Upbound repositories lets you centrally store control plane artifacts, extensions, and build dependencies as part of an integrated Upbound experience.

## Introduction

Upbound Repositories provides a single location for storing and managing your control plane artifacts and extensions, bundled as OCI images. You can:

- Store control plane artifacts generated with [up CLI]({{<ref "learn/build-with-upbound">}}) platform builder tooling.
- Deploy artifacts to control planes.
- Manage and publish artifacts to the [Upbound Marketplace]({{<ref "upbound-marketplace">}})
- Upbound RBAC provides consistent access control.
- Integrate repositories on Upbound with your existing CI/CD tools.

## Supported artifact types

Upbound repositories support these Crossplane package types: `Configurations`, `Functions` and `Providers`.

* **`Configuration`** packages combine Crossplane _Composite Resource Definitions_, _Compositions_ and metadata.
* **`Function`** packages include the compiled function code for single or
  multiple processor architectures.
* **`Provider`** packages combine a [Kubernetes controller](https://kubernetes.io/docs/concepts/architecture/controller/) container, associated _Custom Resource Definitions_ (`CRDs`) and metadata. The Crossplane open source [AWS provider package](https://github.com/crossplane-contrib/provider-aws/tree/master/package) is an example a provider's metadata and `CRDs`.

## Next steps

- [Store configurations in a repostiory]({{<ref "store-configurations">}})
