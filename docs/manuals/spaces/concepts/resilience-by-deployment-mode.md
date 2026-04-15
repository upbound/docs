---
title: Resilience Responsibilities by Deployment Mode
sidebar_position: 20
description: Understand what Upbound manages and what you are responsible for across Cloud, Dedicated, Managed, and Self-Hosted Spaces.
---

Upbound offers four deployment modes for Spaces, each with a different distribution of operational responsibilities between Upbound and the customer. Understanding these responsibilities is the first step toward designing a resilience architecture that matches your requirements.

This page compares the four deployment modes across the dimensions that matter most for resilience planning: infrastructure management, high availability configuration, disaster recovery capabilities, data residency, and support boundaries.

## Deployment modes at a glance

| Deployment mode | Hosted by | Managed by |
|---|---|---|
| **Cloud Spaces** | Upbound | Upbound |
| **Dedicated Spaces** | Upbound | Upbound |
| **Managed Spaces** | Customer | Upbound |
| **Self-Hosted Spaces** | Customer | Customer |

For a full description of each mode, see [Deployment Modes][deployment-modes].

## Infrastructure management

| Responsibility | Cloud Spaces | Dedicated Spaces | Managed Spaces | Self-Hosted Spaces |
|---|---|---|---|---|
| Kubernetes cluster provisioning | Upbound | Upbound | Upbound | Customer |
| Node pool sizing and scaling | Upbound | Upbound | Upbound | Customer |
| Kubernetes upgrades | Upbound | Upbound | Upbound | Customer |
| etcd management | Upbound | Upbound | Upbound | Customer |
| Spaces software installation | Upbound | Upbound | Upbound | Customer |
| Spaces software upgrades | Upbound | Upbound | Upbound | Customer |
| TLS certificate rotation | Upbound | Upbound | Upbound | Customer |
| Ingress and load balancer configuration | Upbound | Upbound | Upbound | Customer |

## High availability

| Capability | Cloud Spaces | Dedicated Spaces | Managed Spaces | Self-Hosted Spaces |
|---|---|---|---|---|
| Multi-zone control plane scheduling | Upbound-managed | Upbound-managed | Upbound-managed | Customer-configured |
| Spaces router (Envoy) HA | Upbound-managed | Upbound-managed | Upbound-managed | Customer-configured via [configure-ha][configure-ha] |
| Spaces controller HA | Upbound-managed | Upbound-managed | Upbound-managed | Customer-configured via [configure-ha][configure-ha] |
| etcd quorum (3-node) | Upbound-managed | Upbound-managed | Upbound-managed | Customer-configured via [scaling-resources][scaling-resources] |
| Horizontal Pod Autoscaler for router | Upbound-managed | Upbound-managed | Upbound-managed | Customer-configured via [configure-ha][configure-ha] |
| PostgreSQL for Query API | Upbound-managed | Upbound-managed | Upbound-managed | Customer-configured via [configure-ha][configure-ha] |
| Node anti-affinity for critical pods | Upbound-managed | Upbound-managed | Upbound-managed | Customer-configured via [configure-ha][configure-ha] |

## Disaster recovery capabilities

| Capability | Cloud Spaces | Dedicated Spaces | Managed Spaces | Self-Hosted Spaces |
|---|---|---|---|---|
| **Space Backups** (`SpaceBackupConfig`, `SpaceBackupSchedule`, `SpaceBackup`) | Not accessible to users | Not accessible to users | Available — Space admin manages | Available — Space admin manages |
| **Shared Backups** (`SharedBackupConfig`, `SharedBackupSchedule`, `SharedBackup`) | Available | Available | Available | Available |
| Self-service restore from Space Backup | Not available | Not available | Available | Available |
| Self-service restore from Shared Backup | Available | Available | Available | Available |
| Restore to a different cluster or region | Not applicable | Not applicable | Customer-managed (new cluster required) | Customer-managed |
| Warm standby control planes (ObserveOnly pattern) | Customer-configured | Customer-configured | Customer-configured | Customer-configured |

:::info
Space Backups cover the entire Space including all groups and control planes. Shared Backups cover individual control planes within a group. For most multi-tenant or production workloads, configure both.
:::

## Plan requirements

Some disaster recovery capabilities require specific Upbound plan tiers.

| Capability | Required plan |
|---|---|
| Shared Backups | Enterprise |
| Space Backups (Managed and Self-Hosted) | Enterprise |
| Dedicated Spaces | Enterprise |

All pages in this resilience guide that apply to plan-restricted features indicate the requirement at the top of the page.

## Data residency

| Dimension | Cloud Spaces | Dedicated Spaces | Managed Spaces | Self-Hosted Spaces |
|---|---|---|---|---|
| Control plane data location | Upbound-chosen region | Upbound-chosen region | Customer's cloud account, customer-chosen region | Customer's cluster, customer-chosen location |
| Backup storage location | Customer-configured object storage | Customer-configured object storage | Customer-configured object storage | Customer-configured object storage |
| etcd data location | Upbound-managed | Upbound-managed | Customer's cloud account | Customer's cluster |
| Network traffic path | Through Upbound infrastructure | Through Upbound infrastructure | Customer's network, to Upbound Console | Customer's network, to Upbound Console |

:::tip
For workloads with strict data residency requirements (GDPR, FedRAMP, financial services regulations), Managed Spaces or Self-Hosted Spaces give you direct control over where compute and storage resources reside.
:::

## Resilience responsibilities summary

The table below shows the overall split of resilience responsibility per deployment mode:

| Area | Cloud Spaces | Dedicated Spaces | Managed Spaces | Self-Hosted Spaces |
|---|---|---|---|---|
| Infrastructure HA | Upbound | Upbound | Upbound | **Customer** |
| Space-level DR | Upbound (not exposed) | Upbound (not exposed) | **Shared** | **Customer** |
| Control plane DR | **Customer** | **Customer** | **Customer** | **Customer** |
| Observability setup | **Customer** | **Customer** | **Customer** | **Customer** |
| Alert response | **Customer** | **Customer** | **Customer** | **Customer** |

The key takeaway is that **every deployment mode** requires customers to take ownership of control plane-level disaster recovery and observability. Only the underlying Space infrastructure responsibility varies by mode.

## Next steps

- Understand recovery objectives for your workloads: [Designing for RTO and RPO in Upbound][rto-rpo]
- Configure Shared Backups for control plane-level DR: [Backup and Restore][backup-and-restore]
- Configure Space Backups for full Space DR (Self-Hosted and Managed): [Disaster Recovery][dr]
- Configure HA for a Self-Hosted Space: [Production Scaling and High Availability][configure-ha]

[deployment-modes]: /manuals/spaces/concepts/deployment-modes
[configure-ha]: /manuals/spaces/howtos/self-hosted/configure-ha
[scaling-resources]: /manuals/spaces/howtos/self-hosted/scaling-resources
[backup-and-restore]: /manuals/spaces/howtos/backup-and-restore
[dr]: /manuals/spaces/howtos/self-hosted/dr
[rto-rpo]: /manuals/spaces/concepts/rto-rpo
