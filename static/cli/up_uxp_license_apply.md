---
mdx:
  format: md
---

Apply a UXP license to a control plane. Specify either a license file or use --dev for development clusters.



#### Usage

`up uxp license apply [<license-file>] [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<license-file>` |**Optional** File containing the license key (required unless using --dev). |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--dev` | | Apply embedded development license for single-node kind clusters. |
| `--namespace` | | Namespace in which to create the license key secret. |
