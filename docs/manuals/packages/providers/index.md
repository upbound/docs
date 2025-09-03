---
title: Official Providers
description: Upbound creates, maintains and supports a set of Crossplane providers
  called official providers.
---

Upbound Official Providers are Crossplane providers built as OCI images and published into the [Upbound Marketplace][upbound-marketplace]. Upbound publishes, maintains, and supports these listings. They're denoted with a _Verification_ label of **Official**. They're published under the `upbound` organization.

<!-- vale off -->
## Introduction

Official Providers are commercially licensed builds of Crossplane providers. These providers may be closed source, or they may be downstream from open source (such as the case for [provider-family-aws][provider-family-aws]).

Upbound publishes and maintains Official Providers. Some enterprise-grade advantages of Official Providers are:

* Multi-language resource schemas for [KCL][kcl], [Python][python], [Go][go], and [Go Templating][gotemplating] to improve the Crossplane composition authoring experience.
* Backporting of fixes supported during 12 months of mainstream support + 6 months additional access
* An SBOM
* [Signed by Upbound][signed-by-upbound]
* Commercial support available from Upbound

Upbound's Official Providers integrate with the Upbound platform to provide the best provider experience. You need an [account on Upbound][account-on-upbound] to [pull an Official Provider][pull-an-official-provider].
<!-- vale on -->

## Official Providers list

<!-- vale Microsoft.Adverbs = NO -->
Upbound is continually adding new providers to the ever growing list of Official Providers. For a complete list of available Official providers, use [this query][this-query] in the Marketplace.
<!-- vale Microsoft.Adverbs = YES -->

## Access

The latest versions of the Upbound Official Providers are available for use by anyone in the Crossplane community. For full access and use details, read the [policies page][policies-page] on access, support and more.


[kcl]: /manuals/cli/howtos/compositions/kcl/
[python]: /manuals/cli/howtos/compositions/python/
[go]: /manuals/cli/howtos/compositions/go/
[gotemplating]: /manuals/cli/howtos/compositions/go-template/
[signed-by-upbound]: /manuals/packages/providers/signature-verification
[pull-an-official-provider]: /manuals/packages/policies
[policies-page]: /manuals/packages/policies


[upbound-marketplace]: https://marketplace.upbound.io/providers?tier=official
[provider-family-aws]: https://github.com/crossplane-contrib/provider-upjet-aws
[account-on-upbound]:https://www.upbound.io/register/?utm_source=docs&utm_medium=cta&utm_campaign=docs_providers
[this-query]: https://marketplace.upbound.io/providers?tier=official
