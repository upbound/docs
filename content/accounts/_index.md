---
title: "User Management"
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

- [Users]({{<ref "./identity-management/users" >}}) - Accounts representing a single user.
- [Organizations]({{<ref "./identity-management/organizations" >}}) - A top-level collection of
  users and teams.
- [Teams]({{<ref "./identity-management/teams" >}}) - A sub-group within an organization.
- [Robots]({{<ref "./identity-management/robots" >}}) - Non-user accounts designed for
  automation.


### Permissions Model

Upbound uses an organization-based access model with two primary roles:

- Admins: Have full permissions to view and change all resources within the organization.
- Members: Can only view and interact with resources that admins have explicitly granted access to.


#### Admins

Organization admins have every available permission within the organization. Permissions include:

- Repository management (create repositories; push packages; download private packages)
- Manage membership (invite or remove users from the org; manage assigned roles)
- Team management (create teams; assign permissions; associate robots; team settings)
- Robot management (create robots; delete robots)
- Organization settings
- Delete organizations
- View and interact with the Upbound console

### Members

Members can only view resources that admins have granted access to. They can't create robot accounts or teams. They also don't have permission to view the Upbound console.

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


## Authentication

Upbound issues JSON Web Tokens (JWT) with identity information to authenticate to your platform APIs. The token includes:

- A subject (`upbound:user/team:<name>`)
- The user's team memberships (`upbound:team:<UUID>`)
- The organization context (upbound:org-role:(admin|member))

## Authorization

Upbound uses identities to check for authentication across the platform. In the Cloud environment, Upbound grants identities organization roles to control access to features and resources with IAM policies.

You can bind identities to Kubernetes RBAC or Upbound RBAC to control access to resources depending on your operational model. The subject and group claims in the JWT token determine the user's effective permissions for an API request.


Depending on your operational model, you can use either:
- Upbound RBAC (with Connected or Cloud Spaces)
- Kubernetes Hub Authorization (Single-Tenant Connected or Disconnected Spaces)

## RBAC Models Overview

Upbound offers two primary models for implementing RBAC: the Kubernetes Hub model and the Upbound model. Understanding the differences and use cases for each is crucial for effective access management.

### Kubernetes Hub Model

The Kubernetes Hub model leverages native Kubernetes RBAC mechanisms and is ideal for:
- Single-Tenant Connected Spaces
- Disconnected Spaces
- Environments where tight integration with existing Kubernetes infrastructure is required

Key features:
- Uses standard Kubernetes `ClusterRoles`, `Roles`, `ClusterRoleBindings`, and `RoleBindings`
- Allows fine-grained control over Kubernetes resources
- Integrates seamlessly with existing Kubernetes RBAC configurations

### Upbound Model

The Upbound model is a proprietary RBAC system designed specifically for Upbound's platform and is suitable for:
- Connected Spaces
- Cloud Spaces
- Scenarios requiring Upbound-specific resource management

Key features:
- Introduces Upbound-specific roles (Admin, Editor, Viewer)
- Provides a simplified, hierarchical approach to access management
- Offers built-in integration with Upbound's unique resources and control planes