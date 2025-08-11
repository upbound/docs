---
mdx:
  format: md
---

The 'export' command is used to export the current state of a Crossplane or Universal Crossplane (xp/uxp) control plane into an archive file. This file can then be used for migration to Upbound Managed Control Planes.

The `export` command exports resources from a Crossplane or Upbound Crossplane
(UXP) cluster to a tarball, for migration to an Upbound Managed Control Plane.

Use the available options to customize the export process, such as specifying
the output file path, including or excluding specific resources and namespaces,
and deciding whether to pause claim,composite,managed resources before
exporting.

#### Examples

Pause all claims, composites, and managed resources before exporting the control
plane state. The state is exported to the default archive file named
`xp-state.tar.gz`. Resources that were already paused will be annotated with
`migration.upbound.io/already-paused: "true"` to preserve their paused state
during the import process:

```shell
up migration export --pause-before-export
```

Export the control plane state to a file called `my-export.tar.gz`:

```shell
up migration export --output=my-export.tar.gz
```

Export the control plane state from only the provided namespaces to the default
file, `xp-state.tar.gz`, with the additional resources specified:

```shell
up migration export --include-extra-resources="customresource.group" \
    --include-namespaces="crossplane-system,team-a,team-b"
```


#### Usage

`up controlplane migration export [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--yes` | | When set to true, automatically accepts any confirmation prompts that may appear during the export process. |
| `--output` | `-o` | Specifies the file path where the exported archive will be saved. Defaults to 'xp-state.tar.gz'. |
| `--include-extra-resources` | | A list of extra resource types to include in the export in "resource.group" format in addition to all Crossplane resources. By default, it includes namespaces, configmaps, secrets. |
| `--exclude-resources` | | A list of resource types to exclude from the export in "resource.group" format. No resources are excluded by default. |
| `--include-namespaces` | | A list of specific namespaces to include in the export. If not specified, all namespaces are included by default. |
| `--exclude-namespaces` | | A list of specific namespaces to exclude from the export. Defaults to 'kube-system', 'kube-public', 'kube-node-lease', and 'local-path-storage'. |
| `--pause-before-export` | | When set to true, pauses all claim,composite and managed resources before starting the export process. This can help ensure a consistent state for the export. Defaults to false. |
