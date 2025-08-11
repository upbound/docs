---
mdx:
  format: md
---

Run a project as a simulation against an existing control plane.



#### Usage

`up project simulate <source-control-plane-name> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<source-control-plane-name>` | Name of the source control plane |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--repository` | | Repository for the built package. Overrides the repository specified in the project file. |
| `--no-build-cache` | | Don't cache image layers while building. |
| `--build-cache-dir` | | Path to the build cache directory. |
| `--max-concurrency` | | Maximum number of functions to build and push at once. |
| `--name` | `-n` | The name of the simulation resource |
| `--tag` | | An existing tag of the project to simulate. If not specified, defaults to building and pushing a new version |
| `--output` | `-o` | Output the results of the simulation to the provided file. Defaults to standard out if not specified |
| `--terminate-on-finish` | | Terminate the simulation after the completion criteria is met |
| `--wait` | | Wait until the simulation completes and output the difference. |
| `--complete-after` | | The amount of time the simulated control plane should run before ending the simulation |
| `--control-plane-group` | `-g` | The control plane group that the control plane to use is contained in. This defaults to the group specified in the current context. |
| `--cache-dir` | | Directory used for caching dependencies. |
| `--public` | | Create new repositories with public visibility. |
| `--timeout` | | Maximum time to wait for the project to become ready in the control plane. Set to zero to wait forever. |
