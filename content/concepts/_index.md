---
title: Concepts
weight: 2
description: A guide to the concepts of Upbound
icon: "lightbulb"
description: "Understand Upbound including managed control planes, the Upbound Console and GitOps with Upbound."
---

Upbound is built around the following core concepts:

## Managed Control Planes (MCPs)
Crossplane control plane environments that are fully managed by Upbound. [Learn more]({{<ref "concepts/managed-control-planes.md" >}}).

## Configurations
Packages that bundle a set of API definitions which get installed on a managed control plane. Configurations in Upbound are defined in Git and Upbound automatically syncs and deploys the definition to your managed control planes. [Learn more]({{<ref "concepts/control-plane-configurations.md" >}}).

## Upbound Console
The single point of control for all of your control planes running on Upbound. The Console consolidates management of your MCPs under a single pane of glass, allowing you to view usage, logs, debug control plane operations, and more. [Learn more]({{<ref "concepts/console.md" >}}).

## GitOps with MCP Connector
A component offered by Upbound that allows you to connect application clusters running outside of Upbound to your managed control planes running in Upbound, so you can do GitOps flows and use Git to drive interactions with your MCPs. [Learn more]({{<ref "concepts/control-plane-connector.md" >}}).

## Control Plane Portal
A CRUD portal interface for you to use to interact directly with the APIs on your control plane. [Learn more]({{<ref "concepts/ctp-portal.md" >}}).

