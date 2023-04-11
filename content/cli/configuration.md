---
title: "Configuration"
metaTitle: "Upbound CLI - Configuration"
metaDescription: "Configuration for the Upbound CLI"
weight: 105
---

`up` interacts with a variety of systems, each of which may have information
that persists between commands. `up` stores this information in a
configuration file in `~/.up/config.json`.

## Upbound configuration

The `up` CLI stores configuration information in `~/.up/config.json`.

### Format

`up` allows users to define profiles that contain sets of preferences and
credentials for interacting with Upbound. This enables executing commands
as different users, or in different accounts. The following example defines five
profiles: `default`, `dev`, `staging`, `prod`, and `ci`. Commands
use the specified profile when set via the `--profile` flag or `UP_PROFILE`
environment variable. If a profile isn't set, `up` uses the profile
specified as `default`, named `default` in this example.

```json
{
  "upbound": {
    "default": "default",
    "profiles": {
      "default": {
        "id": "hasheddan",
        "type": "user",
        "session": "abcdefg123456789",
        "account": "hasheddan"
      },
      "dev": {
        "id": "hasheddan",
        "type": "user",
        "session": "abcdefg123456789",
        "account": "dev"
      },
      "staging": {
        "id": "hasheddan",
        "type": "user",
        "session": "abcdefg123456789",
        "account": "staging"
      },
      "prod": {
        "id": "hasheddan",
        "type": "user",
        "session": "abcdefg123456789",
        "account": "prod"
      },
      "ci": {
        "id": "faa2d557-9d10-4986-8379-4ad618360e57",
        "type": "token",
        "session": "abcdefg123456789",
        "account": "my-org"
      },
}
```

### Specifying Upbound instance

Because Upbound offers both a hosted and self-hosted product, users may be
logging in and interacting with Upbound or their own installation. `up` assumes 
by default that a user is interacting with hosted Upbound and uses `https://api.upbound.io` 
as the domain. All commands that interact with Upbound also accept an `--domain` /
`UP_DOMAIN`, which overrides the API endpoint.

### Adding or updating a profile

To add or update a profile, users can use `up login` with the appropriate
credentials and a profile name specified. For instance, the following command
would add a new profile named `test`:

```shell
up login --profile test -u hasheddan -p cool-password
```

By default the command updates the profile named `default`. Update a specific profile with `--profile`.
Set an account as the default account with `-a` (`--account`).

### Setting the default profile

Running commands without `--profile` or `UP_PROFILE` variable set uses the profile specified as the value to the `default:`.
If the configuration file is empty when a user logs in, that `user` becomes the default.

### Invalidate session tokens

`up` uses session tokens for authentication after login. Tokens are valid for 30
days from login. 

{{<hint "important" >}}
Tokens are private authentication data. Don't share your token.
{{< /hint >}}

For currently active tokens, revoke the token with `up logout --profile <profile-name>`. 

For inactive tokens, use the [Upbound Password Reset](https://accounts.upbound.io/resetPassword) and select "Delete all active sessions" to revoke all tokens.
