---
title: Provider Terraform
sidebar_position: 1
description: Release notes for the Terraform official provider
---

The below release notes are for the Upbound Terraform official provider. These
notes only contain noteworthy changes and you should refer to each release's
GitHub release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance][support-and-maintenance] page.

:::important
Beginning with `v1.21.0` and later, you need at least a `Team` subscription to pull a given Official Provider version.  All prior versions are pullable without a subscription. 
If you're not subscribed to Upbound or have an `Individual` tier subscription, you can still always pull **the most recent provider version** using the `v1` tag.
:::

<!-- vale Google.Headings = NO -->

## v0.19.0

_Released 2024-11-05_

* This release introduces dependency updates and workflow updates.

_Refer to the [v0.19.0 release notes][v0-19-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace]

## v0.18.0

_Released 2024-08-29_

* This release introduces JSON format for inline module, bug fixes, and dependency updates.

_Refer to the [v0.18.0 release notes][v0-18-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-1]

## v0.17.0

_Released 2024-07-11_

* This release includes some important bug fixes, enhancements, and dependency updates.

_Refer to the [v0.17.0 release notes][v0-17-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-2]

## v0.16.0

_Released 2024-04-25_

* This release includes adding support for setting environment variables in a workspace and dependency updates.

_Refer to the [v0.16.0 release notes][v0-16-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-3]

## v0.15.0

_Released 2024-03-28_

* Swaps the `SYNCED` and `READY` columns in the kubectl get workspace output so that they
read left-to-right in the order that you would expect them to occur.
* The release contains bug fixes and updates of dependencies.

_Refer to the [v0.15.0 release notes][v0-15-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-4]

## v0.14.1

_Released 2024-02-07_

* The release makes the terraform harness only take the lock if the plugin cache enabled.

_Refer to the [v0.14.1 release notes][v0-14-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-5]

## v0.14.0

_Released 2024-01-25_

* The release contains adding support for defining the `backend` file content, and updates of dependencies.

_Refer to the [v0.14.0 release notes][v0-14-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-6]

## v0.13.0

_Released 2023-12-28_

* The release contains updates of dependencies, and promoting granular management policies to Beta.

_Refer to the [v0.13.0 release notes][v0-13-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-7]

## v0.12.0

_Released 2023-11-30_

* Adds example for `provider config` terraform for Azure.
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.12.0 release notes][v0-12-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-8]

## v0.11.0

_Released 2023-10-26_

* This release adds support for jitter.
* Upgrade terraform binary to v1.5.5

_Refer to the [v0.11.0 release notes][v0-11-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-9]

## v0.10.0

_Released 2023-08-17_

* This release adds support for nested objects in output.
* Upgrade alpine Docker tag to v3.18.3

_Refer to the [v0.10.0 release notes][v0-10-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-10]

## v0.9.0

_Released 2023-08-01_

* This release adds example of random value generators.
* Upgrade terraform binary to v1.5.2

_Refer to the [v0.9.0 release notes][v0-9-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-11]
<!-- vale Google.Headings = YES -->


[support-and-maintenance]: /usage/support

[v0-19-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.19.0
[upbound-marketplace]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.19.0
[v0-18-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.18.0
[upbound-marketplace-1]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.18.0
[v0-17-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.17.0
[upbound-marketplace-2]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.17.0
[v0-16-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.16.0
[upbound-marketplace-3]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.16.0
[v0-15-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.15.0
[upbound-marketplace-4]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.15.0
[v0-14-1-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.14.1
[upbound-marketplace-5]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.14.1
[v0-14-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.14.0
[upbound-marketplace-6]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.14.0
[v0-13-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.13.0
[upbound-marketplace-7]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.13.0
[v0-12-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.12.0
[upbound-marketplace-8]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.12.0
[v0-11-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.11.0
[upbound-marketplace-9]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.11.0
[v0-10-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.10.0
[upbound-marketplace-10]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.10.0
[v0-9-0-release-notes]: https://github.com/upbound/provider-terraform/releases/tag/v0.9.0
[upbound-marketplace-11]: https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.9.0
