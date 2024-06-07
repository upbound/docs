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
- Granular permissions
- Auditing & compliance
- Scalability

## Core concepts

Upbound manages access to resouces with role permissions. Each
organizations administrator can assign membership to a user to have access to
the following resources:

|              | Create | List    | Read    | Update | Delete |
|--------------|--------|---------|---------|--------|--------|
| Organization | Anyone | Member+ | Member+ | Admin  | Admin  |
| User         | Anyone | Member+ | Self    | Self   | Self   |
| Membership   | Admin  | Member+ | Member+ | Admin  | Admin  |
| Robots       | Admin  | Member+ | Member+ | Admin  | Admin  |
| Teams        | Admin  | Member+ |         |        |        |
| RoleBindings |        |         |         |        |        |
| Spaces       |        |         |         |        |        |
| Configs      | Admin  | Admin   | Admin   | Admin  | Admin  |
| Repos        | Admin  | Member+ | Member+ | Admin  | Admin  |
