---
title: "Build with the Upbound CLI"
description: "Use the Upbound CLI to create infrastructure and have more control
of your configurations" 
weight: 1
aliases:
    - "/getstarted-devex/create-controllers"
    - "/quickstart"
---

In the previous tutorial, you create a control plane and deployed real cloud
resources in the Upbound Console and Consumer Portal. In this guide, you'll see
actual Composite Resource Definitions, Configurations, and Claims and interact
with these components in the Upbound CLI.

This tutorial deploys an EKS cluster, an RDS database, S3 bucket, and underlying
networking configuration. By the end of this guide, you'll have a frontend
website and backend server on the cluster which retreives information from the
database and serves images from the S3 bucket.

## Prerequisites
- An Upbound Account
- A Cloud Provider Admin account (AWS, Azure, or GCP)
- Docker Desktop
- `kubectl` installed

## Install the Upbound CLI

You'll need to install the `up` CLI. You can download it as a
binary package or with Homebrew. 
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

### Validate your installation

<!-- vale write-good.TooWordy = NO -->

The minimum supported version is `v0.35.0`. To verify your CLI installation and
version, use the `up version` command:

<!-- vale write-good.TooWordy = YES -->
```shell
up version
```
You should see the installed version of the `up` CLI. Since you aren't logged in
yet, `Crossplane Version` and `Spaces Control Version` returns `unknown`.

### Login to Upbound

Authenticate your CLI with your Upbound account by using the login command. This
opens a browser window for you to log into your Upbound account.

{{< editCode >}}
```ini {copy-lines="all"}
up login --account=$@<yourUpboundAccount>$@
```
{{< /editCode >}}

## Fork and create a new project

Upbound uses project directories containing configuration files to deploy
infrastructure. 

First, [fork](https://github.com/tr0njavolta/up-pound-project/fork) this project and clone it locally.

{{< editCode >}}
```
git clone https://$@yourGitHubUser>$@/up-pound-project
```
{{</ editCode >}}

### Init the project

This project contains all the necessary configuration files to deploy your
application. 

Use the `up project move` command to initialize the project and associate it
with your Upbound account.

```shell
<!--- TODO(tr0njavolta): update move command --->
```

## Explore the repository

Your project contains:

* `upbound.yaml`: Project configuration file.
* `apis/`: Directory for Crossplane composition definitions.
* `examples/`: Directory for example claims.
* `.github/` and `.vscode/`: Directories for CI/CD and local development.

Open the `upbound.yaml` file in your editor.

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: new-project
spec:
  dependsOn:
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: 
  <!--- TODO(tr0njavolta): project repo update/editCode with user info --->
  source: github.com/upbound/project-template
```

This project file is the entrypoint for your new control plane project. It
contains the project metadata and needs the necessary dependencies to deploy
your project.

## Add dependencies

Your project file requires dependencies to know what providers or configuration
files to use.

Your infrastructure requires an EKS cluster, a database, an S3 bucket, and
networking to expose the frontend to the public and allow for communication
between the components.

This tutorial uses prebuilt packages called **configurations** to help you get
started with this project. These configurations bundle the definitions
and compositions necessary to deploy fully functioning components with minimal
manual changes.

Start with the [EKS cluster configuration](https://marketplace.upbound.io/configurations/upbound/configuration-aws-eks/v0.16.0):

```shell
up dep add xpkg.upbound.io/upbound/configuration-aws-eks:v0.16.0
```


Next, add the [RDS database configuration](up dep add xpkg.upbound.io/upbound/configuration-aws-database:v0.15.0):

```shell
up dep add xpkg.upbound.io/upbound/configuration-aws-database:v0.15.0
```

Add the [network configuration](https://marketplace.upbound.io/configurations/upbound/configuration-aws-network/v0.23.0):

```shell
up dep add xpkg.upbound.io/upbound/configuration-aws-network:v0.23.0
```

Finally, add the [S3 provider](https://marketplace.upbound.io/providers/upbound/provider-aws-s3/v1.21.0):

```shell
up dep add xpkg.upbound.io/upbound/provider-aws-s3:v1.21.0

```

Each of these are **dependencies** in your project, meaning your project
requires them to function and deploy your desired end state.

Most of the dependencies you added are configurations, except the S3
**provider**. Providers handle communication between your Upbound control plane
and the external resource, like the AWS S3 bucket. Unlike configurations,
providers handle a single cloud endpoint and require direct configuration.

Open your `upbound.yaml` file again and notice the new items added to the
`dependsOn` section.

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: new-project
spec:
  dependsOn:
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  - configuration: xpkg.upbound.io/upbound/configuration-aws-eks
    version: '>=v0.0.0'
  - configuration: xpkg.upbound.io/upbound/configuration-aws-database
    version: '>=v0.0.0'
  - configuration: xpkg.upbound.io/upbound/configuration-aws-network
    version: '>=v0.0.0'
  - provider: xpkg.upbound.io/upbound/provider-aws-s3
    version: '>=v0.0.0'
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: 
    <!--- TODO(tr0njavolta): repo update and add pinned versions of dependencies --->
  source: github.com/upbound/project-template
```

## Generate your project inputs and definitions

Now that you have your project dependencies, you need to generate the project
building blocks.

## Generate a claim

Claims are structured yaml files that you use to define the values you care
about exposing in your project. These files are abstractions of the resources
you require and you can give these files to teams in your organization to deploy
the infrastructure they require while maintaining consistency across your
resources. 

Think of claims as the blueprint of your project. It's a high-level plan that
shows what to build, without structural or implementation details.

Use the `up generate` command to create a claim:

```
up example generate \
    --type claim \
    --api-group  \
    --api-version v1alpha1 \
    --kind  \
    --name  \
    --namespace default

<!--- TODO(tr0njavolta): api-group, kind, name --->
```

This command creates a scaffold claim file. Open the claim in your editor to
review:

```yaml
<!--- TODO(tr0njavolta): scaffold claim, no copy --->
```

#### Determine your claim inputs

To determine your claim inputs, consider the resources and services you're
provisioning.

* What resources do you need to manage?
    * An S3 bucket
    * An EKS cluster with frontend and backend nodes
    * An RDS instance
    * The underlying networking infrastructure: VPC, Subnets, Security Groups,
        etc.
* What parameters should your users have control over?
    * The AWS region to deploy these resrouces
    * An identifying name
    * Node instance size
    * Database instance size

Open your claim file and copy and paste the claim file with these parameters:

```yaml
apiVersion: app.uppound.com/v1alpha1
kind: App
metadata:
  name: example
  namespace: default
spec:
  parameters:
    id: uppound-aws
    containers:
      - name: frontend
        image: tr0njavolta/uppound-demo-frontend:latest
      - name: backend
        image: tr0njavolta/uppound-demo-backend:latest
    region: us-east-1
    version: "1.27"
    nodes:
      count: 2
      instanceType: t3.small
    size: large
    engine: postgresql
  writeConnectionSecretToRef:
    name: uppound-aws-kubeconfig
```

This new claim file contains the parameters you determined were okay for users
to edit and change when they need to deploy this configuration, but it also
helps create the next file necessary for your project: the **definition**.

### Generate a definition file

Your **definition** file or Composite Resource Definition (XRD) is the schema
definition Upbound needs to create the resources with the parameters you've
specified in your claim.

Use the claim you created to generate this definition file:

```shell
up xrd generate example.yaml
<!--- TODO(tr0njavolta): full path based on name --->
```

If the claim is the blueprint of your project, the definition is the file with
the rules and regulations. The XRD is a custom schema representation for the
bucket API you defined in your claim. The up xrd generate command automatically
infers the variable types for the XRD based on the input parameters in your claim.

With these rules and regulations generated, you need to generate a
**composition** file.

### Generate a composition file

Your **composition** file is the template that allows you create multiple
resources in a single file. Compositions define how your individual resources
should be created and managed by Upbound.

Use the definition you created to generate this composition file:

```shell
up composition generate
<!--- TODO(tr0njavolta): file name --->
```

If the definition contains your project's rules and regulations, the composition
is the project implementation plan. The composition file uses the XRD to
determine what resources to create and how they need to be configured when you
deploy them.

The composition file you generated needs a way to systematically deploy the
dependencies you added to your project. You need to generate a **composition
function**.

## Create a composition function

**Composition functions** allow you to build, package, and manage resources with
common programming languages. Instead of statically managing the composition
file itself in YAML, functions let you use advanced logic and reusablability.
You can create composition functions with KCL, Python, or Go. In this guide,
you'll use KCL.

Use the composition you created to generate your function with KCL:

```shell
up function generate
<!--- TODO(tr0njavolta): function name and composition path --->
```

If the composition file is the project implementation plan, the function is the
"how-to" of the construction process. Functions take the claim blueprint and
ensures that each piece of the project is in place correctly and assembled to
match the blueprint within the confines of the rule and regulations in the
definition.

### Add your configurations to the function

## Deploy

## Destroy
