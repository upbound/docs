---
title: Spaces Concepts
sidebar_position: 0
description: High-level overview of Spaces architecture, system components, and
  control plane components
---

This document provides a high-level overview of Upbound Spaces: its
architecture, system components, and how control planes and their components
work.

## Spaces architecture

The basic Spaces workflow follows the pattern below:

![Spaces workflow][spaces-workflow]

## Spaces system components

Spaces is built from several system-level components that work together:

### Spaces-router

Entry point for all Spaces endpoints. The router handles the following:

- Spaces API
- Spaces Apollo
- Control plane API servers

It reconciles control planes and dynamically builds routes to each control plane
API server.

### Spaces-controller

Reconciles Space-level resources, serves webhooks, and works with
mxp-controller to provision control planes.

### Spaces-api

API for managing groups, control planes, shared secrets, and shared telemetry
objects. It is accessed only through Spaces-router.

### Spaces-apollo

Hosts the Query API and connects to the Postgres database that is populated by
apollo-syncer pods in each control plane.

## Control planes and components

Each control plane runs in an isolated environment with a consistent set of components.

### Namespaces

Each control plane gets a namespace with the pattern: `mxp-uuid-system`.

Namespaces are labeled with:

- `internal.spaces.upbound.io/controlplane-name`
- `internal.spaces.upbound.io/controlplane-namespace`

### Finding which cluster a control plane is in

```bash
# Search across all namespaces for a specific control plane
kubectl get namespaces -l internal.spaces.upbound.io/controlplane-name=<ctp-name>

# Get more details about the namespace
kubectl describe namespace <namespace-name>

# See what's running in that control plane's namespace
kubectl get pods -n <namespace-name>
```

### Control plane runtime

Each control plane runs inside the Space cluster. Its main components are:

- **API server** — Often run in a single pod.
- **Etcd** — Data store for the control plane API server. It holds all user
  Crossplane resources.
- **CoreDNS** — Handles DNS resolution inside the control plane.

### mxp-controller

Controller and webhook that runs per control plane. It:

- Handles control plane provisioning (installs Crossplane, kube-state-metrics,
  and related components)
- Manages resources inside the control plane API server (such as Crossplane)
- Serves webhooks

### kube-state-metrics

Captures metrics around Managed Resource (MR) usage for billing. It counts
resource usage so usage can be metered and billed appropriately.

### vector

Used with kube-state-metrics to send MR usage data to bucket storage for
billing.

### apollo-syncer

Syncs control plane state into Postgres, which backs the Query API. It
bridges Kubernetes storage (etcd) and the query system (Query API /
Postgres).

### External Secrets Operator (Spaces)

Uses the upstream External Secrets Operator to power the SharedSecrets
feature in Spaces.

[spaces-workflow]: /img/up-basic-flow.png
