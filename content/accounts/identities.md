---
title: Enable and configure access control
weight: 9
description: A tutorial for creating role-based access control in Upbound
---


Upbound uses a unified identity model across the platform. Upbound managed
identities centrally for authentication and authorization in Cloud and
Connected Spaces.

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

- a subject
- the users team memberships
- The organization context


## Directory Sync
## Authorization

Upbound uses identities to check for authentication across the platform. In
the Cloud environment, Upbound grants identities organization roles to
control access to features and resources with IAM policies.

In Connected Spaces, you can bind identities to Kubernetes RBAC roles or
Upbound IAM roles to control access to resources.

 The subject and group claims in the JWT token determine the user's
 effective permissions for an API request.
