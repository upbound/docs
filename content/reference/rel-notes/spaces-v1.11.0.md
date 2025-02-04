---
title: "Spaces v1.11.0"
version: "v1.11.0"
date: 2025-02-04
tocHidden: true
product: "spaces"
---
<!-- vale off -->

#### What's Changed

**Warning - Action Required**

If you are running Spaces with observability enabled; ensure the host cluster's `opentelemetry-operator` is updated to
**v0.110.0 or later** to maintain compatibility with new Collector flags.

#### Overview

This release enhances backup/restore workflows and telemetry customization, while addressing critical stability issues. Key highlights include:  
- **Backup/Restore Improvements**:  
  - Selective restoration of control planes using the `--controlplanes` flag via Space Backup API.  
  - Backup jobs now fail explicitly if target control planes are missing.  
- **Observability Enhancements**: Added support for OpenTelemetry **transform processors** in SharedTelemetry API, enabling advanced data manipulation (e.g., adding labels) before exporting metrics/logs/traces.  
  -  Upgraded OTEL Collector images to **v0.116.0**.  
- **Query API**: Helm chart now supports tuning PostgreSQL instance parameters and connection pooler settings for in-cluster deployments.  
- **Bug Fixes**:  
  - Resolved label selector matching issues in Shared Backups, Policies, and Telemetry APIs.  
  - Fixed certificate renewal parameters causing synchronization issues in ArgoCD.  
  - Ensured correct image pull secret usage for Crossplane version detection.  

#### Features and Improvements

- Added `--controlplanes` flag to the SpaceBackup restore command that allows specifying the control planes to be restored.
- Allow customising postgres parameters for the in-chart cluster, and tune connection pooler parameters.
- Mark Backup as failed if target control plane can't be found after a few retries.
- SharedTelemetry: adds an option to configure telemetry OTEL processors similarly as the existing exporters. Currently supports the [transform](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/transformprocessor/README.md) processor which allows for transforming telemetry data(adding labels, modificatons...) before being sent by the exporters to your defined observability backend.

#### Bug fixes

- Fix matching of multiple label selectors in backups, policies, telemetry and external secrets.
- Fixed the renewBefore and duration values in the certificates that were causing Argo to go out of sync.
- Fixes an issue where SharedTelemetryConfig would not get reconciled when a secret from its `spec.configPatchSecretRefs` would be modified.
- Using right image pull secret for automated crossplane versions detection.
- Fixed a regression causing x509 certificate validation errors while connecting a control using ArgoCD plugin.
- Adds missing network policies for space level telemetry.
- Fixed an issue where groups have not been able to be managed through the Spaces API through means which set an annotation, due to Spaces API disallowing setting any annotation for security reasons. Now there is an Spaces Helm allowlist knob through which select annotation keys can be configured to be allowed.

#### Chore

- **[Breaking change]**
  Upgraded OTEL Collector images to v0.116.0. The opentelemetry-operator on the host cluster needs to run versions =>0.110.0 due to a change in OTEL Collector flags.
<!-- vale on -->
