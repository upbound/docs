---
title: Compose resources dynamically
draft: true
---

:::important
This guide requires an Upbound control plane instance running UXP v2.0 or later
and targets users with existing control plane experience. Upbound SaaS coming soon.
:::

The UP CLI lets you create an MCP server configurations for kubectl-ai for Cursor, Gemini CLI or Claude Code

```shell
up project ai configure-tools <PROVIDER-FLAG>
```

This will create the tooling configuration file in the repo for your control plane project.

Once created, reference the MCP server tool in your IDE provider of choice, and use it to accelerate your Crossplane development.
