---
title: "Official Providers"
weight: 350
icon: "upbound-official"
description: Upbound creates, maintains and supports a set of Crossplane providers called official providers.
aliases:
  - upbound-marketplace/providers
---

Upbound creates, maintains and supports a set of Crossplane providers published as **Official** providers in the
Marketplace.

The Upbound official providers are open source under the Apache 2.0 license. Upbound recommends using the Official
providers for all deployments.

<!-- vale write-good.Passive = NO -->
The following providers are designated Upbound Official and are subject to
Upbound's publishing and access policies.
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

Find the Official providers in the [Upbound Marketplace](https://marketplace.upbound.io/providers?tier=official) where all Official providers have an `Official` tag.

Read more information on the Official provider
[release schedule and support window]({{<ref "../../reference/lifecycle.md" >}}).

For information on access and support view the [Official provider policies]({{<ref "./policies.md" >}}).

Upbound customers with subscriptions offering Official provider support can find more information available on
the [support page]({{<ref "../../support.md" >}}).

{{<img src="/upbound-marketplace/images/provider-by-upbound.png" alt="Official provider tag" size="tiny" unBlur="true" >}}
