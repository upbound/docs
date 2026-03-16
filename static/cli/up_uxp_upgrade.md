---
mdx:
  format: md
---

Upgrade UXP.



#### Usage

`up uxp upgrade [<version>] [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<version>` |**Optional** UXP version to upgrade. Should be >= 2.0.0-up.0, use the helm chart to install uxp v1. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--set` | | Set parameters. |
| `--file` | `-f` | Parameters file. |
| `--bundle` | | Local bundle path. |
| `--rollback` | | Rollback to previously installed version on failed upgrade. |
| `--force` | | Force upgrade even if versions are incompatible. |
| `--unstable` | | Allow installing unstable versions. |
