Deprecated: Connect kubectl to control plane.

#### Usage

```bash
up controlplane (ctp) connect <name> [flags]
```

#### Arguments

##### `<name>`

**Required**

Name of control plane.

#### Flags

##### `--token`

API token used to authenticate. Required for Upbound Cloud; ignored otherwise.

##### `--group` / `-g`

The control plane group that the control plane is contained in. By default, this is the group specified in the current profile.

#### Examples

```bash
# Show help
up controlplane connect --help

# Basic usage
up controlplane connect my-project
```
