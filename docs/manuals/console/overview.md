---
title: Hub
weight: 1
description: Hub is a centralized API platform that aggregates resource state and provides unified visibility across your control plane fleet.
validation:
  type: conceptual
  owner: docs@upbound.io
  tags:
    - conceptual
    - hub
    - platform
---

Hub is a centralized API platform for managing your entire control plane fleet. Connect UXP instances, Spaces, OSS Crossplane clusters, and generic Kubernetes environments to Hub, then query resources, monitor health, and enforce access control across all of them from a single API surface.

## Why Hub

Without Hub, managing multiple control planes means logging into each cluster separately, manually correlating resource state, and maintaining separate access controls per cluster. Hub addresses this by:

- Aggregating resource state across all connected control planes into a single queryable API
- Mirroring each control plane's RBAC so users see only what they can access via `kubectl`
- Automatically indexing packages and APIs from OCI artifacts across your fleet
- Monitoring reconciliation health in real time across your entire estate

## Architecture

Hub has four main components.

| Component | Purpose |
|---|---|
| Hub API | RESTful API groups for global queries, control plane management, and catalog indexing |
| Hub Syncer | Agent running on each connected control plane, continuously pushing resource state to Hub |
| Hub Console | Web UI for dashboards, resource exploration, and infrastructure management |
| Hub CLI | `up hub` commands for registering control planes, managing Realms, and running queries |

### API groups

Hub exposes three API groups:

- **Global Resources API** (`/apis/controlplane/v1/query`) — Aggregates resource state across all connected control planes. Supports filtering by resource type, health, Realm, control plane name, and labels.
- **Control Plane API** (`/apis/controlplane/v1`) — Register, monitor, and manage control plane connections.
- **Catalog API** (`/apis/catalog/v1`) — Index packages, extract CRD and XRD schemas, and track API utilization across your fleet.

### Data flow

Hub Syncer agents run on each connected control plane and continuously send resource state to the Hub API. The Console and CLI query that centralized state. Users interact through the Console, the `up` CLI, or direct API calls.

## Core concepts

### Realms

A Realm is a logical boundary that groups control planes and defines access control. Realms let you organize resources by team, environment, business unit, or security zone.

Within a Realm, team members have one of three roles:

| Role | Access |
|---|---|
| `admin` | Manage the Realm and assign control planes to it |
| `edit` | Create and update resources |
| `view` | Read-only access |

Teams are created automatically from your OIDC provider's identity groups and assigned to Realms. Users only see the control planes and resources in their assigned Realms.

### Control plane connections

A control plane connection registers a Kubernetes cluster with Hub. Hub supports four connection types:

- UXP instances
- Cloud or Self-Hosted Spaces
- OSS Crossplane clusters
- Generic Kubernetes clusters

After registration, Hub Syncer runs on the connected control plane and syncs resource state continuously. If a control plane becomes temporarily unavailable, Hub continues to serve the last cached state and resumes syncing when the cluster recovers.

### Catalog

The Catalog automatically indexes all packages available across your connected control planes. Hub extracts CRD and XRD schemas from OCI artifacts and makes them queryable.

| Catalog resource | Description |
|---|---|
| Package | A versioned collection of providers, functions, or configurations in an OCI registry |
| API | A CRD or XRD schema extracted from a package |
| Utilization | Metrics tracking how each API is actively used across your fleet |

### Authorization model

Hub mirrors the RBAC from each connected control plane. A user with view-only access on a control plane sees only the resources accessible to them via `kubectl` on that cluster — no separate Hub permission layer is required.

Hub uses OIDC for authentication. Supported identity providers:

- AWS Cognito and AWS IAM
- Google Cloud Identity
- Azure Entra ID
- Custom OIDC-compatible providers (self-hosted only)

## Deployment modes

Hub runs in two modes.

| Aspect | Self-Hosted | Upbound Cloud |
|---|---|---|
| Hosting | Your Kubernetes cluster | Upbound-managed infrastructure |
| Authentication | Configurable OIDC | Upbound IAM |
| Connected control planes | UXP, Spaces, OSS Crossplane, generic Kubernetes | Cloud-managed Spaces only (beta) |
| Installation | Helm chart | Pre-installed |

**Self-Hosted** gives you full control over OIDC configuration, infrastructure, and the ability to connect a mix of control plane types. Use self-hosted Hub if you need to integrate with a specific enterprise identity provider or manage Hub infrastructure yourself.

**Upbound Cloud** is the fully managed option. If you already use Upbound Cloud and Upbound IAM, Hub is pre-installed and ready to use.

### Community tier

Every UXP instance ships with Hub components pre-installed. The Community tier is for single control plane deployments. It includes the full Hub API and Console, accessible locally from your control plane, at no cost.

To connect additional control planes and use fleet-wide features, upgrade to the Standard tier or higher.

## Known limitations (beta)

The following features are not yet available:

- Robot users and Personal Access Tokens (PATs)
- SCIM provisioning
- OIDC providers beyond AWS, GCP, and Azure (self-hosted)
- Intent-based and natural language resource discovery
- Non-Cloud Spaces connected to Upbound Cloud Hub
- Full Marketplace integration
- Multi-cluster Hub federation (single Hub per organization in beta)
- Full audit logging

## Next steps

- [Install Hub][installHub] — Set up a self-hosted Hub deployment
- [Connect a control plane][connectCP] — Register your first control plane with Hub
- [Hub Console][console] — Navigate dashboards and resource views

[installHub]: ../howtos/install-hub.md
[connectCP]: ../howtos/connect-control-plane.md
[console]: ../howtos/console.md
