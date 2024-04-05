---
title: Migrating to Spaces
weight: 300
description: A guide to how to migrate to a managed control plane in a Space
---

{{< hint "important" >}}
This feature is in preview.
{{< /hint >}}

The Upbound migration tool is a [CLI command]({{<ref "reference/cli/command-reference.md">}}) that helps you migrate your existing Crossplane control plane to a managed control plane in a Space.

To migrate from Crossplane to an Upbound Space, you must:

1. Export your existing Crossplane control plane configuration/state into an archive file.
2. Import the archive file into a managed control plane in a Space.

The migration tool is available in the [up CLI]({{<ref "reference/cli/command-reference.md#alpha-xpkg-migration">}}) as
`up alpha migration export` and `up alpha migration import` commands.

## Prerequisites

Before you begin, you must have the following:
- A Spaces installation with version 1.2.0 or later.
- The [up CLI]({{<ref "reference/cli/_index.md">}}) version 0.23.0 or later.

### Migration process

To migrate an existing Crossplane control plane to a managed control plane in a Space, do the following:

1. Run the `up alpha migration export` command to export your existing Crossplane control plane configuration/state into an archive file:

    ```bash
    up alpha migration export --kubeconfig <path-to-source-kubeconfig> --out <path-to-archive-file>
    ```

    The command exports your existing Crossplane control plane configuration/state into an archive file.

    {{< hint "note" >}}
  By default, the export command doesn't make any changes to your existing Crossplane control plane state, leaving it intact. Use the `--pause-before-export` flag to pause the
     reconciliation on managed resources before exporting the archive file.
    
  This is a safety mechanism to help ensure the control plane you migrate state to doesn't assume ownership of resources before
    you're ready.
    {{< /hint >}}

2. Use the control plane [create command]({{<ref "reference/cli/command-reference.md#controlplane-create">}}) to create a managed
control plane in a Space:

    ```bash
    up controlplane create my-controlplane
    ```

3. Use the control plane [connect command]({{<ref "reference/cli/command-reference.md#controlplane-connect">}}) to connect to the
managed control plane created in the previous step:

    ```bash
    up controlplane connect my-controlplane
    ```

    The command configures your local `kubeconfig` to connect to the managed control plane.

4. Run the following command to import the archive file into the managed control plane:

    ```bash
    up alpha migration import --in <path-to-archive-file>
    ```

   {{< hint "note" >}}
   By default, the import command leaves the control plane in an inactive state by pausing the reconciliation on managed
   resources which gives you an opportunity to review the imported configuration/state before activating the control plane.
   Use the `--unpause-after-import` flag to change the default behavior and activate the control plane immediately after
   importing the archive file.
   {{< /hint >}}

5. Review and validate the imported configuration/state. When you are ready, activate your managed
   control plane by running the following command:

    ```bash
    kubectl annotate managed --all crossplane.io/paused-
    ```

   At this point, you can delete the source Crossplane control plane.
 