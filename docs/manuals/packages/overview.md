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
* **`Provider`** packages combine a Kubernetes controller container, associated _Custom Resource Definitions_ (`CRDs`) and metadata. The [AWS provider package][aws-provider-package] is an example a provider's metadata and `CRDs`.

## Availability

Upbound's Official Packages are commercially licensed and compatible with UXP.

All minor versions of packages ending in `.0` are publicly accessible and
compatible with the Community plan of UXP.

Patch release versions not ending in `.0` require the **Standard** plan or
higher.


| Edition | v1.0 | v1.1 | v1.1.1 | v1.1.2 | v1.2 | v1.2.1 |
|---------|------|------|--------|--------|------|--------|
| Community | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Standard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Enterprise | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Business Critical | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

For more information on licensing and provider availability, review the
[package Policy][package-policy] documentation.

[aws-provider-package]: https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.21.0
[package-policy]: /manuals/packages/policies
