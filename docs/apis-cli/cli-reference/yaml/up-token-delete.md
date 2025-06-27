Delete a personal access token for the current user.

#### Usage

```bash
up token delete <token-name> [flags]
```

#### Arguments

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
up token delete --help

# Basic usage
up token delete <token-name>
```
