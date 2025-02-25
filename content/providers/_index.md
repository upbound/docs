---
title: "Official Providers"
weight: 350
icon: "upbound-official"
description: Upbound creates, maintains and supports a set of Crossplane providers called official providers.
aliases:
  - upbound-marketplace/providers
---

Upbound Official Providers are Crossplane providers built as OCI images and published into the [Upbound Marketplace](https://marketplace.upbound.io/providers?tier=official). Upbound publishes, maintains, and supports these listings. They're denoted with a _Trust Tier_ label of **Official**. They're published under the `upbound` organization.

<!-- vale off -->
## Introduction

Official Providers are commercially licensed builds of Crossplane providers. These providers may be closed source, or they may be downstream from open source (such as the case for [provider-family-aws](https://github.com/crossplane-contrib/provider-upjet-aws)).

Upbound publishes and maintains Official Providers. Some enterprise-grade advantages of Official Providers are:

* Multi-language [resource schemas]({{<ref "core-concepts" >}}) (KCL, Python, and more on the way) that improve the Crossplane composition authoring experience.
* Backporting of fixes supported during 12 months of mainstream support + 6 months additional access
* An SBOM
* [Signed by Upbound]({{<ref "signature-verification" >}})
* Commercial support available from Upbound

Upbound's Official Providers integrate with the Upbound platform to provide the best provider experience. You need an [account on Upbound](https://accounts.upbound.io/register) to [pull an Official Provider]({{<ref "policies#access" >}}).
<!-- vale on -->

## Official Providers list

<!-- vale Microsoft.Adverbs = NO -->
Upbound is continually adding new providers to the ever growing list of Official Providers. For a complete list of available Official providers, use [this query](https://marketplace.upbound.io/providers?tier=official) in the Marketplace.
<!-- vale Microsoft.Adverbs = YES -->

## Access

The latest versions of the Upbound Official Providers are available for use by anyone in the Crossplane community. For full access and use details, read the [policies page]({{<ref "policies#access" >}}) on access, support and more.
