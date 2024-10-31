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
up dependency add xpkg.upbound.io/upboundcare/provider-aws-ec2:v1.16.0
```

The **provider** in your project creates external resources without. Functions
add logic to automate complex provisioning processes.

After adding these dependencies, your `upbound.yaml` file's `dependsOn` section should reflect the changes:

```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upboundcare/provider-aws-ec2
    version: v1.16.0

```

Your project configuration now includes your provider dependency and requires an
authentication method.

### Create provider credentials

`ProviderConfig` is a custom resource that defines how your control plane authenticates and connects with cloud providers like AWS. It acts as a configuration bridge between your control plane's managed resources and the cloud provider's API.

{{<hint>}}
For more detailed instructions or alternate authentication methods, visit the
[provider
documentation](https://docs.upbound.io/providers/provider-aws/authentication/).
{{</hint>}}


Using AWS access keys, or long-term IAM credentials, requires storing the AWS
keys as a control plane secret.

To create the secret [download your AWS access key](https://aws.github.io/aws-sdk-go-v2/docs/getting-started/#get-your-aws-access-keys)
ID and secret access key.

Create a new file called `aws-credentials.txt` and paste your AWS access key ID
and secret access key.

```ini
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

Next, create a new secret to store your credentials in your control plane. The
`kubectl create secret` command puts your AWS login details in the control plane
secure storage:

```shell
kubectl create secret generic aws-secret \
  -n crossplane-system \
  --from-file=my-aws-secret=./aws-credentials.txt
```

Next, create a new file called `provider-config.yaml` and paste the
configuration below.

```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: aws-secret
      key: my-aws-secret
```

Apply the provider configuration.

```bash
kubectl apply -f provider-config.yaml
```

Later, when you create a configuration and deploy your infrastructure with the
control plane, Upbound will use the `ProviderConfig` to locate and retrieve the
credentials in the secret store.

## Step 2: Generate configurations

### Create an example claim

Use the `up example generate` command to create an example **Composite Resource Claim** (XRC), a request for an instance of a composite resource. Claims allow users to request infrastructure without handling the complexities of the underlying configurations:

```shell
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: Network
What is the API group named?: xp-layers.crossplane.io
What is the API Version named?: v1alpha1
Successfully created resource and saved to examples/network/example-network.yaml
```

This command generates a claim and saves it to `examples/network/example-network.yaml`.

Open your `example-network.yaml` file and add the contents below:

```yaml
apiVersion: xp-layers.crossplane.io/v1alpha1
kind: Network
metadata:
 name: network-conditional
 namespace: default
spec:
  id: "conditional"
  count: 1
  includeGateway: false
  providerConfigName: default
  region: eu-central-1
```

Next, create a secondary claim.

```bash
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: Network1
What is the API group named?: xp-layers.crossplane.io
What is the API Version named?: v1alpha1
Successfully created resource and saved to examples/network/example-network1.yaml
```

Open `example-network1.yaml` in your editor and add the contents below:

```yaml
apiVersion: xp-layers.crossplane.io/v1alpha1
kind: Network
metadata:
 name: network-iteration
 namespace: default
spec:
  id: "iteration"
  count: 2
  includeGateway: true
  providerConfigName: default
  region: eu-central-1
```

Next, create a **Composite Resource Definition** (XRD) from this claim using the `up xrd generate` command:

```shell
up xrd generate examples/network/example-network.yaml
```

This command parses the claim to generate a matching definition for it. Here's a sample XRD file created:

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xnetworkss.platform.acme.co
spec:
  claimNames:
    kind: Network
    plural: networks
  group: platform.acme.co
  names:
    categories:
    - crossplane
    kind: XNetwork
    plural: xnetworks
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

Use the `up composition generate` command to create a composition based on the
claim you created.

```shell
up composition generate apis/xnetworks/definition.yaml
```

The corresponding **Composite Resource Definition** (XRD) is saved to `apis/xtests/definition.yaml` and includes details on the structure of `XTest`.

Now you can apply these resources and create the managed resources.

## Step 3: Create a function

Functions are files you write to programmatically deploy your configurations.
You can write functions in KCL or Python.

### Generate a function

Use `up function generate` to create a function based on your composition.

```shell
up function generate apis/xnetworks/composition.yaml
```

The default language is KCL, so this composition generates a `main.k` file.

```kcl
import model.v1beta1 as v1beta1

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}

id = option("params")?.oxr?.spec?.id or ""
includeGateway = option("params")?.oxr?.spec?.includeGateway or False
count = option("params")?.oxr?.spec?.count or 1
providerConfigName = option("params")?.oxr?.spec?.providerConfigName or "default"
region = option("params")?.oxr?.spec.region or "eu-central-1"

# Create number of VPCs according to spec.count
vpcs = [v1beta1.VPC{
    metadata.name = "vpc-{}-{}".format(id, i)
    metadata.labels = {
        "networks.meta.fn.crossplane.io/network-id" = id
        "networks.meta.fn.crossplane.io/vpc-id" = "vpc-{}-{}".format(id, i)
    }

    spec.forProvider = {
        region = region
        cidrBlock = "192.168.0.0/16"
        enableDnsSupport = True
        enableDnsHostnames = True
    }

    spec.providerConfigRef.name = providerConfigName

} for i in range(count)]

# Optionally create number of gateways according to spec.count and spec.includeGateway
gateways = [v1beta1.InternetGateway{
    metadata.name = "gateway-{}-{}".format(id, i)
    metadata.labels = {
        "networks.meta.fn.crossplane.io/network-id" = id
    }

    spec.forProvider = {
        region = region
        vpcIdSelector = {
            matchControllerRef = True
            matchLabels = {
                "networks.meta.fn.crossplane.io/vpc-id" = "vpc-{}-{}".format(id, i)
            }
        }
    }

    spec.providerConfigRef.name = providerConfigName
} for i in range(count)] if includeGateway else []

items = vpcs + gateways
```

## Step 3: Build your project


### Start a local control plane

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