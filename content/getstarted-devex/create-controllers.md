---
title: "Create cloud resources with Upbound"
description: "Define a control plane for resource abstractions in a real cloud provider environment"
---

Now that you have a conceptual understanding of Upbound, let's get hands-on. In this guide, you'll create a control plane for provisioning and managing cloud resources across AWS, Azure, or GCP. You'll build reusable APIs that allow your development teams to deploy and configure infrastructure themselves.

By the end of this guide, you'll have:

1. A control plane project
2. Composite Resources defining your cloud resources
3. APIs for self-service infrastructure provisioning
4. A streamlined infrastructure workflow

This approach allows you to efficiently manage cloud resources across multiple providers, enabling your organization to scale its online services while maintaining control and consistency.

## Step 0: Prerequisites
This guide assumes you are already familiar with AWS, Azure, or GCP.

For this guide, you will need:
- The Up CLI installed
- An Upbound free-tier account
- A cloud provider account with administrative access
- Docker Desktop
- Visual Studio Code
- KCL or Python VSCode Extension

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

## Step 1: Create a new project
Upbound uses project directories containing configuration files to deploy infrastructure. Use the `up project init` command to create a project directory with the necessary scaffolding. Previously, this would require manually creating directories, writing configuration files, and manually defining resources.

### Init the project
```shell
  up project init upbound-qs && cd upbound-qs
```

The `up project init` command creates:
*   `upbound.yaml`: Project configuration file.
*   `apis/`: Directory for Crossplane composition definitions.
*   `examples/`: Directory for example claims.
*   `.github/` and `.vscode/`: Directories for CI/CD and local development.
*   `Makefile`: A file to execute project commands.

### Review the project configuration
Review the files in your project directory, starting with `upbound.yaml`. The `upbound.yaml` file in each project directory is the entry point for your project configuration. This file contains metadata and specifications necessary to build your APIs and configurations. Open it in your editor and explore fields like `apiVersion`, `kind`, `metadata`, and `spec`.

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

{{< table >}}
| Field        | Description                                              |
| ------------ | -------------------------------------------------------- |
| `apiVersion` | Specifies the API version for the Upbound package format |
| `kind`       | Defines the type of Upbound package                      |
| `metadata`   | Contains metadata like name or additional annotations    |
{{</ table >}}

## Step 2: Add project dependencies

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}
<!-- AWS -->
### Add the AWS RDS provider
```shell
up dependency add xpkg.upbound.io/upbound/provider-aws-s3:v1.16.0
```
<!-- /AWS -->

<!-- Azure -->
### Add the Azure DB provider
```shell
up dependency add xpkg.upbound.io/upbound/provider-azure-storage:v1.7.0
```
<!-- /Azure -->

<!-- GCP -->
### Add the GCP SQL provider
```shell
up dependency add xpkg.upbound.io/upbound/provider-gcp-storage:v1.8.3
```
<!-- /GCP -->
{{< /content-selector >}}

The **provider** in your project creates external resources for Upbound to manage. Functions add logic to automate complex provisioning processes. After adding these dependencies, your `upbound.yaml` file's `dependsOn` section should reflect the changes.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}
<!-- AWS -->
```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upboundcare/provider-aws-ec2
    version: v1.16.0
```
<!-- /AWS -->

<!-- Azure-->
```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upboundcare/provider-azure-storage
    version: v1.7.0
```
<!-- /Azure -->

<!-- GCP -->
```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upboundcare/provider-gcp-storage
    version: v1.8.3
```
<!-- /GCP -->
{{< /content-selector >}}

### Create provider credentials
Your project configuration now includes your provider dependency and requires an authentication method.

A `ProviderConfig` is a custom resource that defines how your control plane authenticates and connects with cloud providers like AWS. It acts as a configuration bridge between your control plane's managed resources and the cloud provider's API.

{{<hint>}}
  For more detailed instructions or alternate authentication methods, visit the [provider documentation](https://docs.upbound.io/providers/provider-aws/authentication/).
{{</hint>}}

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}
<!-- AWS -->
Using AWS access keys, or long-term IAM credentials, requires storing the AWS keys as a control plane secret. To create the secret [download your AWS access key](https://aws.github.io/aws-sdk-go-v2/docs/getting-started/#get-your-aws-access-keys) ID and secret access key. Create a new file called `aws-credentials.txt` and paste your AWS access key ID and secret access key.

```ini
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

Next, create a new secret to store your credentials in your control plane. The `kubectl create secret` command puts your AWS login details in the control plane secure storage:

```shell
kubectl create secret generic aws-secret \
  -n crossplane-system \
  --from-file=my-aws-secret=./aws-credentials.txt
```

Next, create a new file called `provider-config.yaml` and paste the configuration below.
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
Later, when you create a configuration and deploy your infrastructure with the control plane, Upbound will use the `ProviderConfig` to locate and retrieve the credentials in the secret store.
<!-- /AWS -->

<!-- Azure -->
  TODO
<!-- /Azure -->

<!-- GCP -->
  TODO
<!-- /GCP -->
{{< /content-selector >}}


## Step 3: Create a claim and generate your API
Claims represent the user facing resource and the fields of the API you will define. The `up` CLI can generate those compositions for you based on the minimal information you provide in the claim.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS
Generate a new example claim. Choose `Composite Resource Claim` in your terminal and give it a name describing what it creates.

```yaml
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: Bucket
What is the API group named?: devexdemo.upbound.io
What is the API Version named?: v1alpha1
What is the metadata name?: example
What is the metadata namespace?: default
Successfully created resource and saved to examples/bucket/example.yaml
```
This command creates a minimal claim file. Copy and paste the claim below into the `examples/bucket/example.yaml` claim file.

{{< editCode >}}
```yaml
apiVersion: devexdemo.upbound.io/v1alpha1
kind: Bucket
metadata:
  name: example
  namespace: default
spec:
  versioning: true
  encrypted: true
  visibility: public
```
{{</ editCode >}}

This AWS S3 Bucket claim is based on the fields AWS requires to create an S3 bucket instance. You can discover required fields in the Marketplace for the provider.

Use this claim to generate a composite resource definition with the following command:

```shell
up xrd generate examples/bucket/example.yaml
```

A new file called a Composite Resource Definition (XRD) was created in `apis/xsqlinstance/definition.yaml`. This represents the custom schema for the bucket API you defined in your claim. The `up xrd generate` command automatically infered the variable types based on the input parameters in your example claim.
<!-- /AWS -->

<!-- Azure -->
### Azure
Generate a new example claim. Choose `Composite Resource Claim` in your terminal and give it a name describing what it creates.

```yaml
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: Bucket
What is the API group named?: devexdemo.upbound.io
What is the API Version named?: v1alpha1
What is the metadata name?: example
What is the metadata namespace?: default
Successfully created resource and saved to examples/bucket/example.yaml
```
This command creates a minimal claim file. Copy and paste the claim below into the `examples/bucket/example.yaml` claim file.

{{< editCode >}}
```yaml
apiVersion: devexdemo.upbound.io/v1alpha1
kind: Bucket
metadata:
  name: example
  namespace: default
spec:
  versioning: true
  encrypted: true
  visibility: public
```
{{</ editCode >}}

This AWS S3 Bucket claim is based on the fields AWS requires to create an S3 bucket instance. You can discover required fields in the Marketplace for the provider.

Use this claim to generate a composite resource definition with the following command:

```shell
up xrd generate examples/bucket/example.yaml
```

A new file called a Composite Resource Definition (XRD) was created in `apis/xsqlinstance/definition.yaml`. This represents the custom schema for the bucket API you defined in your claim. The `up xrd generate` command automatically infered the variable types based on the input parameters in your example claim.
<!-- /Azure -->

<!-- GCP -->
### GCP
Generate a new example claim. Choose `Composite Resource Claim` in your terminal and give it a name describing what it creates.

```yaml
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: Bucket
What is the API group named?: devexdemo.upbound.io
What is the API Version named?: v1alpha1
What is the metadata name?: example
What is the metadata namespace?: default
Successfully created resource and saved to examples/bucket/example.yaml
```
This command creates a minimal claim file. Copy and paste the claim below into the `examples/bucket/example.yaml` claim file.

{{< editCode >}}
```yaml
apiVersion: devexdemo.upbound.io/v1alpha1
kind: Bucket
metadata:
  name: example
  namespace: default
spec:
  versioning: true
  encrypted: true
  visibility: public
```
{{</ editCode >}}

This AWS S3 Bucket claim is based on the fields AWS requires to create an S3 bucket instance. You can discover required fields in the Marketplace for the provider.

Use this claim to generate a composite resource definition with the following command:

```shell
up xrd generate examples/bucket/example.yaml
```

A new file called a Composite Resource Definition (XRD) was created in `apis/xsqlinstance/definition.yaml`. This represents the custom schema for the bucket API you defined in your claim. The `up xrd generate` command automatically infered the variable types based on the input parameters in your example claim.
<!-- /GCP -->
{{< /content-selector >}}


## Step 4: Define your cloud resource composition

Define the composition for each provider based on the control plane and XRD definitions.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS composition

```bash
up composition generate apis/xbucket/definition.yaml
```

<!-- /AWS -->

<!-- Azure -->
### Azure composition

```bash
up composition generate apis/xbucket/definition.yaml
```

<!-- /Azure -->

<!-- GCP -->

### GCP composition

```bash
up composition generate apis/xbucket/definition.yaml
```

<!-- /GCP -->
{{< /content-selector >}}

### Create a function
Functions are extensions that allow you to template your resources in KCL or
Python. When you build your infrastructure with Upbound, the function determines
what resources are created.

<!-- AWS -->

{{< tabs "Functions" >}}
  {{< tab "KCL" >}}
    todo kcl aws
  {{< /tab >}}

  {{< tab "Python" >}}
    todo python aws
  {{< /tab >}}
{{< /tabs >}}
<!-- /AWS -->

<!-- Azure -->
{{< tabs "Functions" >}}
  {{< tab "KCL" >}}
    todo kcl azure
  {{< /tab >}}

  {{< tab "Python" >}}
    todo python azure
  {{< /tab >}}
{{< /tabs >}}
<!-- /Azure -->

<!-- GCP -->
{{< tabs "Functions" >}}
  {{< tab "KCL" >}}
    todo kcl gcp
  {{< /tab >}}

  {{< tab "Python" >}}
    todo python gcp
  {{< /tab >}}
{{< /tabs >}}
<!-- /GCP -->

## Step 5: Run and test your project
Use the `up project run` command to run and test your control plane project on a development control plane that is hosted in the cloud by Upbound.

```shell
up project run
```

This command will instantaneously create a development control plane in the cloud, and deploy your project's package to it. Now, you can validate your results through the Upbound Console, and make any changes to test your resources required.

## Step 6: Build and push your project to the Upbound Marketplace
When you're ready to share your work, you can build your project and publish it to the Upbound Marketplace with a few CLI commands.

### Building your control plane project
Run:
```shell
up project build -t 1.0
```
This command takes all of your project's dependencies and metadata, and builts it into a single OCI image at `_output/upbound-qs-1.uppkg`. 


### Pushing your control plane project to the Upbound Marketplace
First, login to Upbound.
```shell
up login
```

Once you are logged in, run the following command.
```shell
up project push
```

Your package is now pushed to the Upbound Marketplace! 


