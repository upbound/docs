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

## v1.1.0

_Released 2024-04-25_

* Support for new resources: `RegionNetworkEndpoint.compute.gcp.upbound.io/v1beta1` and `Cluster.containerattached.gcp.upbound.io/v1beta1`
* This release includes a new set of managed resource (MR) metrics, a new family provider `provider-gcp-containerattached`,
new resources, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.1.0 release notes](https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.1.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.1.0)

## v1.0.2

_Released 2024-03-21_

* Switches to the new API for marking as required the fields. The new API marks the fields as required during
the generation without any native resource schema change.
* Adds information logs in the monolithic provider's output that communicate the deprecation and the next steps.
* Adds `SSA` merge strategy to container Cluster's `nodeConfig` to avoid fights over ownership.

_Refer to the [v1.0.2 release notes](https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.0.2) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.0.2)

## v0.41.4

_Released 2024-03-21_

* Adds information logs in the monolithic provider's output that communicate the deprecation and the next steps.
* Adds `SSA` merge strategy to container Cluster's `nodeConfig` to avoid fights over ownership.

_Refer to the [v0.41.4 release notes](https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v0.41.4) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.4)

## v1.0.1

_Released 2024-03-14_

* This release sets a default `io.Discard` logger for the controller-runtime if debug logging isn't enabled.

_Refer to the [v1.0.1 release notes](https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.0.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.0.1)

## v0.41.3

_Released 2024-03-14_

* This release sets a default `io.Discard` logger for the controller-runtime if debug logging isn't enabled.

_Refer to the [v0.41.3 release notes](https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v0.41.3) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.3)

## v1.0.0

_Released 2024-03-07_

* Update the Google Terraform provider version to v5.19.0
* This release brings support for the conversion functions to be able to handle any future breaking API changes.
* The release contains some important bug fixes, and updates of dependencies.

_Refer to the [v1.0.0 release notes](https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.0.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.0.0)

## v0.41.2

_Released 2024-02-22_

* This release includes some important bug fixes and dependency bumps, please select the release notes for more details.

_Refer to the [v0.41.2 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.41.2) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.2)

## v0.41.1

_Released 2024-01-25_

* The release contains updates of dependencies.

_Refer to the [v0.41.1 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.41.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.1)

## v0.41.0

_Released 2023-12-28_

* Support for new resource: `RegionTargetTCPProxy.compute`
* The release contains some important bug fixes, adding a new resource, and updates of dependencies.

_Refer to the [v0.41.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.41.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.0)

## v0.40.0

_Released 2023-12-13_

* This release brings a change with how interact with the underlying Terraform GCP provider. Instead of interfacing with
Terraform via the TF CLI, the new implementation consumes the Terraform provider's Go provider schema and invokes the CRUD
functions registered in that schema, and no longer fork the underlying Terraform provider process.

_Refer to the [v0.40.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.40.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.40.0)

## v0.39.0

_Released 2023-11-30_

* Support for new resources: `FolderSink.logging`, `FolderExclusion.logging` and `FolderBucketConfig.logging`
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.39.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.39.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.39.0)


## v0.38.1

_Released 2023-11-02_

* This release updates Crossplane Runtime to v1.14.1 which includes a fix in the retry mechanism while persisting the critical annotations.

_Refer to the [v0.38.1 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.38.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.38.1)

## v0.38.0

_Released 2023-10-26_

* The release contains some bug fixes, updates of dependencies, and promoting granular management policies to Beta.

_Refer to the [v0.38.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.38.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.38.0)

## v0.37.0

_Released 2023-09-29_

* Update the GCP Terraform provider to v4.77.0
* Support for new family providers: `provider-gcp-alloydb` and `provider-gcp-vpcaccess`
* Support for new resources: `Backup.alloydb`, `Cluster.alloydb`, `Instance.alloydb`
and `Connector.vpcaccess`
* The release contains some bug fixes and configuring the default poll jitter for the controllers.

_Refer to the [v0.37.0 release notes](https://github.com/upbound/provider-gcp/releases/tag/v0.37.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.37.0)

## v0.36.0

_Released 2023-08-23_

* The release contains some important bug fixes to the granular
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