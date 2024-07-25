---
title: "Upbound RBAC"
weight: 6
description: "A guide to implementing and configuring access control in Upbound"
---

{{< hint "important" >}}
For more information about Upbound's Space offerings, review [What is Upbound]({{<ref "what-is-upbound.md" >}}).
{{< /hint >}}

This guide provides an overview of role-based access control (RBAC) in Upbound. RBAC allows you to control access to your Upbound resources and control planes based on the roles of individual users within your organization.

## Identity types

Upbound supports the following identity types:

- Users - Accounts representing a single user.
- Organizations - A top-level collection of users and teams.
- Teams - A sub-group within an organization.
- Robots - Non-user accounts designed for automation.

Upbound constructs unique identities with `upbound:(user|robot|team):<name>`.

## Authentication

Upbound issues JSON Web Tokens (JWT) with identity information to authenticate to your platform APIs. The token includes:
- A subject (`upbound:user/team:<name>`)
- The user's team memberships (`upbound:team:<UUID>`)
- The organization context (`upbound:org-role:(admin|member)`)

## Authorization

<!-- vale Google.WordList = NO -->
<!-- vale Microsoft.Terms = NO -->
Upbound uses identities to check for authentication across the platform. In the Cloud environment, Upbound grants identities organization roles to control access to features and resources with IAM policies.
<!-- vale Google.WordList = YES -->
<!-- vale Microsoft.Terms = NO -->

In Connected Spaces, you can bind identities to Kubernetes RBAC or Upbound RBAC to control access to resources. The subject and group claims in the JWT token determine the user's effective permissions for an API request.

<!-- vale Microsoft.HeadingAcronyms = NO -->
## Upbound RBAC

### Enable Upbound RBAC
<!-- vale Microsoft.HeadingAcronyms = YES -->

You can enable Upbound RBAC at install or upgrade time:

```yaml
--set "features.alpha.upboundRBAC.enabled=true"
```

### Roles

Upbound RBAC roles define sets of permissions with three built-in roles at the group level:

- Admin
- Editor
- Viewer

These roles apply at three levels:
- Organization
- Control Plane Groups
- Control Planes

### Configure roles

Below is an example of configuring roles using an `ObjectRoleBinding`:

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
