---
title: "Upbound RBAC"
weight: 6
description: "A guide to implementing and configuring access control in Upbound"
aliases:
    - /accounts/authorization/upbound-rbac
    - accounts/authorization/upbound-rbac
---

This guide provides an overview of role-based access control (RBAC) in Upbound. RBAC lets you control access to your Upbound resources and control planes based on the roles of individual users in your organization. 
<!-- vale off -->
{{<hint "tip" >}}
To learn how to manage access to resources in a control plane, read the [documentation]({{<ref "k8s-rbac" >}}) on authorizing actions on resources in control planes
{{< /hint >}}
<!-- vale on -->

<!-- vale Microsoft.HeadingAcronyms = NO -->
## Enable Upbound RBAC
<!-- vale Microsoft.HeadingAcronyms = YES -->

{{<hint "note" >}}
This section only applies to administrators who've deployed a self-hosted Space.
{{< /hint >}}

For administrators who have deployed [self-hosted Spaces]({{<ref "deploy/self-hosted-spaces/" >}}), you can enable Upbound RBAC at install or upgrade time. Configure the feature in the Spaces helm chart:

```yaml
--set "features.alpha.upboundRBAC.enabled=true"
```

<!-- vale write-good.Passive = NO -->
Upbound RBAC is enabled by default in Upbound Cloud Spaces.
<!-- vale write-good.Passive = YES -->

<!-- vale write-good.TooWordy = NO -->
## Authorize access to control plane group resources
<!-- vale write-good.TooWordy = YES -->

### Roles

Upbound RBAC roles define sets of permissions with three built-in roles at the group level:

- Admin
- Editor
- Viewer

These roles apply at three levels:
- Organization
- Control Plane Groups
- Control Planes

Upbound RBAC roles have either `read-only` or `read/write` access for features. Review the table for permissions for each role:

{{<img src="operate/accounts/images/rbac-access-levels.png" alt="A table with RBAC permissions" size="medium" unBlur="true" align="center">}}

### View group role permissions

{{< tabs >}}
{{< tab "Console" >}}
1. On the **Control Planes** screen in the Console, select which **Space** and **group** context you wish to be in.
2. Select the **Settings** pane of the control plane group.
3. In the **Team access** card of the settings page, view the teams and their permissions for this group.
{{< /tab >}}

{{< tab "Space API" >}}
Use the [up CLI]({{<ref "reference/cli/contexts/" >}}) to set your kubecontext to the desired Space, then run the following:

```sh
kubectl get objectrolebindings    
NAME            AGE
default-zcntk   14s
```

Each role permission granted to a team gets represented with an `objectrolebinding` Space API resource.
{{< /tab >}}
{{< /tabs >}}

### Assign group role permissions

{{< tabs >}}
{{< tab "Console" >}}
1. On the **Control Planes** screen in the Console, select which **Space** and **group** context you wish to be in.
2. Select the **Settings** pane of the control plane group view.
3. Select **Add Teams**
4. Select which role you wish to grant.
5. Select which teams you wish to apply the role to, then select the **Add Selected to Group** button.
{{< /tab >}}

{{< tab "Space API" >}}
Use the [up CLI]({{<ref "reference/cli/contexts/" >}}) to set your kubecontext to the desired Space, then create an `objectrolebinding`. The example below gives control plane group editor access to the `UpboundTeam` with the UUID of `918a6338-abbe-420d-81cf-9e87642a87c6`:

```yaml
apiVersion: authorization.spaces.upbound.io/v1alpha1
kind: ObjectRoleBinding
metadata:
  name: my-binding
  namespace: ctp-group-1
spec:
  object:
    apiGroup: core
    resource: namespaces
    name: ctp-group-1
  subjects:
  - kind: UpboundTeam
    name: 918a6338-abbe-420d-81cf-9e87642a87c6
    role: editor
```
{{< /tab >}}
{{< /tabs >}}

### Delete group role permissions

{{< tabs >}}
{{< tab "Console" >}}
1. On the **Control Planes** screen in the Console, select which **Space** and **group** context you wish to be in.
2. Select the **Settings** pane of the control plane group view.
3. Select the settings button on the right side the team you wish to delete.
4. Select **Remove**
{{< /tab >}}

{{< tab "Space API" >}}
Use the [up CLI]({{<ref "reference/cli/contexts/" >}}) to set your kubecontext to the desired Space, then delete the desired `objectrolebinding`. The example below deletes the permission created in the previous section:

```sh
kubectl delete objectrolebinding default-zcntk                        
objectrolebinding.authorization.spaces.upbound.io "default-zcntk" deleted
```
{{< /tab >}}
{{< /tabs >}}
