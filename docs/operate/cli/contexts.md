---
title: Contexts
weight: 2
description: An introduction to the how contexts work in Upbound
aliases:
    - /reference/contexts
    - /reference/cli/contexts
---

Crossplane and Upbound emerged out of the Kubernetes ecosystem. The up CLI's command structure and syntax is strongly inspired by Kubernetes contexts and the conventions of the Kubernetes `kubectl` CLI.

## Contexts in Upbound

Upbound's information architecture is a hierarchy consisting of:
<!-- vale off -->
* a set of control planes
* logically grouped into control planes groups
* which are hosted in an environment called a [Space][space].

These contexts nest within each other. A control plane must **always** belong to a group which **must** be hosted in a Space--whether Cloud, Connected, or Disconnected.
<!--vale on -->

Every control plane in Upbound has its own API server. Each Space likewise offers a set of APIs that you can manage things through, exposed as a [Kubernetes-compatible API][kubernetes-compatible-api]. This means there's two relevant contextual scopes you interact with often: a **Spaces context** and a **control plane context**.

In `up`, the commands you can execute are context-sensitive.

<!-- vale off -->
## The 'up ctx' command
<!--vale on -->

In `up`, the `up ctx` sub-command is a single command to set a kubecontext across all deployments of Upbound. You can use this kubecontext to drive interactions via `kubectl`. `up` CLI commands that interact with Upbound's Kubernetes compatible APIs also use the current kubeconfig context.



<!-- vale off -->
### Interactive terminal UI

The default experience for `up ctx` is a terminal UI like [kubectx][kubectx].
<!--vale on -->

:::important
When interacting with control planes that are hosted in:

* **a Cloud or Connected Space:** make sure you're using a cloud profile logged into Upbound with `up login` before trying to use `up ctx`.
* **a Disconnected Space:** make sure you're using a disconnected profile created using the Space's kubeconfig with either `up space init` or `up profile create`.
:::

The following are some tips for using the terminal UI:

* Use the arrow keys or hotkeys to navigate around the hierarchy within Upbound. Pressing the right arrow button attempts to navigate you **into** a context. Pressing the left arrow button attempts to navigate you **out** of the current context into the parent context.
* Use the `Q` key to quit and set the context you're in as the current kubecontext.
* Use the `escape` key to quit and cancel changing your kubecontext.

### Non-interactive navigation

You can also use `up ctx` in a non-interactive mode to navigate around the information hierarchy in Upbound. This form of navigation works in similar fashion to navigating a file system from a CLI.

Suppose you start with your context pointed at a Space:

```shell
up ctx .
# returns acme/upbound-gcp-us-west1
```

To traverse to a group, you can use a relative path:

```shell
up ctx ./my-group
# returns acme/upbound-gcp-us-west1/my-group
```

To return to the previous level in the hierarchy, you can use `..`:

```shell
up ctx ..
# returns acme/upbound-gcp-us-west1
```

If you're connecting to multiple control planes and want to hop between them, you can do the following:

```shell
up ctx acme/upbound-gcp-us-west1/my-group/ctp1
# Set context to ctp1

up ctx acme/upbound-gcp-us-west1/other-group/ctp2
# Set context to ctp2

up ctx -
# Resets context to previous context, ctp1

up ctx -
# Resets context to previous context, ctp2
```

## Proxied configurations

If your organization requires a proxy like ZScaler, or other SSL network security
tools, you might run into certificate validation errors when you attempt to
connect to your control plane context.

The `--ca-bundle` flag lets you add a custom certificate authority bundle to the
trust chain.

<EditCode language="shell">
{`
up ctx --ca-bundle $@/path/to/custom-ca-bundle.pem$@ $@YOUR_ORG$@/$@YOUR_SPACE_REGION$@/$@YOUR_GROUP$@/$@YOUR_CONTROL_PLANE$@ -f -
`}
</EditCode>

### Storing a context to a file

Instead of selecting a context and making it your current kubecontext, you can also print the context out to a kubeconfig file. Run the following:

```shell
# This saves a control plane's connection details to a kubeconfig
up ctx <your-org>/<your-space>/<your-group>/<your-ctp> -f - > context.yaml

# This saves a Space's connection details to a kubeconfig
up ctx <your-org>/<your-space> -f - > context.yaml

# This saves whatever the current context is to a kubeconfig
up ctx . -f - > context.yaml
```

### Print the current context

If you get lost in the navigation hierarchy, you can print the current context to the screen with the following command:

```shell
up ctx .
```

## Generate a kubeconfig

Because contexts in Upbound are Kubernetes-compatible, there may be cases where you want to generate a [kubeconfig][kubeconfig] from a context:

- Use the kubeconfig with a CLI like kubectl
- Provide the kubeconfig to tooling such as Argo

### Generate a kubeconfig for a Space

The steps below generate a kubeconfig so you can interact with Space APIs.

1. Log on to Upbound.

```ini
up login
```

2. Set your `up` context to the desired Space. For example, this command sets it to an Upbound Cloud Space:

```ini
up ctx $@<your-org-name>$@/upbound-gcp-us-central-1
```

3. Save the current context to a kubeconfig in your current working directory called `context.yaml`:
```ini
up ctx . -f - > context.yaml
```

### Generate a kubeconfig for a Space with a group set

The steps below generate a kubeconfig with the namespace set to the group so you can interact with Space APIs.

1. Log on to Upbound.
```ini
up login
```

2. Set your `up` context to the desired control plane group in your Upbound resource hierarchy. For example, this command sets it to the default group of an Upbound Cloud Space:
```ini
up ctx $@<your-org-name>$@/upbound-gcp-us-central-1/default
``` 

3. Save the current context to a kubeconfig in your current working directory called `context.yaml`:
```ini
up ctx . -f - > context.yaml
```


### Generate a kubeconfig for a control plane in a group

The steps below generate a kubeconfig so you can interact with a control plane's API server.

1. Log on to Upbound.
```ini
up login
```

2. Set your `up` context to the desired control plane in your Upbound resource hierarchy. For example, this command sets it to a control plane in the default group of an Upbound Cloud Space:
```ini
up ctx $@<your-org-name>$@/upbound-gcp-us-central-1/default/my-ctp
``` 

3. Save the current context to a kubeconfig in your current working directory called `context.yaml`:
```ini
up ctx . -f - > context.yaml
```

[space]: /deploy
[kubernetes-compatible-api]: /apis-cli/spaces-api/
[kubectx]: https://github.com/ahmetb/kubectx/
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
