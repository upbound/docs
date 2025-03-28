---
title: Simulations
weight: 200
description: A guide for how to use Simulations in a Space.
aliases:
    - /all-spaces/simulations
    - /spaces/simulations
---

{{< hint "important" >}}
The Simulations feature is in private preview. For more information, contact
your Upbound representative.
{{< /hint >}}

This guide provides detailed instructions for using the `up ctp simulate` command and the (Simulation API)[https://docs.upbound.io/reference/space-api/] to test changes to your control planes.

## Simulations

The up ctp simulate command allows you to create simulations of existing control planes to preview the impact of changes before applying them to production environments.

This feature is especially valuable for organizations transitioning from traditional IaC tools like Terraform, where previewing changes with terraform plan is a standard practice.

A control plane simulation creates a temporary copy of your control plane and returns a preview of the desired changes. Simulations provide visibility into this
reconciliation process by showing:

* New resources to create
* Existing resources to modify
* Existing resources to delete
* How configuration changes propagate through the system

This can help you reduce the risk of unexpected behavior based on your changes.


## Running a simulation
Note - if you are running an Upbound project, please refer to (running simulations in projects)[https://docs.upbound.io/core-concepts/simulations].

The basic syntax for creating a control plane simulation is:

```shell
up ctp simulate <base-control-plane-name> -f ./changes
```

Simulations assumes that you have some workload already running in your base control plane in Upbound. The command above will create a simulation of the base control plane, and applies the changes found in the ./changes directory into a simulation control plane.

Note that when running the command, you must `up ctx` to the group level above your base control plane.


# Viewing your Simulation Results
At the end of your simulation, your CLI returns:
* A summary of the resources created, modified, or deleted
* Diffs for each resource affected

You can also view your simulation results in the Upbound Console:
1. Navigate to your base control plane in the Upbound Console
2. Select the "Simulations" tab in the menu
3. Select a simulation object for a change list of all
   resources affected.

The Console provides visual indications of changes:

- Created Resources: Marked with green
- Modified Resources: Marked with yellow
- Deleted Resources: Marked with red
- Unchanged Resources: Displayed in gray

<IMAGE GOES HERE>

## Managing your simulations
To view all simulations for a specific control plane, navigate to the control plane group using `up ctx` and run the following command

```shell
kubectl get simulations
```

This will output all of your simulations objects

```shell
    ID          NAME                    STATUS      CREATED             EXPIRES
    sim-abcd1   my-control-plane-sim1   Running     2024-03-25T14:30    2024-03-25T15:30
    sim-efgh2   my-control-plane-sim2   Completed   2024-03-24T10:15    2024-03-24T11:15
```
## Interacting with your simulation
When a simulation is running, you can directly interact with the simulation object to control the behavior of the simulation.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: Simulation
metadata:
  name: simulation
  namespace: default
  labels:
    mxe.upbound.io/disposable: "true"
spec:
  controlPlaneName: source
  desiredState: AcceptingChanges
  completionCriteria:
  - type: Duration
    duration: 90s
```

In the Simulation object's spec field, the two most important fields are completionCriteria and the desiredState.

### completionCriteria
The completionCriteria field specifies how Spaces should determine when the simulation is complete. Once any of the criteria in the list are met, Spaces will update the Simulation’s desired state to complete. Currently, the accepted CompletionCriteria is of `type: Duration` and a respective `duration` field which how long the simulation will run.

When starting a simulation, you can use the `complete-after` flag to define the completionCriteria of your simulation.

```shell
up ctp simulate <base-control-plane-name> -f ./changes --complete-after=60s
```

The default completionCriteria is 60s. But if a user wants to disable completion criteria, they can use `--complete-after=""`.

### desiredState
The desiredState field specifies the current state of the simulation. By default, the value will be set to acceptingChanges, and simulation will run until the completionCriteria is hit or the simulation is manually terminated.

To manually end a simulation, you can use kubectl to edit the value of desiredState to either `complete` or `terminated`. `complete` will end the simulation and populate the status with the results but will leave the simulated control plane running. `terminated` will end the simulation, populate the status with the results and delete the simulated control plane.

## Considerations 

Simulations is a **private preview** feature. 

Be aware of the following limitations:

- Simulations can't predict the exact behavior of external systems due to the
    complexity and non-deterministic reconciliation pattern in Crossplane.

- The only completion criteria for a simulation at this moment is time. Your simulation may not receive a conclusive result within that interval.

- Providers don't run in simulations. Simulations can't compose resources that
    rely on the status of Managed Resources.

The Upbound team is working to improve these limitations. Your feedback is always appreciated.
