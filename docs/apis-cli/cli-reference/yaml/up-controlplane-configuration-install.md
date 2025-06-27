Install a Configuration.

#### Usage

```bash
up controlplane (ctp) configuration install <package> [flags]
```

#### Arguments

##### `<package>`

**Required**

Reference to the Configuration.

#### Flags

##### `--name`

Name of Configuration.

##### `--package-pull-secrets`

List of secrets used to pull Configuration.

##### `--wait` / `-w`

Wait duration for successful Configuration installation.

#### Examples

```bash
# Show help
up controlplane configuration install --help

# Basic usage
up controlplane configuration install <package>
```
