---
title: AI-powered Intelligent Controllers
description: "Learn how to use the AI-powered Intelligent Controllers in UXP"
sidebar_position: 1
---

Upbound Crossplane supports running **Intelligent Controllers**, which are a
class of [composition functions][intelligent-compositions] and [operation
functions][intelligent-operations] that bring LLM-driven logic into your control
plane's reconcile loop.

<!-- vale alex.Condescending = NO -->
Intelligent controllers extend the traditional `observe → compare → act` pattern
to `observe → analyze → act → adapt` cycles that incorporate AI-driven reasoning
capabilities. The analyze phase introduces decision making that can balance
competing objectives, understand business context, and optimize based on complex
patterns that deterministic logic can't easily capture. The adapt phase enables
learning from operational outcomes to improve future decision-making processes.
<!-- vale alex.Condescending = YES -->


## Intelligent Compositions

When you incorporate a [composition function][intelligent-compositions] having
AI intelligence to a composition pipeline, it's considered an _intelligent
composition_. Some examples of these functions are:

- [function-claude][function-claude]
- [function-openai][function-openai]

These functions pass the pipeline context to a Large Language Model, such as
Claude, and provide user-specified prompts to task Claude with influencing the
configuration of a function pipeline's desired resources. [MCP
servers][mcp-servers], packaged as [Add-Ons][add-ons], are installable on your
control plane and deliver additional tools that may be used by the language
model. 

## Intelligent Operations

When you incorporate an [operation function][intelligent-operations] having AI
intelligence to an operation pipeline, it's considered an _intelligent
operation_. Some examples of these functions are:

- [function-ai-status-transformer][function-ai-status-transformer]
- [function-pod-analyzer][function-pod-analyzer]

## Model Context Protocol (MCP) Servers

Model Context Protocol (MCP) is an open standard for connecting LLMs to systems
where data lives. Upbound Crossplane supports the installation of MCP servers,
packaged as [Add-Ons][add-ons]. Some examples are:

- [controlplane-mcp-server][controlplane-mcp-server]
- [marketplace-mcp-server][marketplace-mcp-server]

Learn about how to package an MCP server into an Add-On in the [concept][add-on-concept] documentation.

## Next steps

Learn about example use cases of Intelligent Controllers by [reading the guides][intelligent-controllers-guides]

[intelligent-compositions]: /manuals/uxp/concepts/composition/intelligent-compositions
[intelligent-operations]: /manuals/uxp/concepts/operations/intelligent-operations
[mcp-servers]: #model-context-protocol-mcp-servers
[add-ons]: /manuals/uxp/features/add-ons
[add-on-concept]: /manuals/uxp/concepts/packages/add-ons
[intelligent-controllers-guides]: /guides/intelligent-controllers/scale-database
<!--TODO crwilhit: replace with actual marketplace listings-->
[function-claude]: https://marketplace.upbound.io
[function-openai]: https://marketplace.upbound.io
[function-ai-status-transformer]: https://marketplace.upbound.io
[function-pod-analyzer]: https://marketplace.upbound.io
[controlplane-mcp-server]: https://marketplace.upbound.io
[marketplace-mcp-server]: https://marketplace.upbound.io
