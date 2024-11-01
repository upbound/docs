---
title: Product Lifecycle
weight: 100
description: "Information on Upbound software versions, support windows, and release policies." 
---

## Software list

Upbound provides support and software maintenance to paid customers. Supported software products include:

* [Spaces]({{< ref "spaces" >}})
* [UXP]({{< ref "uxp/_index.md" >}})
* [Official Providers]({{< ref "providers/_index.md" >}})

## Maintenance and updates

<!-- vale Microsoft.Adverbs = NO --> 
<!-- allow "Generally" -->
Upbound supports Generally Available releases for a defined time span, depending on the release cycle of the respective
component. See below for details. All software follows semantic versioning of `X.Y.Z`.
<!-- vale Microsoft.Adverbs = NO --> 

* A **major release** is a change in the first digit and indicates breaking API changes or for 1.0.0 indicates the first
  release where the API is complete and stable.
* A **minor release** is a change in the second digit and indicates the addition of new features. It may also include
  new bug fixes that weren't included in a previous patch release.
* A **patch release** is a change in the third digit and only contains bug fixes, no new features.

### Spaces schedule

Spaces has a minor release every month. Minor patch releases are available as needed. Upbound provides 6 months of
mainstream support and 6 months of maintenance support for each minor release. Only critical security issues and
functional bugs deemed critical qualify under maintenance support.

Upgrades to a newer version must be done sequentially according to the minor release. E.g., Upgrading from `v1.4.x` to
`v1.6.x`, must be preceded by first upgrading to `v1.5.x`

### UXP schedule

UXP follows the [Crossplane Release Cycle](https://docs.crossplane.io/knowledge-base/guides/release-cycle/). UXP has a
major release roughly every 3 months. Minor patch releases are available as needed. Upbound provides support for the
current and 2 previous minor releases.

Upbound fixes bugs in supported major releases and the latest minor release. Upbound backports only critical bugs (both
functional and security) to older minor releases.

### Official provider schedule

Upbound releases new minor versions of Official providers on a roughly monthly cadence.

For those with a Team tier or higher subscription, Upbound supports its Official providers for 12 months from the
release date. Once the support window has lapsed, an unsupported provider version is accessible for another 6 months in
the Upbound Marketplace.

{{< hint "important" >}}
The support window for Upbound official providers for AWS, Azure, AzureAD, and GCP on versions before v1.0.0 ends after
31 Jan 2025.
{{< /hint >}}

Refer to the [access and policies]({{<ref "../../providers/access-support-policies.md" >}}) of the Official providers
for more details.

## Feature launch stages

<!-- vale Microsoft.Adverbs = NO --> 
<!-- allow "Generally" -->
Upbound's features are available in one of three stages: preview, generally available, or deprecated.
<!-- vale Microsoft.Adverbs = NO --> 

### Preview

Preview features are ready for testing by customers. Preview features are often publicly announced, but not necessarily
feature-complete. Preview features don't have an SLA or technical support commitment. Unless stated otherwise by
Upbound, it's intended that you use preview features in test environments only.

Often times, [alpha features](https://docs.crossplane.io/knowledge-base/guides/feature-lifecycle/#alpha-features) in
Crossplane manifest as preview features in Upbound. Preview features aren't enabled by default and opt-in, unless stated
otherwise.

### Generally Available

Generally available features are open to all customers, ready for production use, and covered by Upbound's SLA.

### Deprecated

Deprecated features are features that Upbound plans to remove from the product at some point in the future. Upbound
provides customers 12 months notice before discontinuing the feature, unless Upbound replaces it with a feature having
materially similar use.

## Pre-Releases

Customers with paid support contracts are eligible for pre-release cuts on an as-needed basis for all covered software.
