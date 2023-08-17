---
title: Product Lifecycle
---

## Software list

Upbound provides support and software maintenance to paid customers. Supported software products include:

* [UXP]({{< ref "uxp/_index.md" >}})
* [Official Providers]({{< ref "providers/_index.md" >}})

## Maintenance and updates

<!-- vale Microsoft.Adverbs = NO --> 
<!-- allow "Generally" -->
Upbound supports Generally Available releases for up to 12 months. 
All software follows semantic versioning of `X.Y.Z`.
<!-- vale Microsoft.Adverbs = NO --> 

* A major release is a change in the first digit and indicates breaking API
  changes or for 1.0.0 indicates the first release where the API is complete and stable.
* A minor release is a change in the second digit and indicates the addition of new features. It may also include new bug fixes that weren't included in a previous patch release.
* A patch release is a change in the third digit and only contains bug fixes, no new features.

Upbound fixes bugs in supported major releases and the latest minor release
Upbound backports only critical bugs (both functional and security) to older minor releases.

### UXP schedule

UXP follows the [Crossplane Release Cycle](https://docs.crossplane.io/knowledge-base/guides/release-cycle/). UXP has a major release every 3 months. Minor patch releases are available as needed. Upbound provides support for the current + 2 previous minor releases.

### Official Provider schedule

Upbound releases Official providers monthly. 

Upbound provides support and patch maintenance for the last 12 months of Official Provider releases. You can find the list of Official Providers in the [Upbound Marketplace](https://marketplace.upbound.io/providers?tier=official).

## Pre-Releases

Customers with paid support contracts are eligible for pre-release cuts on an as-needed basis for all covered software.