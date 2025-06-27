Delete a control plane.

#### Usage

```bash
up controlplane (ctp) delete <name> [flags]
```

#### Arguments

##### `<name>`

**Required**

Name of control plane.

#### Flags

##### `--group` / `-g`

The control plane group that the control plane is contained in. This defaults to the group specified in the current context

#### Examples

```bash
# Show help
up controlplane delete --help

# Basic usage
up controlplane delete my-project
```
