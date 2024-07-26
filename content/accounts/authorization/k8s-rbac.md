---
title: "Kubernetes RBAC"
weight: 9
description: "A guide to implementing and configuring Kuberentes RBAC in Upbound"
---

{{< hint "important" >}}
For more information about Upbound's Space offerings, review [What is Upbound]({{<ref "what-is-upbound.md" >}}).
{{< /hint >}}

This guide provides an overview of Kubernetes role-based access control (RBAC) in Upbound. RBAC allows you to regulate access to your Upbound resources and control planes based on the roles of individual users within your organization.

<!-- vale Google.Headings = NO -->
<!-- vale Microsoft.HeadingAcronyms = NO -->
### Enable Kubernetes Hub authorization

To enable Kubernetes Hub Authentication in your Space, you need:
- A Kubernetes cluster with RBAC enabled
- To attach your cluster to Upbound

Users can authenticate to the single-tenant Space with their Kubernetes credentials using this method.

### Configure Kubernetes RBAC

To configure Kubernetes RBAC in your Disconnected Space, you need to create `ClusterRoles` and `Roles` for defining access to your resources. For example:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: controlplane-getter
rules:
- apiGroups: ["spaces.upbound.io"]
  resources: ["controlplanes"]
  verbs: ["get", "list", "watch"]
```

Next, create `ClusterRoleBindings` and `RoleBindings` to assign roles to subjects like users, groups, or service accounts:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: controlplane-getters
subjects:
- kind: User
  name: upbound:(user|robot):<username>
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: controlplane-getter
  apiGroup: rbac.authorization.k8s.io
```

The `subject` in this example can contain teams (`upbound:team:<uuid>`) or org roles (`upbound:org-role:admin|member`) depending on your role needs.

## Upbound RBAC integration
<!-- vale Google.Headings = YES -->
<!-- vale Microsoft.HeadingAcronyms = YES -->

<!-- vale Google.WordList = NO -->
Upbound RBAC integrates with Kubernetes hub RBAC to map to admin, edit, and view access:

- `controlplanes/k8s, [create, delete]` => Admin
- `controlplanes/k8s, update` => Editor
- `controlplanes/k8s, get` => Viewer
<!-- vale Google.WordList = NO -->
