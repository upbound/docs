---
title: "Authorize actions in control planes with Kubernetes RBAC"
weight: 9
description: "A guide to implementing and configuring Kuberentes RBAC in Upbound"
aliases:
    - /accounts/authorization/k8s-rbac
    - accounts/authorization/k8s-rbac
---

{{< hint "note" >}}
For general RBAC in Upbound, read [Upbound RBAC]({{<ref "operate/accounts/authorization/upbound-rbac/" >}}).
{{< /hint >}}

This guide explains how to authorize actions on resources in your control planes on Upbound. It uses the built-in Kubernetes role-based access control (RBAC) mechanism. This gives you fine-grained control over control plane access.

In a control plane on Upbound, Upbound RBAC and the cluster's Kubernetes RBAC are integrated to authorize users to perform actions. They must have enough permission according to either system. To authorize users with their Upbound account, you must configure kubectl to authenticate to Upbound before running any commands that require authorization.

## Define permissions and assign roles

Because control planes in Upbound are built on Kubernetes, you can use _ClusterRole_ and _Role_ objects to define RBAC rules in your control planes. Assign those rules using _ClusterRoleBinding_ and _RoleBinding_ objects:

- **Role:** A namespace-scoped group of resources and allowed operations that you can assign to a user or a group of users using a _RoleBinding_.
- **ClusterRole:** A cluster-scoped group of resources and allowed operations that you can assign to a user or a group of users using a _RoleBinding_ or _ClusterRoleBinding_.
- **RoleBinding:** A namespace-scoped assignment of a _Role_ or _ClusterRole_ to a user or group. 
- **ClusterRoleBinding:** A cluster-scoped assignment of a _Role_ or _ClusterRole_ to a user or group. 

If you plan to use namespaces in your control plane as an isolation mechanism between tenants, its recommended to use _RoleBinding_ objects. If namespace-scoping is not a priority, use _ClusterRoleBinding_ objects instead.

### Define permissions using _Roles_ and _ClusterRoles_

Define permissions with a _Role_ or _ClusterRole_ object. A _Role_ defines access to resources in a single namespace of your control plane. A _ClusterRole_ defines access to resources in the entire control plane. 

The example below demonstrates creating a `sql-instance-viewer` cluster-scoped role. This role permits viewing `sqlinstance` objects, a composite resource created with Crossplane.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: sqlinstance-viewer
rules:
- apiGroups: ["aws.platform.upbound.io"] 
  resources: ["sqlinstances"]
  verbs: ["get", "watch", "list"]
```

### Assign roles

The example below demonstrates how to assign the role in the earlier section to an Upbound user, robot, and control plane group member:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: sqlinstance-viewer-binding
  namespace: tenant1
subjects:
# An Upbound account user
- kind: User
  name: upbound:user:${username-on-upbound}
# A robot on Upbound
- kind: User
  name: upbound:robot:${robot-name}
  apiGroup: rbac.authorization.k8s.io
# An Upbound control plane group member
- kind: Group
  name: upbound:team:${team-uuid}
roleRef:
  kind: ClusterRole
  name: sqlinstance-viewer
  apiGroup: rbac.authorization.k8s.io
```

