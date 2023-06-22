---
title: Product Lifecycle
---

## Software List

Upbound provides support and software maintenance to paid customers. Supported software products include:

* [UXP]({{< ref "uxp/_index.md" >}})
* [Official Providers]({{< ref "upbound-marketplace/providers/_index.md" >}})

## Maintenance and Updates

Upbound supports Generally Available releases for up to 12 months. 
All software follows semantic versioning of `X.Y.Z`.

* A major release is a change in the first digit and usually indicates breaking API changes or, in the case of 1.0.0, indicates the first release where the API is considered complete and stable.
* A minor release is a change in the second digit and indicates new features were added. It could also include new bug fixes that were not included in a previous patch release.
* A patch release is a change in the third digit and only contains bug fixes, no new features.

Upbound fixes bugs in supported major releases and the latest minor release
Upbound backports only critical bugs (both functional and security) to older minor releases.

### UXP Schedule

UXP follows the [Crossplane Release Cycle](https://docs.crossplane.io/knowledge-base/guides/release-cycle/). UXP has a major release every 3 months. Minor patch releases are available as needed. Upbound provides support for the current + 2 previous minor releases.

### Official Provider Schedule

Official providers are released at least monthly. 

Upbound provides support and patch maintenance for the last 12 months of Official Provider releases. The list of Official Providers is here: [Upbound Marketplace](https://marketplace.upbound.io/providers?tier=official).

## Pre-Releases

Customers with paid support contracts are eligible for pre-release cuts on an as-needed basis for all covered software.