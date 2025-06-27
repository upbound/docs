The 'import' command imports a control plane state from an archive file into an Upbound managed control plane.

#### Usage

```bash
up alpha migration import [flags]
```

#### Flags

##### `--yes`

**Default:** `false`

When set to true, automatically accepts any confirmation prompts that may appear during the import process.

##### `--input` / `-i`

**Default:** `xp-state.tar.gz`

Specifies the file path or directory of the archive to be imported. The default path is 'xp-state.tar.gz'.

##### `--unpause-after-import`

**Default:** `false`

When set to true, automatically unpauses all managed resources that were paused during the import process. This helps in resuming normal operations post-import. Defaults to false, requiring manual unpausing of resources if needed.

##### `--mcp-connector-cluster-id`

MCP Connector cluster ID. Required for importing claims supported my MCP Connector.

##### `--mcp-connector-claim-namespace`

MCP Connector claim namespace. Required for importing claims supported by MCP Connector.

##### `--skip-target-check`

**Default:** `false`

When set to true, skips the check for a local or managed control plane during import.

#### Examples

```bash
# Show help
up alpha migration import --help

# Import with default settings
up import

# Import from specific file
up import --input my-state.tar.gz

# Import and automatically unpause resources
up import --input state.tar.gz --unpause-after-import

# Import with automatic confirmation
up import --yes --input state.tar.gz
```
