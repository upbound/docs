---
title: Get Upbound
sidebar_position: 1
slug: "/getstarted"
---
import { GetStarted } from '@site/src/components/GetStartedCallout';

<!-- vale gitlab.SentenceLength = NO -->
Welcome to Upbound, the enterprise platform for Crossplane that helps you build
autonomous infrastructure platforms at scale. Whether you're already using Open
Source Crossplane or exploring control planes for the first time, Upbound
provides the tools and services to take your infrastructure automation to the
next level.

<!-- vale Google.We = NO -->
Upbound allows you to expose infrastructure across clouds, vendors, and systems
through a single programmable API surface that works for humans and intelligent
agents alike. Upbound powers this API surface with **Upbound Crossplane 2.0
(UXP)** - our next-generation control plane that delivers enterprise-grade
reliability, performance, and developer experience. 

<!-- vale Microsoft.HeadingPunctuation = NO -->

## Already using open source Crossplane?
<!-- vale Google.WordList = NO -->
If you're already using Crossplane and want to check out Upbound Crossplane
2.0, you can upgrade an existing Crossplane cluster with Helm or the `up`
CLI.

<Tabs>

<TabItem value="Helm Install">

```shell
helm upgrade crossplane --namespace crossplane-system upbound-stable/universal-crossplane --devel
```
:::important
For more details, follow our [Upgrade Guide][upgrade] to see how Upbound can enhance your existing workflow.
:::

</TabItem>


<TabItem value="Up CLI">

Download the `up` CLI and upgrade an existing test cluster.

**Download the CLI:**

```shell
curl -sL "https://cli.upbound.io" | sh
```

**Upgrade an existing Crossplane cluster to UXP:**

```shell
up uxp upgrade
```

</TabItem>

</Tabs>

<!-- vale Google.WordList = YES -->


## New to Crossplane and Upbound?

<GetStarted />

<!-- vale Microsoft.Contractions = NO -->
## What is Upbound?
<!-- vale Microsoft.Contractions = YES -->
<!-- vale Microsoft.HeadingPunctuation = YES -->

Upbound is the platform that helps platform engineers automate and build their
platforms.

The power of the Upbound platform is the **control plane**. A control plane is
software that controls other software by exposing custom APIs for your
infrastructure to automatically maintain your desired state. Upbound's control
plane framework lets you manage infrastructure and resources across clouds and
services.

**The value of control planes is building your own custom APIs to provision the
resources your users need.**

The control plane constantly monitors your cloud resources to meet the state you
define in your custom APIs. You define your resources and Upbound parses,
connects with the service, and manages the lifecycle on your behalf.


## Next steps

<!-- vale Google.We = YES -->
* Follow the [introduction][intro] guide to get started building your own control plane.
* For OSS Crossplane users, follow the [Upgrade][upgrade] guide.


<!-- vale gitlab.SentenceLength = YES -->
[upgrade]: /getstarted/upgrade-to-upbound/upgrade-to-uxp
[guides]: /guides
[register]: https://accounts.upbound.io/register
[up]: /manuals/cli/overview
[pricing]: https://upbound.io/pricing
[intro]: /getstarted/introduction/project
