Migrate control planes to Upbound Managed Control Planes.

#### Usage

```bash
up alpha migration [flags] [subcommand]
```

#### Flags

##### `--kubeconfig`

Override default kubeconfig path.

#### Subcommands

- `export` - The 'export' command is used to export the current state of a Crossplane or Universal Crossplane (xp/uxp) control plane into an archive file. This file can then be used for migration to Upbound Managed Control Planes.
- `import` - The 'import' command imports a control plane state from an archive file into an Upbound managed control plane.
- `pause-toggle` - The 'pause-toggle' command is used to pause or unpause resources affected by a migration, ensuring that only migration-induced pauses are undone.

#### Examples

```bash
# Show help
up alpha migration --help
```
