Delete a token for the robot.

#### Usage

```bash
up robot token delete <robot-name> <token-name> [flags]
```

#### Arguments

##### `<robot-name>`

**Required**

Name of robot.

##### `<token-name>`

**Required**

Name of token.

#### Flags

##### `--force`

**Default:** `false`

Force delete token even if conflicts exist.

#### Examples

```bash
# Show help
up robot token delete --help

# Basic usage
up robot token delete <robot-name> <token-name>
```
