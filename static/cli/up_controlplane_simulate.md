---
mdx:
  format: md
---

Alias for 'up controlplane simulation create'.



#### Usage

`up controlplane simulate --changeset=CHANGESET,... <source-name> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<source-name>` | Name of source control plane. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--group` | `-g` | The control plane group that the control plane is contained in. This defaults to the group specified in the current context |
| `--simulation-name` | `-n` | The name of the simulation resource |
| `--changeset` | `-f` | **Required** Path to the resources that will be applied as part of the simulation. Can either be a single file or a directory |
| `--recursive` | `-r` | Process the directory used in -f, --changeset recursively. |
| `--complete-after` | | The maximum amount of time the simulated control plane should run before ending the simulation |
| `--fail-on` | | Fail and exit with a code of '1' if a certain condition is met |
| `--output` | `-o` | Output the results of the simulation to the provided file. Defaults to standard out if not specified |
| `--wait` | | Wait for the simulation to complete. If set to false, the command will exit immediately after the changeset is applied |
| `--terminate-on-finish` | | Terminate the simulation after the completion criteria is met |
