---
title: Debugging issues on a managed control plane
weight: 3
description: A guide for how to debug resources on a managed control plane running in Upbound.
---

What do you do if you need to debug a resource running on an MCP in Upbound? This guide recommends steps for how you can use Upbound's features to identify the root cause for an issue.

## Start from Upbound Console

The Upbound [Console]({{<ref "concepts/console" >}}) has a built-in control plane explorer experience that surfaces status and events for the resources on your MCP. The explorer is **claim-based**, meaning resources are only rendered in this view if they exist in the reference chain originating from a claim. This view is a helpful starting point if you are attempting to debug an issue originating from a claim. 

{{< hint "tip" >}}
What this means is if you directly create Managed Resources or Composite Resources (MRs or XRs), they will not render in the explorer.
{{< /hint >}}

### Example

In the example below, the control plane explorer view is used to inspect why a claim for an EKS Cluster is not healthy. 

#### Check the health status of claims

From the API type card, you can see two claims branching off of it: one shows a healthy green icon, while the other shows an unhealthy red icon.

{{<img src="knowledge-base/images/kb-debug/debug-overview.png" alt="Use control plane explorer view to see status of claims" quality="100" lightbox="true">}}

Click the `More details` button on the unhealthy claim card and Upbound will show a flyout of additional details for the claim.

{{<img src="knowledge-base/images/kb-debug/debug-claim-more-details.png" alt="Use control plane explorer view to see details of claims" quality="100" lightbox="true">}}

Looking at the three events being surfaced for this claim:

- **ConfigureCompositeResource**: this event indicates the Composite Resource (XR) that has been "claimed" was created correctly.
- **BindCompositeResource**: this is the helpful event that reveals the Composite Resource (XR) that is being "claimed" is not ready yet. This is very useful to know, because a claim will not show healthy until the XR it references is ready.
- **ConfigureCompositeResource**: the error saying, `cannot apply composite resource...the object has been modified; please apply your changes to the latest version and try again` is a very unhelpful and generic event emitted by many Crossplane resources. In the vast majority of cases, **this error is a red herring and can safely be ignored**.

One other region to check in the `More details` flyout is the `status` field of the rendered YAML for the resource. This field is usually at the bottom of the rendered YAML for this object.

{{<img src="knowledge-base/images/kb-debug/debug-claim-status.png" alt="Use control plane explorer view to see status details of claims" quality="100" lightbox="true">}}

Here again we can see the status reports a similar message as the event stream: this claim is waiting for a Composite Resource to be ready. Based on our learnings above, we should investigate the Composite Resource referenced by this claim.

#### Check the health status of the Composite Resource

The control plane explorer only shows the claim cards by default. Clicking on a claim card will trigger the view to render the rest of the Crossplane resource tree associated with the selected claim. Doing this for the claim above results in a rendering like the screenshot below.

{{<img src="knowledge-base/images/kb-debug/debug-claim-expansion.png" alt="Use control plane explorer view to expand tree of claim" quality="100" lightbox="true">}}

This causes the XR referenced by the claim (along with all of _its own_ references) to be rendered. Above you can see the XR is showing the same unhealthy status icon in its card. Notice the XR we will investigate next has itself two nested XRs that are rendered which trace back to it. One of the nested XRs shows a healthy green icon on its card, while the other shows red. Much like the claim, a Composite Resource will not show healthy until its referenced resources (MRs and XRs) also show healthy. Therefore, we can keep following the trace to find the culprit resources that are unhealthy.

#### Inspecting Managed Resources

Using the `more details` flyout to inspect one of the unhealthy Managed Resources, we observe the following:

{{<img src="knowledge-base/images/kb-debug/debug-mr-event.png" alt="Use control plane explorer view to view events for an MR" quality="100" lightbox="true">}}

This event reveals it's unhealthy because it is waiting on a reference to another Managed Resource. Searching the rendered YAML of the MR for this resource reveals the following:

{{<img src="knowledge-base/images/kb-debug/debug-mr-status.png" alt="Use control plane explorer view to view status for an MR" quality="100" lightbox="true">}}

The rendered YAML reveals this MR is referencing a sibling MR that shares the same controller (both of these MRs were created from the same parent XR). Hence, we can follow the trail and inspect the sibling MR to see what its status is.

{{<img src="knowledge-base/images/kb-debug/debug-mr-dependency-status.png" alt="Use control plane explorer view to view status for a sibling MR" quality="100" lightbox="true">}}

The sibling MR's event stream shows the resource create request is successfully being processed (and remember we can safely ignore the unhelpful red event). We know EKS clusters can take upwards of >15 minutes to provision in AWS. Thus, the root cause has been identified: everything is fine -- all the resources are just provisioning! If we wait a few more minutes and then check the control plane explorer again, we will see all resources are healthy. For reference, below is an example status field for a resource that is healthy and provisioned.

```yaml
...
status:
  atProvider:
    id: team-b-app-cluster-bhwfb-hwtgs-20230403135452772300000008
  conditions:
    - lastTransitionTime: '2023-04-03T13:56:35Z'
      reason: Available
      status: 'True'
      type: Ready
    - lastTransitionTime: '2023-04-03T13:54:02Z'
      reason: ReconcileSuccess
      status: 'True'
      type: Synced
    - lastTransitionTime: '2023-04-03T13:54:53Z'
      reason: Success
      status: 'True'
      type: LastAsyncOperation
    - lastTransitionTime: '2023-04-03T13:54:53Z'
      reason: Finished
      status: 'True'
      type: AsyncOperation
```

### Control plane explorer limitations

The control plane explorer view is currently designed around claims. There are other Crossplane resources you may want to inspect for which you do not have visibility via the control plane explorer. If you want to inspect any of the following, we recommend you connect directly to the managed control plane via CLI (described in the next section):

- Inspect Managed Resources that are not associated with a claim
- Inspect Composite Resources that are not associated with a claim
- Inspect the status of **deleting** resources. Once a resource deletion request has been initiated and the claim gets destroyed, you will lose visibility in the control plane explorer of all resources undergoing deletion
- Inspect ProviderConfigs
- Inspect events for Providers

## Use direct CLI access

If your preference is to use a terminal instead of a GUI, Upbound supports direct access to the API server of the managed control plane. The [`up ctp kubeconfig get`]({{<ref "cli/command-reference/controlplane" >}}) can be used to get a `kubeconfig` for your managed control plane.
