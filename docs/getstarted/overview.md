---
title: Get Upbound
sidebar_position: 1
slug: "/getstarted"
---
import { GetStarted } from '@site/src/components/GetStartedCallout';

Welcome to Upbound, a platform for building autonomous infrastructure platforms
that provision, operate, and adapt without human intervention.

Upbound allows you to expose infrastructure across clouds, vendors, and systems
through a single programmable API surface that works for humans and intelligent
agents alike. Upbound powers this API surface with **Upbound Crossplane 2.0
(UXP)** - our next-generation control plane that delivers enterprise-grade
reliability, performance, and developer experience. If you're new to Upbound and
Crossplane, this section guides you through the
essential resources to get started with UXP.

Follow the guides to help you get started and learn how Upbound can help you
build your own infrastructure platform.

For more advanced concepts and scenarios in Upbound, see [Guides][guides].


<GetStarted />

<!-- vale Microsoft.Contractions = NO -->
<!-- vale Microsoft.HeadingPunctuation = NO -->
## What is Upbound?
<!-- vale Microsoft.Contractions = YES -->

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

<!-- vale Microsoft.HeadingPunctuation = YES -->

## Next steps

Follow the [introduction][intro] guide to get started building your own control plane.

[guides]: /guides
[register]: https://accounts.upbound.io/register
[up]: /manuals/cli/overview
[pricing]: https://upbound.io/pricing
[intro]: /getstarted/introduction/project
