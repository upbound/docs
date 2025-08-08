---
mdx:
  format: md
---

Append additional files to an xpkg.

The `append` command creates a tarball from a local directory of additional
package assets, such as images or documentation, and appends them to a remote
package.

If your remote image is already signed, this command will invalidate current
signatures and the updated image will need to be re-signed.

#### Examples

Add all files from `./extensions` to a remote image and create a new index with
the extensions included:

```shell
up alpha xpkg-append --extensions-root=./extensions \
    registry.example.com/my-organization/my-repo@sha256:digest
```

Add documentation files to a package and save to a different tag, preserving the
original package at the source reference:

```shell
up alpha xpkg-append --extensions-root=./docs \
    --destination=registry.example.com/my-organization/my-repo:v1.0.1 \
    registry.example.com/my-organization/my-repo@sha256:digest
```


#### Usage

`up xpkg append <remote-ref> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<remote-ref>` | The fully qualified remote image reference |
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
| `--destination` | | Optional OCI reference to write to. If not set, the command will modify the input reference. |
| `--extensions-root` | | An optional directory of arbitrary files for additional consumers of the package. |
