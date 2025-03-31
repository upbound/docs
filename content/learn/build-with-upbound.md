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
networking configuration. This creates a frontend website and backend server on
the cluster which retrieves information from the database and serves images from
the S3 bucket.

## Prerequisites

- An Upbound Account
- A Cloud Provider Admin account (AWS, Azure, or GCP)
- Docker Desktop
- `kubectl` installed

## Set up your environment 

### Install the Upbound CLI

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

## Create a new project

Upbound uses project directories containing configuration files to deploy
infrastructure. 

```shell
git clone https://github.com/upbound/up-pound-project && cd up-pound-project
```

This project contains all the necessary configuration files to deploy your
application. 

Use the `up project init` command to initialize the project and associate it
with your Upbound account.

```shell
up project init .
```

### Run and build your project

Build and run your project. While Upbound spins up your project, you can read
this guide to understand what's happening behind the scenes.

```shell
up project build && up project run
```

The `build` command packages your project in the hidden `_output` directory.
The `run` command installs your project functions and dependencies to a
**control plane**.



## Project structure and dependencies

Your new project contains:

* `upbound.yaml`: Project configuration file.
* `apis/`: Directory for Crossplane composition definitions.
* `examples/`: Directory for example claims.
* `.github/` and `.vscode/`: Directories for CI/CD and local development.

The `upbound.yaml` file is the entrypoint for your new control plane project. It
contains the project metadata and needs the necessary dependencies to deploy
your project.

### Review your project dependencies

Your project file requires dependencies to know what providers or configuration
files to use.

This demo requires:
* [an EKS cluster](https://marketplace.upbound.io/configurations/upbound/configuration-aws-eks/v0.16.0)
* [an RDS database](https://marketplace.upbound.io/configurations/upbound/configuration-aws-eks/v1.16.0)
* [underlying networking](https://marketplace.upbound.io/configurations/upbound/configuration-aws-network/v0.23.0)
* [an S3 bucket](https://marketplace.upbound.io/providers/upbound/provider-aws-s3/v1.21.0)

This tutorial uses prebuilt packages called **configurations** to help you get
started with this project. These configurations bundle the definitions
and compositions necessary to deploy fully functioning components with minimal
manual changes.

Each of these are **dependencies** in your project, meaning your project
requires them to function and deploy your desired end state.

Most of the dependencies in this project are configurations, except the S3
**provider**. Providers handle communication between your Upbound control plane
and the external resource, like the AWS S3 bucket. Unlike configurations,
providers handle a single cloud endpoint and require direct configuration.

### Understand project components

Upbound projects use three key file types:

1. **Composite resource** (XR) files for setting user-customizable parameters
2. **Definition** files for defining the schema and rules for your XRs
3. **Composition** files to compose multiple resources into a single file and
   determine how Upbound creates and manages your managed resources.

These files already exist in your example repository.

### Determine your resource inputs

Open the XR file to discover how to set resource inputs. The XR file should
contain the parameters your users care about for the resources they want to
create.

* What parameters should your users have control over?
    * The AWS region to deploy these resources
    * An identifying name
    * Node instance size
    * Database instance size


The example XR file contains several user-exposed parameters:

```yaml {copy-lines="none"}
apiVersion: app.uppound.com/v1alpha1
kind: XApp
metadata:
  name: example
spec:
  compositionSelector:
    matchLabels:
      language: kcl
  parameters:
    id: uppound-aws
    containers:
      - name: frontend
        image: tr0njavolta/uppound-demo-frontend:latest
      - name: backend
        image: tr0njavolta/uppound-demo-backend:latest
    region: us-west-2
    version: "1.27"
    nodes:
      count: 2
      instanceType: t3.small
    size: large
    engine: postgres
    dbVersion: "13.18"
  writeConnectionSecretToRef:
    name: uppound-aws-kubeconfig
    namespace: default
```

This file contains user-customizable parameters that generate
the required configuration for your project. When you apply this XR, parameters
like the `region` to deploy to pass to your composition function.

## Composition function

**Composition functions** allow you to build, package, and manage resources with
common programming languages. Instead of statically managing the composition
file itself in YAML, functions let you use advanced logic and reusability.
You can create composition functions with KCL, Python, or Go. In this guide,
you'll use KCL.

Functions take the claim blueprint and
ensure each piece of the project matches the rules and regulations in the definition.

Open the function file in your editor.

This function file contains an example of how to structure your resource
requests.

### Imports

The `import` statements at the beginning of the function are paths to the
underlying provider and configuration resources. You can import packages like
providers or other configurations as well as built-in KCL or Kubernetes
libraries.

```yaml {copy-lines="none"}
import models.com.uppound.app.v1alpha1 as appv1alpha1
import models.io.upbound.aws.s3.v1beta2 as s3v1beta2
import models.io.crossplane.kubernetes.v1alpha2 as k8sv1alpha2
```

You have several import packages here that help your function create your
resources with aliases your function can reference them later.

### Inputs

Next, review the `inputs` section:

```yaml {copy-lines="none"}
oxr = appv1alpha1.XApp {**option("params").oxr}
_ocds = option("params").ocds
_dxr = option("params").dxr
dcds = option("params").dcds
```

This function uses the `oxr` or observed composite resource input primarily.
The `oxr` input takes parameters from your XR and interpolates them as
variables in your function.

For instance, `oxr.region` follows the path of your claim specification to
find the `region` value in your claim parameters.

```yaml {copy-lines="none"}
_metadata = lambda name: str -> any {
    {
        name: name
        annotations = {"krm.kcl.dev/composition-resource-name" = name}
    }
}
```

<!--- TODO(tr0njavolta): metadata --->

### Resource items

Next, review the `_items` array with the required resources. This example uses the
`XEKS` item to highlight how the function works:

```yaml {copy-lines="none"}
_items = [
    # ... file truncated ...

    # cluster config
    {
        apiVersion: "aws.platform.upbound.io/v1alpha1"
        kind: "XEKS"
        metadata: _metadata("{}-xeks".format(oxr.metadata.name))
        spec: {
            parameters: {
                id: oxr.metadata.name
                region: oxr.spec.parameters.region
                version: oxr.spec.parameters.version
                nodes: {
                    count: oxr.spec.parameters.nodes.count
                    instanceType: oxr.spec.parameters.nodes.instanceType
                }
            }
        }
    },
   # ... file truncated ...   
]

items = _items
```

Each resource follows a pattern and requires:

1. An `apiVersion` field
2. The resource `kind`, like `XSqlInstance` or `XEKS`
3. Object `metadata` for names and labels
4. The resource `spec` for resource specific configuration parameters


The `items` variable contains all the resources you want when you run this
project, called **outputs**

## Deploy your resources

You installed your project files to the control plane with `up project run`.
Next, you need to submit your XR request and allow the control plane to handle
the management and provisioning.

### Authenticate with AWS

### Apply your Composite Resource (XR) 

Use the `kubectl apply` command to apply your Composite Resource (XR) file to the
control plane. 
```shell
kubectl apply -f examples/xapp/example.yaml
```

This initiates the deployment process, letting the control plane create the
resources you defined.

You can monitor the status of your resources with `kubectl`:

```shell
kubectl get xapp
```

You can also monitor specific resources:

```shell
kubectl get xeks
```

Once your project deploys, find the frontend endpoint and visit the application
in your browser.

### Make a change in your project

You can also make changes to your deployment while it's running.

Upbound uses continuous reconciliation to determine if your real world resources
match with your desired resources in the XR.

Update your XR file with a change to the `dbVersion`.

Reapply your XR.

```
kubectl apply -f examples/xapp/example.yaml

```

## Clean up

## Next steps
