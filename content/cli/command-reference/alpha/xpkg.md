---
title: "up alpha xpkg"
---

Extract package contents into a Crossplane cache compatible format. Fetches from a remote registry by default.

### `up alpha xpkg xp-extract`


#### Arguments
* `<package>` - name of the package to extract. Must be a valid OCI image tag or a path if using `--from-xpkg`.

#### Flags
* `--from-daemon` - Fetch the image from the Docker daemon.
* `--from-xpkg` - Fetch the image from a local xpkg. If package isn't specified the command uses the current directory.
* `-o, --output="out.gz"` - Package output path. Extension must be `.gz`.