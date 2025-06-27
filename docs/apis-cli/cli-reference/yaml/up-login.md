Login to Upbound. Will attempt to launch a web browser by default. Use --username and --password flags for automations.

#### Usage

```bash
up login [flags]
```

#### Flags

##### `--username` / `-u`

Username used to execute command.

##### `--password` / `-p`

Password for specified user. '-' to read from stdin.

##### `--token` / `-t`

Upbound API token (personal access token) used to execute command. '-' to read from stdin.

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

##### `--use-device-code`

Use authentication flow based on device code. We will also use this if it can't launch a browser in your behalf, e.g. in remote SSH

#### Examples

```bash
# Show help
up login --help
```
