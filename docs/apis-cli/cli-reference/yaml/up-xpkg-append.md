Append additional files to an xpkg.

#### Usage

```bash
up xpkg append <remote-ref> [flags]
```

#### Arguments

##### `<remote-ref>`

**Required**

The fully qualified remote image reference

#### Flags

##### `--destination`

Optional OCI reference to write to. If not set, the command will modify the input reference.

##### `--extensions-root`

**Default:** `./extensions`

An optional directory of arbitrary files for additional consumers of the package.

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

#### Examples

```bash
# Show help
up xpkg append --help

# Basic usage
up xpkg append <remote-ref>
```
