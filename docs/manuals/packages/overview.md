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

## Availability

Beginning with `v2.0.0`, all minor version releases are publicly accessible and
compatible with UXP Community license.

Patch Release Access:
* Patch releases for the current minor version are compatible with UXP Community license
* Patch releases for previous minor versions require a Standard or higher commercial Upbound license to access

**Important Notes**:

* Only a subset of patch releases are compatible with the Community license. For
example, backported critical CVE patches require an Upbound Standard license or
higher to access 
* Releases compatible with the Community license today remain compatible
  until end-of-life 
* Releases before `v2.0.0` remain compatible with Crossplane and
UXP, and follow the same access policies as before


The table below illustrates compatible versions of a v2 Official Package based
on your Upbound license:


|                   | v2.0.0 | v2.1.0 | v2.1.1 | v2.1.2 | v2.2.0 | v2.2.0-fips | V2.2.1 (latest) |
|-------------------|--------|--------|--------|--------|--------|-------------|-----------------|
| Community         | ✅      | ✅      | X      | X      | ✅      | X           | ✅               |
| Standard          | ✅      | ✅      | ✅      | ✅      | ✅      | X           | ✅               |
| Enterprise        | ✅      | ✅      | ✅      | ✅      | ✅      | ✅           | ✅               |
| Business Critical | ✅      | ✅      | ✅      | ✅      | ✅      | ✅           | ✅               |

For more information on licensing and provider availability, review the
[package Policy][package-policy] documentation.

[aws-provider-package]: https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.21.0
[package-policy]: /manuals/packages/policies
