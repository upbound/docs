---
title: Mirror Spaces images
description: Mirror OCI artifacts for a Spaces version to local storage or a
  private registry.
---

`up space mirror` copies all OCI artifacts for a given Spaces version to a local
directory (as `.tar.gz` files) or a container registry.

For full usage, flags, and examples, see the [up space mirror][cli-mirror]
section of the CLI reference.

## Prerequisites

* The [Up CLI][cli-reference] installed
* An Upbound token file (JSON with `accessId` and `token`) for registry auth

## Mirror to a local directory

To export artifacts as `.tar.gz` files into a directory:

```bash
up space mirror -v <version> --output-dir=<path> --token-file=<path-to-token.json>
```

Example:

```bash
up space mirror -v 1.15.2 --output-dir=/tmp/spaces-artifacts --token-file=upbound-token.json
```

## Mirror to a private registry

To push artifacts to your own container registry:

1. Log in to the registry (for example, `docker login myregistry.io`).

2. Run the mirror command with `--destination-registry`:

```bash
up space mirror -v <version> --destination-registry=<registry> --token-file=<path-to-token.json>
```

Example:

```bash
up space mirror -v 1.15.2 --destination-registry=myregistry.io --token-file=upbound-token.json
```

:::tip
Use `--dry-run` to list artifacts the command would mirror without copying them. This verifies you have proper access to the Upbound registry.
:::

[cli-mirror]: /reference/cli-reference#up-space-mirror
[cli-reference]: /reference/cli-reference
