---
title: "Spaces v1.3.0"
version: "v1.3.0"
date: 2024-04-30
tocHidden: true
product: "spaces"
---
<!-- vale off -->

#### Highlights

- Control Plane Groups: Introducing Control Plane groups and Shared APIs for managing multiple control planes and
  related resource types, streamlining operations across environments.
- Automated Crossplane Upgrades: Implementing release channels for automated upgrades of Crossplane versions, ensuring
  Control planes remains up-to-date by getting latest patches automatically.
- Unified IAM: Unified identity and access management experience to manage access controls to everything within Spaces.
- Performance and Stability Improvements: Enhancements to system performance and stability to ensure a smoother and more
  reliable experience.

#### Alpha Features

- Aggregate Query API: Enchanced experience for querying one or more Control Planes with Aggregate Query API.
- External Secret Stores: Introducing the SharedSecretStore API, supporting external secret management.
- Upbound Policy: Introducing SharedUpboundPolicy API for centralized policy management across control planes.
- Observability: ShareTelemetryConfig API enabling exporting one or more telemetry for one or more control planes to the
  desired observability backends.
- Backup and Restore: Implementing SharedBackup and SharedBackupSchedule APIs to provide robust backup and restore
  functionality control planes.
- Importing/Exporting Control Planes: Enabling migrating in or out from Spaces control planes.

<!-- vale on -->
