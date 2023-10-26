---
title: "Provider AWS"
weight: 1
description: Release notes for the AWS official provider
---

The below release notes are for the Upbound AWS official provider. These notes
only contain noteworthy changes and you should refer to each release's GitHub
release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance]({{<ref "support" >}}) page.

<!-- vale Google.Headings = NO -->

## v0.43.0

_Released 2023-10-26_

* Support for new resource: `ServerlessCluster.kafka`
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.43.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.43.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.43.0)

## v0.42.0

_Released 2023-10-12_

* Support for new resources: `SecurityGroupEgressRule.ec2`, `SecurityGroupIngressRule.ec2`
* The release contains some bug fixes, updates of dependencies, and promoting granular management policies to Beta.

_Refer to the [v0.42.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.42.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.42.0)

## v0.41.0

_Released 2023-09-29_

* Support for new family provider: `provider-aws-redshiftserverless`
* Support for new resources: `ScramSecretAssociation.kafka`, `JobDefinition.batch`, `EndpointAccess.redshiftserverless`
`RedshiftServerlessNamespace.redshiftserverless`, `ResourcePolicy.redshiftserverless`,
`Snapshot.redshiftserverless`, `UsageLimit.redshiftserverless` and `Workgroup.redshiftserverless`
* The release contains some bug fixes and configuring the default poll jitter for the controllers.

_Refer to the [v0.41.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.41.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.41.0)

## v0.40.0

_Released 2023-08-31_

* Support for new resource: `RolePolicy.iam`
* The release contains the ability to define roles with `inline policy` 
and `managed policy arn` in the Role.iam resource and some bug fixes.

_Refer to the [v0.40.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.40.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.40.0)

## v0.39.0

_Released 2023-08-23_

* Support for new resources: `PrincipalAssociation.ram` and `ResourceShareAccepter.ram`
* The release contains some important bug fixes to the granular
management policies and a fix in the reconciliation logic of the Upjet runtime.
* Updated Terraform CLI to 1.5.5 to address CVEs in previous Terraform versions.

_Refer to the [v0.39.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.39.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.39.0)

## v0.38.0

_Released 2023-08-01_

* This release adds support for the `spec.initProvider` API and for the granular management
policies alpha feature.
* Bug fixes and enhancements.

_Refer to the [v0.38.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.38.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.38.0)

## v0.37.0

_Released 2023-06-27_

* ⚠️ The family providers now require Crossplane version v1.12.1 or later.
* Support for new resources: `datasync` and `route53_zone_association`.
* Bug fixes and enhancements

_Refer to the [v0.37.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.37.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.37.0)

## v0.36.0

_Released 2023-06-13_

* This release introduces the new [provider families architecture]({{<ref "provider-families">}}) for
the Upbound official AWS provider.
* Bug fixes and enhancements.

_Refer to the [v0.36.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.36.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.36.0)

## v0.35.0

_Released 2023-05-15_

* Update the AWS Terraform provider version to v4.66.0
* Adds [LocalStack](https://localstack.cloud/) support for testing.
* Various bug fixes and enhancements.

_Refer to the [v0.35.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.35.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.35.0)

<!-- vale Google.Headings = YES -->