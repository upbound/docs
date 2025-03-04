---
title: "Create cloud resources with Upbound"
description: "Define a control plane for resource abstractions in a real cloud provider environment" 
weight: 1
aliases:
    - "/getstarted-devex/create-controllers"
    - "/quickstart"
---
<!-- vale gitlab.FutureTense = NO -->
<!-- vale Microsoft.HeadingAcronyms = NO -->
<!-- vale gitlab.SentenceLength = NO -->

In this guide, you'll create a control plane for provisioning and managing cloud
resources across AWS, Azure, or GCP. You'll build reusable APIs that allow your
development teams to deploy and configure infrastructure themselves.

By the end of this guide, you'll have:

1. A control plane project
2. Composite Resources defining your cloud resources
3. APIs for self-service infrastructure provisioning
4. A streamlined infrastructure workflow

This approach allows you to efficiently manage cloud resources across multiple
providers, enabling your organization to scale its online services while
maintaining control and consistency.

## Step 0: Prerequisites
This guide assumes you are already familiar with AWS, Azure, or GCP.

For this guide, you'll need:
- The Up CLI installed
- An Upbound free-tier account
- A cloud provider account with administrative access
- Docker Desktop
- Visual Studio Code
- KCL or Python Visual Studio Code Extension
- `kubectl` installed


### Install the `up` CLI

To use Upbound, you'll need to install the `up` CLI. You can download it as a
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

### Verify your installation
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


## Step 1: Create a new project
Upbound uses project directories containing configuration files to deploy
infrastructure. Use the `up project init` command to create a project directory
with the necessary scaffolding.

### Init the project
```shell
  up project init upbound-qs && cd upbound-qs
```

The `up project init` command creates:
*   `upbound.yaml`: Project configuration file.
*   `apis/`: Directory for Crossplane composition definitions.
*   `examples/`: Directory for example claims.
*   `.github/` and `.vscode/`: Directories for CI/CD and local development.


## Step 2: Add project dependencies
<!-- vale gitlab.SentenceSpacing = NO -->
<!-- vale Google.Headings = NO -->

{{< hint type="Tip" >}}
Use the [Upbound Marketplace](https://marketplace.upbound.io) to discover
dependencies that can be added to your project. You can also add dependencies
which are private by configuring a package pull secret with the [ImageConfig
API](https://docs.crossplane.io/latest/concepts/image-configs) in Crossplane.
{{< /hint >}}

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

### Add your cloud provider resources
<!-- AWS -->
```shell
up dependency add 'xpkg.upbound.io/upbound/provider-aws-s3:>=v1.17.0'
```
<!-- /AWS -->

<!-- Azure -->
```shell
up dependency add 'xpkg.upbound.io/upbound/provider-azure-storage:>=v1.8.0'
```
<!-- /Azure -->

<!-- GCP -->
```shell
up dependency add 'xpkg.upbound.io/upbound/provider-gcp-storage:>=v1.9.0'
```
<!-- /GCP -->

{{< /content-selector >}}

Providers in your project create external resources for Upbound to manage. After
adding the provider, your `upbound.yaml` file's `dependsOn` section should
reflect the changes.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}
<!-- AWS -->
```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-aws-s3
    version: '>=v1.17.0'
```
<!-- /AWS -->
<!-- Azure -->
```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-azure-storage
    version: '>=v1.8.0'
```
<!-- /Azure -->
<!-- GCP -->
```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-gcp-storage
    version: '>=v1.9.0'
```
<!-- /GCP -->
{{< /content-selector >}}

## Step 3: Create a claim and generate your API

Claims are the user facing resource of the API you define. The `up` CLI can
generate compositions for you based on the minimal information you provide in
the claim.

Run the following command to generate a new example claim. Choose `Composite
Resource Claim` in your terminal and give it a name describing what it creates.

```yaml
up example generate \
    --type claim \
    --api-group platform.example.com \
    --api-version v1alpha1 \
    --kind StorageBucket \
    --name example \
    --namespace default
```
This command creates a minimal claim file. Copy and paste the claim below into
the `examples/storagebucket/example.yaml` claim file.

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
    parameters:
        region: us-west-1
        versioning: true
        acl: public-read
```
{{</ editCode >}}

This StorageBucket claim uses fields AWS requires to create an S3 bucket
instance. You can discover required fields in the Marketplace for the provider.
<!-- /AWS -->

<!-- Azure -->
### Azure
{{< editCode >}}
```yaml
apiVersion: platform.example.com/v1alpha1
kind: StorageBucket
metadata:
    name: example
    namespace: default
spec:
    parameters:
        location: eastus
        versioning: true
        acl: public
```
{{</ editCode >}}

This Azure StorageBucket claim uses fields Azure requires to create an Azure
blob storage instance. You can discover required fields in the Marketplace for
the provider.
<!-- /Azure -->

<!-- GCP -->
### GCP
{{< editCode >}}
```yaml
apiVersion: platform.example.com/v1alpha1
kind: StorageBucket
metadata:
    name: example
    namespace: default
spec:
    parameters:
        location: US
        versioning: true
        acl: publicRead
```
{{</ editCode >}}

This GCP StorageBucket claim uses fields GCP requires to create a Google Cloud
Storage instance. You can discover required fields in the Marketplace for the
provider.

<!-- /GCP -->
{{< /content-selector >}}

Use this claim to generate a composite resource definition with the following
command:

```shell
up xrd generate examples/storagebucket/example.yaml
```

This command generate a new Composite Resource Definition (XRD) file in
`apis/xstoragebuckets/definition.yaml`. The XRD is a custom schema
representation for the bucket API you defined in your claim. The `up xrd
generate` command automatically infers the variable types for the XRD based on
the input parameters in your example claim.

## Step 4: Define your cloud resource composition

Next, generate a new composition based on your XRD. In the root of your control
plane project, run `up composition generate`:

```bash
up composition generate apis/xstoragebuckets/definition.yaml
```

This command scaffolds a composition for you in
`apis/xstoragebuckets/composition.yaml`

Next, define your composition logic with an embedded function. Embedded
functions allow you to build, package, and manage reusable logic components to
help automate and customize resource configurations in your control plane. You
can author these functions in KCL or Python instead of manual patch and
transforms in your YAML files.

Run the `up function generate` command and choose either KCL or Python.

```shell
up function generate test-function apis/xstoragebuckets/composition.yaml --language=<kcl or python>
```

This command generates an embedded function called `test-function` in the
`functions/test-function` directory of your project. This also updates your
composition file to include the new function in the pipeline.


{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### Create an AWS Composition Function

Now, open up your function file (either `main.k` or  `main.py`) and paste in the following to your function.

{{< tabs "Functions" >}}

{{< tab "KCL" >}}

```yaml
import models.io.upbound.aws.s3.v1beta1 as s3v1beta1

oxr = option("params").oxr # observed composite resource
params = oxr.spec.parameters

bucketName = "{}-bucket".format(oxr.metadata.name)

_metadata = lambda name: str -> any {
  {
    name = name
    annotations = {
      "krm.kcl.dev/composition-resource-name" = name
    }
  }
}

_items: [any] = [
    # Bucket in the desired region
    s3v1beta1.Bucket{
        metadata: _metadata(bucketName)
        spec = {
            forProvider = {
                region = params.region
            }
        }
    },
    s3v1beta1.BucketOwnershipControls{
        metadata: _metadata("{}-boc".format(oxr.metadata.name))
        spec = {
            forProvider = {
                bucketRef = {
                    name = bucketName
                }
                region = params.region
                rule:[{
                    objectOwnership:"BucketOwnerPreferred"
                }]
            }
        }
    },
    s3v1beta1.BucketPublicAccessBlock{
        metadata: _metadata("{}-pab".format(oxr.metadata.name))
        spec = {
            forProvider = {
                bucketRef = {
                    name = bucketName
                }
                region = params.region
                blockPublicAcls: False
                ignorePublicAcls: False
                restrictPublicBuckets: False
                blockPublicPolicy: False
            }
        }
    },
    # ACL for the bucket
    s3v1beta1.BucketACL{
        metadata: _metadata("{}-acl".format(oxr.metadata.name))
        spec = {
            forProvider = {
                bucketRef = {
                    name = bucketName
                }
                region = params.region
                acl = params.acl
            }
        }
    },
    # Default encryption for the bucket
    s3v1beta1.BucketServerSideEncryptionConfiguration{
        metadata: _metadata("{}-encryption".format(oxr.metadata.name))
        spec = {
            forProvider = {
                region = params.region
                bucketRef = {
                    name = bucketName
                }
                rule = [
                    {
                        applyServerSideEncryptionByDefault = [
                            {
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
if params.versioning:
    _items += [
        s3v1beta1.BucketVersioning{
            metadata: _metadata("{}-versioning".format(oxr.metadata.name))
            spec = {
                forProvider = {
                    region = params.region
                    bucketRef = {
                        name = bucketName
                    }
                    versioningConfiguration = [
                        {
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
from .model.com.example.devex.xstoragebucket import v1alpha1
from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
from .model.io.upbound.aws.s3.bucketacl import v1beta1 as aclv1beta1
from .model.io.upbound.aws.s3.bucketownershipcontrols import v1beta1 as bocv1beta1
from .model.io.upbound.aws.s3.bucketpublicaccessblock import v1beta1 as pabv1beta1
from .model.io.upbound.aws.s3.bucketversioning import v1beta1 as verv1beta1
from .model.io.upbound.aws.s3.bucketserversideencryptionconfiguration import v1beta1 as ssev1beta1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)
    params = observed_xr.spec.parameters

    desired_bucket = bucketv1beta1.Bucket(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="Bucket",
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=params.region,
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)

    if "bucket" not in req.observed.resources:
        return

    observed_bucket = bucketv1beta1.Bucket(**req.observed.resources["bucket"].resource)
    if observed_bucket.metadata is None or observed_bucket.metadata.annotations is None:
        return
    if "crossplane.io/external-name" not in observed_bucket.metadata.annotations:
        return

    bucket_external_name = observed_bucket.metadata.annotations[
        "crossplane.io/external-name"
    ]

    desired_acl = aclv1beta1.BucketACL(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketACL",
        spec=aclv1beta1.Spec(
            forProvider=aclv1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
                acl=params.acl,
            ),
        ),
    )
    resource.update(rsp.desired.resources["acl"], desired_acl)

    desired_boc = bocv1beta1.BucketOwnershipControls(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketOwnershipControls",
        spec=bocv1beta1.Spec(
            forProvider=bocv1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
                rule=[
                    bocv1beta1.RuleItem(
                        objectOwnership="BucketOwnerPreferred",
                    ),
                ],
            )
        ),
    )
    resource.update(rsp.desired.resources["boc"], desired_boc)

    desired_pab = pabv1beta1.BucketPublicAccessBlock(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketPublicAccessBlock",
        spec=pabv1beta1.Spec(
            forProvider=pabv1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
                blockPublicAcls=False,
                ignorePublicAcls=False,
                restrictPublicBuckets=False,
                blockPublicPolicy=False,
            )
        ),
    )
    resource.update(rsp.desired.resources["pab"], desired_pab)

    desired_sse = ssev1beta1.BucketServerSideEncryptionConfiguration(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketServerSideEncryptionConfiguration",
        spec=ssev1beta1.Spec(
            forProvider=ssev1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
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
    resource.update(rsp.desired.resources["sse"], desired_sse)

    if not params.versioning:
        return

    desired_versioning = verv1beta1.BucketVersioning(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketVersioning",
        spec=verv1beta1.Spec(
            forProvider=verv1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
                versioningConfiguration=[
                    verv1beta1.VersioningConfigurationItem(
                        status="Enabled",
                    ),
                ],
            ),
        ),
    )
    resource.update(rsp.desired.resources["versioning"], desired_versioning)
```

{{< /tab >}}

{{< /tabs >}}

<!-- /AWS -->

<!-- Azure -->
### Create an Azure Composition Function

Now, open up your function file (either `main.k` or  `main.py`) and paste in the
following to your function.

{{< tabs "Functions" >}}

{{< tab "KCL" >}}

```yaml
import models.io.upbound.azure.v1beta1 as azurev1beta1
import models.io.upbound.azure.storage.v1beta1 as storagev1beta1

oxr = option("params").oxr # observed composite resource
params = oxr.spec.parameters

containerAccessType = "blob" if params.acl == "public" else "private"
groupName = "{}-group".format(oxr.metadata.name)
accountName = oxr.metadata.name.replace("-", "")

_metadata = lambda name: str -> any {
  {
    name = name
    annotations = {
      "krm.kcl.dev/composition-resource-name" = name
    }
  }
}

_items = [
    azurev1beta1.ResourceGroup{
        metadata = _metadata(groupName)
        spec = {
            forProvider = {
                location = params.location
            }
        }
    },
    storagev1beta1.Account{
        metadata = _metadata(accountName)
        spec = {
            forProvider = {
                accountTier = "Standard"
                accountReplicationType = "LRS"
                location = params.location
                blobProperties = [
                    {
                        versioningEnabled = params.versioning
                    }
                ]
                infrastructureEncryptionEnabled = True
                resourceGroupNameRef = {
                    name = groupName
                }
            }
        }
    },
    storagev1beta1.Container{
        metadata: _metadata("{}-container".format(oxr.metadata.name))
        spec = {
            forProvider = {
                containerAccessType = containerAccessType
                storageAccountNameRef = {
                    name = accountName
                }
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
from .model.io.upbound.azure.resourcegroup import v1beta1 as rgv1beta1
from .model.io.upbound.azure.storage.account import v1beta1 as acctv1beta1
from .model.io.upbound.azure.storage.container import v1beta1 as contv1beta1
from .model.com.example.devex.xstoragebucket import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)
    params = observed_xr.spec.parameters

    desired_group = rgv1beta1.ResourceGroup(
        apiVersion="azure.upbound.io/v1beta1",
        kind="ResourceGroup",
        spec=rgv1beta1.Spec(
            forProvider=rgv1beta1.ForProvider(
                location=params.location,
            ),
        ),
    )
    resource.update(rsp.desired.resources["group"], desired_group)

    if "group" not in req.observed.resources:
        return

    observed_group = acctv1beta1.Account(**req.observed.resources["group"].resource)
    if observed_group.metadata is None or observed_group.metadata.annotations is None:
        return
    if "crossplane.io/external-name" not in observed_group.metadata.annotations:
        return

    group_external_name = observed_group.metadata.annotations[
        "crossplane.io/external-name"
    ]

    account_external_name = observed_xr.metadata.name.replace("-", "")  # type: ignore  # Name is an optional field, but it'll always be set.

    desired_acct = acctv1beta1.Account(
        apiVersion="storage.azure.upbound.io/v1beta1",
        kind="Account",
        metadata=metav1.ObjectMeta(
            annotations={
                "crossplane.io/external-name": account_external_name,
            },
        ),
        spec=acctv1beta1.Spec(
            forProvider=acctv1beta1.ForProvider(
                resourceGroupName=group_external_name,
                accountTier="Standard",
                accountReplicationType="LRS",
                location=params.location,
                infrastructureEncryptionEnabled=True,
                blobProperties=[
                    acctv1beta1.BlobProperty(
                        versioningEnabled=params.versioning,
                    ),
                ],
            ),
        ),
    )
    resource.update(rsp.desired.resources["acct"], desired_acct)

    desired_cont = contv1beta1.Container(
        apiVersion="storage.azure.upbound.io/v1beta1",
        kind="Container",
        spec=contv1beta1.Spec(
            forProvider=contv1beta1.ForProvider(
                storageAccountName=account_external_name,
                containerAccessType="blob" if params.acl == "public" else "private",
            ),
        ),
    )
    resource.update(rsp.desired.resources["cont"], desired_cont)
```

{{< /tab >}}
{{< /tabs >}}


<!-- /Azure -->

<!-- GCP -->
### Create a GCP Composition Function

Now, open up your function file (either `main.k` or  `main.py`) and paste in the
following to your function.


{{< tabs "Functions" >}}
{{< tab "KCL" >}}

```yaml
import models.io.upbound.gcp.storage.v1beta1

oxr = option("params").oxr # observed composite resource
params = oxr.spec.parameters

bucketName = "{}-bucket".format(oxr.metadata.name)

_metadata = lambda name: str -> any {
  {
    name = name
    annotations = {
      "krm.kcl.dev/composition-resource-name" = name
    }
  }
}

_items: [any] = [
    v1beta1.Bucket{
        metadata: _metadata(bucketName)
        spec = {
            forProvider = {
                location = params.location
                versioning = [
                    {
                        enabled = params.versioning
                    }
                ]
            }
        }
    },
    v1beta1.BucketACL{
        metadata: _metadata("{}-encryption".format(oxr.metadata.name))
        spec = {
            forProvider = {
                bucketRef = {
                    name = bucketName
                }
                predefinedAcl = params.acl
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

from .model.io.upbound.gcp.storage.bucket import v1beta1 as bucketv1beta1
from .model.io.upbound.gcp.storage.bucketacl import v1beta1 as aclv1beta1
from .model.com.example.devex.xstoragebucket import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)
    params = observed_xr.spec.parameters

    desired_bucket = bucketv1beta1.Bucket(
        apiVersion="storage.gcp.upbound.io/v1beta1",
        kind="Bucket",
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                location=params.location,
                versioning=[
                    bucketv1beta1.VersioningItem(
                        enabled=params.versioning,
                    )
                ],
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)

    if "bucket" not in req.observed.resources:
        return

    observed_bucket = bucketv1beta1.Bucket(**req.observed.resources["bucket"].resource)
    if observed_bucket.metadata is None or observed_bucket.metadata.annotations is None:
        return
    if "crossplane.io/external-name" not in observed_bucket.metadata.annotations:
        return

    bucket_external_name = observed_bucket.metadata.annotations[
        "crossplane.io/external-name"
    ]

    desired_acl = aclv1beta1.BucketACL(
        apiVersion="storage.gcp.upbound.io/v1beta1",
        kind="BucketACL",
        spec=aclv1beta1.Spec(
            forProvider=aclv1beta1.ForProvider(
                bucket=bucket_external_name,
                predefinedAcl=params.acl,
            ),
        ),
    )
    resource.update(rsp.desired.resources["acl"], desired_acl)
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

### Render your composition locally

Use the [`up composition
render`](https://docs.upbound.io/reference/cli/command-reference/#composition-render)
command to print your desired composed resources for review. The render command
requires a **Composite Resource** (XR) file. XRs use the Composition template to
create new managed resources. An XR uses the same parameters as your example
claim, but specifies the `XStorageBucket` type and specifies the target cluster.

Create a new file called `xr.yaml`:

```yaml
apiVersion: platform.example.com/v1alpha1
kind: XStorageBucket
metadata:
  name: example
spec:
  parameters:
    location: US
    versioning: true
    acl: publicRead
```

Next, render the composition against your new composite resource file:

```shell
up composition render apis/xstoragebuckets/composition.yaml examples/storagebucket/xr.yaml
```

This local test ensures the build, configuration, and orchestration runs as
expected before you deploy it to a development control plane.

### Run your project in a development control plane in Upbound Cloud

In your terminal, set your Space context with the `up ctx` command.

```shell
up ctx
```

Use the `up project run` command to run and test your control plane project on a
development control plane hosted in Upbound's Cloud.

```shell
up project run
```

This command creates a development control plane in the Upbound Cloud and
deploys your project's package to it.

Next validate your control plane project state to verify the resources created
by locally invoking the API.

Update your `up` CLI context to your control plane which uses the name of your
control plane project (upbound-qs) by default.

```shell
up ctx ./upbound-qs
```

### Author a composition test

Composition testing ensures your compositions work as expected, follow best
practices, and meet your organizations requirements. You can generate tests for
your compositions with the `up test generate` command.

In the root of your project, generate a new test:

```shell
up test generate xstoragebucket
```

{{< hint "note" >}}
The default testing language is KCL. You can specify Python or YAML with the
`--language` flag when you generate the test.
{{< /hint >}}


In the new `tests\test-xstoragebucket` directory, open the `main.k` file and
paste the following content:
```yaml

import models.com.example.platform.v1alpha1 as platformv1alpha1
import models.io.upbound.aws.s3.v1beta1 as s3v1beta1
import models.io.upbound.dev.meta.v1alpha1 as metav1alpha1

_items = [
    metav1alpha1.CompositionTest{
        metadata.name="test-xstoragebucket"
        spec= {
            assertResources: [
                platformv1alpha1.XStorageBucket{
                    metadata.name: "example"
                    spec.parameters: {
                        acl: "public-read"
                        region: "us-west-1"
                        versioning: True
                    }
                }
                s3v1beta1.BucketACL{
                    metadata.name: "example-acl"
                    spec.forProvider:{
                        acl: "public-read"
                        bucketRef: {
                            name: "example-bucket"
                        }
                        region: "us-west-1"
                    }
                }
                s3v1beta1.BucketOwnershipControls{
                    metadata.name: "example-boc"
                    spec.forProvider: {
                        bucketRef: {
                            name: "example-bucket"
                        }
                        region: "us-west-1"
                        rule: [
                            {
                                objectOwnership: "BucketOwnerPreferred"
                            }
                        ]
                    }
                }
                s3v1beta1.Bucket{
                    metadata.name: "example-bucket"
                    spec.forProvider: {
                        region: "us-west-1"
                    }
                }
                s3v1beta1.BucketServerSideEncryptionConfiguration{
                    metadata.name: "example-encryption"
                    spec.forProvider: {
                        bucketRef: {
                            name: "example-bucket"
                        }
                        region: "us-west-1"
                        rule: [
                            {
                                applyServerSideEncryptionByDefault: [
                                    {
                                        sseAlgorithm: "AES256"
                                    }
                                ]
                                bucketKeyEnabled: True
                            }
                        ]
                    }
                }
                s3v1beta1.BucketPublicAccessBlock{
                    metadata.name: "example-pab"
                    spec.forProvider: {
                        blockPublicAcls: False
                        blockPublicPolicy: False
                        bucketRef: {
                            name: "example-bucket"
                        }
                        ignorePublicAcls: False
                        region: "us-west-1"
                        restrictPublicBuckets: False
                    }
                }
                s3v1beta1.BucketVersioning{
                    metadata.name: "example-versioning"
                    spec.forProvider: {
                        bucketRef: {
                            name: "example-bucket"
                        }
                        region: "us-west-1"
                        versioningConfiguration: [
                            {
                                status: "Enabled"
                            },
                        ]
                    }
                }
            ]
            compositionPath: "apis/xstoragebuckets/composition.yaml"
            xrPath: "examples/storagebucket/xr.yaml"
            xrdPath: "apis/xstoragebuckets/definition.yaml"
            timeoutSeconds: 120
            validate: False
        }
    }
]
items = _items
```

Save your changes and run your tests from the root of your project:

```shell
up test run tests/*
```

### Create provider credentials
Your project configuration now includes your provider dependency and requires an authentication method.

<!-- vale Microsoft.Terms = NO -->
A `ProviderConfig` is a custom resource that defines how your control plane authenticates and connects with cloud providers like AWS. It acts as a configuration bridge between your control plane's managed resources and the cloud provider's API.
<!-- vale Microsoft.Terms = YES -->

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
<!-- /AWS -->

<!-- Azure -->
A service principal is an application within the Azure Active Directory that passes `client_id`, `client_secret`, and `tenant_id` authentication tokens to create and manage Azure resources. As an alternative, it can also authenticate with a `client_certificate` instead of a `client_secret`.

{{< hint "tip" >}}
If you don't have the Azure CLI, use the [install guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
{{< /hint >}}

First, find the Subscription ID for your Azure account.

```shell
az account list
```

Note the value of the `id` in the return output.

Next, create a service principle `Owner` role. Update the `<subscription_id>` with the `id` from the previous command.

```shell
az ad sp create-for-rbac --sdk-auth --role Owner --scopes /subscriptions/<subscription_id> \ > azure.json
```

The `azure.json` file in the preceding command contains the client ID, secret, and tenant ID of your subscription.


Next, use `kubectl` to associate your Azure credentials file with a generic Kubernetes secret.

```shell
kubectl create secret generic azure-secret -n crossplane-system --from-file=creds=./azure.json
```

Next, create a new file called `provider-config.yaml` and paste the configuration below.

```yaml
apiVersion: azure.upbound.io/v1beta1
metadata:
  name: default
kind: ProviderConfig
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: azure-secret
      key: creds
```
<!-- /Azure -->

<!-- GCP -->
Using GCP service account keys requires storing the GCP account keys JSON file as a Kubernetes secret.

To create the Kubernetes secret create or [download your GCP service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating) JSON file.

First, you'll need a Kubernetes secret. Create the Kubernetes secret with the following command.

```shell {label="kubesecret"}
kubectl create secret generic \
gcp-secret \
-n crossplane-system \
--from-file=my-gcp-secret=./gcp-credentials.json
```

To create a secret declaratively requires encoding the authentication keys as a base-64 string. Create a Secret object with the data containing the secret key name, `my-gcp-secret` and the base-64 encoded keys.

```yaml
apiVersion: v1
kind: Secret
metadata:
    name: gcp-secret
    namespace: crossplane-system
    type: Opaque
data:
    my-gcp-secret: ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiZG9jcyIsCiAgInByaXZhdGVfa2V5X2lkIjogIjEyMzRhYmNkIiwKICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5cbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgImNsaWVudF9lbWFpbCI6ICJkb2NzQHVwYm91bmQuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTIzNDUiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2RvY3MuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0=
```

Next, create a new file called `provider-config.yaml` and paste the configuration below. Replace the value in `spec.projectID` with your GCP project ID below:

```yaml
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  projectID: your-gcp-project-id
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: gcp-secret
      key: my-gcp-secret
```
<!-- /GCP -->
{{< /content-selector >}}

Lastly, apply the provider configuration.

```bash
kubectl apply -f provider-config.yaml
```

When you create a composition and deploy with the control plane, Upbound uses the `ProviderConfig` to locate and retrieve the credentials
in the secret store.

### Apply your claim

Apply the example claim with `kubectl`.

```shell
kubectl apply -f examples/storagebucket/example.yaml
```

Return the resource state with the `up` CLI.

```shell
up alpha get managed -o yaml
```

Now, you can validate your results through the Upbound Console, and make any changes to test your resources required.

## Step 6: Build and push your project to the Upbound Marketplace

When you're ready to share your work, you can build your project and publish it
to the Upbound Marketplace with the `up` CLI.

### Building your control plane project

To build your control plane project, use the `up project build` command.

```shell
up project build
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
