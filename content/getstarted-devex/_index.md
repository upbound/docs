---
title: "Get Started with Upbound"
weight: -1
description: "Learn how Upbound works and how it can work for you."
---

Upbound is a scalable infrastructure management service built on Crossplane. The advantage of Crossplane and Upbound is the universal control plane. Control planes continuously reconcile your desired state with actual resources, allowing teams to self-serve their infrastructure needs.

## How Upbound works

Upbound uses control planes to manage resources through custom APIs. The control plane constantly monitors your cloud resources to meet the state you define in your custom APIs. You define your resources with Custom Resource Definitions (CRDs), which Upbound parses, connects with the service, and manages on your behalf.

## Why Upbound

Upbound offers several advantages for managing complex infrastructure. As your infrastructure grows, managing cloud environments, scaling, and security can become more challenging. Other infrastructure as code tools often require more hands-on intervention to avoid drift and deploy consistently across providers.

By adopting Upbound, you gain:

- Integrated drift protection and continuous reconciliation
- Scalability across providers
- Self-service deployment workflows
- Consistent deployment using GitOps principles

## Try it out

Now that you have a conceptual understanding of Upbound, let's get hands-on. You'll set up a control plane, package resource definitions, and deploy resources using the Upbound CLI tool.

## Prerequisites

For this guide, you will need:

- An Upbound free-tier account
- Docker Desktop
- KCL VSCode Extension

## Step 1: Setup your Workspace

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

### Create a new project

Upbound uses project directories containing configuration files to deploy
infrastructure. Use the `up project init` command to create a project directory
with the necessary scaffolding. Previously, this would require manually creating
directories, writing configuration files, and manually defining resources.

```shell
up project init upbound-qs && cd upbound-qs
```

The `up project init` command creates:

*   `upbound.yaml`: Project configuration file.
*   `apis/`: Directory for Crossplane composition definitions.
*   `examples/`: Directory for example claims.
*   `.github/` and `.vscode/`: Directories for CI/CD and local development.
*   `Makefile`: A file to execute project commands.

### Add packages to your project

Review the files in your project directory, starting with `upbound.yaml`:

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

Add providers and functions to your project with the `up dep add` command:

```shell
up dep add xpkg.upbound.io/crossplane-contrib/function-auto-ready
```

The **provider** in your project simulates creating external resources without creating real ones, allowing for local testing and experimentation. Functions add logic to automate complex provisioning processes. In this example:

*   **Auto-ready function** detects when resources are ready, providing updates to keep your resources in sync.
*   **Configuration language function** lets you define resources in a more flexible format, reducing manual YAML handling.

After adding these dependencies, your `upbound.yaml` file's `dependsOn` section should reflect the changes:

```yaml
spec:
  dependsOn:
  - function: xpkg.upbound.io/crossplane-contrib/function-kcl
    version: v0.9.4
  - provider: xpkg.upbound.io/crossplane-contrib/provider-helm
    version: v0.19.0
  - configuration: xpkg.upbound.io/upbound/configuration-aws-network
    version: v0.17.0
```

Your project configuration now includes your dependencies, setting you up to create a resource claim.

## Step 2: Generate configurations

### Create an example claim

Use the `up example generate` command to create an example **Composite Resource Claim** (XRC), a request for an instance of a composite resource. Claims allow users to request infrastructure without handling the complexities of the underlying configurations:

```shell
up example generate --kind=Database --api-group=platform.acme.co --api-version=v1alpha1 --type=xrc
```

This command generates a claim and saves it to `examples/database/example-database.yaml`.

Next, create a **Composite Resource Definition** (XRD) from this claim using the `up xrd generate` command:

```shell
up xrd generate examples/database/example-database.yaml
```

This command parses the claim to generate a matching definition for it. Here's a sample XRD file created:

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
            type: object
          status:
            type: object
        required:
        - spec
        type: object
    served: true
```

The XRD defines the shape of your new composite resource. In the next step, you
will generate an XRD from a composite resource (XR).

### Generate an XRD from a composite resource (XR)

In your `/examples` folder, create a new YAML file `xr.yaml` with the following content. This file defines an instance of a composite resource:

```yaml
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
```

Run the command below to generate an XRD based on this composite resource:

```shell
up xrd generate examples/xr.yaml
```

The corresponding **Composite Resource Definition** (XRD) is saved to `apis/xtests/definition.yaml` and includes details on the structure of `XTest`.

Now you can apply these resources and create the managed resources.

## Step 3: Create your infrastructure

### Start your local control plane

Use the `up local start` command to launch a local control plane with Docker:

```shell
up local start
```

You should see output indicating your control plane is ready. Next, apply the XRDs, XRs, and XRCs to create the managed resources:

```shell
kubernetes apply -f apis/xnetworks/definition.yaml
compositeresourcedefinition.apiextensions.crossplane.io/xnetworks.xp-layers.crossplane.io created
```

Check your resources:

```shell
kubectl get xrd
```

### Build and deploy your project

When you're ready to share your work, you can build your project and publish it to the Upbound Marketplace. Run:

```shell
up project build -t 1.0
```

This command creates a package at `_output/upbound-qs-1.xpkg`. To push it to the Upbound Marketplace:

```shell
up project push xpkg.upbound.io/user/upbound-qs:1.0
```
{{<hint>}}
**Note:** The `up project build` command may expand with new features in upcoming versions.
{{</hint>}}

## Cleanup

To end the tutorial and stop your local control plane:

```shell
up local stop
```

## Next steps

In the next guide, you'll learn how to provision cloud resources in your preferred provider, leveraging the full capabilities of Upbound's cross-cloud infrastructure management.