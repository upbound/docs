---
title: "Provider AzureAD"
weight: 1
description: Release notes for the AzureAD official provider
---

The below release notes are for the Upbound AzureAD official provider. These notes
only contain noteworthy changes and you should refer to each release's GitHub
release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance][support-and-maintenance] page.

:::important
Beginning with `v1.21.0` and later, you need at least a `Team` subscription to pull a given Official Provider version.  All prior versions are pullable without a subscription. 
If you're not subscribed to Upbound or have an `Individual` tier subscription, you can still always pull **the most recent provider version** using the `v1` tag.
:::

<!-- vale Google.Headings = NO -->

## v1.6.0

_Released 2024-10-05_

* This release introduces the Terraform provider upgrade from `2.47.0` to `2.53.1`,
support for Upbound authentication, bug fixes, enhancements, and dependency
updates.

_Refer to the [v1.5.0 release notes][v1-5-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace]

## v1.5.0

_Released 2024-09-20_

* This release introduces support for `ManagedIdentity` and `OIDC` authentication
methods, and dependency updates.

_Refer to the [v1.5.0 release notes][v1-5-0-release-notes-1] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-2]

## v1.4.1

_Released 2024-09-16_

* This release fixes the issue of hiding error messages.

_Refer to the [v1.4.1 release notes][v1-4-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-3]

## v1.4.0

_Released 2024-08-29_

* This release includes bug fixes, enhancements, and dependency updates.

_Refer to the [v1.4.0 release notes][v1-4-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-4]


## v1.3.0

_Released 2024-06-13_

* This release generates the secret references under `spec.initProvider` API trees and updates dependencies.

_Refer to the [v1.3.0 release notes][v1-3-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-5]

## v1.2.0

_Released 2024-05-16_

* This release includes converting singleton lists in the MR APIs to embedded objects, and dependency updates.

_Refer to the [v1.2.0 release notes][v1-2-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-6]

## v1.1.0

_Released 2024-04-25_

* This release includes a new set of managed resource (MR) metrics, bug fixes, and dependency updates.

_Refer to the [v1.1.0 release notes][v1-1-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-7]

## v1.0.0

_Released 2024-03-21_

* Update the Azure Terraform provider version to v2.47.0
* The release contains some important bug fixes, and updates of dependencies.

_Refer to the [v1.0.0 release notes][v1-0-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-8]

## v0.15.3

_Released 2024-03-21_

* This release sets a default `io.Discard` logger for the controller-runtime if debug logging isn't enabled.

_Refer to the [v0.15.3 release notes][v0-15-3-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-9]

## v0.15.2

_Released 2024-02-29_

* This release includes updates to the dependencies, please select the release notes for more details.

_Refer to the [v0.15.2 release notes][v0-15-2-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-10]

## v0.15.1

_Released 2024-02-22_

* This release includes some important bug fixes and dependency bumps, please select the release notes for more details.

_Refer to the [v0.15.1 release notes][v0-15-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-11]

## v0.15.0

_Released 2023-12-28_

* This release generates reference fields for the `spec.initProvider` of all resources.

_Refer to the [v0.15.0 release notes][v0-15-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-12]

## v0.14.0

_Released 2023-11-30_

* This release brings a change with how interact with the underlying Terraform AzureAD provider. Instead of interfacing with
Terraform via the TF CLI, the new implementation consumes the Terraform provider's Go provider schema and invokes the CRUD
functions registered in that schema, and no longer fork the underlying Terraform provider process.

_Refer to the [v0.14.0 release notes][v0-14-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-13]

## v0.13.1

_Released 2023-11-02_

* This release updates Crossplane Runtime to v1.14.1 which includes a fix in the retry mechanism while persisting the critical annotations.

_Refer to the [v0.13.1 release notes][v0-13-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-14]

## v0.13.0

_Released 2023-10-26_

* The release contains updates of dependencies and promoting granular management policies to Beta.

_Refer to the [v0.13.0 release notes][v0-13-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-15]

## v0.12.0

_Released 2023-09-29_

* The release contains some bug fixes and configuring the default poll jitter for the controllers.

_Refer to the [v0.12.0 release notes][v0-12-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-16]

## v0.11.0

_Released 2023-08-23_

* The release contains some important bug fixes to the granular
management policies and a fix in the reconciliation logic of the Upjet runtime.
* Updated Terraform CLI to 1.5.5 to address CVEs in previous Terraform versions.
* Update the AzureAD Terraform provider version v2.41.0

_Refer to the [v0.11.0 release notes][v0-11-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-17]


## v0.10.0

_Released 2023-08-01_

* This release adds support for the spec.initProvider API and for the granular management policies alpha feature.
* Various bug fixes and enhancements.

_Refer to the [v0.10.0 release notes][v0-10-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-18]

## v0.9.0

_Released 2023-06-16_

* Update the AzureAD Terraform provider version v2.39.0
* Various bug fixes and enhancements.

_Refer to the [v0.9.0 release notes][v0-9-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-19]

## v0.8.0

_Released 2023-05-15_

* Update the AzureAD Terraform provider version to v2.38.0
* Various bug fixes and enhancements.

_Refer to the [v0.8.0 release notes][v0-8-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-20]
<!-- vale Google.Headings = YES -->


[support-and-maintenance]: /usage/support

[v1-5-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v1.5.0
[upbound-marketplace]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v1.5.0
[v1-5-0-release-notes-1]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v1.5.0
[upbound-marketplace-2]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v1.5.0
[v1-4-1-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v1.4.1
[upbound-marketplace-3]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v1.4.1
[v1-4-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v1.4.0
[upbound-marketplace-4]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v1.4.0
[v1-3-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v1.3.0
[upbound-marketplace-5]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v1.3.0
[v1-2-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v1.2.0
[upbound-marketplace-6]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v1.2.0
[v1-1-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v1.1.0
[upbound-marketplace-7]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v1.1.0
[v1-0-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v1.0.0
[upbound-marketplace-8]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v1.0.0
[v0-15-3-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v0.15.3
[upbound-marketplace-9]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.15.3
[v0-15-2-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azuread/releases/tag/v0.15.2
[upbound-marketplace-10]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.15.2
[v0-15-1-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.15.1
[upbound-marketplace-11]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.15.1
[v0-15-0-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.15.0
[upbound-marketplace-12]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.15.0
[v0-14-0-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.14.0
[upbound-marketplace-13]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.14.0
[v0-13-1-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.13.1
[upbound-marketplace-14]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.13.1
[v0-13-0-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.13.0
[upbound-marketplace-15]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.13.0
[v0-12-0-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.12.0
[upbound-marketplace-16]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.12.0
[v0-11-0-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.11.0
[upbound-marketplace-17]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.11.0
[v0-10-0-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.10.0
[upbound-marketplace-18]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.10.0
[v0-9-0-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.9.0
[upbound-marketplace-19]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.9.0
[v0-8-0-release-notes]: https://github.com/upbound/provider-azuread/releases/tag/v0.8.0
[upbound-marketplace-20]: https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.8.0
