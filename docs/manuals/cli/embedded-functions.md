---
title: What are Embedded Functions?
description: "What are Embedded Functions?"
sidebar_position: 5
---

## What are Embedded Functions?

An embedded function is a lightweight, self-contained unit of logic that runs inside your control plane as part of a function pipeline. Embedded functions allow you to customize how your compositions behave—by injecting defaults, transforming data, validating inputs, generating outputs, or reacting to external signals.

Unlike traditional Crossplane upstream functions, which are deployed and managed as standalone Kubernetes resources (Function CRs backed by separate containers), embedded functions are authored directly in your control plane project and bundled alongside your configuration code.

## How Are Embedded Functions Different from Upstream Crossplane Functions?
While both embedded functions and upstream Crossplane functions serve the same purpose — extending your control plane with custom logic — they differ significantly in how they’re authored, deployed, and managed.

Embedded functions are designed to be lightweight and tightly integrated into your control plane project. In contrast, upstream Crossplane functions follow a more traditional Kubernetes model, requiring containerized deployments and additional Kubernetes resources.

Here are the key differences:
- Deployment and Management: Embedded functions are bundled directly into your control plane project. There’s no need to deploy additional Function custom resources or manage sidecar containers. Upstream functions, on the other hand, are typically containerized workloads that must be deployed into the cluster and managed separately.
- Performance and Overhead: Embedded functions run in-memory as part of the control plane’s reconciliation loop. This makes them faster and more efficient, with less runtime overhead compared to containerized upstream functions that operate as external processes.
- Portability and Versioning: Because embedded functions live inside your control plane project package, they are versioned alongside your infrastructure definitions. This ensures that your logic and configuration evolve together, making control planes fully portable across environments. Upstream functions are versioned independently and require separate coordination to ensure compatibility.
- Developer Experience: Embedded functions support multiple languages—including Go, KCL, Python, and Go-templating—offering greater flexibility for teams with diverse skill sets. Upstream functions are typically authored in Go and require container build and deployment pipelines, which can be a heavier lift for platform teams.

##When Should I Use Embedded Functions?
Use embedded functions when you want:
- Fast, low-overhead customization for compositions
- A fully declarative control plane project with all logic embedded and versioned
- Simpler developer workflows without managing containers
- Reusable, language-flexible logic that travels with your platform configuration