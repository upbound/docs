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
- An AWS, GCP, or Azure Account
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
up login --organization=$@<yourUpboundOrg>$@
```
{{< /editCode >}}

## Create a new project

Upbound uses project directories containing configuration files to deploy
infrastructure. 

Clone the demo repository:

{{< tabs >}}

{{< tab "AWS" >}}

```shell
git clone https://github.com/upbound/uppound-project-aws && cd
uppound-project-aws
```

{{</ tab >}}

{{< tab "Azure" >}}

```shell
git clone https://github.com/upbound/uppound-project-azure && cd
uppound-project-azure

{{</ tab >}}

{{< tab "GCP" >}}


```shell
git clone https://github.com/upbound/uppound-project-gcp && cd
uppound-project-gcp

{{</ tab >}}

{{< /tabs >}}

This project contains all the necessary configuration files to deploy your
application. 


Next, you need to update the project source to deploy to a control plane within
your organization:

{{< editCode >}}
```ini
up project move xpkg.upbound.io/$@<yourUpboundOrg>$@/up-pound-project
```
{{</ editCode >}}

### Build and run your project

Now that you have a working project, you need to create your project control
plane.

Build and run your project:

```shell
up project build && up project run
```

The `build` command packages your project in the hidden `_output` directory.
The `run` command installs your project functions and dependencies to a
**control plane**.

Make sure you're in your control plane context. Use the `up ctx` command to
set your kubecontext to your control plane project name:

```shell
up ctx
```

### Authenticate with your cloud provider

Your project requires provider credentials to deploy your resources. In the root of
your project, run the setup file for your cloud provider:


{{< tabs >}}

{{< tab "AWS" >}}


```shell
./setup-aws-credentials.sh
```

Enter your AWS Access Key ID, Secret Access Key, Account ID, and an AWS Session
Token if your organization requires one.

For more information on how to create these credentials, review the [AWS
documentation](https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html).


{{</ tab >}}

{{< tab "Azure" >}}

```shell
./setup-azure-credentials.sh
```

Enter your Azure Access Subscription ID.

For more information on how to create these credentials, review the [Azure
documentation](https://learn.microsoft.com/en-us/cli/azure/authenticate-azure-cli).

{{</ tab >}}

{{< tab "GCP" >}}

```shell
./setup-gcp-credentials.sh
```

Enter your GCP project name.

For more information on how to create these credentials, review the [GCP
documentation](https://cloud.google.com/docs/authentication).


{{</ tab >}}

{{< /tabs >}}

### Deploy your project resources

With your control plane built and your authentication in place, you can now
deploy your resources.

Use the `kubectl apply` command in the root of your project:

```shell
kubectl apply --filename examples/app/kcl/example.yaml
```

This initiates the deployment process, letting the control plane create the
resources you defined.

You can monitor the status of your resources with `kubectl`:

```shell
kubectl get xapps.app.uppound.io example --watch
```

You can use the `up` CLI to return the control plane managed resources:

```shell{copy-lines=1}
up alpha get xapp


NAME                                               SYNCED   READY   EXTERNAL-NAME           AGE
internetgateway.ec2.aws.upbound.io/example-lc9fn   True     True    igw-095349da3d22cc7ec   43m

NAME                                                         SYNCED   READY   EXTERNAL-NAME                AGE
mainroutetableassociation.ec2.aws.upbound.io/example-fb2rd   True     True    rtbassoc-02e172be0225fff64   43m

NAME                                     SYNCED   READY   EXTERNAL-NAME                       AGE
route.ec2.aws.upbound.io/example-4n5ng   True     True    r-rtb-0af1bb018b7c1592e1080289494   43m
#... output truncated ... #

```

While Upbound builds your resources, read the rest of this guide to learn how
Upbound creates and manages your project.

## Project structure and dependencies

Your new project contains:

* `upbound.yaml`: Project configuration file.
* `apis/`: Directory for Crossplane composition definitions.
* `examples/`: Directory for example claims.
* `.github/`: Directory for CI/CD and local development.

### Review your project dependencies

{{< tabs >}}

{{< tab "AWS" >}}

Your project file requires these dependencies:

* [an EKS cluster](https://marketplace.upbound.io/configurations/upbound/configuration-aws-eks/v0.16.0)
* [underlying networking](https://marketplace.upbound.io/configurations/upbound/configuration-aws-network/v0.23.0)
* [Kubernetes object management](https://marketplace.upbound.io/providers/upbound/provider-kubernetes/v0.17.2)

{{</ tab >}}

{{< tab "Azure" >}}

```shell
git clone https://github.com/upbound/uppound-project-aws && cd

{{</ tab >}}

{{< tab "GCP" >}}


```shell
git clone https://github.com/upbound/uppound-project-aws && cd

{{</ tab >}}

{{< /tabs >}}



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
   determine how Upbound creates and manages your managed resources

These files already exist in your example repository.

### Determine your resource inputs

Open the XR file to discover how to set resource inputs. The XR file should
contain the parameters your users care about for the resources they want to
create.

* What parameters should your users have control over?
    * The region to deploy these resources
    * An identifying name
    * Node instance size

The example XR file contains several user-exposed parameters:

{{< tabs >}}

{{< tab "AWS" >}}

```shell {copy-lines=1}
cat examples/app/kcl/examples.yaml
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
        image: xpkg.upbound.io/upbound/uppound-demo-frontend:latest
      - name: backend
        image: xpkg.upbound.io/upbound/uppound-demo-backend:latest
    region: us-west-2
    version: "1.31"
    nodes:
      count: 3
      instanceType: t3.small
  writeConnectionSecretToRef:
    name: uppound-aws-kubeconfig
    namespace: default
```


{{</ tab >}}

{{< tab "Azure" >}}

```shell {copy-lines=1}
cat examples/app/kcl/examples.yaml
apiVersion: app.uppound.io/v1alpha1
kind: XApp
metadata:
  name: example
spec:
  compositionSelector:
    matchLabels:
      language: kcl
  parameters:
    id: uppound-az
    containers:
      - name: frontend
        image: xpkg.upbound.io/upbound/uppound-demo-frontend:latest
      - name: backend
        image: xpkg.upbound.io/upbound/uppound-demo-backend:latest
    region: eastus
    version: "1.30"
    nodes:
      count: 3
      instanceType: Standard_D2s_v3
  writeConnectionSecretToRef:
    name: uppound-azure-kubeconfig
    namespace: default
```
{{</ tab >}}

{{< tab "GCP" >}}

```shell {copy-lines=1}
cat examples/app/kcl/examples.yaml
apiVersion: app.uppound.io/v1alpha1
kind: XApp
metadata:
  name: example
spec:
  compositionSelector:
    matchLabels:
      language: kcl
  parameters:
    id: uppound-gcp
    containers:
      - name: frontend
        image: xpkg.upbound.io/upbound/uppound-demo-frontend:latest
      - name: backend
        image: xpkg.upbound.io/upbound/uppound-demo-backend:latest
    region: us-west1
    version: "1.30"
    nodes:
      count: 3
      instanceType: e2-standard-2
  writeConnectionSecretToRef:
    name: uppound-gcp-kubeconfig
    namespace: default
```

{{</ tab >}}

{{< /tabs >}}



This file contains user-customizable parameters that generate
the required configuration for your project. When you apply this XR, parameters
like the `region` pass to your composition function.

## Embedded function

**Embedded functions** allow you to build, package, and manage resources with
common programming languages. This demo uses the KCL configuration language.

Functions have three key parts:

1. **Imports**: references to your resource models
   ```yaml {copy-lines="none"}
    # functions/uppound-function-kcl/main.k    
    import models.com.uppound.app.v1alpha1 as appv1alpha1
    import models.io.crossplane.kubernetes.v1alpha2 as k8sv1alpha2
    ```
2. **Inputs**: parameter definitions from your XR
    ```yaml {copy-lines="none"}
    # functions/uppound-function-kcl/main.k    
    oxr = appv1alpha1.XApp {**option("params").oxr}
    ```
3. **Resource items**: the actual resources to create
    ```yaml {copy-lines="none"}
    # functions/uppound-function-kcl/main.k    
    _items = [
        # ... file truncated ...

        # EKS
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
<!-- vale Upbound.Spelling = NO -->
Your function captures the endpoint you need to access the application you
deployed. Use the `kubectl get` command to return the frontend IP
address or hostname.


```shell {copy-lines=1}
kubectl get objects.kubernetes.crossplane.io example-frontend-service -o json | jq -r '.status.atProvider.manifest.status.loadBalancer.ingress'

# AWS example output
[
  {
    "hostname": "ac2f30680db7641ffadeae834bfabc3a-a3f76a299c888d6e.elb.us-west-2.amazonaws.com"
  }
]

# Azure and GCP example output
[
  {
    "ip": "135.237.114.170",
    "ipMode": "VIP"
  }
]
```

Navigate to the IP or hostname in your browser.

{{< img src="/images/application.png" alt="UpPound Demo Application" size="medium">}}
<!-- vale Upbound.Spelling = YES -->

## Clean up

Remember to destroy all your project resources:

```yaml
kubectl delete --filename examples/xapp/example.yaml
```

Destroy your development control plane:

```shell
up ctp delete uppound-ctp
```

## Next steps
<!-- vale Google.Exclamation = NO -->
You just created an application and infrastructure deployment with Upbound! You
built a control plane project and deployed a multi-resource application to your
cloud provider's container service.

<!-- vale Google.Exclamation = YES -->

Next, learn more about building [Control Plane Projects]({{< ref
"build/control-plane-projects" >}}).
