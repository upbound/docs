---
mdx:
  format: md
---

Login to Upbound. Will attempt to launch a web browser by default. Use --username and --password flags for automations.

The `login` command authenticates with Upbound Cloud and stores session
credentials.

#### Authentication Methods

- **Web Browser (default)** - Opens browser for OAuth authentication
- **Device Code** - Use --use-device-code for headless environments
- **Username/Password** - Provide --username and --password flags
- **Personal Access Token or Robot Token** - Provide --token flag

The command creates or updates a profile with the authenticated session. If no
profile name is specified, it uses the currently active profile. A profile named
`default` will be created if no profiles exist.

#### Examples

Open a browser for OAuth authentication (recommended):

```shell
up login
```

Prompt for password and authenticate with credentials:

```shell
up login --username=user@example.com
```

Authenticate using a personal access token.

```shell
up login --token=upat_xxxxx
```

Use the device code flow for headless/remote environments:

```shell
up login --use-device-code
```

Authenticate and create or update the `production` profile:

```shell
up login --profile=production --organization=my-org
```


#### Usage

`up login [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--domain` | | Root Upbound domain. Overrides the current profile's domain. |
| `--profile` | | Profile used to execute command. |
| `--account` | `-a` | Deprecated. Use organization instead. |
| `--organization` | | Organization used to execute command. Overrides the current profile's organization. |
| `--ca-bundle` | | Path to CA bundle file to prepend to existing CAs |
| `--insecure-skip-tls-verify` | | [INSECURE] Skip verifying TLS certificates. |
| `--debug` | `-d` | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens. |
| `--override-api-endpoint` | | Overrides the default API endpoint. |
| `--override-auth-endpoint` | | Overrides the default auth endpoint. |
| `--override-proxy-endpoint` | | Overrides the default proxy endpoint. |
| `--override-registry-endpoint` | | Overrides the default registry endpoint. |
| `--override-accounts-endpoint` | | Overrides the default accounts endpoint. |
| `--kubeconfig` | | Override default kubeconfig path. |
| `--kubecontext` | | Override default kubeconfig context. |
| `--username` | `-u` | Username used to execute command. |
| `--password` | `-p` | Password for specified user. '-' to read from stdin. |
| `--token` | `-t` | Upbound API token (personal access token) used to execute command. '-' to read from stdin. |
| `--use-device-code` | | Use authentication flow based on device code. We will also use this if it can't launch a browser in your behalf, e.g. in remote SSH |
| `--qr-code` | | Display a QR code for the login URL when using the device code login flow. |
