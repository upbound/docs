Create a new Upbound Profile without logging in.

#### Usage

```bash
up profile create <name> [flags]
```

#### Arguments

##### `<name>`

**Required**

Name of the profile to create.

#### Flags

##### `--use`

**Default:** `true`

Use the new profile after it's created. Defaults to true.

##### `--type`

**Default:** `cloud`

Type of profile to create: cloud or disconnected.

#### Examples

```bash
# Show help
up profile create --help

# Basic usage
up profile create my-project
```
