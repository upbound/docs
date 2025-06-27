Remove the Upbound Spaces deployment.

#### Usage

```bash
up space destroy [flags]
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

##### `--registry-repository`

**Default:** `xpkg.upbound.io/spaces-artifacts`

Set registry for where to pull OCI artifacts from. This is an OCI registry reference, i.e. a URL without the scheme or protocol prefix.

##### `--registry-endpoint`

**Default:** `https://xpkg.upbound.io`

Set registry endpoint, including scheme, for authentication.

##### `--yes-really-delete-space-and-all-data`

Bypass safety checks and destroy Spaces

##### `--orphan`

Remove Space components but retain Control Planes and data

#### Examples

```bash
# Show help
up space destroy --help
```
