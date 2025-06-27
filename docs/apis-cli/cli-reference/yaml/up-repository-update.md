Update a repository.

#### Usage

```bash
up repository (repo) update <name> [flags]
```

#### Arguments

##### `<name>`

**Required**

Name of repository. Required.

#### Flags

##### `--private`

The desired repository visibility. Required.

##### `--publish`

The desired repository publishing policy. Required.

##### `--force`

**Default:** `false`

Force the repository update.

#### Examples

```bash
# Show help
up repository update --help

# Basic usage
up repository update my-project
```
