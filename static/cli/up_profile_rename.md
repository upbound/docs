---
mdx:
  format: md
---

Rename an existing Upbound profile.

The `rename` command changes the name of an existing Upbound profile.

This command renames a profile while preserving all its configuration settings.
If the profile being renamed is currently active, it remains active after
renaming.

The new name must not conflict with any existing profile names.

#### Examples

Rename the profile `dev` to `development`:

```shell
up profile rename dev development
```


#### Usage

`up profile rename <from> <to> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<from>` | Name of the profile to rename. |
| `<to>` | New name for the profile. |
