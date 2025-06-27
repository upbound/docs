Select an Upbound kubeconfig context.

#### Usage

```bash
up alpha ctx [argument] [flags]
```

#### Arguments

##### `<argument>`

**Optional**

.. to move to the parent, '-' for the previous context, '.' for the current context, or any relative path.

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

##### `--short` / `-s`

Short output.

##### `--context`

**Default:** `upbound`

Kubernetes context to operate on.

##### `--file` / `-f`

Kubeconfig to modify when saving a new context. Overrides the --kubeconfig flag. Use '-' to write to standard output.

#### Examples

```bash
# Show help
up alpha ctx --help

# Basic usage
up alpha ctx <argument>
```
