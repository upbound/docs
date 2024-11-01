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

- An Upbound Free Tier account  <!--- TODO(tr0njavolta): link --->
- The up CLI installed
- A cloud provider account with administrative access
- Visual Studio Code

For an introduction to the Upbound workflow, review the [Upbound CLI] <!--- TODO(tr0njavolta): link --->

## Setup your Workspace

### Install the `up` CLI

To use Upbound, you'll need to install the `up` CLI. You can download it as a binary package or with Homebrew.

{{< tabs >}}

{{< tab "Binary" >}}
```shell
curl -sL "https://cli.upbound.io" | sh
````

{{< /tab >}}

{{< tab "Homebrew" >}}

```bash
brew install upbound/tap/up
```

{{< /tab >}}

{{< /tabs >}}

### Verify your installation

To verify your CLI installation and version, use the `up version` command:

```shell
up version
```

You should see the installed version of the `up` CLI. Since you aren't logged in yet, `Crossplane Version` and `Spaces Control Version` returns `unknown`.

### Login to Upbound

Authenticate your CLI with your Upbound account by using the login command. This opens a browser window for you to log into your Upbound account.

```shell
up login
```

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

Generate a new example claim. Choose `Composite Resource Claim` in your terminal
and give it a name describing what it creates.

<!--- TODO(tr0njavolta): describe api/version fields --->

```yaml
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: SQLInstance
What is the API group named?: demo.upbound.io
What is the API Version named?: v1alpha1
Successfully created resource and saved to examples/sqlinstance/example-sqlinstance.yaml
```

This command creates a minimal claim file. Copy and paste the claim below into
the `examples/sqlinstance/example-sqlinstance.yaml` claim file.

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
instance class. It also allows them to set a password and determines which
region you deploy to.

{{<table>}}
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
| **spec.forProvider.region**                      | `string`  | The AWS region                                                                                        |
where the RDS instance is hosted (e.g., `us-west-1`).
| Yes      |
| **spec.forProvider.username**                    | `string`  | The master (or administrative) username for accessing the RDS instance.                               | Yes      |
{{</table>}}

The values in the `spec.forProvider` section determine how the instance is
provisioned based on the input the user provides.

You may notice that some required fields are not present in this claim - don't
worry, they will be represented in a different configuration file.

Use this claim to generate a composite resource definition:

```shell
up xrd generate examples/aws-rds-instance.yaml
```

The minimal claim you created generated a new file called a Composite Resource
Definition (XRD) in `apis/xsqlinstance/definition.yaml`. The `up xrd generate`
command automatically infers the variable types based on the input parameters in
your example claim.

<!--- TODO(tr0njavolta): expand box for xrd view --->


<!-- /AWS -->

<!-- Azure -->
### Azure

Generate a new example claim. Choose `Composite Resource Claim` in your terminal
and give it a name describing what it creates.

<!--- TODO(tr0njavolta): describe api/version fields the terminal options--->

```yaml
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: SQLInstance
What is the API group named?: demo.upbound.io
What is the API Version named?: v1alpha1
Successfully created resource and saved to examples/sqlinstance/example-sqlinstance.yaml
```

This command creates a minimal claim file. Copy and paste the claim below into
the `examples/sqlinstance/example-sqlinstance.yaml` claim file.

{{< editCode >}}
```yaml
apiVersion: demo.upbound.io/v1alpha1
kind: SQLInstance
metadata:
  name: my-azure-sql-instance
spec:
  parameters:
    edition: "GeneralPurpose"
    computeModel: "Serverless"
    family: "Gen5"
    capacity: 2
    maxSizeGB: 32
```
{{</ editCode >}}

This Azure SQL claim is based on the fields Azure requires to create an instance.
You can discover required fields in the Marketplace for the provider.

In this instance, the claim allows users to select the size, engine, and
instance class. It also allows them to set a password and determines which
region you deploy to.

{{<table>}}
| Field | Type | Description | Required |
| ----- | ---- | ----------- | -------- |
<!--- TODO(tr0njavolta): azure description fields --->
{{</table>}}

The values in the `spec.forProvider` section determine how the instance is
provisioned based on the input the user provides.

You may notice that some required fields are not present in this claim - don't
worry, they will be represented in a different configuration file.

Use this claim to generate a composite resource definition:

```shell
up xrd generate examples/azure-sql-instance.yaml
```

The minimal claim you created generated a new file called a Composite Resource
Definition (XRD) in `apis/xsqlinstance/definition.yaml`. The `up xrd generate`
command automatically infers the variable types based on the input parameters in
your example claim.

<!--- TODO(tr0njavolta): expand box for xrd view --->

<!-- /Azure -->

<!-- GCP -->
### GCP
Generate a new example claim. Choose `Composite Resource Claim` in your terminal
and give it a name describing what it creates.

<!--- TODO(tr0njavolta): describe api/version fields --->

```yaml
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: SQLInstance
What is the API group named?: demo.upbound.io
What is the API Version named?: v1alpha1
Successfully created resource and saved to examples/sqlinstance/example-sqlinstance.yaml
```

This command creates a minimal claim file. Copy and paste the claim below into
the `examples/sqlinstance/example-sqlinstance.yaml` claim file.

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

This GCP SQL claim is based on the fields GCP requires to create an instance.
You can discover required fields in the Marketplace for the provider.

In this instance, the claim allows users to select the size, engine, and
instance class. It also allows them to set a password and determines which
region you deploy to.

{{<table>}}
| Field | Type | Description | Required |
| ----- | ---- | ----------- | -------- |
<!--- TODO(tr0njavolta): gcp description fields --->
{{</table>}}

The values in the `spec.forProvider` section determine how the instance is
provisioned based on the input the user provides.

You may notice that some required fields are not present in this claim - don't
worry, they will be represented in a different configuration file.

Use this claim to generate a composite resource definition:

```shell
up xrd generate examples/gcp-sql-instance.yaml
```

The minimal claim you created generated a new file called a Composite Resource
Definition (XRD) in `apis/xsqlinstance/definition.yaml`. The `up xrd generate`
command automatically infers the variable types based on the input parameters in
your example claim.

<!--- TODO(tr0njavolta): expand box for xrd view --->

<!-- /GCP -->
{{< /content-selector >}}


## Define cloud resource composition

Define the composition for each provider based on the control plane and XRD definitions.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS composition

```bash
up composition generate apis/xsqlinstances/definition.yaml
```

{{< tabs "Functions" >}}

{{< tab "KCL" >}}

```yaml
yamls-aws
```

1. second
2. third

{{< /tab >}}

{{< tab "Python" >}}
```python
pythons-aws
```
{{< /tab >}}


{{< /tabs >}}


<!-- /AWS -->

<!-- Azure -->
### Azure composition

```bash
up composition generate apis/xsqlinstances/definition.yaml
```

{{< tabs "Functions" >}}

{{< tab "KCL" >}}

```yaml
yamls-az
```

1. second
2. third

{{< /tab >}}

{{< tab "Python" >}}
```python
pythons-az
```
{{< /tab >}}


{{< /tabs >}}


<!-- /Azure -->

<!-- GCP -->

### GCP composition

```bash
up composition generate apis/xsqlinstances/definition.yaml
```

{{< tabs "Functions" >}}

{{< tab "KCL" >}}

```yaml
yamls-gcp
```

1. second
2. third

{{< /tab >}}

{{< tab "Python" >}}
```python
pythons-gcp
```
{{< /tab >}}


{{< /tabs >}}


<!-- /GCP -->

{{< /content-selector >}}

## Create a function

<!--- TODO(tr0njavolta): verify function creation for cloud providers --->

Functions are extensions that allow you to template your resources in KCL or
Python. When you build your infrastructure with Upbound, the function determines
what resources are created.

This function adds sever side encryption to your database

{{< content-selector options="KCL,Python" default="KCL" >}}

<!-- KCL -->
### KCL function

```yaml
import models.v1alpha1 as v1alpha1
import models.v1beta1 as v1beta1
import models.v1beta2 as v1beta2
import models.k8s.apimachinery.pkg.apis.meta.v1 as metav1

oxr = option("params").oxr # observed composite resource
_ocds = option("params").ocds # observed composed resources
_dxr = option("params").dxr # desired composite resource
dcds = option("params").dcds # desired composed resources

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}

_items = [
  v1beta1.Bucket{
    metadata.name = oxr.metadata.name
    spec.forProvider: {
      objectLockEnabled = True
      forceDestroy = False

    }
  }

  v1beta1.BucketVersioning {
    spec.forProvider: {
        bucketRef.name = oxr.metadata.name
    }
   }   if oxr.spec.versioning and oxr.status.conditions == 'True' else {}

   v1beta1.BucketServerSideEncryptionConfiguration {
    spec.forProvider = {
        bucketRef.name = oxr.metadata.name
        # rule.applyServerSideEncryptionByDefault.
        rule: [
          {
            applyServerSideEncryptionByDefault: [
                {
                    sseAlgorithm = "AES256"
                }
            ]
            bucketKeyEnabled = True
          }
        ]
    }
   } if oxr.spec.versioning and oxr.status.conditions == 'True' else {}
]
items = _items
```

<!-- /KCL -->

<!-- Python -->
### Python function


```python
```

<!-- /Python -->

{{< /content-selector >}}

## Deploy your configuration

Login to the [Upbound
Marketplace](https://accounts.upbound.io/login?targetProperty=marketplace&returnTo=https%3A%2F%2Fmarketplace.upbound.io%2F)
and create a new repository called `up-sql-demo`.

Update the repository settings in your `upbound.yaml` file

<!--- TODO(tr0njavolta): verify line numbers and add highlights --->
{{<editCode>}}
```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  creationTimestamp: null
  name: ${}
spec:
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
	This is where you can add a readme for your project.
  repository: xpkg.upbound.io${reponame}
  source: github.com/upbound/project-template
```
{{</editCode>}}

