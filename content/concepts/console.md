---
title: Upbound Console
weight: 5
description: An introduction to the Console feature of Upbound
---

Upbound’s Console is the command and control for users to operate their organization’s internal cloud platforms. The Console consolidates management of your internal cloud platforms under a single pane of glass, allowing you to view usage and logs, debug control plane operations, and more across all of your control planes. 

## Dashboard

The default landing page for the Console is the dashboard view. On the dashboard, you will find a grid view of your managed control planes, along with a horizontally scrolling list of your git-synced configurations. 

Above the dashboard, you will find Upbound's top navigation bar. The Navigation bar can:

- Return to the control planes dashboard
- Organization settings and management
- Help and documentation
- the Upbound Marketplace
- Account management and an org picker (if you belong to several organizations)

{{<img src="concepts/images/dashboard.png" alt="Upbound Console" quality="100" lightbox="true">}}

## Control Plane Explorer

Clicking into a control plane brings you to the control plane explorer. From the control plane explorer you can navigate to its [portal]({{<ref "ctp-portal">}}), learn how to integrate the control plane [with GitOps]({{<ref "control-plane-connector">}}) flows, and the control plane settings.

{{<img src="concepts/images/ctp-explorer.png" alt="control plane explorer" quality="100" lightbox="true">}}

## MCP and Configuration creation

You can create new managed control planes and git-synced configurations from the dashboard. 

Creating a new managed control plane from the Console:

{{<img src="concepts/images/mcp-create-flow.png" alt="Create an MCP" quality="100" lightbox="true">}}

Creating a new git-synced configuration from a gallery of starter configurations:

{{<img src="concepts/images/config-create-flow.png" alt="Create a configuration" quality="100" lightbox="true">}}

## Org and Team Management

Clicking the gear icon (Organization Settings) in the top navigation bar takes you to the org management pane, where you can create new team members, assign roles, and more.

{{<img src="concepts/images/org-mgmt.png" alt="org management" quality="100" lightbox="true">}}
