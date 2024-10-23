---
title: "Get Started with Upbound"
weight: -1
description: "Learn how Upbound works and how it can work for you."
---

Upbound is a scalable infrastructure management service built on
Crossplane. The advantage of Crossplane and Upbound is the universal control
plane. Control planes continuously reconcile your desired state with actual
resources, allowing teams to self-serve their infrastructure needs.

## How Upbound works

Upbound uses control planes to manage resources through custom APIs. The
control plane constantly monitors your cloud resources to meet the state you
define in your custom APIs. You define your resources with Custom Resource
Definitions (CRDs), which Upbound parses, connects with the service, and
manages it for you.

## Why Upbound?

Upbound offers several advantages for managing complex infrastructure.
As your infrastructure grows, managing cloud environments, scaling, and
security can become more difficult. Other infrastructure as code tools
require more hands-on intervention to avoid drift and deploy
consistently across providers.

By adopting Upbound you gain:

- Integrated drift protection and continuous reconciliation
- Scalability across providers
- Self-service deployment workflows
- Consistent deployment system using GitOps principles

## Try it out

Now that you have a conceptual understanding of Upbound, let's build on that knowledge with a hands-on tutorial. You'll build your control plane, learn how the control plane runs, package your resource definitions, and deploy resources with the Upbound CLI tool.

## Prerequisites

For this guide, you will need:

An Upbound free-tier account

## Install up CLI
To use Upbound, you'll need to install the up cli binary. You can download the CLI as a binary package or with Homebrew

{{< tabs >}}

{{< tab "Binary" >}}
```shell
curl -sL "https://cli.upbound.io" | sh
```
{{< /tab >}}
{{< tab "Homebrew" >}}
```
brew install upbound/tap/up
```
{{< /tab >}}
{{< /tabs >}}

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

The Upbound CLI creates a project directory with the necessary scaffolding for your project with the project command:

```shell
up project init upbound-qs && cd upbound-qs
```

The up project init command creates:

* `upboubnd.yaml`: Project configuration file
* `apis/`: Directory for Crossplane composition definitons
* `examples/`: Directory for example claims
* `.github/` and `.vscode/`: Directory for CI/CD and local development
    with the the VSCode extensions
* `Makefile`: File to execute project commands

## Add packages to your project

First, let's review the files included in this initial project directory. Open `upbound.yaml` in your text editor.

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

This scaffolding file outlines your Upbound project. 

Now let’s add a provider and configuration to our project with the `up dep add`
command:

```shell
up dep add xpkg.upbound.io/upbound/provider-azure-web:v1.6.1
up dep add xpkg.upbound.io/crossplane-contrib/function-auto-ready ``
```

The **provider** in your project is a No-Op provider. This provider simulates
creating external resources, but does not create any real resources outside of
your local Upbound cluster. 

There are two functions in your project as well. The first is a Crossplane community function that
automatically detects if a composed resource is ready. The second is a
configuration language function that allows you to write your
configuration without adhering to strict YAML formatting. Functions allow you to
input more complex logic or otherwise manual tasks into the provisioning
process.

After you add your dependencies, review the `upbound.yaml` and the expanded `dependsOn` section.

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

Your `upbound.yaml` file now contains your project dependencies. Now, you're
ready to create a resource claim.

## Generate an example claim

The Upbound CLI uses the `up example generate` command to create an example claim in your project directory. 

The **Composite Resource Claim** (XRC) is a request for an instance of a composite resource. Claims are interface that most users interact with to request infrastructure, and they allow users to request infrastructure in a simplified, abstract manner.

```shell
up example generate --kind=Database --api-group=platform.acme.co --api-version=v1alpha1 --type=xrc

Successfully created resource and saved to examples/database/example-database.yaml
```

Next, use the `up xrd generate` command to create a Composite Resoure Definition
(XRD) from the claim you created in the previous step.

```shell
up xrd generate examples/database/example-database.yaml 

Successfully created CompositeResourceDefinition and saved to apis/xdatabases/definition.yaml
```

This command parses the claim you created and generated a definition
for that claim. Open the XRD in your editor.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatabases.platform.acme.co
spec:
  claimNames:
    kind: Database
    plural: databases
  group: platform.acme.co
  names:
    categories:
    - crossplane
    kind: XDatabase
    plural: xdatabases
  versions:
  - name: v1alpha1
    referenceable: true
    schema:
      openAPIV3Schema:
        description: Database is the Schema for the Database API.
        properties:
          spec:
            description: DatabaseSpec defines the desired state of Database.
            type: object
          status:
            description: DatabaseStatus defines the observed state of Database.
            type: object
        required:
        - spec
        type: object
    served: true
```

The XRD defines the shape of a new composite resource. In the next section, you'll learn what a composite resource is and how to generate an XRD from one.

## Generate an XRD from a composite resource (XR)

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

#TODO: Will fill out once composition scaffolding withCLI is completed
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
