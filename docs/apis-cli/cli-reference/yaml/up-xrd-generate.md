Generate an XRD from a Composite Resource (XR) or Claim (XRC).

#### Usage

```bash
up xrd generate <file> [flags]
```

#### Arguments

##### `<file>`

**Required**

Path to the file containing the Composite Resource (XR) or Composite Resource Claim (XRC).

#### Flags

##### `--cache-dir`

**Default:** `~/.up/cache/`

Directory used for caching dependency images.

##### `--path`

Path to the output file where the Composite Resource Definition (XRD) will be saved.

##### `--plural`

Optional custom plural form for the Composite Resource Definition (XRD).

##### `--output` / `-o`

**Default:** `file`

Output format for the results: 'file' to save to a file, 'yaml' to print XRD in YAML format, 'json' to print XRD in JSON format.

##### `--project-file` / `-f`

**Default:** `upbound.yaml`

Path to project definition file.

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
up xrd generate --help

# Basic usage
up xrd generate <file>
```
