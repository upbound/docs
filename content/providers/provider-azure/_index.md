---
title: "Provider Azure"
weight: 1
description: Release notes for the Azure official provider
---

The below release notes are for the Upbound Azure official provider. These notes
only contain noteworthy changes and you should refer to each release's GitHub
release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance]({{<ref "support" >}}) page.

<!-- vale Google.Headings = NO -->

## v0.38.0

_Released 2023-10-26_

* Support for new family providers: `provider-azure-containerapp` and `provider-azure-loadtestservice`
* Support for new resources: `ContainerApp.containerapp`, `Environment.containerapp` and `LoadTest.loadtestservice`
* The release contains some bug fixes, updates of dependencies, and promoting granular management policies to Beta.

_Refer to the [v0.38.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.38.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.38.0)

## v0.37.1

_Released 2023-10-02_

* The release contains fixing import of `ManagementGroupSubscriptionAssociation.management` resource.

_Refer to the [v0.37.1 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.37.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.37.1)

## v0.37.0

_Released 2023-09-29_

* Support for new resources: `FlexibleServerActiveDirectoryAdministrator.dbforpostgresql`and `VirtualMachineExtension.compute`
* The release contains some bug fixes and configuring the default poll jitter for the controllers.

_Refer to the [v0.37.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.37.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.37.0)

## v0.36.0

_Released 2023-08-23_

* The release contains some important bug fixes to the granular
management policies and a fix in the reconciliation logic of the Upjet runtime.
* Updated Terraform CLI to 1.5.5 to address CVEs in previous Terraform versions.

_Refer to the [v0.36.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.36.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.36.0)

## v0.35.0

_Released 2023-08-01_

* This release adds support for the `spec.initProvider` API and for the granular management
policies alpha feature.
* Support for new resources: `ManagementGroupSubscriptionAssociation`
* Various bug fixes and enhancements.

_Refer to the [v0.35.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.35.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.35.0)

## v0.34.0

_Released 2023-06-27_

* ⚠️ The family providers now declare a dependency on version v1.12.1 of
Crossplane.
* Various bug fixes and enhancements.

_Refer to the [v0.33.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.34.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.34.0)

## v0.33.0

_Released 2023-06-13_

* This release introduces the new [provider families architecture]({{<ref "provider-families">}}) for
the Upbound Official Azure provider.
* Various bug fixes and enhancements.

_Refer to the [v0.33.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.33.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.33.0)

## v0.32.0

_Released 2023-05-15_

* Update the Azure Terraform provider version to v3.55.0
* Various bug fixes and enhancements.

_Refer to the [v0.32.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.32.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.32.0)
<!-- vale Google.Headings = YES -->