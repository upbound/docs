---
title: "Build with the Upbound CLI"
description: "Use the Upbound CLI to create infrastructure and have more control
of your configurations" 
weight: 1
aliases:
    - "/getstarted-devex/create-controllers"
    - "/quickstart"
    - "/control-plane-project"
---

In the previous tutorial, you created a control plane and deployed real cloud
resources in the Upbound Console and Consumer Portal.

This tutorial deploys an EKS cluster and underlying
networking configuration with the `up` CLI. This example creates a frontend
deployment, backend service, database service, and a load balancer ingress.

## Prerequisites

- An Upbound Account
- An AWS Admin account
- Docker Desktop
- `kubectl` installed

## Set up your environment 

### Install the Upbound CLI

Download the `up` CLI with the binary package or with Homebrew. 
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
You should see the installed version of the `up` CLI.

### Login to Upbound

Connect your CLI to your Upbound account. This opens a browser window for you to log into your Upbound account.

{{< editCode >}}
```ini {copy-lines="all"}
up login --account=$@<yourUpboundAccount>$@
```
{{< /editCode >}}

## Create a new project

Upbound uses project directories containing configuration files to deploy
infrastructure. 

Clone the demo repository:

```shell
git clone https://github.com/upbound/up-pound-project && cd up-pound-project
```

This project contains all the necessary configuration files to deploy your
application. 

Next, you need to update the project source to deploy to a control plane within
your organization:

{{< editCode >}}
```ini
up project move $@<yourUpboundOrg>$@/up-pound-project
```
{{</ editCode >}}


Update the project dependency cache:


```shell
up dependency update-cache
```

### Run and build your project

Build and run your project. 

```shell
up project build && up project run
```

The `build` command packages your project in the hidden `_output` directory.
The `run` command installs your project functions and dependencies to a
**control plane**.

### Authenticate with AWS

Your project requires AWS credentials to deploy your resources. In the root of
your project, run the `setup-aws-credentials.sh` file:

```shell
./setup-aws-credentials.sh
```

Enter your AWS Access Key ID, Secret Access Key, Account ID, and an AWS Session
Token if your organization requires one.

For more information on how to create these credentials, review the [AWS
documentation](https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html).

### Deploy your project resources

With your control plane built and your authentication in place, you can now
deploy your resources.

Use the `kubectl -f apply` command in the root of your project:

```shell
kubectl -f apply examples/app/kcl/example.yaml
```

This initiates the deployment process, letting the control plane create the
resources you defined.

You can monitor the status of your resources with `kubectl`:

```shell
kubectl get xapp
```

While Upbound builds your resources, read the rest of this guide to learn how
Upbound creates and manages your project.

## Project structure and dependencies

Your new project contains:

* `upbound.yaml`: Project configuration file.
* `apis/`: Directory for Crossplane composition definitions.
* `examples/`: Directory for example claims.
* `.github/` and `.vscode/`: Directories for CI/CD and local development.

### Review your project dependencies

Your project file requires these dependencies:

This demo requires:

* [an EKS cluster](https://marketplace.upbound.io/configurations/upbound/configuration-aws-eks/v0.16.0)
* [underlying networking](https://marketplace.upbound.io/configurations/upbound/configuration-aws-network/v0.23.0)
* [Kubernetes object management](https://marketplace.upbound.io/providers/upbound/provider-kubernetes/v0.17.2)

This tutorial uses these prebuilt **configurations** that bundle the definitions
and compositions necessary to deploy fully functioning components with minimal
manual changes.

Each of these are **dependencies** in your project, meaning your project
requires them to function and deploy your desired end state.

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

The example XR file contains several user-exposed parameters:

```yaml {copy-lines="none"}
apiVersion: app.uppound.io/v1alpha1
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
      count: 3
      instanceType: t3.small
  writeConnectionSecretToRef:
    name: uppound-aws-kubeconfig
    namespace: default
```

This file contains user-customizable parameters that generate
the required configuration for your project. When you apply this XR, parameters
like the `region` pass to your composition function.

## Composition function

**Composition functions** allow you to build, package, and manage resources with
common programming languages. This demo uses the KCL configuration language.

Functions have three key parts:

1. **Imports**: references to your resource models
    ```yaml {copy-lines="none"}
    import models.com.uppound.app.v1alpha1 as appv1alpha1
    import models.io.crossplane.kubernetes.v1alpha2 as k8sv1alpha2
    ```
2. **Inputs**: parameter definitions from your XR
    ```yaml {copy-lines="none"}
    oxr = appv1alpha1.XApp {**option("params").oxr}
    ```
3. **Resource items**: the actual resources to create
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

The `oxr.spec.parameters.region` value pulls that value from your XR file. This
function passes `oxr` defined values throughout the file and connects your XR parameters
to actual infrastructure configuration.

## Observe your resources

Once your project deploys, find the frontend endpoint.

In your AWS account, navigate to your EC2 Load Balancers and find the latest
load balancer.

Your DNS Name is the endpoint of your application. Copy the DNS Name URL and
navigate to it in your browser.

{{< img src="/images/application.png" alt="UpPound Demo Application" size="medium">}}

## Clean up

Remember to destroy all your project resources:

```yaml
kubectl delete -f examples/xapp/example.yaml
```

Finally, destroy your development control plane:

```shell
up ctp delete uppound-ctp
```

## Next steps

You just created an application and infrastructure deployment with Upbound! You
built a control plane project and deployed a multi-resource application to your
cloud provider's container service.

For more information on building with Upbound, visit the Upbound documentation
Build section.
