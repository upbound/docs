---
title: Contexts
weight: 2
description: An introduction to the how contexts work in Upbound
---

Crossplane and Upbound emerged out of the Kubernetes ecosystem. The up CLI's command structure and syntax is strongly inspired by Kubernetes contexts and the conventions of the Kubernetes `kubectl` CLI. 

## Contexts in Upbound

Upbound's information architecture is a hierarchy consisting of:

* a set of managed control planes
* logically grouped into control planes groups
* which are hosted in an environment called a [Space]({{<ref "/all-spaces" >}}).

These contexts nest within each other. An MCP must **always** belong to a group which **must** be hosted in a Space--whether Cloud, Connected, or Disconnected.

Every managed control plane in Upbound has its own API server. Each Space likewise offers a set of APIs that you can manage things through, exposed as a [Kubernetes-compatible API]({{<ref "/reference/space-api" >}}). This means there's two relevant contextual scopes you interact with often: a **Spaces context** and a **control plane context**.

In `up`, the commands you can execute are context-sensitive. 

## The 'up ctx' command

In `up`, the `up ctx` sub-command is a single command that can used across all deployments of Upbound to set a kubecontext. You can use this kubecontext to drive interactions via `kubectl` or it's used during the execution of other `up` CLI commands.

### Interactive terminal UI (TUI)

The default experience for `up ctx` is a terminal UI like [kubectx]().

{{< hint "important" >}}
When interacting with managed control planes that are hosted in:

* **a Cloud Space:** always make sure you're logged into Upbound with `up web-login` before trying to use `up ctx`.
* **a Connected or Disconnected Space:** always make sure your current kubecontext is pointed at the cluster which hosts your Space.
{{< /hint >}}

The following are some tips for using the TUI:

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

### Storing a context to a file

Instead of selecting a context and making it your current kubecontext, you can also print the context out to a kubeconfig file. Run the following:

```shell
# This saves an MCP's connection details to a kubeconfig
up ctx <your-org>/<your-space>/<your-group>/<your-ctp> -f context.yaml

# This saves a Space's connection details to a kubeconfig
up ctx <your-org>/<your-space> -f context.yaml

# This saves whatever the current context is to a kubeconfig
up ctx . -f context.yaml
```

### Print the current context

If you get lost in the navigation hierarchy, you can print the current context to the screen with the following command:

```shell
up ctx .
```

