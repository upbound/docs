---
title: Provider Azure
sidebar_position: 1
description: Release notes for the Azure official provider
---

The below release notes are for the Upbound Azure official provider. These notes
only contain noteworthy changes and you should refer to each release's GitHub
release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance][support-and-maintenance] page.

:::important
Beginning with `v1.21.0` and later, you need at least a `Team` subscription to pull a given Official Provider version.  All prior versions are pullable without a subscription. 
If you're not subscribed to Upbound or have an `Individual` tier subscription, you can still always pull **the most recent provider version** using the `v1` tag.
:::

<!-- vale Google.Headings = NO -->

## v1.9.0

_Released 2024-11-21_

* Support for new resources: `PrivateDNSResolverOutboundEndpoint.network.azure.upbound.io/v1beta1`
and `TrustedAccessRoleBinding.authorization.azure.upbound.io/v1beta1`
* This release introduces new resources, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.9.0 release notes][v1-9-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace]

## v1.8.0

_Released 2024-11-07_

* Support for new resources: `PrivateDNSResolverInboundEndpoint.network.azure.upbound.io/v1beta1`,
`RedisCacheAccessPolicy.cache.azure.upbound.io/v1beta1` and `RedisCacheAccessPolicyAssignment.cache.azure.upbound.io/v1beta1`
* Upgraded the underlying Terraform provider version from `v3.110.0` to `v3.116.0`
* This release also introduces new resources, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.8.0 release notes][v1-8-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-1]

## v1.7.0

_Released 2024-10-04_

* Support for new resources: `CustomDomain.containerapp.azure.upbound.io/v1beta1`,
`EnvironmentCertificate.containerapp.azure.upbound.io/v1beta1`, `EnvironmentCustomDomain.containerapp.azure.upbound.io/v1beta1`,
`EnvironmentDaprComponent.containerapp.azure.upbound.io/v1beta1`, `EnvironmentStorage.containerapp.azure.upbound.io/v1beta1`
and `BackupInstanceKubernetesCluster.dataprotection.azure.upbound.io/v1beta1`
* Upgraded the underlying Terraform provider version from `v3.95.0` to `v3.110.0`
* This release also introduces new resources, enhancements, and dependency updates.

_Refer to the [v1.7.0 release notes][v1-7-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-2]

## v1.6.1

_Released 2024-09-25_

* This release introduces the fix to the issues of the StorageAccount resource.

_Refer to the [v1.6.1 release notes][v1-6-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-3]

## v1.6.0

_Released 2024-09-20_

* Support for new resources: `KubernetesClusterExtension.containerservice.azure.upbound.io/v1beta1`
and `BackupPolicyKubernetesCluster.dataprotection.azure.upbound.io/v1beta1`
* This release introduces new resources enhancements, and dependency updates.

_Refer to the [v1.6.0 release notes][v1-6-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-4]

## v1.5.1

_Released 2024-09-16_

* This release fixes the issue of hiding error messages.

_Refer to the [v1.5.1 release notes][v1-5-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-5]

## v1.5.0

_Released 2024-08-23_

* Support for a new resource: `StorageDefender.security.azure.upbound.io/v1beta1`
* This release includes a new resource, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.5.0 release notes][v1-5-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-6]

## v1.4.0

_Released 2024-07-04_

* Support for a new resource: `BastionHost.network.azure.upbound.io/v1beta1`
* This release includes a new resource, bug fixes, and dependency updates.

_Refer to the [v1.4.0 release notes][v1-4-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-7]

## v1.3.0

_Released 2024-06-13_

* Support for new resources: `PimActiveRoleAssignment.authorization.azure.upbound.io/v1beta1`
and `PimEligibleRoleAssignment.authorization.azure.upbound.io/v1beta1`
* This release includes new resources, bug fixes, enhancements,
and dependency updates.

_Refer to the [v1.3.0 release notes][v1-3-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-8]

## v1.2.0

_Released 2024-05-22_

* Support for new resource: `VirtualMachineRunCommand.compute`
* This release includes converting singleton lists in the MR APIs to embedded objects
, a new resource, bug fixes, and dependency updates.

_Refer to the [v1.2.0 release notes][v1-2-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-9]

## v1.1.0

_Released 2024-04-25_

* Support for new resource: `Deployment.cognitiveservices.azure.upbound.io/v1beta1`
* This release includes a new set of managed resource (MR) metrics, a new resource, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.1.0 release notes][v1-1-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-10]

## v1.0.1

_Released 2024-04-04_

* Sets the Azure partner tracking `GUID` to `a9cee75d-8f11-42e4-bc19-953757f4ea3c` in the requests that the provider makes.
* Adds two words to the `UserAgent` header: the provider name/version such as `crossplane-provider-upjet-azure/v1.0.1` and the
`CPU` architecture and operating system name the provider is running on, such as `(arm64-darwin)`

_Refer to the [v1.0.1 release notes][v1-0-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-11]

## v1.0.0

_Released 2024-03-21_

* Update the Azure Terraform provider version to v3.95.0
* Support for new resource: `WorkspaceRootDbfsCustomerManagedKey.databricks.azure.upbound.io/v1beta1`
* This release brings support for the conversion functions to be able to handle any future breaking API changes.
* The release contains some important bug fixes, adding a new resource, and updates of dependencies.

_Refer to the [v1.0.0 release notes][v1-0-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-12]

## v0.42.2

_Released 2024-03-21_

* Sets a default `io.Discard` logger for the controller-runtime if debug logging isn't enabled.
* Adds information logs in the monolithic provider's output that communicate the deprecation and the next steps.

_Refer to the [v0.42.2 release notes][v0-42-2-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-13]

## v0.42.1

_Released 2024-02-22_

* This release includes some important bug fixes and dependency bumps, please select the release notes for more details.

_Refer to the [v0.42.1 release notes][v0-42-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-14]

## v0.42.0

_Released 2024-01-25_

* Support for new resource: `CustomDomain.apimanagement.azure.upbound.io/v1beta1`
* The release contains adding a new resource, and updates of dependencies.

_Refer to the [v0.42.0 release notes][v0-42-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-15]

## v0.41.0

_Released 2024-01-03_

* This release brings a change with how interact with the underlying Terraform Azure provider. Instead of interfacing with
Terraform via the TF CLI, the new implementation consumes the Terraform provider's Go provider schema and invokes the CRUD
functions registered in that schema, and no longer fork the underlying Terraform provider process.

_Refer to the [v0.41.0 release notes][v0-41-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-16]

## v0.40.0

_Released 2023-12-28_

* Support for new resources: `FrontdoorFirewallPolicy.cdn` and `FrontdoorSecurityPolicy.cdn`
* Adds client certificate support for Azure service principal credentials.
* The release contains some important bug fixes, adding new resources, and updates of dependencies.

_Refer to the [v0.40.0 release notes][v0-40-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-17]

## v0.39.0

_Released 2023-11-30_

* Support for new resource: `VirtualMachineDataDiskAttachment.compute`
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.39.0 release notes][v0-39-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-18]

## v0.38.2

_Released 2023-11-02_

* This release updates Crossplane Runtime to v1.14.1 which includes a fix in the retry mechanism while persisting the critical annotations.

_Refer to the [v0.38.2 release notes][v0-38-2-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-19]

## v0.38.1

_Released 2023-10-30_

* This release sets `async` mode true for `ResourceGroup` resource.

_Refer to the [v0.38.1 release notes][v0-38-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-20]

## v0.38.0

_Released 2023-10-26_

* Support for new family providers: `provider-azure-containerapp` and `provider-azure-loadtestservice`
* Support for new resources: `ContainerApp.containerapp`, `Environment.containerapp` and `LoadTest.loadtestservice`
* The release contains some bug fixes, updates of dependencies, and promoting granular management policies to Beta.

_Refer to the [v0.38.0 release notes][v0-38-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-21]

## v0.37.1

_Released 2023-10-02_

* The release contains fixing import of `ManagementGroupSubscriptionAssociation.management` resource.

_Refer to the [v0.37.1 release notes][v0-37-1-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-22]

## v0.37.0

_Released 2023-09-29_

* Support for new resources: `FlexibleServerActiveDirectoryAdministrator.dbforpostgresql`and `VirtualMachineExtension.compute`
* The release contains some bug fixes and configuring the default poll jitter for the controllers.

_Refer to the [v0.37.0 release notes][v0-37-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-23]

## v0.36.0

_Released 2023-08-23_

* The release contains some important bug fixes to the granular
management policies and a fix in the reconciliation logic of the Upjet runtime.
* Updated Terraform CLI to 1.5.5 to address CVEs in previous Terraform versions.

_Refer to the [v0.36.0 release notes][v0-36-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-24]

## v0.35.0

_Released 2023-08-01_

* This release adds support for the `spec.initProvider` API and for the granular management
policies alpha feature.
* Support for new resources: `ManagementGroupSubscriptionAssociation`
* Various bug fixes and enhancements.

_Refer to the [v0.35.0 release notes][v0-35-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-25]

## v0.34.0

_Released 2023-06-27_

* ⚠️ The family providers now declare a dependency on version v1.12.1 of
Crossplane.
* Various bug fixes and enhancements.

_Refer to the [v0.33.0 release notes][v0-33-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-26]

## v0.33.0

_Released 2023-06-13_

* This release introduces the new [provider families architecture][provider-families-architecture] for
the Upbound Official Azure provider.
* Various bug fixes and enhancements.

_Refer to the [v0.33.0 release notes][v0-33-0-release-notes-27] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-28]

## v0.32.0

_Released 2023-05-15_

* Update the Azure Terraform provider version to v3.55.0
* Various bug fixes and enhancements.

_Refer to the [v0.32.0 release notes][v0-32-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-29]
<!-- vale Google.Headings = YES -->


[support-and-maintenance]: /usage/support
[provider-families-architecture]: /providers/provider-families


[v1-9-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.9.0
[upbound-marketplace]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.9.0
[v1-8-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.8.0
[upbound-marketplace-1]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.8.0
[v1-7-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.7.0
[upbound-marketplace-2]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.7.0
[v1-6-1-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.6.1
[upbound-marketplace-3]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.6.1
[v1-6-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.6.0
[upbound-marketplace-4]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.6.0
[v1-5-1-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.5.1
[upbound-marketplace-5]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.5.1
[v1-5-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.5.0
[upbound-marketplace-6]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.5.0
[v1-4-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.4.0
[upbound-marketplace-7]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.4.0
[v1-3-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.3.0
[upbound-marketplace-8]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.3.0
[v1-2-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.2.0
[upbound-marketplace-9]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.2.0
[v1-1-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.1.0
[upbound-marketplace-10]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.1.0
[v1-0-1-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.0.1
[upbound-marketplace-11]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.0.1
[v1-0-0-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v1.0.0
[upbound-marketplace-12]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v1.0.0
[v0-42-2-release-notes]: https://github.com/crossplane-contrib/provider-upjet-azure/releases/tag/v0.42.2
[upbound-marketplace-13]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.42.2
[v0-42-1-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.42.1
[upbound-marketplace-14]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.42.1
[v0-42-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.42.0
[upbound-marketplace-15]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.42.0
[v0-41-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.41.0
[upbound-marketplace-16]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.41.0
[v0-40-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.40.0
[upbound-marketplace-17]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.40.0
[v0-39-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.39.0
[upbound-marketplace-18]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.39.0
[v0-38-2-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.38.2
[upbound-marketplace-19]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.38.2
[v0-38-1-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.38.1
[upbound-marketplace-20]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.38.1
[v0-38-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.38.0
[upbound-marketplace-21]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.38.0
[v0-37-1-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.37.1
[upbound-marketplace-22]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.37.1
[v0-37-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.37.0
[upbound-marketplace-23]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.37.0
[v0-36-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.36.0
[upbound-marketplace-24]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.36.0
[v0-35-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.35.0
[upbound-marketplace-25]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.35.0
[v0-33-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.34.0
[upbound-marketplace-26]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.34.0
[v0-33-0-release-notes-27]: https://github.com/upbound/provider-azure/releases/tag/v0.33.0
[upbound-marketplace-28]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.33.0
[v0-32-0-release-notes]: https://github.com/upbound/provider-azure/releases/tag/v0.32.0
[upbound-marketplace-29]: https://marketplace.upbound.io/providers/upbound/provider-family-azure/v0.32.0
