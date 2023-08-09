---
title: "Provider releases"
weight: 50
---

The below release notes are for the Upbound Official providers. The notes only
contain noteworthy changes and you should refer to each release's GitHub
release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance]({{<ref "support" >}}) page.

## 2023-08-01

### `upbound/provider-azure` v0.35.0

* This release adds support for the `spec.initProvider` API and for the granular management
policies alpha feature.
* Support for new resources: `ManagementGroupSubscriptionAssociation`
* Various bug fixes and enhancements.

_Refer to the [v0.35.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.35.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.35.0)

### `upbound/provider-gcp` v0.35.0

* This release adds support for the `spec.initProvider` API and for the granular management
policies alpha feature.
* Support for new resources: `AccessLevel`, `AccessLevelCondition`, `AccessPolicy`, `AccessPolicyIAMMember`,
`ServicePerimeter`, `ServicePerimeterResource` and `RouterPeer`
* Various bug fixes and enhancements.

_Refer to the [v0.35.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.35.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.35.0)

### `upbound/provider-terraform` v0.9.0

* This release adds example of random value generators.
* Upgrade terraform binary to v1.5.2

_Refer to the [v0.9.0 release notes](https://github.com/upbound/provider-terraform/releases/tag/v0.9.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-terraform/v0.9.0)

### `upbound/provider-azuread` v0.10.0

* This release adds support for the `spec.initProvider` API and for the granular management
policies alpha feature.
* Various bug fixes and enhancements.

_Refer to the [v0.10.0 release notes](https://github.com/upbound/provider-azuread/releases/tag/v0.10.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.10.0)

## 2023-06-27

### `upbound/provider-azure` v0.34.0

* ⚠️ The family providers now declare a dependency on version v1.12.1 of
Crossplane.
* Various bug fixes and enhancements.

_Refer to the [v0.33.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.34.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.34.0)

### `upbound/provider-gcp` v0.34.0

* ⚠️ The family providers now declare a dependency on version v1.12.1 of
Crossplane.
* Various bug fixes and enhancements.

_Refer to the [v0.34.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.34.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.34.0)

## 2023-06-16

### `upbound/provider-azuread` v0.9.0

* Update the AzureAD Terraform provider version v2.39.0
* Various bug fixes and enhancements.

_Refer to the [v0.9.0 release notes](https://github.com/upbound/provider-azuread/releases/tag/v0.9.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.9.0)

## 2023-06-13

### `upbound/provider-azure` v0.33.0

* This release introduces the new [provider families architecture]({{<ref "provider-families">}}) for
the Upbound Official Azure provider.
* Various bug fixes and enhancements.

_Refer to the [v0.33.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.33.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.33.0)

### `upbound/provider-gcp` v0.33.0

* This release introduces the new [provider families architecture]({{<ref "provider-families">}}) for
the Upbound Official GCP provider.
* It also includes various bug fixes and enhancements.

_Refer to the [v0.33.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.33.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.33.0)

## 2023-05-15

### `upbound/provider-azure` v0.32.0

* Update the Azure Terraform provider version to v3.55.0
* Various bug fixes and enhancements.

_Refer to the [v0.33.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.33.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.33.0)

### `upbound/provider-azuread` v0.8.0

* Update the AzureAD Terraform provider version to v2.38.0
* Various bug fixes and enhancements.

_Refer to the [v0.8.0 release notes](https://github.com/upbound/provider-azuread/releases/tag/v0.8.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-azuread/v0.8.0)

### `upbound/provider-gcp` v0.32.0

* Update the GCP Terraform provider version to v4.64.0
* Add support for External Secret Stores.
* Support for new resources: `sharedVPCHostProject` and `sharedVPCServiceProject`
* It also includes various bug fixes and enhancements.

_Refer to the [v0.32.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.32.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.32.0)
