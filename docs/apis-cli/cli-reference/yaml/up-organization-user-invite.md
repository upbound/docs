Invite a user to the organization.

#### Usage

```bash
up organization (org) user invite <org-name> <email> [flags]
```

#### Arguments

##### `<org-name>`

**Required**

Name of the organization.

##### `<email>`

**Required**

Email address of the user to invite.

#### Flags

##### `--permission` / `-p`

**Default:** `member`

Role of the user to invite (owner or member).

#### Examples

```bash
# Show help
up organization user invite --help

# Basic usage
up organization user invite <org-name> <email>
```
