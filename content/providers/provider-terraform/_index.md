---
title: "Provider Terraform"
weight: 1
description: Release notes for the Terraform official provider
---

The below release notes are for the Upbound Terraform official provider. These
notes only contain noteworthy changes and you should refer to each release's
GitHub release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance]({{<ref "support" >}}) page.

<!-- vale Google.Headings = NO -->

## v0.15.0

_Released 2024-03-28_

* Swaps the `SYNCED` and `READY` columns in the kubectl get workspace output so that they
read left-to-right in the order that you would expect them to occur.
* The release contains bug fixes and updates of dependencies.

_Refer to the [v0.15.0 release notes](https://github.com/upbound/provider-terraform/releases/tag/v0.15.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.15.0)

## v0.14.1

_Released 2024-02-07_

* The release makes the terraform harness only take the lock if the plugin cache enabled.

_Refer to the [v0.14.1 release notes](https://github.com/upbound/provider-terraform/releases/tag/v0.14.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.14.1)

## v0.14.0

_Released 2024-01-25_

* The release contains adding support for defining the `backend` file content, and updates of dependencies.

_Refer to the [v0.14.0 release notes](https://github.com/upbound/provider-terraform/releases/tag/v0.14.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.14.0)

## v0.13.0

_Released 2023-12-28_

* The release contains updates of dependencies, and promoting granular management policies to Beta.

_Refer to the [v0.13.0 release notes](https://github.com/upbound/provider-terraform/releases/tag/v0.13.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.13.0)

## v0.12.0

_Released 2023-11-30_

* Adds example for `provider config` terraform for Azure.
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.12.0 release notes](https://github.com/upbound/provider-terraform/releases/tag/v0.12.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.12.0)

## v0.11.0

_Released 2023-10-26_

* This release adds support for jitter.
* Upgrade terraform binary to v1.5.5

_Refer to the [v0.11.0 release notes](https://github.com/upbound/provider-terraform/releases/tag/v0.11.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.11.0)

## v0.10.0

_Released 2023-08-17_

* This release adds support for nested objects in output.
* Upgrade alpine Docker tag to v3.18.3

_Refer to the [v0.10.0 release notes](https://github.com/upbound/provider-terraform/releases/tag/v0.10.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.10.0)

## v0.9.0

_Released 2023-08-01_

* This release adds example of random value generators.
* Upgrade terraform binary to v1.5.2

_Refer to the [v0.9.0 release notes](https://github.com/upbound/provider-terraform/releases/tag/v0.9.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.9.0)
<!-- vale Google.Headings = YES -->
