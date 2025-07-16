---
title: Overview
sidebar_position: 1
description: Product documentation for the Official Packages offered by Upbound.
---

## Package types
Crossplane supports these package types: `Configurations`, `Functions` and `Providers`.

* **`Configuration`** packages combine Crossplane _Composite Resource Definitions_, _Compositions_ and metadata.
* **`Function`** packages include the compiled function code for single or
  multiple processor architectures.
* **`Provider`** packages combine a [Kubernetes controller][kubernetes-controller] container, associated _Custom Resource Definitions_ (`CRDs`) and metadata. The Crossplane open source [AWS provider package][aws-provider-package] is an example a provider's metadata and `CRDs`.
