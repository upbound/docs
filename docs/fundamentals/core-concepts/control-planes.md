---
title: Control Planes
sidebar_position: 1
description: A centralized management layer that enables the orchestration of cloud
  resources and services across multiple providers.
---

Control planes are a conceptual management layer that enables you to create and
manage cloud resources and other services.


## Control plane components

Control planes provide a vector for operations and can manage your
infrastructure. Control planes use an API server and Controllers to manage your
resources.

### API server

The API server is an HTTPS endpoint that accepts and responds to API requests.
This component is an extension of the Kubernetes API.

When you interact with your control plane, you're making HTTP requests to this
server.

The API server handles these requests by:

- Authenticating your credentials (API tokens, certificates)
- Authorizing whether you have permission to perform the action
- Validating the resource definition matches its schema
- Storing the validated resource in its database
- Returning a response to your request
- Notifying controllers that watch for changes to that resource type

The API server acts as the central entry point for all control plane interactions. You access the same API server whether you use `kubectl`, the Upbound Console, or direct API calls. It authoritatively determines which resources should exist and their configurations.

### Controllers

Controllers are long-running programs within provider packages that manage
specific resource types through reconciliation loops. For example, the
`provider-aws-s3` package contains controllers specifically for AWS S3 resources

When a controller detects changes in either its managed resources or the API
server, it reconciles the actual state with the desired state. An S3 controller
checks if a bucket exists in AWS, then creates or modifies it according the
API server specifications. Controllers also handle operation retries, track long
running changes, and update resource status in the API server to reflect the
current state.

## State management

Your desired state comes from the configuration files you write. The controllers
deployed handle fetching from your configuration via the API and then create or
correct the actual state of your resources.

Control planes operate through a continuous cycle of three key actions for state
reconciliation:

1. **Check** - Control planes constantly observe your infrastructure resources
   via controllers.
   The control plane verifies all your requested resources exist and function as
   defined in your configuration.

2. **Report** - When the real state doesn't match your configurations, the
   control plane reports the delta of differences.

3. **Act** - Control planes use the controllers to act on the provider and reconcile any differences, ensuring your infrastructure matches your specifications.

<!--- TODO(tr0njavolta): line breaks --->
## The control plane workflow
<!-- vale alex.Condescending = NO -->
| Phase | Control Plane |
|-------|--------------|
| **Infrastructure Definition** | Define platform APIs (XRDs) and compositions once, users consume via simple claims |
| **State Storage** | Stored automatically in API server, continuously updated |
| **Resource Creation** | User submits claim like:`kind: PostgreSQLInstancespec:size: large` |
| **Abstraction** | Compositions handle provider-specific details automatically |
| **Execution** | Continuous reconciliation loop:1. Watches for changes2. Detects drift3. Reconciles automatically |
| **Drift Detection** | Automatic and continuous |
| **Error Handling** | Automatic retries and status reporting |
| **Multi-Provider** | Managed through single composition |
| **Updates** | Submit new claim or update existing one - reconciliation happens automatically |
| **Team Usage** | Self-service through predefined APIs |


<!-- vale alex.Condescending = YES -->

Crossplane runs control planes in a Kubernetes deployment, which requires you to
build and configure a Kubernetes deployment. Upbound handles this for you with **control planes**. For more
information, review the [control plane documentation][ctpdocs].

[ctpdocs]: /build
