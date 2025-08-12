---
mdx:
  format: md
---

Tear down a development control plane started by the run command.



#### Usage

`up project stop [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--control-plane-group` | | The control plane group that the control plane to use is contained in. This defaults to the group specified in the current context. |
| `--control-plane-name` | | Name of the control plane to stop. Defaults to the project name. |
| `--skip-control-plane-check` | | Allow stopping a non-development control plane. |
| `--force` | | Do not ask for confirmation before stopping the control plane. |
| `--local` | | Find and stop a local dev control plane, even if Spaces is available. |
