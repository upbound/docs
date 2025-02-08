---
title: "Create cloud resources with Upbound"
description: "Define a control plane for resource abstractions in a real cloud provider environment"
weight: 1
aliases:
    - "/getstarted-devex/create-controllers"
    - "/quickstart"
    - getstarted/control-plane-project
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

Upbound allows you to efficiently manage cloud resources across multiple providers, enabling your organization to scale its online services while maintaining control and consistency.

## Step 0: Prerequisites
This guide assumes you're already familiar with AWS, Azure, or GCP.

For this guide, you'll need:
- The Up CLI installed
- An Upbound free-tier account
- A cloud provider account with administrative access
- Docker Desktop
- Visual Studio Code
- KCL or Python Visual Studio Code Extension
- `kubectl` installed


### Install the `up` CLI

To use Upbound, install the `up` CLI. You can download it as a binary package or with Homebrew.
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

The minimum supported version is `v0.35.0`. To verify your CLI installation and version, use the `up version` command:
<!-- vale write-good.TooWordy = YES -->
```shell
up version
```
Both the `Crossplane Version` and `Spaces Control Version` return `unknown`.

### Login to Upbound

Authenticate your CLI with your Upbound account by using the login command. This opens a browser window for you to log into your Upbound account.

```shell
  up login
```

## Step 1: Create a new project
Upbound uses project directories containing configuration files to deploy infrastructure. Use the `up project init` command to create a project directory with the necessary scaffolding.

### Initialize the project
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

Providers in your project create external resources for Upbound to
manage. After adding the provider, your `upbound.yaml` file's `dependsOn` section should reflect the changes.

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

Claims are the user facing resource of the API you define. The `up` CLI can generate compositions for you based on the minimal information you provide in the claim.

Run the following command to generate a new example claim. Choose `Composite Resource Claim` in your terminal and give it a name describing what it creates.

```yaml
up example generate \
    --type claim \
    --api-group devexdemo.example.com \
    --api-version v1alpha1 \
    --kind StorageBucket \
    --name example \
    --namespace default
```
This command creates a minimal claim file. Copy and paste the claim below into the `examples/storagebucket/example.yaml` claim file.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS
{{< editCode >}}
```yaml
apiVersion: devexdemo.example.com/v1alpha1
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
    parameters:
        location: eastus
        versioning: true
        acl: public
```
{{</ editCode >}}

This Azure StorageBucket claim uses fields Azure requires to create an Azure blob storage instance. You can discover required fields in the Marketplace for the provider.
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
    parameters:
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
`apis/xstoragebuckets/definition.yaml`. The XRD is a custom schema representation
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
from .model.com.example.platform.xstoragebucket import v1alpha1
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

Now, open up your function file (either `main.k` or  `main.py`) and paste in the following to your function.

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
from .model.com.example.platform.xstoragebucket import v1alpha1


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

Now, open up your function file (either `main.k` or  `main.py`) and paste in the following to your function.


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
from .model.com.example.platform.xstoragebucket import v1alpha1


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
kubectl create secret generic azure-secret -n upbound-system --from-file=creds=./azure.json
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
        namespace: upbound-system
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

Next, create a new file called `provider-config.yaml` and paste the configuration below.

```yaml
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
    name: default
spec:
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
## Deploy with the consumer portal

With your control plane project set up, you're ready to create resources in your
cloud service provider with the Consumer Portal.

<!-- vale gitlab.SentenceLength = NO -->
The Consumer Portal is a self-service tool that you and users in your organization can use to
deploy infrastructure based on claims and configurations you create. This portal
is what your developers interact with when they want to deploy infrastructure on your control plane
platform. For more information on adding users to Upbound, review the [Identity
Management guide]({{<ref "operate/accounts/identity-management/users" >}})
<!-- vale gitlab.SentenceLength = YES -->

Follow the flow below to create a resource based on your claim.

<!-- vale write-good.Passive = NO -->
<!-- vale gitlab.FutureTense = NO -->
<!-- vale Google.Will = NO -->
Login to the [Upbound Console](https://console.upbound.io) and navigate to the Consumer
Portal. Your browser will redirect you to the Consumer Experience portal, which only
displays information necessary for consumers to deploy infrastructure.
<!-- vale write-good.Passive = YES -->
<!-- vale gitlab.FutureTense = YES -->
<!-- vale Google.Will = YES -->

First, navigate to the Control Plane you created in the previous guides and
select the claim resource. Add a name and create your resource. Follow the
interactive guide below:

<div style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.764294049008168; padding: 40px 0 40px 0;"><iframe src="https://app.supademo.com/embed/cm33dyzpz126i2617f7l062iy?embed_v=2" loading="lazy" title="Upbound Consumer Portal" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

<!-- vale write-good.TooWordy = NO -->

## Modify a claim

You can modify your resource directly from the Consumer Portal. Navigate to the
resource and go to **Details**. From here, you can edit the fields or select
**Edit YAML** and create additional YAML specifications.
<!-- vale write-good.TooWordy = YES -->

<div style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.764294049008168; padding: 40px 0 40px 0;"><iframe src="https://app.supademo.com/embed/cm33flbir015fnf6c7d9sgt5k?embed_v=2" loading="lazy" title="New Demo" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Verify your resources

After creating and configuring your resources, you can verify your bucket
configuration using AWS CLI commands. Below are examples of how to confirm the
existence of an S3 bucket and verify its encryption settings.

### List buckets

<!-- vale write-good.Passive = NO -->
To verify your S3 bucket has been created, use the following command:
<!-- vale write-good.Passive = YES -->

```bash
aws s3api list-buckets
````

Expected output:

```json
{
    "Buckets": [
        {
            "Name": "devex-aws-bucket",
            "CreationDate": "2024-11-04T10:30:45+00:00"
        }
    ],
    "Owner": {
        "DisplayName": "<Your-AWS-Account>",
        "ID": "<Your-AWS-Account-ID>"
    }
}
```

In this output, verify your bucket is under `"Buckets"`, along with its creation date.

### Check bucket encryption

To verify encryption policy, use the following command, replacing `<your-bucket-name>` with your bucket's name:

```bash
aws s3api get-bucket-encryption --bucket <your-bucket-name>
```

Expected output:

```json
{
    "ServerSideEncryptionConfiguration": {
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                },
                "BucketKeyEnabled": true
            }
        ]
    }
}
```

<!-- vale write-good.Passive = NO -->
<!-- vale write-good.TooWordy = NO -->
This output confirms that server-side encryption is configured with `AES256` as
the encryption algorithm with `BucketKeyEnabled` set to `true`. This means
your bucket is encrypted based on the composition configuration. The
Consumer Portal user doesn't have to specify any additional information to get this.
<!-- vale write-good.TooWordy = YES -->
<!-- vale write-good.Passive = YES -->

## Destroy your resources

You can delete resources directly from the Consumer Portal. Select the resource
you want to delete and go to **Settings** then select **Delete Resource**.

Follow the interactive guide below:

<div style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.764294049008168; padding: 40px 0 40px 0;"><iframe src="https://app.supademo.com/embed/cm33errz80001ci8b2b2xi0jc?embed_v=2" loading="lazy" title="Upbound Consumer Portal" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

To verify bucket deletion, run the AWS S3 CLI again.

```bash
aws s3api get-bucket-encryption --bucket <your-bucket-name>
```

This command should return with an error:

```yaml {copy-lines="none"}
{
    "Error": {
        "Code": "NoSuchBucket",
        "Message": "The specified bucket does not exist",
        "BucketName": "devex-aws-bucket"
    }
}
```

## Next steps

<!-- vale Google.Exclamation = NO -->

You just drove an entire deployment lifecycle with an Upbound control plane!
Now you're ready for more Upbound concepts.
<!-- vale Google.Exclamation = YES -->

Check out the [Core Concepts](https://docs.upbound.io/core-concepts/) section for more information about
authoring compositions or configuration with Python and KCL.


<!-- vale gitlab.FutureTense = YES -->
<!-- vale Microsoft.HeadingAcronyms = YES -->
<!-- vale gitlab.SentenceLength = YES -->
