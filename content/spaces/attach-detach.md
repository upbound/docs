---
title: Attach or detach from the Upbound Console
weight: 120
description: How to configure automatic upgrades of Crossplane in a managed control plane
---

{{< hint "important" >}}
This functionality is in preview and requires Spaces `v1.3.0`.
{{< /hint >}}

You can attach self-hosted Spaces to the [Upbound Console]({{<ref "concepts/console">}}) to use the rich ops and debugging experiences available only in the Console. 

## Usage

### Attach

To attach a self-hosted Space to the global Upbound Console, you need a preexisting [organization]({{<ref "concepts/accounts/organizations.md">}}) in Upbound's cloud. Make sure you're logged into that organization in the `up` CLI. Make sure your current kubecontext points to the Kubernetes cluster where you've installed the self-hosted Space software. 

Give your Space a friendly name to show up in the Console. If you don't provide this, `up` automatically generates one for you:

{{< editCode >}}
```ini
export UPBOUND_SPACE_NAME=$@your-self-hosted-space$@
```
{{< /editCode >}}

Attach the Space to the Console:

```bash
up space attach "${UPBOUND_SPACE_NAME}"
```

This command installs a Connect agent into the `upbound-system` namespace of your Space. It also creates and configures the necessary service account (robot) and permissions in your Upbound cloud organization necessary for communication.

Go to the [Upbound Console](https://console.upbound.io), log in, and choose the newly attached Space from the Space selector dropdown.

{{<img src="spaces/images/attached-space.png" alt="A screenshot of the Upbound Console space selector dropdown">}}

You can only attach a self-hosted Space to a single organization at a time.

### Detach

To detach a self-hosted Space which you attached prior (or it longer exists), run the following command:

```bash
up space detach "${UPBOUND_SPACE_NAME}"
```

If the Space still exists, this command uninstalls the Connect agent installed prior. It also cleans up the service account (robot) and permissions created prior.

## Security model

### Architecture

{{<img src="spaces/images/console-attach-architecture.jpg" alt="An architectural diagram of a self-hosted Space attached to Upbound">}}

{{< hint "note" >}}
This diagram illustrates a self-hosted Space running in AWS connected to the global Upbound Console. The same model applies to a Space running in AKS, GKE, or other Kubernetes environments.
{{< /hint >}}

### Data path

Upbound uses a Pub/Sub model exposed over TLS to communicate between Upbound's global console and a user's self-hosted Space. Users' self-hosted Spaces establish a secure connection with `connect.upbound.io` and subscribe to an endpoint. The Upbound Console in turn communicates to the Space through that endpoint. The data flow appears like the following:

1. Users sign in to the Upbound Console, redirecting to authenticate with an organization's configured Identity Provider via SSO.
2. Once the users have authenticated, users can trigger requests from the Console, such as fetching a list of control planes or fetching the resources of a certain type from a specific control plane. These requests post as messages to the Upbound Connect service.
3. A user's self-hosted Space polls the Upbound Connect service periodically for new messages, verifies the authenticity of the message, and fulfills the request contained.
4. A user's self-hosted Space returns the results of the request to the Upbound Connect service, whereby the Console renders the results in the user's browser session.

**No data originating from your self-hosted Space is ever stored in Upbound's cloud.** The data is transient and contained only within the user's browser session. The Console needs it render things, like to present a tree of resources on a managed control plane.

### Data transmitted

Normal actions taken in the Console generate a variety of requests that go to your self-hosted Space. When users use the Upbound Console to explore, manage, and debug a self-hosted Space, their actions generate queries as described in the previous section. Data returns from the self-hosted Space, existing only in the user's browser session. The data which gets sent back and renders in the user's Console browser session could be any of the following:

* Metadata for the Space
* Metadata for managed control planes in the state
* Configuration manifests for various resource types within your Space: Crossplane managed resources, composite resources, composite resource claims, Upbound shared secrets, Upbound shared backups, Crossplane providers, ProviderConfigs, Configurations, and Crossplane Composite Functions.

It's important to note this kind of data only concerns resource configuration. There's no ability to gain visibility into any data _inside_ the resource managed by control planes running on your Space.

**Upbound can't see your data.** Upbound doesn't have access to any of the session-based data rendered for your users in the Upbound Console. Likewise Upbound has no information about your self-hosted Space, other than the fact that you've attached a self-hosted Space, somewhere.

### Threat vectors

Only users with high enough access granted within your Upbound organization can use the console to perform write operations. These write operations could be like to create or delete a control plane, or to create or delete a control plane group. For a malicious actor to pose a threat to your self-hosted Space, they must first pass authentication via SSO to your Identity Provider. They must then gain the required level of access (editor or administrator access) within Upbound to perform any action beyond read-level ability.

Employees of Upbound aren't members of your Identity Provider. A malicious Upbound employee doesn't have an ability to bypass the safeguard in place by using SSO to the Upbound Console.