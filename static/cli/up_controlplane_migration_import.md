---
mdx:
  format: md
---

The 'import' command imports a control plane state from an archive file into an Upbound managed control plane.

The `import` command imports resources from an exported bundle into a Managed
Control Plane.

By default, all managed resources will be paused during the import process for
possible manual inspection/validation. You can use the --unpause-after-import
flag to automatically unpause all claim,composite,managed resources after the
import process completes.

#### Examples

Automatically import the control plane state from `my-export.tar.gz`. Claim and
composite resources that were paused during export will remain paused. Managed
resources will be paused. If they were already paused during export, the
annotation `migration.upbound.io/already-paused: "true"` will be added to
preserve their paused state:

```shell
up migration import --input=`my-export.tar.gz`
```

Automatically import and unpause claims, composites, and managed resources after
importing them. Resources with the annotation
`migration.upbound.io/already-paused: "true"` will remain paused:

```shell
up migration import --unpause-after-import
```

Automatically import and unpause claims, composites, and managed resources after
importing them. The `metadata.name` of claims will be adjusted for MCP Connector
compatibility, and the corresponding composite's `claimRef` will also be
updated. Resources annotated with `migration.upbound.io/already-paused: "true"`
will remain paused:

```shell
up migration import --unpause-after-import --mcp-connector-claim-namespace=default \
    --mcp-connector-cluster-id=my-cluster-id
```


#### Usage

`up controlplane migration import [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--yes` | | When set to true, automatically accepts any confirmation prompts that may appear during the import process. |
| `--input` | `-i` | Specifies the file path or directory of the archive to be imported. The default path is 'xp-state.tar.gz'. |
| `--unpause-after-import` | | When set to true, automatically unpauses all managed resources that were paused during the import process. This helps in resuming normal operations post-import. Defaults to false, requiring manual unpausing of resources if needed. |
| `--mcp-connector-cluster-id` | | MCP Connector cluster ID. Required for importing claims supported my MCP Connector. |
| `--mcp-connector-claim-namespace` | | MCP Connector claim namespace. Required for importing claims supported by MCP Connector. |
| `--skip-target-check` | | When set to true, skips the check for a local or managed control plane during import. |
