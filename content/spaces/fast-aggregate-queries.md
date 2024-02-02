---
title: Fast aggregate queries
weight: 400
description: Use the `up` CLI to query objects and resources
---
<!-- vale write-good.TooWordy = NO -->
<!-- ignore "aggregate" -->

Fast aggregate queries in Upbound allow users to inspect objects and resources within Spaces control planes. The read-only `up query` and `up get` CLI commands allow users to gather information to help improve performance in their control planes.

{{< hint "important" >}}

This feature is in alpha.

{{< /hint >}}

## Query within a space

The `up query` command returns a list of objects of any kind within all the control planes in your space.  `up query` has three sub-commands for managed resources, composite resources, and claims. You can also query all control plane group objects with the `-A` flag.

The `up query` command is useful for discovering roadblocks or issues in your deployment. For example, to return all managed resources with a `READY` status of `FALSE`, use the following command:

```shell
up query managed --controlplanes=type=prod --filter '.status.conditions[*].type=="Ready" && .status.conditions[*].status=="False"'
```

## Query within a single control plane

You can query within a single control plane with the `up get` command to return more information about a given object within the current kubeconfig context.

The `up get` command has three sub-commands for managed resources, claims, and composite resources. To connect to a specific control plane, you can switch between control plane groups with `up ctp connect`.

```shell
up cap connect <context-1>

current context set to <context-1>
```

## Next steps

For more information on the fast, aggregate queries available in the `up` CLI, review the [`up` CLI reference documentation](../reference/cli/command-reference).

<!-- ignore "aggregate" -->
<!-- vale write-good.TooWordy = YES -->