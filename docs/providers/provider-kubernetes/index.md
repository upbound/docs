---
title: "Provider Kubernetes"
weight: 1
description: Release notes for the Kubernetes official provider
---

The below release notes are for the Upbound Kubernetes official provider. These
notes only contain noteworthy changes and you should refer to each release's
GitHub release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance][support-and-maintenance] page.

:::important
Beginning with `v1.21.0` and later, you need at least a `Team` subscription to pull a given Official Provider version.  All prior versions are pullable without a subscription. 
If you're not subscribed to Upbound or have an `Individual` tier subscription, you can still always pull **the most recent provider version** using the `v1` tag.
:::

<!-- vale Google.Headings = NO -->

## v0.16.0

_Released 2024-11-07_

* This release introduces dependency updates and workflow updates.

_Refer to the [v0.16.0 release notes][v0-16-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace]

## v0.15.0

_Released 2024-09-17_

* This release introduces Alpha support for Server Side Apply.
Enable this feature using the `--enable-server-side-apply` flag.

_Refer to the [v0.15.0 release notes][v0-15-0-release-notes] for full details._

Install the provider from the [Upbound Marketplace][upbound-marketplace-1]
<!-- vale Google.Headings = YES -->


[support-and-maintenance]: /usage/support

[v0-16-0-release-notes]: https://github.com/crossplane-contrib/provider-kubernetes/releases/tag/v0.16.0
[upbound-marketplace]: https://marketplace.upbound.io/providers/upbound/provider-kubernetes/v0.16.0
[v0-15-0-release-notes]: https://github.com/crossplane-contrib/provider-kubernetes/releases/tag/v0.15.0
[upbound-marketplace-1]: https://marketplace.upbound.io/providers/upbound/provider-kubernetes/v0.15.0
