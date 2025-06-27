Add a dependency to the current project.

#### Usage

```bash
up dependency (dep) add <package> [flags]
```

#### Arguments

##### `<package>`

**Required**

Package to be added.

#### Flags

##### `--project-file` / `-f`

**Default:** `upbound.yaml`

Path to project definition file.

##### `--cache-dir`

**Default:** `~/.up/cache/`

Directory used for caching package images.

#### Examples

```bash
# Show help
up dependency add --help

# Basic usage
up dependency add <package>
```
