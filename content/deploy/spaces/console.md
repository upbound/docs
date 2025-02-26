---
title: Upbound Console
weight: 5
description: An introduction to the Console feature of Upbound
aliases:
    - all-spaces/spaces/console
    - /console
---

Upbound's Console is the command and control center for users to operate their organization's internal cloud platforms. The Console consolidates management of your internal cloud platforms under a single pane of glass. You can view usage and logs, debug control plane operations, and more across all your control planes.

## Dashboard

The default landing page for the Console is the control plane dashboard. On the dashboard is a table view of your managed control planes showing key details such as name, status, configuration version, and creation date. You can search the table by control plane name to filter down the table.

Above the dashboard is Upbound's top navigation bar. Wherever you are in the product, the navigation bar allows you to access:

- Control plane dashboard
- Configurations list
- Organization settings and management
- Help and documentation
- the Upbound Marketplace
- Account management and an org picker (if you belong to several organizations)

{{<img src="deploy/spaces/images/ctp-dashboard.png" alt="Upbound Console" lightbox="true">}}

<!-- vale Google.Headings = NO -->
## Control Plane Explorer
<!-- vale Google.Headings = YES -->

Clicking into a control plane brings you to the control plane explorer. From the control plane explorer you can learn how to integrate the control plane

{{<img src="deploy/spaces/images/ctp-explorer2.png" alt="control plane explorer" lightbox="true">}}

<!-- vale Google.Headings = NO -->
## MCP and configuration creation
<!-- vale Google.Headings = YES -->

You can create new managed control planes from the dashboard.

Creating a new managed control plane from the Console:

{{<img src="deploy/spaces/images/create-ctp.png" alt="Create an MCP" lightbox="true">}}

You can create new configurations from the configurations list.

Creating a new Git-synced configuration from a gallery of starter configurations:

{{<img src="deploy/spaces/images/create-config.png" alt="Create a configuration" quality="100" lightbox="true">}}

## Organization and team management

Clicking the gear icon (Organization Settings) in the top navigation bar takes you to the organization management pane. You can create new team members, assign roles, and more.

{{<img src="deploy/spaces/images/org-mgmt.png" alt="org management" lightbox="true">}}

## Account management

Clicking on your account profile and selecting `My Account` takes you to your personal account settings.

### Create a personal access token

You can create a personal access token (`PAT`) from the Account Settings view. Select `API Tokens` in the left-side menu and then select `Create New Token`. Use personal access tokens to authenticate to Upbound with the `up` CLI.

{{<img src="deploy/spaces/images/settings-api-token.png" alt="Create a personal access token" lightbox="true">}}
