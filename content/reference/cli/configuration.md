---
title: "Configuration"
metaTitle: "Upbound CLI - Configuration"
metaDescription: "Configuration for the Upbound CLI"
weight: 105
---

`up` interacts with a variety of systems, each of which may have information
that persists between commands. `up` stores this information in a
configuration file in `~/.up/config.json`.

## Configuration

The `up` CLI stores configuration information in `~/.up/config.json`. Commands use the specified profile when set via the `--profile` flag or `UP_PROFILE` environment variable. If a profile isn't set, `up` uses the profile specified as `default`.

### Format

`up` allows users to define profiles that contain sets of preferences and credentials for interacting with Upbound. This enables executing commands as different users, in different accounts, or different Upbound deployment contexts. 

An `up` profile uses the following format:

{{< editCode >}}
```json
{
  "upbound": {
    "default": "$@<profile-name>$@",
    "profiles": {
      "$@<profile-name>$@": {
        "id": "$@<individual-username>$@",
        "type": "$@<profile-type>$@",
        "session": "$@<session-token>$@",
        "account": "$@<organization-account>$@"
      },
      // other profiles
}
```
{{< /editCode >}}

### Profile types

You can configure an `up` profile as one of three types:

- **user:** This profile type configures `up` to communicate with an account in Upbound's SaaS environment.
- **space:** This profile type configures `up` to communicate with an [Upbound Space]({{<ref "/spaces/overview.md" >}}), which requires a `kubecontext`.
- **token:** This profile type configures `up` to communicate with an account in Upbound's SaaS environment using an API token as the auth method.

## Profile management

### Add or update a profile

To add or update a profile, users can use `up login` with the appropriate
credentials and a profile name specified. For instance, the following command
would add a new profile named `test`:

```shell
up login --profile test -u hasheddan -p cool-password
```

By default the command updates the profile named `default`. Update a specific profile with `--profile`.
Set an account as the default account with `-a` (`--account`). 

If users use `up` to create a new Space, `up` automatically adds a new profile configured to communicate with that Space.

### Set the default profile

Running commands without `--profile` or `UP_PROFILE` variable set uses the profile specified as the value to the `default:`.

If the configuration file is empty when a user logs in, that `user` becomes the default. Or, if the configuration file is empty when a user creates a Space, that `Space` becomes the default.

### Set the current profile

`up` executes commands against the `current` profile. If you have multiple profiles and you want to toggle between contexts, run the following:

{{< editCode >}}
```ini
up profile use $@<profile-name>$@
```
{{< /editCode >}}

### Invalidate session tokens

`up` uses session tokens for authentication after login. Tokens are valid for 30
days from login. 

{{<hint "important" >}}
Tokens are private authentication data. Don't share your token.
{{< /hint >}}

For currently active tokens, revoke the token with `up logout --profile <profile-name>`. 

For inactive tokens, use the [Upbound Password Reset](https://accounts.upbound.io/resetPassword) and select "Delete all active sessions" to revoke all tokens.