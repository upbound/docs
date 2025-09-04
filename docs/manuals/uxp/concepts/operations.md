---
title: Operation
description: Operations run function pipelines once to completion for operational tasks
sidebar_position: 1
---

Operations run function pipelines once to completion for operational tasks that
don't fit the typical resource creation pattern. Unlike compositions that
continuously reconcile desired state, Operations focus on tasks like backups,
rolling upgrades, configuration validation, and scheduled maintenance.

## How operations work

Operations are like Kubernetes Jobs - they run once to completion rather than
continuously reconciling. Like compositions, Operations use function pipelines
to implement their logic, but they're designed for operational workflows instead
of resource composition.

When you create any Operation, Crossplane:

1. **Validates** the operation and its function dependencies
2. **Executes** the function pipeline step by step
3. **Applies** any resources the functions create or change
4. **Updates** the Operation status with results and completion state

## Key characteristics

All operations share these characteristics:

-   **Runs once to completion** (like Kubernetes Jobs)
-   **Uses function pipelines** (like Compositions)
-   **Can create or change any Kubernetes resources**
-   **Provides detailed status and output from each step**
-   **Supports retry on failure with configurable limits**

## Operation functions vs composition functions

Operations and compositions both use function pipelines, but with important differences:

**Composition Functions:**

-   **Purpose**: Create and maintain resources
-   **Lifecycle**: Continuous reconciliation
-   **Input**: Observed composite resources
-   **Output**: Desired composed resources
-   **Ownership**: Creates owner references

**Operation Functions:**

-   **Purpose**: Perform operational tasks
-   **Lifecycle**: Run once to completion
-   **Input**: Required resources only
-   **Output**: Any Kubernetes resources
-   **Ownership**: Force applies without owners

Functions can support both modes by declaring the appropriate capabilities in
their package metadata:

```yaml
apiVersion: meta.pkg.crossplane.io/v1
kind: Function
metadata:
    name: my-function
spec:
    capabilities:
        - composition
        - operation
```

## Types of Operations

### Operation

An `Operation` runs a function pipeline once to completion to perform immediate
operational tasks. Operations are like Kubernetes Jobs - they run once rather
than continuously reconciling.

**Resource management**

Operations can create or change any Kubernetes resources using server-side apply with force ownership:

**What Operations can do:**

-   Create new resources of any kind
-   Change existing resources by taking ownership of specific fields
-   Apply changes that may conflict with other controllers

**What Operations can't do:**

-   Delete resources (current limitation of alpha implementation)
-   Establish owner references (resources aren't garbage collected)
-   Continuously maintain desired state (they run once)

**Retry behavior**

Operations automatically retry when they fail:

-   Each retry resets the entire pipeline - if step 2 of 3 fails, the retry starts from step 1
-   Operations use exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s, then 60s max
-   Operations track the number of failures in `status.failures`
-   After reaching `retryLimit`, the Operation becomes `Succeeded=False`

### CronOperation

A `CronOperation` creates Operations on a schedule, like Kubernetes CronJobs.
CronOperations contain a template for an Operation and create new Operations
based on a cron schedule. Each scheduled run creates a new Operation that
executes once to completion.

**Scheduling**

CronOperations use standard cron syntax:

```console-noCopy
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Concurrency policies**

CronOperations support three concurrency policies:

-   **Allow (default)**: Multiple Operations can run simultaneously. Use this when operations don't interfere with each other.
-   **Forbid**: New Operations don't start if previous ones are still running. Use this for operations that can't run concurrently.
-   **Replace**: New Operations stop running ones before starting. Use this when you always want the latest operation to run.

**History management**

Control the number of completed Operations to keep:

```yaml
spec:
    successfulHistoryLimit: 5 # Keep 5 successful operations
    failedHistoryLimit: 3 # Keep 3 failed operations for debugging
```

This helps balance debugging capabilities with resource usage.

**Starting deadline**

CronOperations support a `startingDeadlineSeconds` field that controls how long
to wait after the scheduled time before considering it too late to create the
Operation.

If the Operation can't start in the specified time after the scheduled time (due
to controller downtime, resource constraints, etc.), the scheduled run is
skipped.

Skip operations for:

-   **Time-sensitive operations** - Skip operations that become meaningless if delayed
-   **Resource protection** - Prevent backup Operations piling up during outages
-   **SLA compliance** - Ensure operations run in acceptable time windows

**Time zone considerations**

CronOperations use the cluster's local time zone, same as Kubernetes CronJobs.
To ensure consistent scheduling across different environments, consider:

1. **Standardize cluster time zones** - Use UTC in production clusters
2. **Document time zone assumptions** - Note expected time zone in comments
3. **Account for DST changes** - Be aware that some schedules may skip or repeat during transitions

### WatchOperation

A `WatchOperation` creates Operations when watched Kubernetes resources change.
Use WatchOperations for reactive operational workflows such as backing up
databases before deletion, validating configurations after updates, or
triggering alerts when resources fail.

**How WatchOperations work**

WatchOperations watch specific Kubernetes resources and create new Operations
whenever those resources change. The changed resource is automatically injected
into the Operation for the function to process.

**Key features**

-   **Watches any Kubernetes resource type** - Not limited to Crossplane resources
-   **Supports namespace and label filtering** - Target specific resources
-   **Automatically injects changed resources** - Functions receive the triggering resource
-   **Configurable concurrency policies** - Control operation creation

**Resource injection**

When a WatchOperation creates an Operation, it automatically injects the changed
resource using the special requirement name
`ops.crossplane.io/watched-resource`.

Functions can access this resource without explicitly requesting it.

The watched resource is automatically available to functions in
`req.required_resources` under the special name
`ops.crossplane.io/watched-resource`.

**Concurrency policies**

WatchOperations support the same concurrency policies as CronOperations:

-   **Allow (default)**: Multiple Operations can run simultaneously. Use this when operations don't interfere with each other.
-   **Forbid**: New Operations don't start if previous ones are still running. Use this for operations that can't run concurrently.
-   **Replace**: New Operations stop running ones before starting. Use this when you always want the latest operation to run.

**History management**

Like CronOperations, WatchOperations automatically clean up completed Operations:

```yaml
spec:
    successfulHistoryLimit: 10 # Keep 10 successful Operations (default: 3)
    failedHistoryLimit: 5 # Keep 5 failed Operations (default: 1)
```

## Intelligent Operations

Upbound control planes combine deterministic control (like reconciliation and
policy) with intelligent control (driven by embedded AI agents). Bring
intelligence into the execution flow of your Operations with AI-embedded
operation functions.

AI-embedded operation functions are standard functions designed to integrate
with popular Large Language Model providers, such as from OpenAI and Anthropic.
You can supplement existing function pipelines with these AI-embedded functions.

**Official AI-embedded functions**

Upbound offers Official Functions that have AI capabilities:

-   function-claude
-   function-openai
-   function-claude-status-transformer
-   function-pod-analyzer


[cronOperation]: /manuals/uxp/concepts/operations/cronoperation
[watchOperation]: /manuals/uxp/concepts/operations/watchoperation
[rbac-manager]: /manuals/uxp/howtos/crossplane/pods#rbac-manager-pod
[compositions-rbac]: /manuals/uxp/concepts/composition/compositions#grant-access-to-composed-resources
[cli-docs]: https://docs.crossplane.io/latest/get-started/install
[docker]: https://www.docker.com
