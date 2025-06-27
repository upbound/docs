Interact with control planes in the current context, both in the cloud and in a local Space.

#### Usage

```bash
up controlplane (ctp) [flags] [subcommand]
```

#### Flags

##### `--domain`

Root Upbound domain. Overrides the current profile's domain.

##### `--profile`

Profile used to execute command.

##### `--account` / `-a`

Deprecated. Use organization instead.

##### `--organization`

Organization used to execute command. Overrides the current profile's organization.

##### `--ca-bundle`

Path to CA bundle file to prepend to existing CAs

##### `--insecure-skip-tls-verify`

[INSECURE] Skip verifying TLS certificates.

##### `--debug` / `-d`

[INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens.

##### `--override-api-endpoint`

Overrides the default API endpoint.

##### `--override-auth-endpoint`

Overrides the default auth endpoint.

##### `--override-proxy-endpoint`

Overrides the default proxy endpoint.

##### `--override-registry-endpoint`

Overrides the default registry endpoint.

##### `--override-accounts-endpoint`

Overrides the default accounts endpoint.

##### `--kubeconfig`

Override default kubeconfig path.

##### `--kubecontext`

Override default kubeconfig context.

#### Subcommands

- `create` - Create a control plane.
- `delete` - Delete a control plane.
- `list` - List control planes for the organization.
- `get` - Get a single control plane.
- `connector` - Connect an App Cluster to a control plane.
- `simulation (sim)` - Manage control plane simulations.
- `simulate` - Alias for 'up controlplane simulation create'.
- `configuration` - Manage Configurations.
- `provider` - Manage Providers.
- `function` - Manage Functions.
- `pull-secret` - Manage package pull secrets.
- `connect` - Deprecated: Connect kubectl to control plane.
- `disconnect` - Deprecated: Disconnect kubectl from control plane.

#### Examples

```bash
# Show help
up controlplane --help
```
