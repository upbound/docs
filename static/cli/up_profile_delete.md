---
mdx:
  format: md
---

Delete an existing Upbound profile.

The `delete` command removes an Upbound profile from the configuration.

This command permanently deletes the specified profile and all its associated
configuration. The profile cannot be recovered after deletion.

#### Examples

Deletes the profile named `staging`:

```shell
up profile delete staging
```


#### Usage

`up profile delete <name> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<name>` | Name of the profile to delete. |
