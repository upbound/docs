Install a Function.

#### Usage

```bash
up controlplane (ctp) function install <package> [flags]
```

#### Arguments

##### `<package>`

**Required**

Reference to the Function.

#### Flags

##### `--name`

Name of Function.

##### `--package-pull-secrets`

List of secrets used to pull Function.

##### `--wait` / `-w`

Wait duration for successful Function installation.

#### Examples

```bash
# Show help
up controlplane function install --help

# Basic usage
up controlplane function install <package>
```
