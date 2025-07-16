---
title: Intelligent Operations
sidebar_position: 5
description: Embed AI intelligence in the Operation execution flow.
---

Upbound control planes combine deterministic control (like reconciliation and policy) with intelligent control (driven by embedded AI agents). Bring intelligence into the exection flow of your Operations with AI-embedded operation functions.

AI-embedded operation functions are standard [functions][functions] that've been designed to integrate with popular Large Language Model providers, such as from OpenAI and Anthropic. You can supplement existing function pipelines with these AI-embedded functions. 

## Example AI-embedded function

Operation functions are a fundamental unit of work in a control plane. Here's an example of an Operation that uses a function to determine why a set of pods are stuck in a `CrashLoopBackoff`:

```yaml
TODO
```

Explain what this is doing

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