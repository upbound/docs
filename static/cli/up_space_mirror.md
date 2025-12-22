---
mdx:
  format: md
---

Managing the mirroring of artifacts to local storage or private container registries.

The `mirror` command mirrors all required OCI artifacts for a specific Spaces
version.

#### Examples

Mirror all artifacts for Spaces version 1.9.0 into a local directory as
`.tar.gz` files, using the token file for authentication:

```shell
up space mirror -v 1.9.0 --output-dir=/tmp/output --token-file=upbound-token.json
```

Mirror all artifacts for Spaces version 1.9.0 to a specified container registry,
using the token file for authentication. Note that you must log in to the mirror
registry first using a command like `docker login myregistry.io`:

```shell
up space mirror -v 1.9.0 --destination-registry=myregistry.io --token-file=upbound-token.json
```

Print the artifacts that would be mirrored into a local directory for Spaces
version 1.9.0, using the token file for authentication. A request is made to the
Upbound registry to confirm network access:

```shell
up space mirror -v 1.9.0 --output-dir=/tmp/output --token-file=upbound-token.json --dry-run
```


#### Usage

`up space mirror --version=STRING [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--registry-repository` | | Set registry for where to pull OCI artifacts from. This is an OCI registry reference, i.e. a URL without the scheme or protocol prefix. |
| `--registry-endpoint` | | Set registry endpoint, including scheme, for authentication. |
| `--token-file` | | File containing authentication token. Expecting a JSON file. Example: {"accessId": "<access-id>", "token": "<token>"} |
| `--registry-username` | | Set the registry username. |
| `--registry-password` | | Set the registry password. |
| `--output-dir` | `-t` | The local directory path where exported artifacts will be saved as .tgz files. |
| `--destination-registry` | `-d` | The target container registry where the artifacts will be mirrored. |
| `--version` | `-v` | **Required** The specific Spaces version for which the artifacts will be mirrored. |
| `--dry-run` | | Print what would be mirrored but do not take action. |
