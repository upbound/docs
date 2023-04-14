---
title: Concepts
weight: 2
description: A guide to the concepts of Upbound
icon: "lightbulb"
description: "Understand Upbound including managed control planes, the Upbound Console and GitOps with Upbound."
---

Upbound's core concepts include:

<!-- vale Google.Headings = NO -->
## Managed Control Planes (MCPs)
<!-- vale Google.Headings = NO -->
Crossplane control plane environments that are fully managed by Upbound. [Learn more]({{<ref "concepts/managed-control-planes.md" >}}).

## Configurations
Configurations are packages that bundle a set of API definitions which get installed on a managed control plane. Upbound defines configurations in Git and automatically syncs and deploys the definition to your managed control planes. [Learn more]({{<ref "concepts/control-plane-configurations.md" >}}).

## Upbound Console
The single point of control for all your control planes running on Upbound. The Console consolidates management of your MCPs under a single pane of glass, allowing you to view usage, logs, debug control plane operations, and more. [Learn more]({{<ref "concepts/console.md" >}}).

## GitOps with MCP Connector
Connect application clusters running outside of Upbound to your managed control planes running in Upbound. This allows GitOps flows and use Git to drive interactions with your MCPs. [Learn more]({{<ref "concepts/control-plane-connector.md" >}}).

## Control Plane Portal
A Create, Read, Update, Delete (`CRUD`) portal interface for you to use to interact directly with the APIs on your control plane. [Learn more]({{<ref "concepts/ctp-portal.md" >}}).

