---
title: Workload-identity for Backup and Restore
weight: 1
description: Description of the document
aliases:
    - concepts/path
---

Workload-identity authentication lets you use access policies to grant your
self-hosted Space cluster access to your cloud providers.

This guide walks you through creating an IAM trust role policy asnd applying it to your EKS
cluster for backup and restore storage.

## Prerequisites

To set up a workload-identity, you'll need:

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
  This service account must then be used by the workload.

* Label the workload (pod) to allow the injection of a temporary credential set,
  enabling authentication.

## **Azure: Microsoft Entra Workload ID**
#### **1. Configure Kubernetes Service Account**
```yaml
--set controlPlanes.mxpController.serviceAccount.annotations."azure\.workload\.identity/client-id"="${SPACES_BR_APP_ID}"
--set controlPlanes.mxpController.pod.customLabels."azure\.workload\.identity/use"="true"
```

#### **2. Restart Workload**
```sh
kubectl rollout restart deployment mxp-controller
```

