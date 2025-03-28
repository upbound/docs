---
title: Simulations
weight: 200
description: A guide for how to use Simulations in a Space.
---

{{< hint "important" >}}
The Simulations feature is in private preview. For more information, contact
your Upbound representative.
{{< /hint >}}

The simulations feature allows you to create a temporary copy of an existing
control plane to preview the impact of changes before applying them to
production environments.

This feature is valuable for organizations transitioning from
traditional IaC tools like Terraform, where previewing changes with `terraform
plan` is a standard practice.

Simulations provide visibility for your resource changes, including:

* New resources to create
* Existing resources to change
* Existing resources to delete
* How configuration changes propagate through the system

This feature is especially valuable for organizations transitioning from traditional IaC tools like Terraform, where previewing changes with terraform plan is a standard practice.

This guide provides instructions for using the `up ctp simulate` command and the
(Simulation API)[] to test changes in your control plane.

## Prerequisites

* The Upbound CLI installed
* An Upbound account wit the Simulations feature enabled
* kubectl installed

## Deploy a base control plane

This example uses a control plane that runs a `nop` provider to illustrate how
the simulations feature works.

You can deploy this control plane by forking this repository and using the `up
project move` command.

Clone your forked repository:

```shel
git clone https://github.com/YOURUSER/no-op-sim.git
cd no-op-sim
```

Login to your Upbound account in the CLI:

```shell
up login --account
```

Move the project to the correct repository:

```shell
up project move YOURREPOSITORY
```

Add the `provider-nop` dependency:

```
up dep add 'xpkg.upbound.io/upboundcare/provider-nop:v0.2.1-2'
```

## Run a simulation

First, change your control plane context to the group level above a running
control plane. For example, if your context is your running control plane, use
the `up ctx` command to switch to the group level.

```shell
up ctx ..
```

Next, make a change in the `examples/noop/example-xr.yaml` file in the project.
In this example, comment out the first `ultimateQuestion` and uncomment the
second, longer parameter value.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: Simulation
metadata:
  name: simulation
  namespace: default
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
The completionCriteria field specifies how Spaces should determine when the simulation is complete. Once any of the criteria in the list are met, Spaces will update the Simulation’s desired state to complete. Currently, the accepted CompletionCriteria is of `type: Duration` and requires a respective `duration` field which how long the simulation will run.

When starting a simulation, you can use the `complete-after` flag to define the completionCriteria of your simulation.

```shell
up ctp simulate <base-control-plane-name> -f ./changes --complete-after=60s
```

The default completionCriteria is 60s. But if a user wants to disable completion criteria, they can use `--complete-after=""`.

```shell {copy-lines="none"}
Simulation "noop-6wqg9" created
▄  [1/5]: Waiting for simulated control plane to start (30s)
▄  [2/5]: Waiting for simulated control plane to start (30s)
✓  [3/5]: Waiting for simulation to complete
▀  [4/5]: Computing simulated differences (0s)

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

The `up ctp simulate` command creates a simulation of the base control plane and
applies the changes found in your changed resource directory into the mock
control plane.

## Simulations API

When you create a simulation in Upbound, you interact with the Spaces API
`simulations` endpoint. The Simulations endpoint has three key fields:

* `spec.controlPlaneName`
* `spec.completionCritera`
* `spec.desiredState`

### `controlPlaneName`

The `controlPlaneName` field specifies the base control plane. You must specify
the control plane name to create the correct simulation.

### `completionCriteria`

The `completionCriteria` field specifies how Spaces should
determine when the simulation is complete. When the simulation meets the
criteria you set, Upbound set's the simulated control plane's desired state to
`Complete`.

The `completionCriteria` is a string that indicates the duration of how long a
simulation should run for in seconds.

```yaml
 apiVersion: spaces.upbound.io/v1alpha1
 kind: Simulation
 metadata:
   name: simulation
   namespace: default
 spec:
   controlPlaneName: source
   desiredState: AcceptingChanges
   completionCriteria:
   - type: Duration
     duration: 90s
```

When you start a simulation, you can add the `complete-after` flag to explicitly
define the `completionCriteria` of your simulation:

```shell
up alpha ctp simulate noop --changeset=./examples/noop/example-xr.yaml --complete-after=2s --terminate-on-finish
```

The default `completelyCriteria` is 60 seconds. To disable the completion
criteria, pass an empty string flag and manually mark the simulation complete:

```shell
up alpha ctp simulate noop --changeset=./examples/noop/example-xr.yaml --complete-after=""
```

### `desiredState`

The `desiredState` field specifies the current state of the simulation. The simulation control plane status defaults to `acceptingChanges` until the
simulation meets the `completionCriteria` or you terminate the simulation.

To manually terminate the simulation, use `kubectl` to set the `desiredState`. A
simulation marked `complete` populates the result status and continues running.
A `terminated` simulation deletes the simulated control plane.

### Use the simulations API

You can create a simulation using the API:

```shell {copy-lines="none"}

```yaml {hl_lines="10-12"}
cat <<EOF | kubectl apply -f -
 apiVersion: spaces.upbound.io/v1alpha1
 kind: Simulation
 metadata:
   name: my-simulation
   namespace: default
 spec:
   controlPlaneName: noop
   desiredState: AcceptingChanges
   completionCriteria:
   - type: Duration
     duration: 120s
 EOF
```

Once you create the simulation object, Upbound populates the `status` field with
information about the simulation including:

* Created, modified, deleted resources
* The state of the simulation (Running, Completed, Terminated)
* Start and/or completion time

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

{{< img src="images/simulations.png" alt="Upbound Console Simulation" size="medium" >}}

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

To destroy your simulated control planes, you can manually delete them with
`kubectl` or in the **Simulations** section of the Upbound Console.

## Considerations

Simulations is a **private preview** feature.

Be aware of the following limitations:

- Simulations can't predict the exact behavior of external systems due to the
    complexity and non-deterministic reconciliation pattern in Crossplane.

- The only completion criteria for a simulation is time. Your simulation may not
    receive a conclusive result within that interval.

- Providers don't run in simulations. Simulations can't compose resources that
    rely on the status of Managed Resources.

The Upbound team is working to improve these limitations. Your feedback is always appreciated.
