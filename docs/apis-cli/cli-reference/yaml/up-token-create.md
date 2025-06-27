Create a personal access token for the current user.

#### Usage

```bash
up token create <token-name> [flags]
```

#### Arguments

##### `<token-name>`

**Required**

Name of token.

#### Flags

##### `--file` / `-f`

file to write Token JSON, Use '-' to write to standard output.

#### Examples

```bash
# Show help
up token create --help

# Basic usage
up token create <token-name>
```
