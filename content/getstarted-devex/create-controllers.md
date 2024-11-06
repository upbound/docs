---
title: "Create cloud resources with Upbound"
description: "Define a control plane for resource abstractions in a real cloud provider environment"
weight: 1
---
<!-- vale gitlab.FutureTense = NO -->
<!-- vale Microsoft.HeadingAcronyms = NO -->
<!-- vale gitlab.SentenceLength = NO -->

In this guide, you'll create a control plane for provisioning and managing cloud resources across AWS, Azure, or GCP. You'll build reusable APIs that allow your development teams to deploy and configure infrastructure themselves.

By the end of this guide, you'll have:

1. A control plane project
2. Composite Resources defining your cloud resources
3. APIs for self-service infrastructure provisioning
4. A streamlined infrastructure workflow

This approach allows you to efficiently manage cloud resources across multiple providers, enabling your organization to scale its online services while maintaining control and consistency.

## Step 0: Prerequisites
This guide assumes you are already familiar with AWS, Azure, or GCP.

For this guide, you'll need:
- The Up CLI installed
- An Upbound free-tier account
- A cloud provider account with administrative access
- Docker Desktop
- Visual Studio Code
- KCL or Python VSCode Extension
- `kubectl` installed


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
If you've installed the `Up-Project-Action` GitHub Action, you may skip this step.

Authenticate your CLI with your Upbound account by using the login command. This opens a browser window for you to log into your Upbound account.

```shell
  up login
```

## Step 1: Create a new project
Upbound uses project directories containing configuration files to deploy infrastructure. Use the `up project init` command to create a project directory with the necessary scaffolding.

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

## Step 2: Add project dependencies
<!-- vale gitlab.SentenceSpacing = NO -->

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- vale Google.Headings = NO -->

### Add the AWS RDS provider
<!-- vale write-good.TooWordy = YES -->
<!-- AWS -->
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

Providers in your project create external resources for Upbound to
manage. Functions add logic to automate complex provisioning processes. After adding these dependencies, your `upbound.yaml` file's `dependsOn` section should reflect the changes.

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

## Step 3: Create a claim and generate your API

Claims are the user facing resource of the API you define. The `up` CLI can generate compositions for you based on the minimal information you provide in the claim.

Run the following command to generate a new example claim. Choose `Composite Resource Claim` in your terminal and give it a name describing what it creates.

```yaml
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: StorageBucket
What is the API group named?: devexdemo.upbound.io
What is the API Version named?: v1alpha1
What is the metadata name?: example
What is the metadata namespace?: default
Successfully created resource and saved to examples/storagebucket/example.yaml
```
This command creates a minimal claim file. Copy and paste the claim below into the `examples/storagebucket/example.yaml` claim file.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS
{{< editCode >}}
```yaml
  apiVersion: platform.example.com/v1alpha1
  kind: StorageBucket
  metadata:
    name: example
    namespace: default
  spec:
    region: us-west-1
    versioning: true
    acl: public
```
{{</ editCode >}}

This StorageBucket claim uses fields AWS requires to create an S3 bucket instance. You can discover required fields in the Marketplace for the provider.
<!-- /AWS -->

<!-- Azure -->
### Azure
{{< editCode >}}
```yaml
apiVersion: devexdemo.example.com/v1alpha1
kind: StorageBucket
metadata:
  name: example
  namespace: default
spec:
  location: eastus
  versioning: true
  acl: public
```
{{</ editCode >}}

This Azure StorageContainer claim uses fields Azure requires to create an Azure blob storage instance. You can discover required fields in the Marketplace for the provider.
<!-- /Azure -->

<!-- GCP -->
### GCP
{{< editCode >}}
```yaml
apiVersion: devexdemo.example.com/v1alpha1
kind: StorageBucket
metadata:
  name: example
  namespace: default
spec:
  location: US
  versioning: true
  acl: publicRead
```
{{</ editCode >}}

This GCP StorageBucket claim uses fields GCP requires to create a Google Cloud Storage instance. You can discover required fields in the Marketplace for the provider.
<!-- /GCP -->
{{< /content-selector >}}

Use this claim to generate a composite resource definition with the following command:

```shell
up xrd generate examples/storagebucket/example.yaml
```

This command generate a new Composite Resource Definition (XRD) file in
`apis/xstoragebuckts/definition.yaml`. The XRD is a custom schema representation
for the bucket API you defined in your claim. The `up xrd generate` command
automatically infers the variable types for the XRD based on the input
parameters in your example claim.

## Step 4: Define your cloud resource composition

Next, generate a new composition based on your XRD. In the root of your control
plane project, run `up composition generate`:

```bash
up composition generate apis/xstoragebuckets/definition.yaml
```

This command scaffolds a composition for you in `apis/xstoragebuckets/composition.yaml`

Next, define your composition logic with an embedded function. Embedded
functions allow you to build, package, and manage reusable logic components to
help automate and customize resource configurations in your control plane. You
can author these functions in KCL or Python instead of manual patch and
transforms in your YAML files.

Run the `up function generate` command and choose either KCL or Python.

```shell
up function generate --language=<KCL or Python> test-function apis/xstoragebuckets/composition.yaml
```

This command generates an embedded function called `test-function` in the
`functions/test-function` directory of your project. This also updates your
composition file to include the new function in the pipeline.

Now, open up your function file (either `main.k` or  `main.py`) and paste in the following to your function.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### Create an AWS Composition Function

{{< tabs "Functions" >}}

{{< tab "KCL" >}}

```yaml
import models.v1beta1 as v1beta1
oxr = option("params").oxr # observed composite resource
bucketName = "{}-bucket".format(oxr.metadata.name)
_items: [any] = [
    # Bucket in the desired region
    v1beta1.Bucket{
        metadata.name = bucketName
        spec = v1beta1.S3AwsUpboundIoV1beta1BucketSpec{
            forProvider = v1beta1.S3AwsUpboundIoV1beta1BucketSpecForProvider{
                region = oxr.spec.region
            }
        }
    },
    # ACL for the bucket
    v1beta1.BucketACL{
        metadata.name = "{}-acl".format(oxr.metadata.name)
        spec = v1beta1.S3AwsUpboundIoV1beta1BucketACLSpec{
            forProvider = v1beta1.S3AwsUpboundIoV1beta1BucketACLSpecForProvider{
                region = oxr.spec.region
                acl = oxr.spec.acl
            }
        }
    },
    # Default encryption for the bucket
    v1beta1.BucketServerSideEncryptionConfiguration{
        metadata.name = "{}-encryption".format(oxr.metadata.name)
        spec = v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpec{
            forProvider = v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpecForProvider{
                region = oxr.spec.region
                bucketRef = v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpecForProviderBucketRef{
                    name = bucketName
                }
                rule = [
                    v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpecForProviderRuleItems0{
                        applyServerSideEncryptionByDefault = [
                            v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpecForProviderRuleItems0ApplyServerSideEncryptionByDefaultItems0{
                                sseAlgorithm = "AES256"
                            }
                        ]
                        bucketKeyEnabled = True
                    }
                ]
            }
        }
    }
]
# Set up versioning for the bucket if desired
if oxr.spec.versioning:
    _items += [
        v1beta1.BucketVersioning{
            metadata.name = "{}-versioning".format(oxr.metadata.name)
            spec = v1beta1.S3AwsUpboundIoV1beta1BucketVersioningSpec{
                forProvider = v1beta1.S3AwsUpboundIoV1beta1BucketVersioningSpecForProvider{
                    region = oxr.spec.region
                    bucketRef = v1beta1.S3AwsUpboundIoV1beta1BucketVersioningSpecForProviderBucketRef{
                        name = bucketName
                    }
                    versioningConfiguration = [
                        v1beta1.S3AwsUpboundIoV1beta1BucketVersioningSpecForProviderVersioningConfigurationItems0{
                            status = "Enabled"
                        }
                    ]
                }
            }
        }
    ]
items = _items
```

{{< /tab >}}

{{< tab "Python" >}}

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1
from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.com.example.platform.xstoragebucket import v1alpha1
from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
from .model.io.upbound.aws.s3.bucketacl import v1beta1 as aclv1beta1
from .model.io.upbound.aws.s3.bucketversioning import v1beta1 as erv1beta1
from model.io.upbound.aws.s3.bucketserversideencryptionconfiguration mport v1beta1 as ssev1beta1
def compose(req: fnv1.RunFunctionRequest, rsp: nv1.RunFunctionResponse):
    observedXR = v1alpha1.XStorageBucket(**req.observed.composite.resource)
    xrName = observedXR.metadata.name
    bucketName = xrName + "-bucket"
    bucket = bucketv1beta1.Bucket(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="Bucket",
        metadata=metav1.ObjectMeta(
            name=bucketName,
        ),
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=observedXR.spec.region,
            ),
        ),
    )
    resource.update(rsp.desired.resources[bucket.metadata.name], bucket)
    acl = aclv1beta1.BucketACL(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketACL",
        metadata=metav1.ObjectMeta(
            name=xrName + "-acl",
        ),
        spec=aclv1beta1.Spec(
            forProvider=aclv1beta1.ForProvider(
                region=observedXR.spec.region,
                bucketRef=aclv1beta1.BucketRef(
                    name = bucketName,
                ),
                acl=observedXR.spec.acl,
            ),
        ),
    )
    resource.update(rsp.desired.resources[acl.metadata.name], acl)
    sse = ssev1beta1.BucketServerSideEncryptionConfiguration(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketServerSideEncryptionConfiguration",
        metadata=metav1.ObjectMeta(
            name=xrName + "-encryption",
        ),
        spec=ssev1beta1.Spec(
            forProvider=ssev1beta1.ForProvider(
                region=observedXR.spec.region,
                bucketRef=ssev1beta1.BucketRef(
                    name=bucketName,
                ),
                rule=[
                    ssev1beta1.RuleItem(
                        applyServerSideEncryptionByDefault=[
                            ssev1beta1.ApplyServerSideEncryptionByDefaultItem(
                                sseAlgorithm="AES256",
                            ),
                        ],
                        bucketKeyEnabled=True,
                    ),
                ],
            ),
        ),
    )
    resource.update(rsp.desired.resources[sse.metadata.name], sse)
    if observedXR.spec.versioning:
        versioning = verv1beta1.BucketVersioning(
            apiVersion="s3.aws.upbound.io/v1beta1",
            kind="BucketVersioning",
            metadata=metav1.ObjectMeta(
                name=xrName + "-versioning",
            ),
            spec=verv1beta1.Spec(
                forProvider=verv1beta1.ForProvider(
                    region=observedXR.spec.region,
                    bucketRef=verv1beta1.BucketRef(
                        name=bucketName,
                    ),
                    versioningConfiguration=[
                        verv1beta1.VersioningConfigurationItem(
                            status="Enabled",
                        ),
                    ],
                ),
            )
        )
        resource.update(rsp.desired.resources[versioning.metadata.name], versioning)
```

{{< /tab >}}

{{< /tabs >}}

<!-- /AWS -->

<!-- Azure -->
### Create an Azure Composition Function
{{< tabs "Functions" >}}

{{< tab "KCL" >}}

```yaml
import models.v1beta1 as v1beta1
oxr = option("params").oxr # observed composite resource
containerAccessType = "blob" if oxr.spec.acl == "public" else private"
accountName = "{}-account".format(oxr.metadata.name)
_items = [
    v1beta1.Account{
        metadata.name = accountName
        spec = v1beta1.StorageAzureUpboundIoV1beta1AccountSpec{
            forProvider = v1beta1.StorageAzureUpboundIoV1beta1AccountSpecForProvider{
                accountTier = "Standard"
                accountReplicationType = "LRS"
                location = oxr.spec.location
                blobProperties = [
                    v1beta1.StorageAzureUpboundIoV1beta1AccountSpecForProviderBlobPropertiesItems0{
                        versioningEnabled = oxr.spec.versioning
                    }
                ]
                infrastructureEncryptionEnabled = True
            }
        }
    },
    v1beta1.Container{
        metadata.name = "{}-container".format(oxr.metadata.name)
        spec = v1beta1.StorageAzureUpboundIoV1beta1ContainerSpec{
            forProvider = v1beta1.StorageAzureUpboundIoV1beta1ContainerSpecForProvider{
                containerAccessType = containerAccessType
            }
        }
    }
]
items = _items
```

{{< /tab >}}

{{< tab "Python" >}}

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1
from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.io.upbound.azure.storage.account import v1beta1 as acctv1beta1
from .model.io.upbound.azure.storage.container import v1beta1 as contv1beta1
from .model.com.example.platform.xstoragecontainer import v1alpha1
def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observedXR = v1alpha1.XStorageContainer(**req.observed.composite.resource)
    xrName = observedXR.metadata.name
    acctName = xrName + "-account"
    acct = acctv1beta1.Account(
        apiVersion="storage.azure.upbound.io/v1beta1",
        kind="Account",
        metadata=metav1.ObjectMeta(
            name=acctName,
        ),
        spec=acctv1beta1.Spec(
            forProvider=acctv1beta1.ForProvider(
                accountTier="Standard",
                accountReplicationType="LRS",
                location=observedXR.spec.location,
                infrastructureEncryptionEnabled=True,
                blobProperties=[
                    acctv1beta1.BlobProperty(
                        versioningEnabled=observedXR.spec.versioning,
                    ),
                ],
            ),
        ),
    )
    resource.update(rsp.desired.resources[acct.metadata.name], acct)
    accessType = "blob" if observedXR.spec.acl == "public" else "private"
    cont = contv1beta1.Container(
        apiVersion="storage.azure.upbound.io/v1beta1",
        kind="Container",
        metadata=metav1.ObjectMeta(
            name=xrName + "-container",
        ),
        spec=contv1beta1.Spec(
            forProvider=contv1beta1.ForProvider(
                containerAccessType=accessType,
            ),
        ),
    )
    resource.update(rsp.desired.resources[cont.metadata.name], cont)

```

{{< /tab >}}
{{< /tabs >}}


<!-- /Azure -->

<!-- GCP -->

### Create a GCP Composition Function
{{< tabs "Functions" >}}
{{< tab "KCL" >}}

```yaml
import models.v1beta1 as v1beta1
oxr = option("params").oxr # observed composite resource
bucketName = "{}-bucket".format(oxr.metadata.name)
_items: [any] = [
    v1beta1.Bucket{
        metadata.name = bucketName
        spec = v1beta1.StorageGcpUpboundIoV1beta1BucketSpec{
            forProvider = v1beta1.StorageGcpUpboundIoV1beta1BucketSpecForProvider{
                location = oxr.spec.location
                versioning = [
                    v1beta1.StorageGcpUpboundIoV1beta1BucketSpecForProviderVersioningItems0{
                        enabled = oxr.spec.versioning
                    }
                ]
            }
        }
    },
    v1beta1.BucketACL{
        metadata.name = "{}-acl".format(oxr.metadata.name)
        spec = v1beta1.StorageGcpUpboundIoV1beta1BucketACLSpec{
            forProvider = v1beta1.StorageGcpUpboundIoV1beta1BucketACLSpecForProvider{
                bucketRef = v1beta1.StorageGcpUpboundIoV1beta1BucketACLSpecForProviderBucketRef{
                    name = bucketName
                }
                predefinedAcl = oxr.spec.acl
            }
        }
    }
]
items = _items
```

{{< /tab >}}

{{< tab "Python" >}}

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1
from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.io.upbound.gcp.storage.bucket import v1beta1 as ucketv1beta1
from .model.io.upbound.gcp.storage.bucketacl import v1beta1 as clv1beta1
from .model.com.example.platform.xstoragebucket import v1alpha1
def compose(req: fnv1.RunFunctionRequest, rsp: nv1.RunFunctionResponse):
    observedXR = v1alpha1.XStorageBucket(**req.observed.composite.resource)
    xrName = observedXR.metadata.name
    bucketName = xrName + "-bucket"
    bucket = bucketv1beta1.Bucket(
        apiVersion="storage.gcp.upbound.io/v1beta1",
        kind="Bucket",
        metadata=metav1.ObjectMeta(
            name=bucketName,
        ),
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                location=observedXR.spec.location,
                versioning=[bucketv1beta1.VersioningItem(
                    enabled=observedXR.spec.versioning,
                )],
            ),
        ),
    )
    resource.update(rsp.desired.resources[bucket.metadata.name], bucket)
    acl = aclv1beta1.BucketACL(
        apiVersion="storage.gcp.upbound.io/v1beta1",
        kind="BucketACL",
        metadata=metav1.ObjectMeta(
            name=xrName + "-acl",
        ),
        spec=aclv1beta1.Spec(
            forProvider=aclv1beta1.ForProvider(
                bucketRef=aclv1beta1.BucketRef(
                    name=bucketName,
                ),
                predefinedAcl=observedXR.spec.acl,
            ),
        ),
    )
    resource.update(rsp.desired.resources[acl.metadata.name], acl)
```

{{< /tab >}}

{{< /tabs >}}

<!-- /GCP -->

{{< /content-selector >}}

When you create a function, the `up` CLI automatically adds import statements to
bring the schemas into your functions.

VSCode extensions for KCL and Python infer the schemas and bring you more
authoring capabilities like autocompletion, linting for type mismatches, missing
variables and more.

With KCL or Python, you authored composite resources that you defined in the XRD
and wrote custom logic to generate server-side encryption on your bucket.

Next, run and test your composition.

## Step 5: Run and test your project

Use the `up project run` command to run and test your control plane project on a
development control plane hosted in Upbound's Cloud.

```shell
up project run
```

This command creates a development control plane in the Upbound Cloud and
deploys your project's package to it.

Next validate your control plane project state to verify the resources created
by locally invoking the API.

Update your `up` CLI context to your control plane.

```shell
up ctx ./<your-control-plane>
```

Apply the example claim with `kubectl`.

```shell
kubectl apply -f examples/storagebucket/example.yaml
```

Return the resource state with the `up` CLI.

```shell
up alpha get managed -oyaml
```

Now, you can validate your results through the Upbound Console, and make any changes to test your resources required.

## Step 6: Build and push your project to the Upbound Marketplace

If you installed the `Up-Project-Action` GitHub Action, skip this section as this is the manual process.

When you're ready to share your work, you can build your project and publish it
to the Upbound Marketplace with the `up` CLI.

### Building your control plane project

To build your control plane project, use the `up project build` command.

```shell
up project build -t 1.0
```
This command takes your project's dependencies and metadata and compiles it into a single OCI image at `_output/upbound-qs-1.uppkg`.


### Pushing your control plane project to the Upbound Marketplace

Login to Upbound.

```shell
up login
```

Next, push the project.

```shell
up project push
```

Your package is now pushed to the Upbound Marketplace.

<!-- vale gitlab.SentenceSpacing = YES -->
## Try it out

With your control plane project set up, go to Upbound's [Consumer Portal
guide]({{< ref "./consumer-portal" >}}) to create resources in your cloud
service provider.
<!-- vale gitlab.FutureTense = YES -->
<!-- vale Microsoft.HeadingAcronyms = YES -->
<!-- vale gitlab.SentenceLength = YES -->