---
title: "Upbound IAM"
weight: 0

---

Upbound allows administrators to deploy Role-based Access Control (RBAC)
for greater security and resource management. With Identity and Access
Management (IAM) and RBAC in Upbound, you can define and enforce access
control policies across your infrastructure.

## Benefits

Some benefits of implementing IAM in Upbound are:

- Centralized access control
- Consistency
- Permission management
- Scalability

## Core concepts

### Identity types

Upbound supports the following identity types:

- [Users]({{<ref "./users" >}}) - Accounts representing a single user.
- [Organizations]({{<ref "./organizations" >}}) - A top-level collection of
  users and teams.
- [Teams]({{<ref "./teams" >}}) - A sub-group within an organization.
- [Robots]({{<ref "./robots" >}}) - Non-user accounts designed for
  automation.

Upbound manages access to resources with role permissions. Each
organizations administrator can assign membership to a user to have access to
the following resources:

<!-- vale Upbound.Spelling = NO -->
{{< table "table table-striped" >}}

|              | Create | List    | Read    | Update | Delete |
|--------------|--------|---------|---------|--------|--------|
| Organization | Anyone | Member+ | Member+ | Admin  | Admin  |
| User         | Anyone | Member+ | Self    | Self   | Self   |
| Membership   | Admin  | Member+ | Member+ | Admin  | Admin  |
| Robots       | Admin  | Member+ | Member+ | Admin  | Admin  |
| Teams        | Admin  | Member+ |         |        |        |
| Spaces       |        |         |         |        |        |
| Configs      | Admin  | Admin   | Admin   | Admin  | Admin  |
| Repos        | Admin  | Member+ | Member+ | Admin  | Admin  |

{{</ table >}}
<!-- vale Upbound.Spelling = YES -->
