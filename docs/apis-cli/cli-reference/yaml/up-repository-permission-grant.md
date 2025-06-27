Grant repository permission for a team.

#### Usage

```bash
up repository (repo) permission grant <team-name> <repository-name> <permission>
```

#### Arguments

##### `<team-name>`

**Required**

Name of team.

##### `<repository-name>`

**Required**

Name of repository.

##### `<permission>`

**Required**

Permission type (admin, read, write, view).

#### Examples

```bash
# Show help
up repository permission grant --help

# Basic usage
up repository permission grant <team-name> <repository-name> <permission>
```
