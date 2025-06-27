Create a token for the robot.

#### Usage

```bash
up robot token create <robot-name> <token-name> [flags]
```

#### Arguments

##### `<robot-name>`

**Required**

Name of robot.

##### `<token-name>`

**Required**

Name of token.

#### Flags

##### `--file` / `-f`

file to write Token JSON, Use '-' to write to standard output.

#### Examples

```bash
# Show help
up robot token create --help

# Basic usage
up robot token create <robot-name> <token-name>
```
