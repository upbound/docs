---
title: "Official Providers"
weight: 350
icon: "upbound-official"
description: Upbound creates, maintains and supports a set of Crossplane providers called official providers.
aliases:
  - upbound-marketplace/providers
---

Upbound creates, maintains and supports a set of Crossplane providers published as **Official** providers in the
Marketplace. Official providers are listings on the Marketplace which Upbound owns and maintains. They're published under the `upbound` organization and have an [Official](https://marketplace.upbound.io/providers?tier=official) tag.

{{<img src="providers/images/official-providers.png" alt="Official providers" size="medium" unBlur="true" >}}

The Upbound official providers are open source under the [Apache 2.0 license]({{<ref "policies#license" >}}).

{{< hint "tip" >}}
Official Packages are Marketplace listings published under the `upbound` organization and bear the _Upbound Official_ trust tier label. Some Official Providers are built in part from open source repos under the [crossplane-contrib](https://github.com/crossplane-contrib) GitHub organization. 

That source code is completely OSS; it's the Marketplace listing which Upbound owns that makes it Upbound Official and which has an access and use policy.
{{< /hint >}}

<!-- vale write-good.Passive = NO -->
The following providers are designated Upbound Official and are subject to
Upbound's [publishing and access policies]({{<ref "policies#access" >}}).
<!-- vale write-good.Passive = YES -->


{{< table >}}
| Official provider                                                                                        | Upjet-based | Provider family |
| -------------------------------------------------------------------------------------------------------- | ----------- | --------------- |
| [upbound/provider-family-aws](https://marketplace.upbound.io/providers/upbound/provider-family-aws/)     | Yes         | Yes             |
| [upbound/provider-family-azure](https://marketplace.upbound.io/providers/upbound/provider-family-azure/) | Yes         | Yes             |
| [upbound/provider-family-gcp](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/)     | Yes         | Yes             |
| [upbound/provider-azuread](https://marketplace.upbound.io/providers/upbound/provider-azuread/)           | Yes         | No              |
| [upbound/provider-terraform](https://marketplace.upbound.io/providers/upbound/provider-terraform/)       | No          | No              |
| [upbound/provider-kubernetes](https://marketplace.upbound.io/providers/upbound/provider-kubernetes/)     | No          | No              |
| [upbound/provider-helm](https://marketplace.upbound.io/providers/upbound/provider-helm/)                 | No          | No              |
{{< /table >}}

Read more information on the [Official provider policies]({{<ref "policies#access" >}}) governing access, support and
more.
