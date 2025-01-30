---
title: "Configuration"
metaTitle: "Upbound CLI - Configuration"
description: "Configuration for the Upbound CLI"
weight: 105
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

- **Cloud:** Cloud profiles are used to interact with Cloud and Connected Spaces
  within a given Upbound organization.
- **Disconnected:** Disconnected profiles are used to interact with a specific
  self-hosted Space that is not connected to Upbound.

Both types of profiles can be logged in to an Upbound organization and used to
manage non-Space resources such as Marketplace repositories. Logging in is
optional for disconnected profiles.

Profile types were introduced in `up` v0.37.0. All profiles created in previous
versions are treated as cloud profiles in newer versions.

## Profile management

### Create a profile

To create a cloud profile for a given organization, use `up login`:

```shell
up login --profile test --organization $@<your-upbound-org>$@
```

By default, `up login` will open a browser window for interactive login. If
opening a browser window is not possible it will show a link that can be copied
and pasted into a browser to login and then copy back a one-time authentication
code. It is also possible to login non-interactively by passing the `--username`
and `--password` flags or the `--token` flag.

Initializing a self-hosted Space with `up space init` will automatically create
a disconnected profile associated with the Space. You can also create a new
disconnected profile manually based on a kubeconfig context pointed at the
Space:

```shell
up profile create --type=disconnected --kubeconfig $@<kubeconfig path>$@ --kubecontext $@<context name>$@
```

The `--kubeconfig` and `--kubecontext` flags are optional; if not given, your
default kubeconfig and its current context will be used.

### Set the current profile

By default, `up` executes commands against the `current` profile. To select the
current profile, run the following:

{{< editCode >}}
```shell
up profile use $@<profile-name>$@
```
{{< /editCode >}}

If you have selected a kubeconfig context with `up ctx` while using a given
profile, that kubeconfig context will be restored to your kubeconfig the next
time you switch to the profile with `up profile use`.

### Update a profile's organization

You can change a profile's associated organization if needed:

```shell
up profile set organization $@<new-organization>$@
```

You will then need to run `up login` again to authenticate against the new
organization.

### Invalidate session tokens

`up` uses session tokens for authentication after login.

{{<hint "important" >}}
Tokens are private authentication data. Don't share your token.
{{< /hint >}}

For currently active tokens, revoke the token with `up logout --profile <profile-name>`.

For inactive tokens, use the [Upbound Password Reset](https://accounts.upbound.io/resetPassword) and select "Delete all active sessions" to revoke all tokens.

### Configuring a Docker credential helper

`up` can build and push Crossplane packages. If pushing to the Upbound Marketplace, you can use the credentials acquired via `up login`.

If you prefer to user Docker, or any other OCI client, you can add the following to your Docker `config.json` file after downloading `docker-credential-up`. This allows your client to use Upbound credentials to interact with the Marketplace.

Instructions for installing `docker-credential-up` are available in the [CLI installation documentation]({{<ref "reference/cli/_index.md#install-docker-credential-up" >}}).

{{< editCode >}}
```json
{
	"credHelpers": {
		"xpkg.upbound.io": "up"
	}
}
```
{{< /editCode >}}
