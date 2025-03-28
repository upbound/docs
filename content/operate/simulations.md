---
title: Simulations
weight: 200
description: A guide for how to use Simulations in a Space.
---

{{< hint "important" >}}
The Simulations feature is in private preview. For more information, contact
your Upbound representative.
{{< /hint >}}

This guide provides instructions for using the `up ctp simulate` command and the
(Simulation API)[] to test changes in your control plane.

The `up ctp simulate` command allows you to create simulations of existing
control planes to preview the impact of changes before applying them to
production environments.

This feature is valuable for organizations transitioning from
traditional IaC tools like Terraform, where previewing changes with `terraform
plan` is a standard practice.

A control plane simulation creates a temporary copy of your control plane and
returns a preview of the desired changes. Simulations provide visibility into
this reconciliation process by showing:

* New resources to create 
* Existing resources to change 
* Existing resources to delete 
* How configuration changes propagate through the system

This can help you reduce the risk of unexpected behavior based on your changes.

This example uses a control plane that runs a `nop` provider to illustrate how
the simulations feature works. 

## Prerequisites
* The Upbound CLI installed
* An Upbound account wit the Simulations feature enabled
* kubectl installed

You can deploy this control plane by forking this repository and using the `up
project move` command.

Clone your forked repository:

```shel
git clone https://github.com/YOURUSER/no-op-sim.git
cd no-op-sim
```

First, login to your Upbound account in the CLI:

```shell
up login --account
```

Move the project to the correct repository:

```shell
up project move
```

Add the `provider-nop` dependency:

```
up dep add 'xpkg.upbound.io/upboundcare/provider-nop:v0.2.1-2'
```

## Running a simulation 

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
apiVersion: customer.upbound.io/v1alpha1
kind: XNoOp
metadata:
  name: example
  namespace: default
spec: 
  compositionRef:
    name: noops.customer.upbound.io
  parameters:
    ultimateAnswer: 42
    #ultimateQuestion: "What is the meaning of life?"
    ultimateQuestion: "What is the meaning of life, the universe, and everything?"
```


Run your control plane simulation


```shell 
 up alpha ctp simulate no-op  --changeset=./examples/noop/example-xr.yaml --complete-after=60s --terminate-on-finish
```

Your command line returns a summary of the resources created, modified, or
deleted Diffs for each resource affected:

```
Simulation "noop-6wqg9" created
▄  [1/5]: Waiting for simulated control plane to start (30s)
▄  [2/5]: Waiting for simulated control plane to start (30s)  
✓  [3/5]: Waiting for simulation to complete
▀  [4/5]: Computing simulated differences (0s)
                                                                               
✓  [4/5]: Computing simulated differences
▀  [5/5]: Terminating simulation (0s)
                                                                               
 ✓  [5/5]: Terminating simulation

Simulation: 0 resources added, 3 resources changed, 0 resources deleted
[~] XNoOp.customer.upbound.io/v1alpha1 example
└─[~] spec.parameters.ultimateQuestion
   ├─[-] "What is the meaning of life?"
   └─[+] "What is the meaning of life, the universe, and everything?"
[~] Function.pkg.crossplane.io/v1 crossplane-contrib-function-auto-ready
└─[~] metadata.annotations
   ├─[-] <nil>
   └─[+] map[]
[~] Function.pkg.crossplane.io/v1 upbound-noopnop-function
└─[~] metadata.annotations
   ├─[-] <nil>
   └─[+] map[]
```

The `up ctp simulate` command creates a
simulation of the base control plane and applies the changes found in your
changed resource directory into
the mock control plane.

## View simulation results in the Upbound Console

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

## Interacting with your simulation

When a simulation is running, you can directly interact with the simulation
object to control the behavior of the simulation.

```shell 
apiVersion: upbound.io/v1alpha1 kind: Simulation spec:completionCriteria: 30 desiredState: AcceptingChanges
```

## Explore the simulation spec

In the Simulation object's spec field, the two most important fields are
`completionCriteria` and the `desiredState`.

### `completionCriteria` 

The `completionCriteria` field specifies how Spaces should
determine when the simulation is complete.
If the simulation meets the critera you set, Spaces set's the simulated control
plane's desired state to `Complete`.

Currently, the CompletionCriteria is a string that indicates the duration of how long a
simulation should run for in seconds. 

When starting a simulation, you can use the `complete-after` flag to define the
`completionCriteria` of your simulation.

```shell 
up alpha ctp simulate noop --changeset=./examples/noop/example-xr.yaml --complete-after=2s --terminate-on-finish
```

You may also choose to omit the criteria if you want to manually mark the
Simulation complete.

### `desiredState`

The simulation control plane status defaults to `acceptingChanges` until the simulation meets the `completionCriteria` or you terminate the simulation.

To manually terminate the simulation, use `kubectl` to set the `desiredState`. A
simulation marked `complete` populates the result status and continues running.
A `terminated` simulation deletes the control plane.

## Considerations 

Simulations is a **private preview** feature. 

Be aware of the following limitations:

- Simulations can't predict the exact behavior of external systems due to the
    complexity and non-deterministic reconciliation pattern in Crossplane.

- The only completion criteria for a simulation at this moment is time. Your
- simulation may not receive a conclusive result within that interval.

- Providers don't run in simulations. Simulations can't compose resources that
    rely on the status of Managed Resources.

    The Upbound team is working to improve these limitations. Your feedback is
    always appreciated.
