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

## v1.2.0

_Released 2024-05-22_

* Support for new resource: `VirtualMachineRunCommand.compute`
* This release includes converting singleton lists in the MR APIs to embedded objects
, a new resource, bug fixes, and dependency updates.

_Refer to the [v1.2.0 release notes](https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.2.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.2.0)

## v1.1.0

_Released 2024-04-25_

* Support for new resource: `Deployment.cognitiveservices.azure.upbound.io/v1beta1`
* This release includes a new set of managed resource (MR) metrics, a new resource, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.1.0 release notes](https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.1.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.1.0)

## v1.0.1

_Released 2024-04-04_

* Sets the Azure partner tracking `GUID` to `a9cee75d-8f11-42e4-bc19-953757f4ea3c` in the requests that the provider makes.
* Adds two words to the `UserAgent` header: the provider name/version such as `crossplane-provider-upjet-azure/v1.0.1` and the
`CPU` architecture and operating system name the provider is running on, such as `(arm64-darwin)`

_Refer to the [v1.0.1 release notes](https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.0.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.0.1)

## v1.0.0

_Released 2024-03-21_

* Update the Azure Terraform provider version to v3.95.0
* Support for new resource: `WorkspaceRootDbfsCustomerManagedKey.databricks.azure.upbound.io/v1beta1`
* This release brings support for the conversion functions to be able to handle any future breaking API changes.
* The release contains some important bug fixes, adding a new resource, and updates of dependencies.

_Refer to the [v1.0.0 release notes](https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.0.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.0.0)

## v0.42.2

_Released 2024-03-21_

* Sets a default `io.Discard` logger for the controller-runtime if debug logging isn't enabled.
* Adds information logs in the monolithic provider's output that communicate the deprecation and the next steps.

_Refer to the [v0.42.2 release notes](https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v0.42.2) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.42.2)

## v0.42.1

_Released 2024-02-22_

* This release includes some important bug fixes and dependency bumps, please select the release notes for more details.

_Refer to the [v0.42.1 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.42.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.42.1)

## v0.42.0

_Released 2024-01-25_

* Support for new resource: `CustomDomain.apimanagement.azure.upbound.io/v1beta1`
* The release contains adding a new resource, and updates of dependencies.

_Refer to the [v0.42.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.42.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.42.0)

## v0.41.0

_Released 2024-01-03_

* This release brings a change with how interact with the underlying Terraform Azure provider. Instead of interfacing with
Terraform via the TF CLI, the new implementation consumes the Terraform provider's Go provider schema and invokes the CRUD
functions registered in that schema, and no longer fork the underlying Terraform provider process.

_Refer to the [v0.41.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.41.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.41.0)

## v0.40.0

_Released 2023-12-28_

* Support for new resources: `FrontdoorFirewallPolicy.cdn` and `FrontdoorSecurityPolicy.cdn`
* Adds client certificate support for Azure service principal credentials.
* The release contains some important bug fixes, adding new resources, and updates of dependencies.

_Refer to the [v0.40.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.40.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.40.0)

## v0.39.0

_Released 2023-11-30_

* Support for new resource: `VirtualMachineDataDiskAttachment.compute`
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.39.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.39.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.39.0)

## v0.38.2

_Released 2023-11-02_

* This release updates Crossplane Runtime to v1.14.1 which includes a fix in the retry mechanism while persisting the critical annotations.

_Refer to the [v0.38.2 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.38.2) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.38.2)

## v0.38.1

_Released 2023-10-30_

* This release sets `async` mode true for `ResourceGroup` resource.

_Refer to the [v0.38.1 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.38.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.38.1)

## v0.38.0

_Released 2023-10-26_

* Support for new family providers: `provider-azure-containerapp` and `provider-azure-loadtestservice`
* Support for new resources: `ContainerApp.containerapp`, `Environment.containerapp` and `LoadTest.loadtestservice`
* The release contains some bug fixes, updates of dependencies, and promoting granular management policies to Beta.

_Refer to the [v0.38.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.38.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.38.0)

## v0.37.1

_Released 2023-10-02_

* The release contains fixing import of `ManagementGroupSubscriptionAssociation.management` resource.

_Refer to the [v0.37.1 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.37.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.37.1)

## v0.37.0

_Released 2023-09-29_

* Support for new resources: `FlexibleServerActiveDirectoryAdministrator.dbforpostgresql`and `VirtualMachineExtension.compute`
* The release contains some bug fixes and configuring the default poll jitter for the controllers.

_Refer to the [v0.37.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.37.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.37.0)

## v0.36.0

_Released 2023-08-23_

* The release contains some important bug fixes to the granular
management policies and a fix in the reconciliation logic of the Upjet runtime.
* Updated Terraform CLI to 1.5.5 to address CVEs in previous Terraform versions.

_Refer to the [v0.36.0 release notes](https://github.com/upbound/provider-azure/releases/tag/v0.36.0) for full details._

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