---
title: Marketplace
description: How to use the Upbound Marketplace to discover Crossplane providers and
  packages.
---

[Upbound Marketplace][upbound-marketplace] simplifies your control plane journey with the largest registry for storing, managing, and sharing control plane extensions. It integrates seamlessly with Upbound's builder tooling. It also provides builders with pre-built Configurations and Functions to speed up control plane development workflows.

The Upbound Marketplace is the main source for publicly available Crossplane packages.

## Extensions in the Marketplace

The Marketplace supports the following control plane extensions:

- [Crossplane providers][crossplane-providers] are packages that enable Upbound control planes to interact with external APIs.
- [Control plane configurations][control-plane-configurations] are packages that define one or more resource types, called Composite Resources.
- [Composition functions][composition-functions] are packages that define reusable logic for composing Crossplane resources.

All extensions in the Marketplace are OCI images served from repositories.

## Features of the Marketplace

Key features of the Upbound Marketplace include:

- Upbound Official Packages ([Providers][providers], Configurations, Functions)
- Verified and community content
- Unlimited public repositories
- Private repositories
- API docs

## Trust tiers

<!-- vale write-good.Passive = NO -->
Extensions in the Marketplace are published and maintained by a variety of sources. Upbound categorizes each published extension according to a _Trust Tier_. Each tier is labeled with a corresponding badge to denote the source of an extension. You can also see the name of the organization responsible for the extension.
<!-- vale write-good.Passive = YES -->

<!-- vale Upbound.Spelling = NO -->

| Tier      | Description                                | Organization |
| --------- | ------------------------------------------ | ------------ |
| Official  | Extensions owned and maintained by Upbound | Upbound      |
| Partner   | Extensions owned, maintained, validated, and published by third-party companies | Third-party organization      |
| Community | Extensions owned and maintained by an individual or other members in the community | Third-party organization      |

<!-- vale Upbound.Spelling = YES -->


[providers]: /core-concepts/providers

[upbound-marketplace]: https://marketplace.upbound.io
[crossplane-providers]: https://marketplace.upbound.io/providers
[control-plane-configurations]: https://marketplace.upbound.io/configurations
[composition-functions]: https://marketplace.upbound.io/functions
