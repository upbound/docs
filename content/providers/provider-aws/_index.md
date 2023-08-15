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