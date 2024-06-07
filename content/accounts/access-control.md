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

- [Users]({{<ref "./users" >}}) - Accounts representing a single user.
- [Organizations]({{<ref "./organizations" >}}) - A top-level collection of
  users and teams.
- [Teams]({{<ref "./teams" >}}) - A sub-group within an organization.
- [Robots]({{<ref "./robots" >}}) - Non-user accounts designed for
  automation.

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

## Enable Upbound RBAC

You can enable Upbound RBAC at install or upgrade time:

```yaml
--set "features.alpha.upboundRBAC.enabled=true"
```

### Roles

Upbound RBAC roles define sets of permissins with three built-in roles:

- Admin
- Editor
- Viewer

Upbound tiers these roles at three levels:

- Organization
- Control Plane Groups
- Control Planes

### Configure roles

```yaml
apiVersion: authorization.spaces.upbound.io/v1
kind: ObjectRoleBinding
metadata:
  name: my-binding
spec:
  object:
    resource: controlplanes
    name: my-controlplane
  subjects:
  - kind: UpboundUser
    name: alice
    role: admin
  - kind: UpboundTeam
    name: eng-team
    role: editor
```

In this example, the `ObjectRoleBinding` grants the `admin` role to `alice` and the `editor` role to the `eng-team` on the specified control plane.

ObjectRoleBindings function as CRDs parallel to the target resource so you can manage them using the same workflows.

### Roles matrix

Spaces API Resources:

{{< table "table table-striped" >}}

| Resource | Get | List | Create | Update | Patch | Delete |
|---|---|---|---|---|---|---|
| namespaces/groups | grp-viewer | filtered | org-admin | org-admin | org-admin | org-admin |
| objectrolebindings | grp-viewer | grp-viewer | grp-admin | grp-admin | grp-admin | grp-admin |
| secrets* | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| controlplanes | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| sharedsecretstores | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| sharedexternalsecrets | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| sharedupboundpolicies | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| sharedtelemetryconfigs | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| queries | N/A | N/A | grp-viewer | N/A | N/A | N/A |
| groupqueries | N/A | N/A | grp-viewer | N/A | N/A | N/A |

{{< /table >}}

Control Plane Resources:
{{< table "table table-striped" >}}

| Resource | Get | List | Create | Update | Patch | Delete |
|---|---|---|---|---|---|---|
| backups | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| sharedbackups | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| sharedbackupconfigs | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| backupschedules | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| sharedbackupschedules | grp-viewer | grp-viewer | grp-editor | grp-editor | grp-editor | grp-editor |
| controlplanes |  |  | grp-editor | grp-editor |  |
| controlplanes/k8s | |  | grp-admin | grp-editor | grp-viewer |
{{< /table >}}

The hierarchy of roles is:

`org-admin` > `grp-admin` > `grp-editor` > `grp-viewer` > `anyone`

### Kubernetes RBAC integration

Upbound RBAC integrates with Kubernetes RBAC to map to admin, edit, and view access.

- `controlplanes/k8s, [create, delete]` => Admin
- `controlplanes/k8s, update` => Editor
- `controlplanes/k8s, get` => Viewer
