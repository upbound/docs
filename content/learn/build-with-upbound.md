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

### Initialize the project

This project contains all the necessary configuration files to deploy your
application. 

Use the `up project init` command to initialize the project and associate it
with your Upbound account.

```shell
<!--- TODO(tr0njavolta): update move command --->
```

## Explore the repository

Your new project contains:

* `upbound.yaml`: Project configuration file.
* `apis/`: Directory for Crossplane composition definitions.
* `examples/`: Directory for example claims.
* `.github/` and `.vscode/`: Directories for CI/CD and local development.

The `upbound.yaml` file is the entrypoint for your new control plane project. It
contains the project metadata and needs the necessary dependencies to deploy
your project.

## Add dependencies

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

Use the `up dep add` command to add these dependencies:

```shell
up dep add xpkg.upbound.io/upbound/configuration-aws-eks:v0.16.0
up dep add xpkg.upbound.io/upbound/configuration-aws-database:v0.15.0
up dep add xpkg.upbound.io/upbound/configuration-aws-network:v0.23.0
up dep add xpkg.upbound.io/upbound/provider-aws-s3:v1.21.0
```

Each of these are **dependencies** in your project, meaning your project
requires them to function and deploy your desired end state.

Most of the dependencies you added are configurations, except the S3
**provider**. Providers handle communication between your Upbound control plane
and the external resource, like the AWS S3 bucket. Unlike configurations,
providers handle a single cloud endpoint and require direct configuration.

# Generate your project inputs and definitions

Now that you have your project dependencies, you need to generate the project
building blocks.

### Generate a claim

Claims are structured YAML files that expose your project's essential
configuration values. You can distribute these claims to teams across your
organization for self-service deployments while maintaining consistency and
compliance with your organization's requirements.

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

To determine your claim inputs, consider the resources you want to provision and
what inputs to expose.

* What parameters should your users have control over?
    * The AWS region to deploy these resources
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


The claim file contains user-customizable parameters that generate
the required **definition** file for your project. 


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
bucket API you defined in your claim. The `up xrd generate command` automatically
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

Open the function file in your editor.
<!--- TODO(tr0njavolta): path --->

The generated function contains an example of how to structure the functions you
write. 

The `import` statements at the beginning of the function are paths to the
underlying provider and configuration resources. You can import packages like
providers or other configurations as well as built-in KCL or Kubernetes
libraries.

Remove the initial import statements and paste the imports below:

```yaml
import models.com.upppound.app.v1alpha1 as appv1alpha1
import models.k8s.apimachinery.pkg.apis.meta.v1 as metav1
import models.io.upbound.aws.s3.v1beta2 as s3v1beta2
import models.k8s.api.apps.v1 as appsv1
import models.k8s.api.core.v1 as corev1
import datetime
```

You have several import packages here that help your function create your
resources with aliases so they can be referenced later.

Next, review the `inputs` section:

```yaml
oxr = option("params").oxr # observed composite resource
_ocds = option("params").ocds # observed composed resources
_dxr = option("params").dxr # desired composite resource
dcds = option("params").dcds # desired composed resources
```

You'll be working with the `oxr` or observed composite resource input primarily.
The `oxr` input takes parameters from your claim and can interpolate them as
variables in your function.

Replace the `inputs` with:

```yaml
time = datetime.ticks()
# observed composite resource
oxr = option("params").oxr
# observed composed resources
_ocds = option("params").ocds
# desired composite resource
_dxr = option("params").dxr
# desired composed resources
dcds = option("params").dcds

id: any = oxr.spec.parameters.id
region = oxr.spec.parameters.region
version: any = oxr.spec.parameters.version
instanceType: any = oxr.spec.parameters.nodes.instanceType
count: any = oxr.spec.parameters.nodes.count
size: any = oxr.spec.parameters.size
engine: any = oxr.spec.parameters.engine
baseName = "{}-{}".format(oxr.metadata.name, time)
dbversion: any = oxr.spec.parameters.dbversion
```

You still have the `oxr` input and you added some variables using this input.
For instance, the `region` input follows the path of your claim specification to
find the `region` value in your claim parameters.

You also have a reference to a built-in `import` function with `datetime`. You
created an input called `time` that retreives the current time in seconds and
then appends it as an input in the `baseName` of the resource to ensure a unique
name for your resources.

Next, the actual `items` you want to create as they are bundled in your provider
and configurations:

```yaml
_items = [
    # bucket config
    s3v1beta2.Bucket {
        metadata: _metadata("{}-bucket".format(baseName))
        spec = {
            forProvider: {
                region: region
            }
        }
    },
    {
        "apiVersion" = "aws.platform.upbound.io/v1alpha1"
        "kind" = "XNetwork"
        "metadata" = {
            "name" = "configuration-aws-network-kcl"
        }
        "spec" = {
            "compositionSelector" = {
                "matchLabels" = {
                    "function" = "kcl"
                }
            }
            "parameters" = {
                "id" = "{}-{}".format(baseName, id)
                "region" = region
            }
        }
    },
    {
        "apiVersion" = "aws.platform.upbound.io/v1alpha1"
        "kind" = "XEKS"
        "metadata" = {
            "name" = "configuration-aws-eks-kcl"
        }
        "spec" = {
            "compositionSelector" = {
                "matchLabels" = {
                    "function" = "kcl"
                }
            }
            "parameters" = {
                "id" = "{}-{}".format(baseName, id)
                "region" = region
                "version" = version
                "nodes" = {
                    "count" = count
                    "instanceType" = instanceType
                }
            }
        }
    },
    {
        "apiVersion" = "aws.platform.upbound.io/v1alpha1"
        "kind" = "XSQLInstance"
        "metadata" = {
            "name" = "configuration-aws-database"
        }
        "spec" = {
            "compositionSelector" = {
                "matchLabels" = {
                    "function" = "kcl"
                }
            }
            "parameters" = {
                "id" = "{}-{}".format(baseName, id)
                "engine" = engine
                "networkRef" = {
                    id = ""
                }
                "region" = region
                "storageGB" = 1
                "passwordSecretRef" = {
                    "key" = "password"
                    "name" = "psqlsecret"
                    "namespace" = "default"
                }
            }
        }
    },
    {
        "apiVersion" = "apps/v1"
        "kind" = "Deployment"
        "metadata" = _metadata("{}-frontend".format(baseName))
        "spec" = {
            "replicas" = 1
            "selector" = {
                "matchLabels" = {
                    "app" = "frontend"
                }
            }
            "template" = {
                "metadata" = {
                    "labels" = {
                        "app" = "frontend"
                    }
                }
                "spec" =  {
                "containers" = [
                    {
                        "name" = oxr.spec.parameters.containers[0].name
                        "image" = oxr.spec.parameters.containers[0].images
                        "ports" = [
                            { "containerPort" = 80 }
                        ]
                    }
                ]
                }
            }
        }
    },

]


items = _items
```

This `items` variable contains all the resources you want when you run this
project. These are called your project `outputs`.


## Edit your composition function

Your composition function has most of the necessary parameters to deploy your
infrastructure. You still need to make some changes to ensure your control plane
project runs correctly.

<!--- TODO(tr0njavolta): make a change to the function --->

## Authenticate your control plane with AWS

```shell
up ctx
```


```
up project run

```



## Destroy
