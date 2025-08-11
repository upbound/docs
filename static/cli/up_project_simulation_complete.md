---
mdx:
  format: md
---

Force complete an in-progress project simulation



#### Usage

`up project simulation complete <name> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<name>` | The name of the simulation resource |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--output` | `-o` | Output the results of the simulation to the provided file. Defaults to standard out if not specified |
| `--terminate-on-finish` | | Terminate the simulation after the completion criteria is met |
| `--control-plane-group` | `-g` | The control plane group that the control plane to use is contained in. This defaults to the group specified in the current context. |
