---
title: Control Plane Portal
weight: 7
description: An introduction to the Developer Portal feature of a Managed Control Plane
---

Every managed control plane in Upbound can be directly interacted with via its portal. The control plane portal is a create, read, update, delete (`CRUD`) interface for the resources on your control plane.

{{<img src="concepts/images/ctp-portal.png" alt="Navigation to control plane portal" quality="100" size="medium" lightbox="true">}}

## Capabilities

The left pane of the portal shows all the available resource types installed on your MCP. Selecting a type shows a list of all running instances. View instances or edit them. You can also select the `Create New` button to create a new instance of the selected resource.

{{< hint "tip" >}}
To use "GitOps" with your MCP, you can use the [MCP Connector]({{<ref "concepts/mcp/control-plane-connector">}}).
{{< /hint >}}

### Create new resource instances

Selecting the `Create New` button takes you to a form creation experience that's dynamically generated based on the API definition of the selected resource. By default, the form shows the required resources in your definition (the Crossplane XRD). Select the `advanced` dropdown in the left-side menu to view optional resources.

{{< hint "tip" >}}
Example: If your resource has multiple compositions available and you want to select one, the `compositionSelector` field is available in the `advanced` dropdown.
{{< /hint >}}

{{<img src="concepts/images/portal-create.png" alt="Create new resources from the control plane portal" quality="100" size="large" lightbox="true">}}

This form generates a claim (a Crossplane `XRC`) for the resource type. Selecting `Create Instance` submits your claim to your managed control plane. Select the `Show YAML` button to View the claim. 

### View resource events

Selecting an instance of a resource shows the following information about the resource:
 - creation time 
 - if the MCP has synced it 
 - if resource is reporting `ready`
 - events emitted by its claim 
 
You can edit the claim for this resource by selecting the `Edit` button.

{{<hint "important" >}}
This view shows events that from the claim. This view doesn't show Composite Resource or Managed Resource events.
{{< /hint >}}

{{<img src="concepts/images/portal-events.png" alt="See resource events from the control plane portal" quality="100" size="large" lightbox="true">}}

## How to reach your control plane portal

To navigate to a control plane's portal, go to the `portal` tab in the control plane instance view and select `Open Control Plane Portal`.

{{<img src="concepts/images/ctp-portal-link.png" alt="Navigation to control plane portal" quality="100" size="large" lightbox="true">}}