Create a repository.

#### Usage

```bash
up repository (repo) create <name> [flags]
```

#### Arguments

##### `<name>`

**Required**

Name of repository.

#### Flags

##### `--private`

Make the new repository private.

##### `--publish`

Enable Upbound Marketplace listing page for the new repository.

#### Examples

```bash
# Show help
up repository create --help

# Basic usage
up repository create my-project
```
