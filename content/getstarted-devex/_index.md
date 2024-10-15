---
title: "Get Started with Upbound"
weight: -1
description: "Learn how Upbound works and how it can work for you."
---

{{< content-selector options="yaml,python,go" default="yaml" >}}
<!-- yaml -->
{{< editCode >}}
```yaml
greet: "hello world"
```
{{</ editCode >}}
<!-- /yaml -->

<!-- python -->
{{< editCode >}}
```python
print("Hello, World!")
```
{{</ editCode >}}
<!-- /python -->

<!-- go -->
{{< editCode >}}
```go
package main
import "fmt"
func main() {
	fmt.Println("hello world")
}
```
{{</ editCode >}}
<!-- /go -->
{{</content-selector >}}

Upbound is a scalable infrastructure service built on Crossplane that helps you
effectively manage your organization's platform needs. What
distinguishes Crossplane and Upbound from other infrastructure tools is the
**universal control plane**. Control planes are orchestration layers that
continuously reconcile your requested state with your actual resources. 

{{< content-selector options="yaml,python,go" default="yaml" >}}
<!-- yaml -->
{{< editCode >}}
```yaml
lang: "yaml"
```
{{</ editCode >}}
<!-- /yaml -->


<!-- python -->
{{< editCode >}}
```python
lang = "python"
```
{{</ editCode >}}
<!-- /python -->

<!-- go -->
{{< editCode >}}
```go
lang := "go"
```
{{</ editCode >}}
<!-- /go -->
{{</ content-selector >}}


Upbound handles building and managing your external
infrastructure and it allows the teams that need infrastructure to self-serve.

If you're not already familiar with Crossplane, Upbound can give you the control plane advantage. This guide will help you started with Upbound without being a Crossplane expert.

## How Upbound works 

Upbound uses control planes to manage resources through custom APIs. The control
plane is like a thermostat. You set preferences for the temperature and the
thermostat constantly monitors the external temperature and then communicates
with your heating and cooling systems to meet your specification. In the same
way, Upbound continuously monitors and reconciles cloud resources to meet your
desired state. You define these resources with Custom Resource
Definitions(CRDs), which Upbound parses, connects with the service, and manages
it for you.

## Why Upbound?

As your infrastructure grows, managing cloud-environments, scaling, and security
becomes more difficult. Tools like Terraform require more hands-on intervention to avoid
drift and deploy consistently across providers.

By adopting Upbound, you gain integrated drift protection, scalability across
providers, and the ability to empower your organization to deploy what they
need. With Upbound's fully managed control plane workflow, you get a consistent
and reliable deployment system managed by GitOps prinicples and continuous
reconciliation.

## Try it out

{{< hint >}}
You can also try our pre-built Instruqt scenario
{{< /hint >}}

Now that you have a conceptual understanding of Upbound, let's build on that knowledge with a hands-on tutorial. We'll dive into building your control plane, how the control plane runs, packaging your resource definitions, and deploying resources with the Upbound CLI tool

## Prerequisites

For this guide, you will need:

An Upbound free-tier account


## Install up CLI
To use Upbound, you'll need to install the up cli binary. You can download the CLI as a binary package or with Homebrew

```shell
curl -sL "https://cli.upbound.io" | sh
```
brew install upbound/tap/up

## Verify your installation

To make sure you installed the CLI and that you have the most recent version, use the `-version` flag.

```shell
up version

```

You should see the installed version of the up CLI. Since you aren’t logged into Upbound yet, you should see ‘unknown’ for Crossplane Version and Spaces Control Version.

## Login to Upbound

Your CLI needs to authenticate to your Upbound account. Use the login command to open a browser window and login to your account through the Upbound console.

```shell
up login

```
## Create a new project

Upbound uses project directories that contain your configuration files to deploy your infrastructure. Your project directory will contain the project metafile and the compositions and definitions for your infrastructure.

To initialize a new project directory, create a new directory on your machine:

```shell
mkdir upbound-qs && cd upbound-qs
```

The Upbound CLI creates the scaffolding for your project with the project command:

```shell
up project init upbound-qs
```

The up project init command creates the minimum required files and setup for a new project with a name you choose.

## Add packages to your project

First, let's review the files included in this initial project directory. Open upbound.yaml in your text editor.

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: upbound-qs
spec:
  maintainer: Upbound User <user@example.com>
  source: github.com/upbound/project-template
  license: Apache-2.0
  description: "This is where you can describe your project."
  readme: |
	This is where you can add a readme for your project.
  repository: xpkg.upbound.io/example/project-template
  dependsOn: []

```

This stub file contains the general shape of an Upbound project. 

In other infrastructure as code or declarative infrastructure tools, you would use this file to build out the exact parameters of your infrastructure. With Upbound, you can add your desired infrastructure without manually authoring or editing.

In addition to the upbound.yaml file, there is

- An apis folder for Crossplane composition definitions to be defined within.
- An examples folder for example claims to be stored.
- Folders for .github and .vscode local development and CI/CD respectively.
- A makefile to execute.

Now let’s add a function, provider and configuration to our project.

```shell
up dependency add xpkg.upbound.io/crossplane-contrib/function-kcl
up dependency add xpkg.upbound.io/crossplane-contrib/provider-helm
up dependency add xpkg.upbound.io/upbound/configuration-aws-network
```

Once this is completed, you can check your upbound.yaml file to find the dependencies have been installed.

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
 name: upbound-qs
spec:
 dependsOn:
 - function: xpkg.upbound.io/crossplane-contrib/function-kcl
   version: v0.9.4
 - provider: xpkg.upbound.io/crossplane-contrib/provider-helm
   version: v0.19.0
 - configuration: xpkg.upbound.io/upbound/configuration-aws-network
   version: v0.17.0
 description: This is where you can describe your project.
 license: Apache-2.0
 maintainer: Upbound User <user@example.com>
 readme: |
   This is where you can add a readme for your project.
 repository: xpkg.upbound.io/example/project-template
 source: github.com/upbound/project-template
```

Now, lets go generate an XRD from a Claim (XRC)

## Generate an XRD from a Claim (XRC)

Copy the content below into a new yaml file, and save it as xrc.yaml inside the /examples folder. It defines a Postgres instance. This defines a composite resource claim (XRC).

```yaml
apiVersion: tutorial.upbound.io/v1
kind: Postgres
metadata:
  name: test
  namespace: upbound-system
spec:
  parameters:
    version: "v1.0.0"
```

A Composite Resource Claim (XRC) is a namespace-scoped request for an instance of a composite resource. It's the interface that most users interact with to request infrastructure, and it allow users to request infrastructure in a simplified, abstract manner.



Now generate the resource claim:

```shell
up xrd generate examples/xrc.yaml
```

A composite resource definition (XRD) corresponding to the claim has been generated and placed in a file called definition.yaml under xpostgres. You can inspect it below.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
 name: xpostgres.tutorial.upbound.io
spec:
 claimNames:
   kind: Postgres
   plural: postgres
 group: tutorial.upbound.io
 names:
   categories:
   - crossplane
   kind: XPostgres
   plural: xpostgres
 versions:
 - name: v1
   referenceable: true
   schema:
     openAPIV3Schema:
       description: Postgres is the Schema for the Postgres API.
       properties:
         spec:
           description: PostgresSpec defines the desired state of Postgres.
           properties:
             parameters:
               properties:
                 version:
                   type: string
               type: object
           type: object
         status:
           description: PostgresStatus defines the observed state of Postgres.
           type: object
       required:
       - spec
       type: object
   served: true

```

A Composite Resource Definition (XRD) defines the schema for a new type of composite resource. It's similar to a Kubernetes Custom Resource Definition (CRD) but specific to Crossplane's composite resources. You can see in the YAML above that the XRD defines the Postgres resource type that we created in the XRC above.

## Generate an XRD from a composite resource (XR)

You can also generate an XRD from a composite resource (XR).

Copy the content below into a new yaml file, and save it as xr.yaml inside the /examples folder. It defines a test instance.

apiVersion: tutorial.upbound.io/v1
kind: XTest
metadata:
 name: test
spec:
 parameters:
   version: "v1.0.0"
   addons:
     - name: "vpc-cni"
       version: "0.96"
status:
 version: "v1.0.0"
 addons:
   - name: "vpc-cni"
     version: "0.96"

A Composite Resource (XR) is an instance of a resource type defined by an XRD. It represents a complex, high-level resource that may be composed of multiple underlying managed resources. In this example, our XR is a test instance.
Now run the following command

up xrd generate examples/xr.yaml

A composite resource definition (XRD) corresponding to the claim has been generated and placed in a file called definition.yaml under xtest. You can inspect it below.

apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
 name: xtests.tutorial.upbound.io
spec:
 group: tutorial.upbound.io
 names:
   categories:
   - crossplane
   kind: XTest
   plural: xtests
 versions:
 - name: v1
   referenceable: true
   schema:
     openAPIV3Schema:
       description: XTest is the Schema for the XTest API.
       properties:
         spec:
           description: XTestSpec defines the desired state of XTest.
           properties:
             parameters:
               properties:
                 addons:
                   items:
                     properties:
                       name:
                         type: string
                       version:
                         type: string
                     type: object
                   type: array
                 version:
                   type: string
               type: object
           type: object
         status:
           description: XTestStatus defines the observed state of XTest.
           properties:
             addons:
               items:
                 properties:
                   name:
                     type: string
                   version:
                     type: string
                 type: object
               type: array
             version:
               type: string
           type: object
       required:
       - spec
       type: object
   served: true

Now, we are ready to apply these resources to actually create the managed resources.

## Start your local cluster

You can start up a local control plane by running the following command. Make sure to have docker installed as a prerequisite.

up local start

Creating local control plane...
  ✓   [1/2]: Starting control plane                                                                                                                                  
  ✓   [2/2]: Starting Crossplane                                                                                                                                     
  🙌  Your local control plane is ready 👀

In a moment, your local control plane will be ready to use!
Let’s generate resources!
Now you can apply the XRDs, XRs and XRCs we created earlier to actually create the managed resources. Then you can get all the resources you created and view them in your terminal.

kubectl apply -f apis/xtests/definition.yaml
kubectl apply -f apis/xpostgres/definition.yaml
kubectl apply -f examples/xr.yaml
kubectl apply -f examples/xrc.yaml

kubectl get xrd
NAME                     ESTABLISHED   OFFERED   AGE
xtests.tutorial.upbound.io   True                    68s
xpostgres.tutorial.upbound.io   True                    68s

kubectl get crds | grep "postgres"
postgres.tutorial.upbound.io                        
xpostgres.tutorial.upbound.io

kubectl get postgres --namespace=upbound-system
NAME   SYNCED   READY   CONNECTION-SECRET   AGE
test   True     False                       10m

kubectl get postgres -A
NAMESPACE        NAME   SYNCED   READY   CONNECTION-SECRET   AGE
upbound-system   test   True     False                       43s

$ kubectl get xpostgres 
NAME         SYNCED   READY   COMPOSITION   AGE
test-5r995   False                          42s
                              

Let’s write some compositions & functions

TODO: Will fill out once composition scaffolding withCLI is completed
Build your project and upload it to the Upbound Marketplace
Once you are done with local development, you can build your project, and upload it to the Upbound Marketplace.

Run the following command in your terminal.
up project build -t 1.0

The output build of your package is now available at `_output/upbound-qs-1.xpkg`.

Now let’s push this to the upbound marketplace.

TODO: the up project build command isn’t complete yet, so rewrite when that’s done.
Cleanup
Now you’re done! Let’s spin down our local control plane to end the tutorial.

Run the following command in your terminal.

up local stop

## Next steps

In the next guide, you will walk create cloud resources in the provider of your
choice.
