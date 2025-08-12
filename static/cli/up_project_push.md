---
mdx:
  format: md
---

Push a project's packages to the Upbound Marketplace.



#### Usage

`up project push [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--repository` | | Repository to push to. Overrides the repository specified in the project file. |
| `--tag` | `-t` | Tag for the built package. If not provided, a semver tag will be generated. |
| `--package-file` | | Package file to push. Discovered by default based on repository and tag. |
| `--max-concurrency` | | Maximum number of functions to build at once. |
| `--public` | | Create new repositories with public visibility. |
