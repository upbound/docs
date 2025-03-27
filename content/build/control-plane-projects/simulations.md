---
title: "Simulating your Control Plane Projects"
weight: 7
description: "Simulate your control plane project"
aliases:
    - /core-concepts/simulations
---
*Simulations is in private preview only*


Control Plane Simulations allow you to preview changes before applying them to your live control planes. Similar to Terraform Plan, this feature lets you simulate the impact of configuration changes, package updates, or claim modifications without affecting your production environment.

Simulations create a temporary copy of your control plane that shows exactly what would happen if your changes were applied, giving you confidence in your infrastructure changes and helping reduce the risk of unexpected behavior.

## Why Use Simulations?
Control planes are dynamic systems that automatically reconcile resources to match your desired state. Simulations provide visibility into this reconciliation process by showing:

- Which resources will be created
- Which resources will be modified
- Which resources will be deleted
- How configuration changes propagate through the system

This visibility is especially valuable during code reviews, when planning complex changes, or when upgrading Crossplane packages.

## Requirements
Simulations are available to select customers on Upbound Cloud, running on Team Tier or higher. To receive access, please reach out to Upbound (we probably need to put in a link for customers to reach out to).

## Simulating Your Control Planes
Before starting a simulation, first ensure that your project is built and running on a control plane (we'll refer to this as the base control plane).

Kubectl apply any claim or XRs you want to validate changes for, make respectivate changes to your composition functions, and run the following command.

```shell
# Simulate changes for a project
up project simulate <my-base-control-plane> --complete-after=60s --terminate-on-finish
```

The 'complete-after' flag defines amount of time the simulated control plane should run before ending. It's important to note that if you define a value for this flag, a simulation may not fully complete within the time period you've defined. In that case, any unaffected resources will be marked as unchanged.

The 'terminate-on-finish' terminates the simulation if the completion criteria is met.

It is also possible to target a singular control plane in isolation if you aren't using a control plane project.

```shell
# Simulate changes for a specific control plane
up ctp simulate <my-base-control-plane> -f <my/directory/changeset> --complete-after=60s --terminate-on-finish
```

At the end of your simulation, you'll get the following output in your CLI.
- Summary of changes (resources created/modified/deleted)
- Detailed diffs for each affected resource

## View Your Simulation in the Console
In addition to the CLI, you can view the results of your simulation in detail in the Upbound Console.

1. Navigate to your base control plane in the Upbound Console
2. Select the "Simulations" tab in the menu
3. Click on the simulation object you wish to view and see the changelist of all resources affected.

The Console provides visual indications of changes:
- Created Resources: Marked with green
- Modified Resources: Marked with yellow
- Deleted Resources: Marked with red
- Unchanged Resources: Displayed in grey

<SCREENSHOT GOES HERE>

## Limitations of Simulations
Simulations is a private preview feature, meaning that some limitations exist today. The most significant are listed below.

- Due to the complexity and non-determinism of Crossplane’s reconciliation approach, simulations cannot predict the exact behavior of external systems.

- Currently, the only completion criteria for a simulation is time, meaning that there is a risk of not reaching a conclusive result within that interval.

- Providers do not run in simulations, meaning that simulations cannot compose resources that rely on the status of MRs.

The Upbound team is working to improve these limitations at this time, so please stay tuned. Your feedback is always appreciated.