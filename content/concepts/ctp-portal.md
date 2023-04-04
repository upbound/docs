---
title: Control Plane Portal
weight: 7
description: An introduction to the Developer Portal feature of a Managed Control Plane
---

Every managed control plane in Upbound can be directly interacted with via its portal. The control plane portal is a simple CRUD (create, read, update, delete) interface for the resources on your control plane.

{{<img src="concepts/images/ctp-portal.png" alt="Navigation to control plane portal" quality="100" size="medium" lightbox="true">}}

## Capabilities

The left pane of the portal shows all the available resource types installed on your MCP. If you click on a type, the main view will show a list of all running instances. You can view instances or edit them. You can also click the `Create New` button to create a new instance of the selected resource.

{{< hint "tip" >}}
The control plane portal is not the _only_ interface to your control plane and you are not required to use it as the mechanism for interacting with your managed control plane's APIs. For example, if you want to do "GitOps" with your MCP, you can use the [MCP Connector]({{<ref "concepts/control-plane-connector">}}).
{{< /hint >}}

### Create new resource instances

Clicking the `Create New` button will take you to a form creation experience that is dynamically generated based on the API definition of the selected resource. By default, the form shows _only_ the resources that are marked as required in your definition (in your XRD). You can find the non-required fields by selecting the `advanced` dropdown in the sidenav of the form creation view.

{{< hint "tip" >}}
Example: If your resource has multiple compositions available and you want to select one, the `compositionSelector` field is available in the `advanced` dropdown.
{{< /hint >}}

{{<img src="concepts/images/portal-create.png" alt="Create new resources from the control plane portal" quality="100" size="large" lightbox="true">}}

Under the covers, this form generates a claim (XRC) for this resource type. When you click `Create Instance`, the claim will be submitted directly to your managed control plane. If you want to view the claim, you can click the `Show YAML` button in the upper right corner.    

### View resource events

When you click into an instance, you are taken to a view that provides some information about your resource: when it was created, whether your MCP has synced it, whether the resource is reporting `ready`, and events being emitted by its claim. You can edit the claim for this resource by clicking the `Edit` button.

The events that are presented in this view are _only_ the events that are surfaced to the claim. This view does not show Composite Resource or Managed Resource events.

{{<img src="concepts/images/portal-events.png" alt="See resource events from the control plane portal" quality="100" size="large" lightbox="true">}}

## How to reach your control plane portal

To navigate to a control plane's portal, go to the `portal` tab in the control plane instance view and click `Open Control Plane Portal`.

{{<img src="concepts/images/ctp-portal-link.png" alt="Navigation to control plane portal" quality="100" size="large" lightbox="true">}}