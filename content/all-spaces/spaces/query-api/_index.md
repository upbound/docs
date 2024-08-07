---
title: Query API
weight: 400
description: Use the `up` CLI to query objects and resources
cascade:
    product: api
---

<!-- vale write-good.TooWordy = NO -->
<!-- ignore "aggregate" -->


Upbound's Query API allows users to inspect objects and resources within their control planes. The read-only `up alpha query` and `up alpha get` CLI commands allow you to gather information on your control planes in a fast and efficient package.

## Overview

The Query API allows you to retrieve control plane information faster than traditional `kubectl` commands. This feature lets you debug your Crossplane resources with the CLI or within the Upbound Console's enhanced management views.

{{< hint "important" >}}

This feature is in preview. The query API is available in the Cloud Space offering in `v1.6` and enabled by default.

{{< /hint >}}

## Requirements

Before you begin, make sure you have the most recent version of the `up` CLI installed.

## Query within a single control plane

Use the `up alpha get` command to retreive information about objects within the current kubeconfig context. This command uses the **Query** endpoint and targets the current control plane.

To switch between control plane groups, use the `up ctp connect` command and change to your desired context:

```shell
up ctp connect <context-1>

current context set to <context-1>
```

You can query within a single control plane with the `up alpha get` command to return more information about a given object within the current kubeconfig context.

The `up alpha get` command has three sub-commands for managed resources, claims, and composite resources.

```shell
up alpha get managed
#TODO output
```

```shell
up alpha get configmaps -A  # -A shows all namespaces
#TODO output
```

```shell
up alpha get providers,providerrevisions
#TODO output
```

## Query multiple control planes

The `up alpha query` command returns a list of objects of any kind within all the control planes in your space. This command uses either the **SpaceQuery** or **GroupQuery** endpoints depending on your query scope. `up alpha query` has three sub-commands for managed resources, compoite resources, and claims. You can also query all control plane group objects with the `-A` flag.

```shell
# Query all Crossplane resources across the space (SpaceQuery)
up alpha query crossplane -A
```

```shell
# Query namespaces in a specific group (GroupQuery)
up alpha query namespaces -g group
```

```shell
# Query namespaces in a specific control plane (Query)
up alpha query namespaces -g group -c controlplane
```

```shell
# Sort results by name
up alpha query crossplane -A --sort-by="{.metadata.name}"
```

```shell
# Output in YAML format
up alpha query namespace -g group -c controlplane -o yaml
```

```shell
# Query multiple resource types
up alpha query namespaces,configmaps -A
```

```shell
# Show labels without headers
up alpha query namespaces --no-headers --show-labels
```

```shell
# Query composite resources with specific label columns
up alpha query composite -A --label-columns=crossplane.io/claim-namespace
```

The `up alpha query` command is useful for discovering roadblocks or issues in your deployment. For example, to return all managed resources with a `READY` status of `FALSE`, use the following command:

```shell
up query managed --controlplanes=type=prod --filter '.status.conditions[*].type=="Ready" && .status.conditions[*].status=="False"'
```

## Query API Reference

<!-- ignore "aggregate" -->
<!-- vale write-good.TooWordy = YES -->
