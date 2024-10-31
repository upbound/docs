---
title: "Create cloud resources with Upbound"
description: "Define a control plane for resource abstractions in a real cloud provider environment"
---

In the previous guide, you deployed minimal resources to a local control plane. In this guide, you'll create a control plane for provisioning and managing cloud resources across AWS, Azure, or GCP. You'll build reusable APIs that allow your development teams to deploy and configure infrastructure themselves.

By the end of this guide, you'll have:

1. A control plane project
2. Composite Resources defining your cloud resources
3. APIs for self-service infrastructure provisioning
4. A streamlined infrastructure workflow

This approach allows you to efficiently manage cloud resources across multiple providers, enabling your organization to scale its online services while maintaining control and consistency.

## Prerequisites

This guide assumes you are already familiar with AWS, Azure, or GCP.

Before you begin, make sure you have:

- The up CLI installed
- A cloud provider account with administrative access
- Visual Studio Code

For an introduction to the Upbound workflow, review the [Upbound CLI] <!--- TODO(tr0njavolta): link --->

## Create a new project

First, create and initialize a new project directory with `up project init`. The `up project` command pulls down the necessary scaffolding files for your project.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS project initialization

{{< editCode >}}
```shell
up project init up-aws-rds
```
{{</ editCode >}}

Change into your project directory:
```shell
cd up-aws-rds
```

<!-- /AWS -->

<!-- Azure -->
### Azure project initialization

{{< editCode >}}
```shell
up project init up-azure-db
```
{{</ editCode >}}

Change into your project directory:
```shell
cd up-azure-db
```

<!-- /Azure -->

<!-- GCP -->
### GCP project initialization

{{< editCode >}}
```shell
up project init up-gcp-db
```
{{</ editCode >}}

Change into your project directory:
```shell
cd up-gcp-db
```

<!-- /GCP -->
{{< /content-selector >}}

## Review the project configuration

The `upbound.yaml` file in each project directory is the entry point for your project configuration. This file contains metadata and specifications necessary to build your APIs and configurations. Open it in your editor and explore fields like `apiVersion`, `kind`, `metadata`, and `spec`.

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  creationTimestamp: null
  name: up-aws-rds
spec:
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
	This is where you can add a readme for your project.
  repository: xpkg.upbound.io/example/project-template
  source: github.com/upbound/project-template
```

{{< table >}}
| Field        | Description                                              |
| ------------ | -------------------------------------------------------- |
| `apiVersion` | Specifies the API version for the Upbound package format |
| `kind`       | Defines the type of Upbound package                      |
| `metadata`   | Contains metadata like name or additional annotations    |
{{</ table >}}

## Add project dependencies

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### Add the AWS RDS provider

```shell
up dependency add xpkg.upbound.io/upbound/provider-
```

<!-- /AWS -->

<!-- Azure -->
### Add the Azure DB provider

```shell
up dependency add xpkg.upbound.io/upbound/provider-
```

<!-- /Azure -->

<!-- GCP -->
### Add the GCP SQL provider

```shell
up dependency add xpkg.upbound.io/upbound/provider-gcp-sql:v0.10.0
```

<!-- /GCP -->
{{< /content-selector >}}

## Create a claim and generate an XRD

Claims are the configurations you create for your users. They contain the type
of resource and the fields that you expose to them. Claims are actually the
final piece of the configuration process because you should build your
configurations based on what your organization cares about.

In this instance, the team you're creating the infrastructure for only needs to
changea parameters to get a database. All other fields and parameters are taken
care of behind the scenes by compositions you create. Users aren't exposed to
the configurations, but the `up` CLI can generate those compositions for you
based on the minimal information you provide in the claim.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS

{{< editCode >}}
```yaml
apiVersion: demo.upbound.io/v1alpha1
kind: RDSInstance
metadata:
  name: my-aws-rds-instance
spec:
  forProvider:
    allocatedStorage: 2
    engine: postgres
    instanceClass: db.t3.micro
    passwordSecretRef:
      key: password
      name: example-dbinstance
      namespace: upbound-system
    region: us-west-1
    username: adminuser
```
{{</ editCode >}}

This AWS RDS claim is based on the fields AWS requires to create an instance.
You can discover required fields in the Marketplace for the provider.

In this instance, the claim allows users to select the size, engine, and
instance class. It also allows them to set a password and determines the region
the instance is deployed to.

| Field                                            | Type      | Description                                                                                           | Required |
| ------------------------------------------------ | --------- | ----------------------------------------------------------------------------------------------------- | -------- |
| **apiVersion**                                   | `string`  | Defines the API version of the custom resource. In this case, it's set to `demo.upbound.io/v1alpha1`. | Yes      |
| **kind**                                         | `string`  | Specifies the type of resource, here `RDSInstance`.                                                   | Yes      |
| **metadata.name**                                | `string`  | Unique name for the RDS instance resource.                                                            | Yes      |
| **spec.forProvider.allocatedStorage**            | `integer` | The amount of storage (in GB) to allocate for the database instance.                                  | Yes      |
| **spec.forProvider.engine**                      | `string`  | The database engine type (e.g., `postgres`, `mysql`).                                                 | Yes      |
| **spec.forProvider.instanceClass**               | `string`  | The RDS instance class that determines compute/memory capacity (e.g., `db.t3.micro`).                 | Yes      |
| **spec.forProvider.passwordSecretRef**           | `object`  | Reference to the Kubernetes secret storing the database admin password.                               | Yes      |
| **spec.forProvider.passwordSecretRef.key**       | `string`  | Key within the referenced secret for the password value.                                              | Yes      |
| **spec.forProvider.passwordSecretRef.name**      | `string`  | Name of the Kubernetes secret containing the password.                                                | Yes      |
| **spec.forProvider.passwordSecretRef.namespace** | `string`  | Namespace where the secret is stored (e.g., `upbound-system`).                                        | Yes      |
| **spec.forProvider.region**                      | `string`  | The AWS region where the RDS instance is hosted (e.g., `us-west-1`).                                  | Yes      |
| **spec.forProvider.username**                    | `string`  | The master (or administrative) username for accessing the RDS instance.                               | Yes      |

The values in the `spec.forProvider` section determine how the instance is
provisioned based on the input the user provides.

You may notice that some required fields are not present in this claim - don't
worry, they will be represented in a different configuration file.

Use this claim to generate a composite resource definition:

```shell
up xrd generate examples/aws-rds-instance.yaml
```

The minimal claim you created generated a new file called a Composite Resource
Definition (XRD) which is quite a bit more involved than the claim itself.

<!-- /AWS -->

<!-- Azure -->
### Azure

{{< editCode >}}
```yaml
apiVersion: demo.upbound.io/v1alpha1
kind: DBInstance
metadata:
  name: my-azure-db-instance
spec:
  forProvider:
    collation: SQL_Latin1_General_CP1_CI_AS
    serverIdSelector:
      matchLabels:
        testing.upbound.io/example-name: mssqljobagent-srv
    skuName: S1
```
{{</ editCode >}}

Use this claim to generate a composite resource definition:

```shell
up xrd generate examples/azure-db-instance.yaml
```

<!-- /Azure -->

<!-- GCP -->
### GCP

{{< editCode >}}
```yaml
apiVersion: demo.upbound.io/v1alpha1
kind: SQLInstance
metadata:
  name: my-gcp-sql-instance
spec:
  parameters:
    databaseVersion: "MYSQL_5_7"
    tier: "db-f1-micro"
    region: "us-central1"
    dataDiskSizeGB: 10
```
{{</ editCode >}}

Use this claim to generate a composite resource definition:

```shell
up xrd generate examples/gcp-sql-instance.yaml
```

<!-- /GCP -->
{{< /content-selector >}}

## Generate a composite resource definition

Using Crossplane and Upbound, define the infrastructure you want to manage in your cloud environment using a Composite Resource Definition (XRD).

### Example composite resource definition (XRD)

The following YAML file defines an XRD for a database instance.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xrds.devex.com
```

Define the parameters for your control plane and cloud resources. Each XRD
creates a framework within Upbound to allow infrastructure provisioning.

## Define cloud resource composition

Define the composition for each provider based on the control plane and XRD definitions.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS composition

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: aws-rds
  labels:
    provider: aws
spec:
```

<!-- /AWS -->

<!-- Azure -->
### Azure composition

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: azure-sql
  labels:
    provider: azure
spec:
```

<!-- /Azure -->

<!-- GCP -->
### GCP composition

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: gcp-sql
  labels:
    provider: gcp
spec:
```

<!-- /GCP -->
{{< /content-selector >}}

## Create a function

Functions are extensions that allow you to template your resources in KCL or
Python. When you build your infrastructure with Upbound, the function determines
what resources are created.

{{< content-selector options="KCL,Python" default="KCL" >}}

<!-- KCL -->
### KCL function

```yaml

```

<!-- /KCL -->

<!-- Python -->
### Python function

```python
```

<!-- /Python -->

{{< /content-selector >}}
