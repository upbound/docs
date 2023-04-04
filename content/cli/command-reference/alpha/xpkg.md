---
title: "up alpha xpkg"
---

Extract package contents into a Crossplane cache compatible format. Fetches from a remote registry by default.

### `up alpha xpkg xp-extract`

<!-- omit in toc -->
#### Arguments
* `<package>` - name of the package to extract. Must be a valid OCI image tag or a path if using `--from-xpkg`.

#### Flags
* `--from-daemon` - Indicates that the image should be fetched from the Docker daemon.
* `--from-xpkg` - Indicates that the image should be fetched from a local xpkg. If package is not specified and only one exists in current directory it will be used.
* `-o, --output="out.gz"` - Package output file path. Extension must be `.gz` or will be replaced.