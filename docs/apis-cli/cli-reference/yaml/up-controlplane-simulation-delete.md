Delete a control plane simulation.

#### Usage

```bash
up controlplane (ctp) simulation (sim) delete <name> [flags]
```

#### Arguments

##### `<name>`

**Required**

Name of the simulation.

#### Flags

##### `--group` / `-g`

The group that the simulation is contained in. This defaults to the group specified in the current context

#### Examples

```bash
# Show help
up controlplane simulation delete --help

# Basic usage
up controlplane simulation delete my-project
```
