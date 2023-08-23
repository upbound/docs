---
title: "Provider GCP"
weight: 1
description: Release notes for the GCP official provider
---
<!-- vale Google.Headings = NO -->
The below release notes are for the Upbound GCP official provider. These notes
only contain noteworthy changes and you should refer to each release's GitHub
release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance]({{<ref "support" >}}) page.

## v0.36.0

_Released 2023-08-23_

* The release contains some important bug fixes regarding the granular
management policies and a fix in the reconciliation logic of the Upjet runtime.
* Updated Terraform CLI to 1.5.5 to address CVEs in previous Terraform versions.

_Refer to the [v0.36.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.36.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.36.0)

## v0.35.0

_Release 2023-08-01_

* This release adds support for the `spec.initProvider` API and for the granular management
policies alpha feature.
* Support for new resources: `AccessLevel`, `AccessLevelCondition`, `AccessPolicy`, `AccessPolicyIAMMember`,
`ServicePerimeter`, `ServicePerimeterResource` and `RouterPeer`
* Bug fixes and enhancements.

_Refer to the [v0.35.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.35.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.35.0)

## v0.34.0

_Released 2023-06-27_

* ⚠️ The GCP family providers now require Crossplane v1.12.1 or later.
* Bug fixes and enhancements.

_Refer to the [v0.34.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.34.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.34.0)

## v0.33.0

_Released 2023-06-13_

* This release introduces the new [provider families architecture]({{<ref "provider-families">}}) for
the Upbound official GCP provider.
* Bug fixes and enhancements.

_Refer to the [v0.33.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.33.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.33.0)

### `upbound/provider-gcp` v0.32.0

_Released 2023-05-15_

* Update the GCP Terraform provider to v4.64.0
* Add support for External Secret Stores.
* Support for new resources: `sharedVPCHostProject` and `sharedVPCServiceProject`
* Bug fixes and enhancements.

_Refer to the [v0.32.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.32.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.32.0)
<!-- vale Google.Headings = YES -->