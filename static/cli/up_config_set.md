---
mdx:
  format: md
---

Set configuration values.

The `set` command sets a global configuration value for the `up` CLI.

#### Configuration Keys

- `telemetry.disabled`: Set to true to disable collection of anonymous
  telemetry.

#### Examples

Disable collection of anonymous telemetry:

```shell
up config set telemetry.disabled true
```


#### Usage

`up config set <key> <value>`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<key>` | Configuration key to set. |
| `<value>` | Configuration value to set. |
