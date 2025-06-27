Remove the robot from a team.

#### Usage

```bash
up robot team leave <team-name> <robot-name> [flags]
```

#### Arguments

##### `<team-name>`

**Required**

Name of team.

##### `<robot-name>`

**Required**

Name of robot.

#### Flags

##### `--force`

**Default:** `false`

Force the removal of a robot from a team even if conflicts exist.

#### Examples

```bash
# Show help
up robot team leave --help

# Basic usage
up robot team leave <team-name> <robot-name>
```
