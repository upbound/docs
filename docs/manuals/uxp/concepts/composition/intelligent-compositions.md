---
title: Intelligent Compositions
sidebar_position: 4
description: Embed AI intelligence in the composition reconcile loop.
draft: true
---

Upbound control planes combine deterministic control (like reconciliation and
policy) with intelligent control (driven by embedded AI agents). Bring
intelligence into the control loop of your compositions with AI-embedded
compositions functions.

AI-embedded composition functions are standard [functions][functions] that've
been designed to integrate with popular Large Language Model providers, such as
from OpenAI and Anthropic. You can supplement existing function pipelines with
these AI-embedded functions. 

## Example AI-embedded function

Composition functions are a fundamental unit of work in a control plane. Here's
an example of a composition that uses a function to augment the status of the
resource, based on the state of the child resources and events getting emitted:

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xnetworks.example.upbound.io
spec:
  compositeTypeRef:
    apiVersion: example.upbound.io/v1alpha1
    kind: XNetwork
  mode: Pipeline
  pipeline:
  - functionRef:
      name: compose-resources
    step: compose-resources
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
When you create an XNetwork object, your control plane uses the provided API key to call Claude, an LLM offered by Anthropic, to:
- analyze the config and status of each composed resource
- make a determination why each resource isn't ready, if it's not
- provide a root cause summary in the status of the XNetwork object and suggest remedial actions

## Official AI-embedded function

Upbound offers a number of Official Functions that've been AI-enabled and are suitable for composition:
- [function-claude][functionClaude]
- [function-openai][functionOpenAi]
- [function-claude-status-transformer][functionStatusTransformer]
- [function-pod-analyzer][functionPodAnalyzer]

[functions]: /manuals/uxp/packages/functions
[functionClaude]: https://marketplace.upbound.io/
[functionOpenAi]: https://marketplace.upbound.io/
[functionStatusTransformer]: https://marketplace.upbound.io/
[functionPodAnalyzer]: https://marketplace.upbound.io/
