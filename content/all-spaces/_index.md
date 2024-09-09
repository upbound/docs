---
title: Spaces
weight: 1
description: An introduction to Spaces hosting feature in Upbound
aliases:
    - "/spaces"
    - "/concepts/upbound-spaces"
---

Upbound Spaces are hosting environments for Upbound's managed Crossplane control planes. 

Upbound is made up of a Global Console, with complementary API and CLI, that users use to manage operations for MCPs which are deployed in hosting environments called Spaces. Upbound supports two types of Spaces: Cloud Spaces and Connected Spaces. Users have the freedom to choose whether to run MCPs in Cloud Spaces, Connected Spaces, or both.

## Cloud Spaces

Cloud Spaces are multi-tenant deployments of Upbound, operated by Upbound inside our cloud environments. With Cloud Spaces, you get a fully managed SaaS experience that includes MCPs as well as management of the hosting infrastructure, management of the backing MCP persistent storage layer, and management of the infrastructure for backup and restore.

Choosing to run in Upbound’s multi-tenant Cloud Spaces offers the most turnkey managed Crossplane experience. Upbound hosts Cloud Spaces in multiple Cloud Service Providers and regions, giving you the flexibility to have a fully managed SaaS experience wherever you need to run Crossplane. 

## Self-hosted Spaces

A self-hosted Space is a single-tenant deployment of Upbound within your
infrastructure. Upbound offers self-hosted Spaces as a Disconnected Space or
Connected Space.

### Connected Spaces

Connected Spaces allows you to use Upbound's Console, CLI, and API to manage your control planes. 

We've packaged the best parts of Upbound into a Helm chart and can deploy and operate them on your own infrastructure, bringing you the best of SaaS with the added benefit of additional security guarantees and a deployment free of noisy neighbors.

With Connected Spaces, it's more than just an on-premises deployment of your MCPs; the Crossplane experts at Upbound are operating your control planes alongside your team for a truly fully managed Crossplane solution. The Upbound team is on-call for your control planes.

## Disconnected Spaces

Like a _Connected Space_, a Disconnected Space is a single-tenant deployment of Upbound within your infrastructure, such as your Amazon Web Services (AWS) cloud account or Microsoft Azure subscription. However, there's no connectivity to the rest of the Upbound product and you're limited to a command-line interface to interact within a single Space context.
