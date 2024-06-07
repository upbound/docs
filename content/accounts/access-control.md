---
title: Enable and configure access control
weight: 9
description: A tutorial for creating role-based access control in Upbound
---

{{< hint "important" >}}
This feature is in alpha and requires Spaces `v1.4.0`
{{< /hint >}}

This guide introduces role-based access control (RBAC) in Upbound. RBAC allows
you to control access to your Upbound resources and control planes based on the
roles of individual users within your organization.

You can use Upbound RBAC or Kubernetes Hub Authorization to manage your users
access within Upbound or the underlying resources, depending on which approach
your organization needs.

## Identity Types

Upbound supports the following identity types:

- Users
- Robots
- Teams

Upbound constructs unique identities with `upbound:(user|robot|team):<name>`.

## Authentication

Upbound issues JSON Web Tokens (JWT) with identity information to
authenticate to your platform APIs.

The token includes:

- a subject (`upbound:user/team:<name>`)
- the users team memberships(`upbound:team:<UUID>`)
- the organization context(`upbound:org-role:(admin|member)`)

## Authorization

Upbound uses identities to check for authentication across the platform. In
the Cloud environment, Upbound grants identities organization roles to
control access to features and resources with IAM policies.

In Connected Spaces, you can bind identities to Kubernetes RBAC or
Upbound RBAC to control access to resources.

The subject and group claims in the JWT token determine the user's effective permissions for an API request.


## Enable Kubernetes Hub Authorization

To enable Kuberentes Hub Authentication in your Space, you need:

- a Kubernetes cluster with RBAC enabled
- to attach your cluster to Upbound

Users can authenticate to the Connected Space with their Kubernetes
credentials with this method.

### Configure Kubernetes RBAC

To configure Kubernetes RBAC in your Connected Space, you need to create
`ClusterRoles` and `Roles` for defining access to your resources.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: upbound-user
rules:
- apiGroups: ["spaces.upbound.io"]
  resources: ["controlplanes"]
  verbs: ["get", "list", "watch"]

```

Next, create `ClusterRoleBindings` and `RoleBindings` to assign
roles to subjects like users, groups, or service accounts.

```yaml

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: controlplane-getters
subjects:
- kind: Group
  name: upbound:(user|robot):<username>
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: controlplane-getter
  apiGroup: rbac.authorization.k8s.io
```

The `subject` in this example can contain teams (`upbound:team:<uuid>`) or org roles (`upbound:org-role:admin|member`) depending on your role need.

This example creates an `controlplane-getter` with read permissions on
`controlplanes` and binds the users to the `upbound:users` group.

## Enable Upbound Unified Authentication
