---
title: Control Planes
weight: 1
description: A centralized management layer that enables the orchestration of cloud resources and services across multiple providers.
---

Control planes are a conceptual management layer that enables you to create and
manage cloud resources and other services.


## Control plane components

Control planes provide a vector for operations and can manage your
infrastructure with a few key components.


<!--- TODO(tr0njavolta): API --->

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

The API server acts as the single entry point for all control plane interactions -
whether you're using kubectl, the Upbound Console, or making direct API calls,
you're always talking to this same API server. It's the authoritative source of
truth for what resources should exist and how they should be configured.

### Controllers

A controller is a long-running program that exists as part of a
provider package. Controllers implement reconciliation loops for a specific
resource type. For example, the `provider-aws-s3` provider, contains the
controllers specific to the AWS S3 resource type.

When controllers detect a change in either the resource it controls, or the API
server, it begins reconciling the actual state with the desired state.

For example, an S3 controller might check if a bucket exists in AWS and then
modify it to specifications, or create a new bucket with the specifications from
the API server. Controllers also handle retries for failed operations, track the
status of long-running changes, and update the resource status in the API server
to reflect the current state.

<!--- TODO(tr0njavolta): link --->

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
<!--- TODO(tr0njavolta): Fix this --->

3. **Act** - Control planes use the controllers to act on the provider and reconcile any differences, ensuring your infrastructure matches your specifications.

<!--- TODO(tr0njavolta): this image sucks lol --->

## The control plane workflow

{{< table "table table-sm table-striped cli-ref">}}
| Phase | Control Plane | Terraform |
|-------|--------------|-----------|
| **Infrastructure Definition** | Define platform APIs (XRDs) and compositions once, users consume via simple claims | Write complete HCL for every resource, including all provider-specific details |
| **State Storage** | Stored automatically in API server, continuously updated | Maintained in state files that must be manually stored, locked, and shared |
| **Resource Creation** | User submits claim like:<br>`kind: PostgreSQLInstance`<br>`spec:`<br>&nbsp;&nbsp;`size: large` | Developer writes full configuration:<br>`resource "aws_db_instance"`<br>`resource "aws_security_group"`<br>`resource "aws_db_subnet_group"` |
| **Abstraction** | Compositions handle provider-specific details automatically | Each provider's resources must be explicitly configured |
| **Execution** | Continuous reconciliation loop:<br>1. Watches for changes<br>2. Detects drift<br>3. Reconciles automatically | Manual process:<br>1. Run `terraform plan`<br>2. Review changes<br>3. Run `terraform apply`<br>4. Commit state file |
| **Drift Detection** | Automatic and continuous | Only detected during manual `terraform plan` |
| **Error Handling** | Automatic retries and status reporting | Manual retry of `terraform apply` |
| **Multi-Provider** | Managed through single composition | Separate provider blocks and state for each |
| **Updates** | Submit new claim or update existing one - reconciliation happens automatically | 1. Update HCL<br>2. Run plan<br>3. Run apply<br>4. Update state<br>5. Commit changes |
| **Team Usage** | Self-service through predefined APIs | Each team member needs:<br>1. Provider credentials<br>2. Terraform knowledge<br>3. State file access<br>4. Lock coordination |
{{< /table >}}


Crossplane runs control planes in a Kubernetes deployment, which requires you to
build and configure a Kubernetes deployment. Upbound handles this for you with **managed control planes**. For more
information, review the managed control plane documentation.
<!--- TODO(tr0njavolta): link --->
