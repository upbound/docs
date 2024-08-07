---
title: Query API
weight: 400
description: Use the `up` CLI to query objects and resources
cascade:
    product: api
---

The Space API describes the types and parameters for the core Space
components.


<!-- vale write-good.TooWordy = NO -->
<!-- ignore "aggregate" -->

Upbound offers a Query API to allow users to inspect objects and resources within their control planes. The read-only `up alpha query` and `up alpha get` CLI commands allow users to gather information to help improve performance in their control planes.

The Query API allows you to retrieve control plane information and debug your Crossplane resources faster than `kubectl` commands. In the Upbound Console, you can inspect your resources with new management views using the Query API.

{{< hint "important" >}}

This feature is in preview. The query API is available in the Cloud Space offering in `v1.6` and enabled by default.

{{< /hint >}}

## Requirements

Before you begin, make sure you have the most recent version of the `up` CLI installed.

## Query within a space

The `up alpha query` command returns a list of objects of any kind within all the control planes in your space.  `up alpha query` has three sub-commands for managed resources, composite resources, and claims. You can also query all control plane group objects with the `-A` flag.

The `up alpha query` command is useful for discovering roadblocks or issues in your deployment. For example, to return all managed resources with a `READY` status of `FALSE`, use the following command:

```shell
up query managed --controlplanes=type=prod --filter '.status.conditions[*].type=="Ready" && .status.conditions[*].status=="False"'
```

## Query within a single control plane

You can query within a single control plane with the `up get` command to return more information about a given object within the current kubeconfig context.

The `up get` command has three sub-commands for managed resources, claims, and composite resources. To connect to a specific control plane, you can switch between control plane groups with `up ctp connect`.

```shell
up ctp connect <context-1>

current context set to <context-1>
```


# Query API Reference



<!-- ignore "aggregate" -->
<!-- vale write-good.TooWordy = YES -->
