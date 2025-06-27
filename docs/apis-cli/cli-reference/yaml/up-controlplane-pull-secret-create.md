Create a package pull secret.

#### Usage

```bash
up controlplane (ctp) pull-secret create <name> [flags]
```

#### Arguments

##### `<name>`

**Required**

Name of the pull secret.

#### Flags

##### `--file` / `-f`

Path to credentials file. Credentials from profile are used if not specified.

##### `--namespace` / `-n`

**Default:** `crossplane-system`

Kubernetes namespace for pull secret.

#### Examples

```bash
# Show help
up controlplane pull-secret create --help

# Basic usage
up controlplane pull-secret create my-project
```
