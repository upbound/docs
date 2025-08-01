---
title: What is a Profile Configuration?
sidebar_position: 3
description: Configuration for the Upbound CLI
---

`up` interacts with a variety of systems, each of which may have information
that persists between commands. `up` stores this information in a
configuration file in `~/.up/config.json`.

## Configuration

The `up` CLI stores configuration information in `~/.up/config.json`. Commands
use the specified profile when set via the `--profile` flag or `UP_PROFILE`
environment variable. If you don't set a profile, `up` uses the currently selected
profile in the configuration file.

You can list your `up` profiles and see which one is currently selected as
follows:

```shell
$ up profile list
CURRENT   NAME          TYPE           ORGANIZATION
*         default       cloud          my-org
```

### Profile types

Profiles have one of two types:

- **Cloud:** Cloud profiles interact with Cloud and Connected Spaces
  within a given Upbound organization.
- **Disconnected:** Disconnected profiles interact with a specific
  self-hosted Space not connected to Upbound.

Both profile types can log in to an Upbound organization and manage non-Space resources like Marketplace repositories. Logging in with a disconnected profile is optional.

<!-- vale write-good.Passive = NO -->

Profile types were introduced in `up` v0.37.0. All profiles created in previous
versions are treated as cloud profiles in newer versions.

<!-- vale write-good.Passive = YES -->

## Profile management

### Create a profile

To create a cloud profile for a given organization, use `up login`:

```shell
up login --profile test --organization <your-upbound-org>
```
<!--- TODO(tr0njavolta): edit:--->
<!-- vale Microsoft.Wordiness = NO -->
By default, `up login` opens browser window for interactive login. If
opening a browser window isn't possible, the command returns link to copy
and paste into a browser to log in. Then returns a one-time authentication
code to paste into your terminal. You can also log in non-interactively by passing the `--username`and `--password` flags or the `--token` flag.
<!-- vale Microsoft.Wordiness = YES -->

Initializing a self-hosted Space with `up space init` automatically creates
a disconnected profile associated with the Space. You can also create a new
disconnected profile manually based on a kubeconfig context pointed at the
Space:

```shell
up profile create <profile name> --type=disconnected --kubeconfig <kubeconfig path> --kubecontext <context name>
```

The `--kubeconfig` and `--kubecontext` flags are optional; if not given, the `up` CLI uses your default kubeconfig and current context.

### Set the current profile

By default, `up` executes commands against the `current` profile. To select the
current profile, run the following:

```shell
up profile use <profile-name>
```

<!-- vale off -->
If you have selected a kubeconfig context with `up ctx` while using a given
profile, that kubeconfig context will be restored to your kubeconfig the next
time you switch to the profile with `up profile use`.
<!-- vale on -->

### Update a profile's organization

You can change a profile's associated organization if needed:

```shell
up profile set organization <new-organization>
```

Then, run `up login` again to authenticate against the new
organization.

### Invalidate session tokens

`up` uses session tokens for authentication after login.

:::warning
Tokens are private authentication data. Don't share your token.
:::

For currently active tokens, revoke the token with `up logout --profile <profile-name>`.

For inactive tokens, use the [Upbound Password Reset][upbound-password-reset] and select "Delete all active sessions" to revoke all tokens.

### Configuring a Docker credential helper

`up` can build and push Crossplane packages. If pushing to the Upbound Marketplace, you can use the credentials acquired via `up login`.

If you prefer to use Docker or any other OCI client, you can add the following to your Docker `config.json` file after downloading `docker-credential-up`. This allows your client to use Upbound credentials to interact with the Marketplace.

Instructions for installing `docker-credential-up` are available in the [CLI installation documentation][cli-installation-documentation].

```json
{
	"credHelpers": {
		"xpkg.upbound.io": "up"
	}
}
```


[cli-installation-documentation]: /manuals/cli/overview

[upbound-password-reset]: https://accounts.upbound.io/resetPassword
