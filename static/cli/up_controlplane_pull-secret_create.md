---
mdx:
  format: md
---

Create a package pull secret.



#### Usage

`up controlplane pull-secret create <name> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<name>` | Name of the pull secret. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--file` | `-f` | Path to credentials file. Credentials from profile are used if not specified. |
| `--namespace` | `-n` | Kubernetes namespace for pull secret. |
