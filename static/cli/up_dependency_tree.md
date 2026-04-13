---
mdx:
  format: md
---

Display the dependency tree for the current project or a specific package.

The `tree` command displays the full dependency tree for the current project,
including all transitive dependencies. Each dependency is shown with its
resolved version and package kind (Provider, Configuration, Function, etc.).

Packages that appear multiple times in the graph (diamond dependencies) are
shown in full on their first occurrence and marked with `(*)` on subsequent
occurrences to avoid redundancy.

If a package reference is provided as an argument, the command displays the
dependency tree for that specific package instead of the current project.

#### Examples

Display the dependency tree for the current project:

```shell
up dependency tree
```

Display the dependency tree for a specific package:

```shell
up dependency tree xpkg.upbound.io/upbound/platform-ref-aws:v0.8.0
```

Display the dependency tree using a custom project file:

```shell
up dependency tree --project-file path/to/upbound.yaml
```


#### Usage

`up dependency tree [<package>] [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<package>` |**Optional** Package reference to show tree for (e.g. xpkg.upbound.io/org/name:version). Defaults to current project. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--cache-dir` | | Directory used for caching package images. |
