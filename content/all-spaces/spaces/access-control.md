---
title: Enable and configure access control
weight: 9
description: A tutorial for creating role-based access control in Upbound
---

{{< hint "important" >}}
For more information about Upbound's Space offerings, review [What is Upbound]({{<ref "content/what-is-upbound.md" >}}).
{{< /hint >}}

This guide introduces role-based access control (RBAC) in Upbound. RBAC allows
you to control access to your Upbound resources and control planes based on the
roles of individual users within your organization.

Depending on your operational model, you can use Upbound RBAC (with Connected or Cloud Spaces) or Kubernetes Hub Authorization (Single-Tenant Connected or Disconnected Spaces) to manage your users access within Upbound or the underlying resources.


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
