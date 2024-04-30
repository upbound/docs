---
title: Enable and configure access control
weight: 1
description: A tutorial for creating Role-based Access Control in Upbound
---

{{< hint "important" >}}
This feature is in alpha and requires Spaces `v1.3.0`.
{{< /hint >}}

This guide introduces role-based access control (RBAC) in Upbound. RBAC allows you to apply privileges to your Upbound objects and control planes. Organizations using RBAC can manage user roles and privileges to determine the level of access a user can have within their role.

RBAC allows organization administrators to:

- build and assign custom roles
- have a centralized set of policies to ensure appropriate access
- enhance compliance workflows

This guide highlights three RBAC workflows you might use in Upbound:

- Kubernetes cluster management
    -
- Spaces/IAM
    -


## Prerequisites

Before you begin, make sure you have:

## Enable

To enable RBAC in your organization, use the `--#TODO` feature flag:

```
```

## Manage permissions in your Kubernetes cluster

For users who want to manage permissions locally within their Kubernetes cluster, Upbound gives you the option to directly manage within the cluster. You can connect to the cluster with the `up cli` tool, the Spaces API, or the kubeconfig.

### Example

```yaml

# ControlPlaneGroup children viewer
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: controlplanegroup-children-viewer
rules:
- apiGroups:
  - spaces.upbound.io
  resources:
  # v1beta1 core resources
  - controlplanes
  # v1alpha1 backup resources
  - backups
  - backupschedules
  - sharedbackups
  - sharedbackupconfig
  - sharedbackupschedules
  # v1alpha1 secret resources
  - sharedexternalsecrets
  - sharedsecretstores
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - policy.spaces.upbound.io
  resources:
  - sharedupboundpolicies
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - spaces.upbound.io
  resources:
  - controlplanes
  verbs:
  # This maps to the crossplane-viewer ClusterRole within the control plane
  - upbound_controlplane_view

```
<!-- vale Microsoft.HeadingAcronyms = NO -->
## Manage permissions with Upbound identity management (SSO)
<!-- vale Microsoft.HeadingAcronyms = YES -->


Another method of managing permissions is with Upbound Identity from SSO. This approach allows you to apply roles from within your own organization. This works for users who don't want to manage permissions through the Upbound console.


### Example

## Manage self-hosted Spaces with Upbound IAM

In self-hosted spaces, you can also use the Upbound IAM model for management. The Upbound IAM model applies roles specific to your Upbound organization and may not map to your SSO or directory sync roles.


### Example