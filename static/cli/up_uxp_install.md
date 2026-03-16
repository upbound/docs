---
mdx:
  format: md
---

Install UXP.



#### Usage

`up uxp install [<version>] [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<version>` |**Optional** UXP version to install. Should be >= 2.0.0-up.0, use the helm chart to install uxp v1. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--set` | | Set parameters. |
| `--file` | `-f` | Parameters file. |
| `--bundle` | | Local bundle path. |
| `--unstable` | | Allow installing unstable versions. |
| `--disable-web-ui` | | Disable the UXP web UI. |
| `--cluster-admin` | | Install UXP with cluster admin permissions. NOT FOR PRODUCTION PURPOSES. |
