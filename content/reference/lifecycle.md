---
title: Product Lifecycle
weight: 100
description: "Information on Upbound software versions, support windows, and release policies."
---

## Software list

Upbound provides support and software maintenance to paid customers. Supported software products include:

* [Spaces]({{< ref "spaces" >}})
* [UXP]({{< ref "uxp/_index.md" >}})
* [Official Providers]({{< ref "providers/policies.md#support" >}})

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

Spaces has a minor release cadence of every two months. Minor patch releases are made available as needed. Upbound provides 6 months of
mainstream support and 6 months of maintenance support for each minor release. Only critical security issues (for example, High or Critical CVEs) and
functional bugs deemed critical qualify under maintenance support.

<!-- vale write-good.Passive = NO -->
Upgrades to a newer version must be done sequentially according to the minor
release.
<!-- vale write-good.Passive = YES -->

For example, if you are on `v1.4.x` you must update to `v1.5.x` before `v1.6.x`. 
We strongly recommend using the latest patch release of a minor version in the upgrade process.

### UXP schedule

<!-- vale write-good.Weasel = NO -->
UXP follows the [Crossplane Release Cycle](https://docs.crossplane.io/knowledge-base/guides/release-cycle/). UXP has a
minor release roughly every 3 months in accordance with the upstream Crossplane release. 

Upbound releases a new minor version of UXP roughly two weeks after the Crossplane release is made available upstream.

Minor patch releases are made available as needed. Upbound provides support for the current and 2 previous minor releases of UXP.
<!-- vale write-good.Weasel = YES -->

Upbound fixes bugs in supported releases. Upbound backports only critical bugs (both
functional and security) to older minor releases.

## Feature launch stages

<!-- vale Microsoft.Adverbs = NO -->
<!-- allow "Generally" -->
Upbound's features are available in one of three stages: Public preview, Generally Available, or Deprecated.
<!-- vale Microsoft.Adverbs = NO -->

### Public preview

Public preview features are ready for testing by customers. Public preview features are often publicly announced, but not necessarily
feature-complete. Preview features don't have an SLA and technical support is limited to business hours. Unless stated otherwise by
Upbound, it's intended that you use preview features in test environments only.

Often times, [alpha features](https://docs.crossplane.io/knowledge-base/guides/feature-lifecycle/#alpha-features) in
Crossplane manifest as Preview features in Upbound. Preview features aren't enabled by default and are opt-in, unless stated
otherwise.

### Generally Available

Generally available features are open to all customers, ready for production use, and covered by Upbound's SLA.

### Deprecated

Deprecated features are features that Upbound plans to remove from the product at some point in the future. Upbound
provides customers 12 months notice before discontinuing the feature, unless Upbound replaces it with a feature having
materially similar use.

## Pre-releases

Customers with paid support contracts are eligible for pre-release cuts on an as-needed basis for all covered software.
