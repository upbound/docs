Install a Provider.

#### Usage

```bash
up controlplane (ctp) provider install <package> [flags]
```

#### Arguments

##### `<package>`

**Required**

Reference to the Provider.

#### Flags

##### `--name`

Name of Provider.

##### `--package-pull-secrets`

List of secrets used to pull Provider.

##### `--wait` / `-w`

Wait duration for successful Provider installation.

#### Examples

```bash
# Show help
up controlplane provider install --help

# Basic usage
up controlplane provider install <package>
```
