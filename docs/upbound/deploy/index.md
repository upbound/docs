---
title: Deploy Upbound 
sidebar_position: 1
description: An introduction to Spaces hosting feature in Upbound
aliases:
    - /all-spaces/_index
    - "/spaces"
    - "/concepts/upbound-spaces"
    - all-spaces/_index.md
icon: balloon
category: "guides"
---
<!-- vale write-good.TooWordy = NO -->
<!-- vale gitlab.SentenceLength = NO -->

Upbound Spaces are hosting environments for Upbound's managed Crossplane control planes.

<!-- vale write-good.Passive = NO -->
Upbound offers a Global Console, with complementary API and CLI, that users use
to manage operations for control planes. Control planes are deployed in hosting environments called Spaces.
Upbound supports two types of Spaces: Cloud Spaces and Connected Spaces. Users
have the freedom to choose whether to run control planes in Cloud Spaces, Connected
Spaces, or both.
<!-- vale write-good.Passive = YES -->

<!-- vale Google.Headings = NO -->
## Cloud Spaces
<!-- vale Google.Headings = YES -->

<!-- vale Google.We = NO -->

Cloud Spaces are multi-tenant deployments of Upbound, operated by Upbound inside
our cloud environments. With Cloud Spaces, you get a fully managed SaaS
experience, control planes, hosting infrastructure management, persistent storage
management, and backup and restore management.

<!-- vale Google.We = YES -->


Choosing to run in Upbound's multi-tenant Cloud Spaces offers the most turnkey
managed Crossplane experience. Upbound hosts Cloud Spaces in multiple Cloud
Service Providers and regions. This gives you the flexibility to have a fully
managed SaaS experience wherever you need to run Crossplane.

<!-- vale Google.Headings = NO -->
## Self-hosted Spaces
<!-- vale Google.Headings = YES -->

A self-hosted Space is a single-tenant deployment of Upbound within your
infrastructure. Upbound offers self-hosted Spaces as a Disconnected Space or
Connected Space.

<!-- vale Google.Headings = NO -->
### Connected Spaces
<!-- vale Google.Headings = YES -->

Connected Spaces allows you to use Upbound's Console, CLI, and API to manage your control planes.

<!-- vale Google.We = NO -->
We've packaged the best parts of Upbound into a Helm chart and can deploy and
operate them on your own infrastructure. You get the best of SaaS with the benefit of additional security guarantees and a deployment free of noisy
neighbors.
<!-- vale Google.We = YES -->

With Connected Spaces, it's more than just an on-premises deployment of your control planes; the Crossplane experts at Upbound are operating your control planes alongside your team for a truly fully managed Crossplane solution. The Upbound team is on-call for your control planes.

<!-- vale Google.Headings = NO -->
## Disconnected Spaces
<!-- vale Google.Headings = YES -->

Like a _Connected Space_, a Disconnected Space is a single-tenant deployment of Upbound within your infrastructure, such as your Amazon Web Services (AWS) cloud account or Microsoft Azure subscription. However, there's no connectivity to the rest of the Upbound product and you're limited to a command-line interface to interact within a single Space context.
<!-- vale write-good.TooWordy = YES -->
<!-- vale gitlab.SentenceLength = YES -->
