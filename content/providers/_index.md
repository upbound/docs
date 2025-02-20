---
title: "Official Providers"
weight: 350
icon: "upbound-official"
description: Upbound creates, maintains and supports a set of Crossplane providers called official providers.
aliases:
  - upbound-marketplace/providers
---

Upbound Official Providers are Crossplane providers built as OCI images and published into the [Upbound Marketplace](https://marketplace.upbound.io/providers?tier=official). Upbound publishes, maintains, and supports these listings. They're denoted with a _Trust Tier_ label of **Official**. They're published under the `upbound` organization.

<!-- vale OFF -->

## Introduction

Official Providers are commercially licensed builds of Crossplane providers. These providers may be closed source, or they may be downstream from open source (such as the case for [provider-family-aws](https://github.com/crossplane-contrib/provider-upjet-aws)).

Upbound builds and supports our commercial providers. They're published by the Upbound org. Official Providers bundle additional enterprise-grade value:

* Multi-language [resource schemas]({{<ref "core-concepts" >}}) (KCL, Python, and more on the way) that dramatically improve the Crossplane composition authoring experience.
* Backporting supported for during 12 months of mainstream support + 6 months additional access
* An SBOM
* [Signed by Upbound]({{<ref "signature-verification" >}})
* Commercial support from Upbound

Official Providers are the best Crossplane provider experience imaged, integrated with the rest of the Upbound platform. To [pull an Official Provider]({{<ref "policies#access" >}}), you must have an account on Upbound.

<!-- vale ON -->

## Official Providers list

<!-- vale Microsoft.Adverbs = NO -->
Upbound is continually adding new providers to the ever growing list of Official Providers. For a complete list of available Official providers, use [this query](https://marketplace.upbound.io/providers?tier=official) in the Marketplace.
<!-- vale Microsoft.Adverbs = YES -->

## Access

The latest versions of the Upbound Official Providers are available for use by anyone in the Crossplane community. For full access and use details, read the [policies page]({{<ref "policies#access" >}}) on access, support and more.
