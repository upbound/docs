---
mdx:
  format: md
---

Update the dependency cache for the current project.

The `update-cache` command updates the local dependency cache for the current
project.  It downloads and caches all dependencies specified in the project's
upbound.yaml file.

#### Examples

```shell
up dependency update-cache
```

Updates cache for all dependencies in upbound.yaml.
Uses default cache directory (~/.up/cache/).

```shell
up dependency update-cache --cache-dir `path/to/cache`
```

Updates cache using a custom cache directory.
Useful for CI/CD environments.

```shell
up dependency update-cache -f `custom-project.yaml`
```

Updates cache for dependencies in a custom project file.
Default is upbound.yaml.


#### Usage

`up dependency update-cache [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--cache-dir` | | Directory used for caching package images. |
