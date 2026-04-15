---
title: Designing for RTO and RPO in Upbound
sidebar_position: 30
description: Understand recovery time and recovery point objectives in the context of Upbound control planes and choose the right resilience architecture for your requirements.
---

Before choosing a disaster recovery architecture for Upbound, you need to understand what you're recovering from, how quickly you need to recover, and how much data loss is acceptable. This page explains the concepts of RTO and RPO in the context of Upbound control planes and maps them to the architectural patterns available.

## RTO and RPO defined

**Recovery Time Objective (RTO)** is the maximum acceptable time from a failure event to the moment your control plane is operational again. An RTO of 30 minutes means your organization can tolerate up to 30 minutes of downtime before it becomes a business problem.

**Recovery Point Objective (RPO)** is the maximum acceptable amount of data loss, measured in time. An RPO of 4 hours means you accept that up to 4 hours of changes to your control plane state could be lost in a recovery scenario.

In the context of Upbound:

- **RTO** governs how quickly a control plane returns to a state where it can reconcile resources — both reading current cloud state and making changes.
- **RPO** governs how much Crossplane resource state (XRs, claims, managed resources, ProviderConfigs, compositions, packages) could be lost or rolled back to an older version.

## What gets lost in a disaster?

When a control plane fails and you need to recover, the state at risk is:

- **Crossplane resource state in etcd** — the desired-state objects that Crossplane is reconciling. If the backup is from 6 hours ago, any resources created or modified in the last 6 hours may not be in the restore.
- **Provider configuration** — ProviderConfigs, credentials, package revisions installed after the last backup.
- **Composition and function revisions** — if you update a composition between backups, the older version is what restores.

What is generally **not** lost regardless of your Upbound DR posture:

- **Actual cloud resources** (S3 buckets, VMs, databases) — these exist independently of the control plane. After restore, Crossplane will reconcile the restored desired state against the actual cloud state. Resources that exist in the cloud but not in the backup can be imported or cleaned up and replaced.
- **Git-managed configuration** — if you use GitOps to drive your control plane, re-applying your Git repository to a restored control plane brings it back to the desired state quickly, reducing the effective impact of RPO.

## Recovery architectures and their RTO/RPO

Upbound supports three primary DR and HA patterns. Each has a different RTO and RPO profile.

### Backup and restore (Shared Backups and Space Backups)

In this pattern, you configure scheduled backups of control plane state using `SharedBackupSchedule` (control plane level) or `SpaceBackupSchedule` (full Space). When a failure occurs, you restore from the most recent backup to either the existing Space or a new one.

| Metric | Typical range | Notes |
|---|---|---|
| **RPO** | Equal to backup interval | Hourly backups → up to 1 hour of data loss. Daily backups → up to 24 hours. |
| **RTO** | 30–90 minutes | Includes time to provision a new cluster (if needed), install Spaces, run the restore command, and validate control planes reach Ready. |

**Best for:** Workloads where occasional longer downtime is acceptable and the cost of a warm standby is not justified.

**Available in:** All deployment modes. Space Backups require Self-Hosted or Managed Spaces. Shared Backups are available in all modes (Enterprise plan required).

### Warm standby with ObserveOnly management policies

In this pattern, you maintain a secondary control plane that mirrors the primary's desired state but operates in `ObserveOnly` mode — it reads cloud resource state but makes no changes. When the primary fails, you promote the standby to active by removing the `ObserveOnly` policy, and it begins reconciling immediately.

| Metric | Typical range | Notes |
|---|---|---|
| **RPO** | Near-zero | The standby mirrors state continuously. Any change applied to the primary is reflected in the standby's observed state. Data loss is bounded by reconciliation latency (seconds to minutes), not backup schedule. |
| **RTO** | 5–15 minutes | Includes time to detect the failure, promote the standby (change `managementPolicies`), and verify providers are reconciling. Automated promotion can bring this closer to 2–5 minutes. |

**Best for:** Workloads with low RTO requirements where backup/restore recovery is too slow.

**Available in:** All deployment modes. Requires Composition Functions. For details, see [Warm Standby Control Planes with ObserveOnly Management Policies][observeonly-standby].

### Cloud Spaces managed HA (Upbound-managed)

For Cloud and Dedicated Spaces, Upbound manages infrastructure-level HA. The Space infrastructure runs with multi-zone redundancy, and control planes are scheduled for resilience. This is transparent to users.

| Metric | Typical range | Notes |
|---|---|---|
| **RPO** | Near-zero | Upbound manages state redundancy. Individual control plane failures do not result in data loss. |
| **RTO** | Near-zero to minutes | Infrastructure-level failures are handled by Upbound. Application-level failures (a broken composition, a misconfigured provider) are still the customer's responsibility to detect and remediate. |

**Best for:** Teams that prefer to delegate infrastructure resilience to Upbound and focus on control plane configuration.

**Available in:** Cloud Spaces and Dedicated Spaces only.

## Backup schedule and RPO relationship

For backup/restore DR, your RPO is bounded by how often you take backups. The table below maps common backup schedules to their maximum RPO:

| Backup schedule | Maximum RPO | Example use case |
|---|---|---|
| Every 15 minutes | 15 minutes | High-frequency configuration changes, compliance-sensitive workloads |
| Hourly | 1 hour | Typical production workloads with active development |
| Every 4 hours | 4 hours | Stable production workloads with infrequent configuration changes |
| Daily (`@daily`) | 24 hours | Non-critical or staging environments |
| Weekly | 7 days | Archive or DR-testing purposes only |

:::tip
Even if your team's configuration changes are infrequent, short backup intervals reduce the blast radius when a change introduces corruption. An hourly backup schedule is a reasonable default for production control planes.
:::

## Decision matrix

Use this matrix to select the DR architecture that matches your requirements:

| Your RTO target | Your RPO target | Recommended architecture |
|---|---|---|
| < 15 minutes | < 15 minutes | Warm standby (ObserveOnly) with automated promotion |
| < 15 minutes | 15–60 minutes | Warm standby (ObserveOnly) with manual promotion |
| 15–60 minutes | 1–4 hours | Shared Backups with hourly schedule + GitOps for fast re-application |
| 1–4 hours | 4–24 hours | Shared Backups with multi-hour schedule |
| > 4 hours | > 24 hours | Daily backups minimum; consider whether this tier of service is acceptable |
| Upbound-managed | Upbound-managed | Cloud Spaces or Dedicated Spaces |

For Self-Hosted Spaces, the warm standby and backup/restore approaches can be combined: use scheduled backups as a safety net, and use a warm standby for fast failover.

## Effect of deployment mode on achievable RTO/RPO

Your deployment mode affects which DR patterns are available:

| Pattern | Cloud Spaces | Dedicated Spaces | Managed Spaces | Self-Hosted Spaces |
|---|---|---|---|---|
| Upbound-managed infrastructure HA | Yes | Yes | Partial | No |
| Shared Backups (control plane DR) | Yes | Yes | Yes | Yes |
| Space Backups (full Space DR) | No | No | Yes | Yes |
| Warm standby (ObserveOnly) | Yes | Yes | Yes | Yes |

Self-Hosted Spaces offer the most control — you can configure the full stack of HA and DR patterns — but require the most operational investment. Cloud Spaces offer the least configuration burden but the least flexibility.

## Planning checklist

Before finalizing your resilience architecture:

- [ ] Document the RTO and RPO target for each environment (production, staging, dev)
- [ ] Map each target to a backup schedule or standby pattern using the decision matrix above
- [ ] Verify the pattern is available in your deployment mode
- [ ] Verify your Upbound plan tier includes the features you need (Enterprise required for Shared and Space Backups)
- [ ] Test your recovery procedure in staging before relying on it in production (see [Validating Your Resilience Configuration][dr-testing])
- [ ] Document the runbook steps so any operator can execute recovery without prior knowledge (see [Disaster Recovery Runbook][dr-runbook])

## Next steps

- Compare resilience responsibilities by deployment mode: [Resilience Responsibilities by Deployment Mode][resilience-by-mode]
- Configure Shared Backups: [Backup and Restore][backup-and-restore]
- Configure Space Backups (Self-Hosted and Managed): [Disaster Recovery][dr]
- Implement a warm standby control plane: [Warm Standby Control Planes with ObserveOnly Management Policies][observeonly-standby]

[resilience-by-mode]: /manuals/spaces/concepts/resilience-by-deployment-mode
[backup-and-restore]: /manuals/spaces/howtos/backup-and-restore
[dr]: /manuals/spaces/howtos/self-hosted/dr
[observeonly-standby]: /manuals/spaces/howtos/observeonly-standby
[dr-testing]: /manuals/spaces/howtos/dr-testing
[dr-runbook]: /manuals/spaces/howtos/dr-runbook
