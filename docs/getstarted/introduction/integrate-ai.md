---
title: Integrate an AI pipeline
sidebar_position: 2
---

Now that you have an `App` deployment, this guide walks you through how to add
an AI operation pipeline to your composition. Upbound's AI-native architeture
enables you to integrate intelligent automation directly into your control
plane. The advantages of intelligent control planes are enhanced observability,
automated diagnostics, and intelligent resource management.

By the end of this guide, you'll have an AI-powered pipeline that can
automatically analyze resource status changes

## Prerequisites

* An Upbound account
* The `up` CLI installed
* `kubectl` installed
* An LLM API key (Claude, OpenAI)

Make sure you've finished the previous guide before moving on to this tutorial.

## Set up your AI provider

First, create an environment variable to store your AI provider credentials:

<Tabs>
<TabItem title="Claude">
```shell
export ANTHROPIC_API_KEY="sk-ant-api..."
```
Create a new secret with this API key:

```shell
kubectl -n crossplane-system create secret generic api-key-anthropic --from-literal=ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}"
```

</TabItem>
<TabItem title="OpenAI">
```shell
todo
```
</TabItem>
</Tabs>

## Add an AI pipeline step

Add the status transformer function to your project dependencies:

```shell
up dep add URL
```

Next, add the following function configuration to your `composition.yaml` file:

```yaml
  - functionRef:
      name: upbound-function-claude-status-transformer
    input:
      apiVersion: function-claude-status-transformer.fn.crossplane.io/v1beta1
      kind: StatusTransformation
      additionalContext: ""
    step: upbound-function-claude-status-transformer
    credentials:
    - name: claude
      source: Secret
      secretRef:
        namespace: crossplane-system
        name: api-key-anthropic
```

Save your composition pipeline step and run your project again to pick up your
changes:

```shell
up project run --local
```

## Update your configuration

Make a change to trigger the AI function

Observe the AI-ness of it all.

Add the prompt function.

## Clean up

## Next steps

Want more AI? Try these guides:



