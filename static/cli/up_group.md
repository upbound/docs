---
mdx:
  format: md
---

Interact with groups inside Spaces.

The `group` command interacts with groups within the current Space. Use the `up
profile` command to switch between different Upbound profiles and the `up ctx`
command to switch between Spaces within a Cloud profile.

#### Examples

List all groups in the current Space:

```shell
up group list
```

Create a new group named `my-group` to organize control planes within a Space:

```shell
up group create my-group
```

Get details about a specific group called `my-group`, including configuration
and metadata:

```shell
up group get my-group
```

Delete the group called `my-group`, which must not be protected:

```shell
up group delete my-group
```


#### Usage

`up group <command> [flags]`
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
