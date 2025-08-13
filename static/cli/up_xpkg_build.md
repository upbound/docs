---
mdx:
  format: md
---

Build a package, by default from the current directory.

*This command is deprecated and will be removed in a future release.*

To build Crossplane packages with up, use the project commands. To work with
non-project Crossplane packages, use the Crossplane CLI.


#### Usage

`up xpkg build [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--name` | | [DEPRECATED: use --output] Name of the package to be built. Uses name in crossplane.yaml if not specified. Does not correspond to package tag. |
| `--output` | `-o` | Path for package output. |
| `--controller` | | Controller image used as base for package. |
| `--package-root` | `-f` | Path to package directory. |
| `--examples-root` | `-e` | Path to package examples directory. |
| `--helm-root` | `-h` | Path to helm directory. |
| `--auth-ext` | `-a` | Path to an authentication extension file. |
| `--ignore` | | Paths, specified relative to --package-root, to exclude from the package. |
