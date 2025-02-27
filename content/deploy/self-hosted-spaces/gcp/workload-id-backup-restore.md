---
title: Workload-identity for Backup and Restore
weight: 1
description: Description of the document
---

Workload-identity authentication lets you use access policies to grant your
self-hosted Space cluster access to your cloud providers.

This guide walks you through creating an IAM trust role policy and applying it to your EKS
cluster for backup and restore storage.

## Prerequisites
<!-- vale gitlab.FutureTense = NO -->
To set up a workload-identity, you'll need:
<!-- vale gitlab.FutureTense = YES -->

- A self-hosted Space cluster
- Administrator access in your cloud provider
- Helm and `kubectl`

The `mxp-controller` component handles backup and restore workloads. To
configure your backup and restore workflow controller, use the following Helm
chart parameters:

*  `controlPlanes.mxpController.serviceAccount.annotations` - Configures service
   account annotations
* `controlPlanes.mxpController.pod.customLabels` - Sets custom labels for the
  back and restore workflow pods

## Requirements

To enable workload-identity for backup and restore, you must:

* Annotate the Kubernetes service account to associate it with a cloud-side
  principal (such as an IAM role, service account, or enterprise application).
  The workload must use this service account.
  

* Label the workload (pod) to allow the injection of a temporary credential set,
  enabling authentication.
<!-- vale Google.Headings = NO -->
## GCP: Workload Identity Federation**
#### **IAM Principal Identifiers (Recommended)**
```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=gcp"
--set "billing.storage.gcp.bucket=${SPACES_BACKUP_BUCKET}"
--set "billing.storage.secretRef.name="
```

#### **Linking Kubernetes Service Account to IAM Role**
```yaml
--set controlPlanes.mxpController.serviceAccount.customAnnotations."iam\.gke\.io/gcp-service-account"="${SPACES_BR_IAM_SA}"
```

<!-- vale Google.Headings = YES -->
