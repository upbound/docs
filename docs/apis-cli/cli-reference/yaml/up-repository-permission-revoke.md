Revoke repository permission from a team.

#### Usage

```bash
up repository (repo) permission revoke <team-name> <repository-name> [flags]
```

#### Arguments

##### `<team-name>`

**Required**

Name of team.

##### `<repository-name>`

**Required**

Name of repository.

#### Flags

##### `--force`

**Default:** `false`

Force the revoke of the repository permission even if conflicts exist.

#### Examples

```bash
# Show help
up repository permission revoke --help

# Basic usage
up repository permission revoke <team-name> <repository-name>
```
