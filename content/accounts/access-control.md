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

## Enable Kubernetes Hub Authentication

To enable Kuberentes Hub Authentication in your Space, you need:

- a Kubernetes cluster with RBAC enabled
- to attach your cluster to Upbound as a Connected Space
- to configure the `spaces-oidc` ConfigMap with your desired OIDC settings.

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
- apiGroups: ["upbound.io"]
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
  name: upbound-users
subjects:
- kind: Group
  name: upbound:users
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: upbound-user
  apiGroup: rbac.authorization.k8s.io
```

This example creates an `upbound-user` with read permissions on
`controlplanes` and binds the users to the `upbound:users` group.
