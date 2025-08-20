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
2.0, follow our [Upgrade Guide][upgrade] to see how Upbound can enhance your existing
workflow.
<!-- vale Google.WordList = YES -->


## New to Crossplane and Upbound?

<GetStarted />

<!-- vale Microsoft.Contractions = NO -->
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

## Crossplane and Upbound comparison

<!-- vale Google.WordList = NO -->
| Feature | Open Source Crossplane | UXP/Upbound |
|---------|-------------------|--------------|
| **Cost** | Free and open source | Community: Free / Standard: $1000/month / Enterprise and Business Critical: Custom pricing |
| **Control Planes** | Unlimited | Unlimited / **5 (Standard)** / **Unlimited (Enterprise+)** |
| **Users** | Unlimited | Unlimited / **10 (Standard)** / **Unlimited (Enterprise+)** |
| **Private Repositories** | N/A | 1 / **5 (Standard)** / **Unlimited (Enterprise+)** |
| **Web UI** | None | Local Web UI |
| **CLI Tooling** | Basic `kubectl` | Up CLI with IDE integrations |
| **Official Package Access** | N/A | Latest releases / **Patch releases (Standard+)** |
| **Runtime** | Standard | Standard / **Enhanced runtime (Standard+)** |
| **Identity** | Manual setup | Manual / **Google and GitHub (Standard+)** |
| **Access Control** | Basic Kubernetes RBAC | Basic / **RBAC (Standard+)** |
| **Security** | Standard | Standard / **Enterprise Security (Enterprise+)** / **Advanced Security (Business Critical)** |
| **Hosting Options** | Self-managed only | Self-managed UXP / **Upbound Cloud hosting (Standard+)** / **Self-hosted and dedicated Spaces (Business Critical)** |
| **Control Plane Management** | Manual | Manual / **Control Plane Group Management (Enterprise+)** |
| **Support** | Community forums/GitHub | Community / **Email and Ticket Support (Enterprise+)** / **Dedicated Support (Business Critical)** |

## Next steps

<!-- vale Google.WordList = YES -->
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
