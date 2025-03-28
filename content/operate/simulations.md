---
title: Simulations
weight: 200
description: A guide for how to use Simulations in a Space.
---

{{< hint "important" >}}
The Simulations feature is in private preview. For more information, contact
your Upbound representative.
{{< /hint >}}

This guide provides detailed information on the (Simulation API)[https://docs.upbound.io/reference/space-api/] and its interfaces to test changes to your control planes.

## Simulations
Simulations API provides a powerful way to preview changes to your control planes before applying them to production environments. Similar to `terraform plan` in traditional infrastructure as code workflows, Simulations provide visibility into your control plane's reconciliation process by showing:

* New resources to create
* Existing resources to change
* Existing resources to delete
* How configuration changes propagate through the system

This feature is especially valuable for organizations transitioning from traditional IaC tools like Terraform, where previewing changes with terraform plan is a standard practice.

## Understanding the Simulations API 
Simulations are represented as Kubernetes-style objects in the Upbound API. The base model looks like this:

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
There are 3 key fields in the API model:
- spec.controlPlaneName
- spec.completionCriteria
- spec.desiredState

### spec.controlPlaneName
The controlPlaneName field specifies the name of the base control plane to simulate off of.

### spec.completionCriteria
The completionCriteria field specifies how Spaces should determine when the simulation is complete. Once any of the criteria in the list are met, Spaces will update the Simulation’s desired state to complete. Currently, the accepted CompletionCriteria is of `type: Duration` and a respective `duration` field which how long the simulation will run.

When starting a simulation, you can use the `complete-after` flag to define the completionCriteria of your simulation.

```shell
up ctp simulate <base-control-plane-name> -f ./changes --complete-after=60s
```

The default completionCriteria is 60s. But if a user wants to disable completion criteria, they can use `--complete-after=""`.

### spec.desiredState
The desiredState field specifies the current state of the simulation. By default, the value will be set to acceptingChanges, and simulation will run until the completionCriteria is hit or the simulation is manually terminated.

To manually end a simulation, you can use kubectl to edit the value of desiredState to either `complete` or `terminated`. `complete` will end the simulation and populate the status with the results but will leave the simulated control plane running. `terminated` will end the simulation, populate the status with the results and delete the simulated control plane.

### Status of your simulation
Once a simulation object is created, its status field will be populated with information about the simulation, including:

- List of changes (created, modified, deleted resources)
- Simulation state (running, completed, terminated)
- Timing information (start time, completion time)

## Using the Simulations API
Note - if you are running an Upbound project, please refer to (running simulations in projects)[https://docs.upbound.io/core-concepts/simulations].

### Create a Simulation object
You can create a simulation directly through the API by submitting a Simulation object:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: spaces.upbound.io/v1alpha1
kind: Simulation
metadata:
  name: my-simulation
  namespace: default
spec:
  controlPlaneName: my-control-plane
  desiredState: AcceptingChanges
  completionCriteria:
  - type: Duration
    duration: 120s
EOF
```

To include changes to simulate, you can use the --patch flag or include the changes in the simulation object definition.

### Using the CLI
The `up ctp simulate` command provides a convenient CLI interface to the Simulations API:

```shell
up ctp simulate <base-control-plane-name> -f ./changes
```

This command:

* Creates a Simulation object via the API
* Uploads the changes from ./changes directory
* Monitors the simulation status

Note that when running the command, you must `up ctx` to the group level above your base control plane.

### Viewing your Simulation Results
At the end of your simulation, your CLI returns:
* A summary of the resources created, modified, or deleted
* Diffs for each resource affected

You can also view your simulation results in the Upbound Console:
1. Navigate to your base control plane in the Upbound Console
2. Select the "Simulations" tab in the menu
3. Select a simulation object for a change list of all resources affected.

The Console provides visual indications of changes:

- Created Resources: Marked with green Modified Resources: Marked with yellow
- Deleted Resources: Marked with red Unchanged Resources: Displayed in gray

    <IMAGE GOES HERE>

## Managing your simulations

To view all simulations for a specific control plane, you can run the following command:

```shell
kubectl get simulations
```

The output returns all simulations associated with your control plane:

```shell
NAME         SOURCE   SIMULATED          ACCEPTING-CHANGES   STATE                  AGE
noop-6wqg9   noop     noop-sim-1dcf6ed   False               SimulationTerminated   28m
```

## Considerations

Simulations is a **private preview** feature.

Be aware of the following limitations:

- Simulations can't predict the exact behavior of external systems due to the
    complexity and non-deterministic reconciliation pattern in Crossplane.

- The only completion criteria for a simulation at this moment is time. Your
    simulation may not receive a conclusive result within that interval.

- Providers don't run in simulations. Simulations can't compose resources that
    rely on the status of Managed Resources.

The Upbound team is working to improve these limitations. Your feedback is always appreciated.
