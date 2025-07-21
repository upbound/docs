---
title: Provider GCP
sidebar_position: 1
description: Release notes for the GCP official provider
---
<!-- vale Google.Headings = NO -->
The below release notes are for the Upbound GCP official provider. These notes
only contain noteworthy changes and you should refer to each release's GitHub
release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance][support-and-maintenance] page.

:::important
Beginning with `v1.21.0` and later, you need at least a `Team` subscription to pull a given Official Provider version. All prior versions are pullable without a subscription. 
If you're not subscribed to Upbound or have an `Individual` tier subscription, you can still always pull **the most recent provider version** using the `v1` tag.
:::

## v1.10.0

_Released 2024-11-21_

* This release introduces new resources: `ResponsePolicy.dns.gcp.upbound.io/v1beta1`,
`ResponsePolicyRule.dns.gcp.upbound.io/v1beta1` and `TrustConfig.certificatemanager.gcp.upbound.io/v1beta1`

_Refer to the [v1.10.0 release notes][v1-10-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace]

## v1.9.0

_Released 2024-11-07_

* Support for new resources: `ServiceConnectionPolicy.networkconnectivity.gcp.upbound.io/v1beta1`,
`Cluster.redis.gcp.upbound.io/v1beta1`, `PolicyTag.datacatalog.gcp.upbound.io/v1beta1`
and `Taxonomy.datacatalog.gcp.upbound.io/v1beta1`
* Upgraded the underlying Terraform provider version from `5.39.0` to `5.44.2`
* This release also introduces new resources, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.9.0 release notes][v1-9-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-1]

## v1.8.3

_Released 2024-09-20_

* The release cleaned `uptest` specific codes/placeholders from the examples in the marketplace.

_Refer to the [v1.8.3 release notes][v1-8-3-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-2]

## v1.8.2

_Released 2024-09-16_

* The release fixes the issue of hiding error messages.

_Refer to the [v1.8.2 release notes][v1-8-2-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-3]

## v1.8.1

_Released 2024-09-09_

* The release is reverting the commit `0927b1f`, which caused a regression.

_Refer to the [v1.8.1 release notes][v1-8-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-4]

## v1.8.0

_Released 2024-08-23_

* The release contains bug fixes, enhancements, and dependency updates.

_Refer to the [v1.8.0 release notes][v1-8-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-5]

## v1.7.0

_Released 2024-08-06_

* Update the GCP Terraform provider from `5.28.0` to `5.39.0`

_Refer to the [v1.7.0 release notes][v1-7-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-6]

## v1.6.0

_Released 2024-07-26_

* Support for new family providers: `provider-gcp-orgpolicy` and `provider-gcp-tags`
* Support for new resources: `EnvgroupAttachment.apigee.gcp.upbound.io/v1beta1`, `EnvgroupAttachment.apigee.gcp.upbound.io/v1beta1`,
`EndpointAttachment.apigee.gcp.upbound.io/v1beta1`, `InstanceAttachment.apigee.gcp.upbound.io/v1beta1`,
`AddonsConfig.apigee.gcp.upbound.io/v1beta1`, `SyncAuthorization.apigee.gcp.upbound.io/v1beta1`,
`Policy.orgpolicy.gcp.upbound.io/v1beta1`, `TagBinding.tags.gcp.upbound.io/v1beta1`,
`TagKey.tags.gcp.upbound.io/v1beta1` and `TagValue.tags.gcp.upbound.io/v1beta1`
* The release contains new family providers, new resources, an important bug fix,
enhancements, and dependency updates.

_Refer to the [v1.6.0 release notes][v1-6-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-7]

## v1.5.0

_Released 2024-07-04_

* Update the GCP Terraform provider from `5.19.0` to `5.28.0`

_Refer to the [v1.5.0 release notes][v1-5-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-8]

## v1.4.0

_Released 2024-06-27_

* Support for a new resources: `HMACKey.storage.gcp.upbound.io/v1beta1`
* This release includes a new resource, enhancements, and dependency updates.

_Refer to the [v1.4.0 release notes][v1-4-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-9]

## v1.3.0

_Released 2024-06-13_

* This release includes bug fixes, documentation updates, and dependency updates.

_Refer to the [v1.3.0 release notes][v1-3-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-10]

## v1.2.0

_Released 2024-05-16_

* This release includes converting singleton lists in the MR APIs to embedded objects, and dependency updates.

_Refer to the [v1.2.0 release notes][v1-2-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-11]

## v1.1.0

_Released 2024-04-25_

* Support for new resources: `RegionNetworkEndpoint.compute.gcp.upbound.io/v1beta1` and `Cluster.containerattached.gcp.upbound.io/v1beta1`
* This release includes a new set of managed resource (MR) metrics, a new family provider `provider-gcp-containerattached`,
new resources, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.1.0 release notes][v1-1-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-12]

## v1.0.2

_Released 2024-03-21_

* Switches to the new API for marking as required the fields. The new API marks the fields as required during
the generation without any native resource schema change.
* Adds information logs in the monolithic provider's output that communicate the deprecation and the next steps.
* Adds `SSA` merge strategy to container Cluster's `nodeConfig` to avoid fights over ownership.

_Refer to the [v1.0.2 release notes][v1-0-2-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-13]

## v0.41.4

_Released 2024-03-21_

* Adds information logs in the monolithic provider's output that communicate the deprecation and the next steps.
* Adds `SSA` merge strategy to container Cluster's `nodeConfig` to avoid fights over ownership.

_Refer to the [v0.41.4 release notes][v0-41-4-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-14]

## v1.0.1

_Released 2024-03-14_

* This release sets a default `io.Discard` logger for the controller-runtime if debug logging isn't enabled.

_Refer to the [v1.0.1 release notes][v1-0-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-15]

## v0.41.3

_Released 2024-03-14_

* This release sets a default `io.Discard` logger for the controller-runtime if debug logging isn't enabled.

_Refer to the [v0.41.3 release notes][v0-41-3-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-16]

## v1.0.0

_Released 2024-03-07_

* Update the Google Terraform provider version to v5.19.0
* This release brings support for the conversion functions to be able to handle any future breaking API changes.
* The release contains some important bug fixes, and updates of dependencies.

_Refer to the [v1.0.0 release notes][v1-0-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-17]

## v0.41.2

_Released 2024-02-22_

* This release includes some important bug fixes and dependency bumps, please select the release notes for more details.

_Refer to the [v0.41.2 release notes][v0-41-2-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-18]

## v0.41.1

_Released 2024-01-25_

* The release contains updates of dependencies.

_Refer to the [v0.41.1 release notes][v0-41-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-19]

## v0.41.0

_Released 2023-12-28_

* Support for new resource: `RegionTargetTCPProxy.compute`
* The release contains some important bug fixes, adding a new resource, and updates of dependencies.

_Refer to the [v0.41.0 release notes][v0-41-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-20]

## v0.40.0

_Released 2023-12-13_

* This release brings a change with how interact with the underlying Terraform GCP provider. Instead of interfacing with
Terraform via the TF CLI, the new implementation consumes the Terraform provider's Go provider schema and invokes the CRUD
functions registered in that schema, and no longer fork the underlying Terraform provider process.

_Refer to the [v0.40.0 release notes][v0-40-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-21]

## v0.39.0

_Released 2023-11-30_

* Support for new resources: `FolderSink.logging`, `FolderExclusion.logging` and `FolderBucketConfig.logging`
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.39.0 release notes][v0-39-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-22]


## v0.38.1

_Released 2023-11-02_

* This release updates Crossplane Runtime to v1.14.1 which includes a fix in the retry mechanism while persisting the critical annotations.

_Refer to the [v0.38.1 release notes][v0-38-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-23]

## v0.38.0

_Released 2023-10-26_

* The release contains some bug fixes, updates of dependencies, and promoting granular management policies to Beta.

_Refer to the [v0.38.0 release notes][v0-38-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-24]

## v0.37.0

_Released 2023-09-29_

* Update the GCP Terraform provider to v4.77.0
* Support for new family providers: `provider-gcp-alloydb` and `provider-gcp-vpcaccess`
* Support for new resources: `Backup.alloydb`, `Cluster.alloydb`, `Instance.alloydb`
and `Connector.vpcaccess`
* The release contains some bug fixes and configuring the default poll jitter for the controllers.

_Refer to the [v0.37.0 release notes][v0-37-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-25]

## v0.36.0

_Released 2023-08-23_

* The release contains some important bug fixes to the granular
management policies and a fix in the reconciliation logic of the Upjet runtime.
* Updated Terraform CLI to 1.5.5 to address CVEs in previous Terraform versions.

_Refer to the [v0.36.0 release notes][v0-36-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-26]

## v0.35.0

_Release 2023-08-01_

* This release adds support for the `spec.initProvider` API and for the granular management
policies alpha feature.
* Support for new resources: `AccessLevel`, `AccessLevelCondition`, `AccessPolicy`, `AccessPolicyIAMMember`,
`ServicePerimeter`, `ServicePerimeterResource` and `RouterPeer`
* Bug fixes and enhancements.

_Refer to the [v0.35.0 release notes][v0-35-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-27]

## v0.34.0

_Released 2023-06-27_

* ⚠️ The GCP family providers now require Crossplane v1.12.1 or later.
* Bug fixes and enhancements.

_Refer to the [v0.34.0 release notes][v0-34-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-28]

## v0.33.0

_Released 2023-06-13_

* This release introduces the new [provider families architecture][provider-families-architecture] for
the Upbound official GCP provider.
* Bug fixes and enhancements.

_Refer to the [v0.33.0 release notes][v0-33-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-29]
<!-- vale Google.Headings = YES -->


[support-and-maintenance]: /usage/support
[provider-families-architecture]: /providers/provider-families


[v1-10-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.10.0
[upbound-marketplace]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.10.0
[v1-9-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.9.0
[upbound-marketplace-1]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.9.0
[v1-8-3-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.8.3
[upbound-marketplace-2]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.8.3
[v1-8-2-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.8.2
[upbound-marketplace-3]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.8.2
[v1-8-1-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.8.1
[upbound-marketplace-4]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.8.1
[v1-8-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.8.0
[upbound-marketplace-5]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.8.0
[v1-7-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.7.0
[upbound-marketplace-6]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.7.0
[v1-6-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.6.0
[upbound-marketplace-7]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.6.0
[v1-5-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.5.0
[upbound-marketplace-8]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.5.0
[v1-4-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.4.0
[upbound-marketplace-9]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.4.0
[v1-3-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.3.0
[upbound-marketplace-10]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.3.0
[v1-2-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.2.0
[upbound-marketplace-11]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.2.0
[v1-1-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.1.0
[upbound-marketplace-12]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.1.0
[v1-0-2-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.0.2
[upbound-marketplace-13]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.0.2
[v0-41-4-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v0.41.4
[upbound-marketplace-14]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.4
[v1-0-1-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.0.1
[upbound-marketplace-15]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.0.1
[v0-41-3-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v0.41.3
[upbound-marketplace-16]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.3
[v1-0-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-gcp/releases/tag/v1.0.0
[upbound-marketplace-17]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v1.0.0
[v0-41-2-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.41.2
[upbound-marketplace-18]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.2
[v0-41-1-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.41.1
[upbound-marketplace-19]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.1
[v0-41-0-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.41.0
[upbound-marketplace-20]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.41.0
[v0-40-0-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.40.0
[upbound-marketplace-21]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.40.0
[v0-39-0-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.39.0
[upbound-marketplace-22]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.39.0
[v0-38-1-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.38.1
[upbound-marketplace-23]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.38.1
[v0-38-0-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.38.0
[upbound-marketplace-24]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.38.0
[v0-37-0-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.37.0
[upbound-marketplace-25]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.37.0
[v0-36-0-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.36.0
[upbound-marketplace-26]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.36.0
[v0-35-0-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.35.0
[upbound-marketplace-27]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.35.0
[v0-34-0-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.34.0
[upbound-marketplace-28]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.34.0
[v0-33-0-release-notes]: https://github.com/upbound/provider-gcp/releases/tag/v0.33.0
[upbound-marketplace-29]: https://marketplace.upbound.io/providers/upbound/provider-family-gcp/v0.33.0
