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