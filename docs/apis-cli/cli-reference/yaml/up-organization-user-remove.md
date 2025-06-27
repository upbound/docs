Remove a member from the organization.

#### Usage

```bash
up organization (org) user remove <org-name> <user> [flags]
```

#### Arguments

##### `<org-name>`

**Required**

Name of the organization.

##### `<user>`

**Required**

Username or email of the user to remove.

#### Flags

##### `--force`

**Default:** `false`

Force removal of the member.

#### Examples

```bash
# Show help
up organization user remove --help

# Basic usage
up organization user remove <org-name> <user>
```
