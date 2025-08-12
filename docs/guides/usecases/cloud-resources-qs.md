---
title: Create custom cloud resources
sidebar_position: 3
---
import GlobalLanguageSelector, { CodeBlock } from '@site/src/components/GlobalLanguageSelector';

<GlobalLanguageSelector />

You can use control planes to define custom resource types for external
resources, like your cloud provider. This guide walks through how to create and
deploy custom resource types for your cloud provider on a control plane.

## Prerequisites

This quickstart takes around 10 minutes to complete. 
Before beginning, make sure that:

- you have installed the [Upbound CLI][up].
- you have a Docker-compatible container runtime installed on your system and running.

This guide uses AWS and Python to build custom cloud resources.

## Create a control plane project

Crossplane works by letting you define new resource types in Kubernetes that
invoke function pipelines to template and generate lower-level resources. Just
like any other software project, a _control plane project_ is a source-level
representation of your control plane. A control plane project gets built into an
OCI package and installed into a running instance of Upbound Crossplane.

Create a control plane project on your machine by running the following command:
<!--- AWS project init --->

```shell
up project init --example="project-example-aws" --language="python" my-new-project
```

## Deploy your control plane

In the root directory of your project, use `up project run` to run your project
locally:

```shell
up project run --local
```

This launches an instance of Upbound Crossplane on your machine, wrapped and
deployed in a container. Upbound Crossplane comes bundled with a Web UI. Run the
following command to view the UI for your control plane, then open a browser at
[https://localhost:8080](https://localhost:8080):

This command deploys a container with an Upbound Crossplane instance on your
machine. 


Upbound Crossplane provides a built in Web UI for you to browse your control
plane resources. 

```shell
up uxp web-ui open
```


## Define a custom resource type

Customize your control plane by defining your own resource type. Start by
creating an example instance of your custom resource type and define the
properties you want to exist, then use the up tooling to generate the definition
files Crossplane needs. Scaffold a new resource type example with:


```shell
up example generate \
  --type xr --api-group getting.started --api-version v1alpha1 --kind UserDefinedBucket --name example
```

Open the project in your IDE of choice and edit the generated file
`my-new-project/examples/userdefinedbucket/example.yaml`:


Open the generated file in your editor and paste the following configuration:

```yaml
apiVersion: gettingstarted.upbound.io/v1alpha1
kind: SuperBucket
metadata:
  name: example
spec:
  region: us-east-1
  logging:
    enabled: true
```


Next generate the definitions files

<!--- AWS Generate xrd/comp/func --->

```shell
up xrd generate examples/userdefinedbucket/example.yaml
up composition generate apis/userdefinedbuckets/definition.yaml
up function generate --language=python compose-resources apis/userdefinedbuckets/composition.yaml
```

What you just did is created your own resource type called UserDefinedBucket and
created a single function to contain the logic that defines what should happen
when one of these UserDefinedBuckets get created. Open the function definition
file at `my-new-project/functions/compose-resources/` and add some logic:

<!--- AWS build func --->

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
from .model.io.upbound.aws.s3.bucketserversideencryptionconfiguration import (
    v1beta1 as ssev1beta1,
)


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)
    params = observed_xr.spec.parameters

    desired_bucket = bucketv1beta1.Bucket(
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=params.region,
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)

    # Return early if Crossplane hasn't observed the bucket yet. This means it
    # hasn't been created yet. This function will be called again after it is.
    if "bucket" not in req.observed.resources:
        return

    observed_bucket = bucketv1beta1.Bucket(**req.observed.resources["bucket"].resource)

    # The desired ACL, encryption, and versioning resources all need to refer to
    # the bucket by its external name, which is stored in its external name
    # annotation. Return early if the Bucket's external-name annotation isn't
    # set yet.
    if observed_bucket.metadata is None or observed_bucket.metadata.annotations is None:
        return
    if "crossplane.io/external-name" not in observed_bucket.metadata.annotations:
        return

    bucket_external_name = observed_bucket.metadata.annotations[
        "crossplane.io/external-name"
    ]

    desired_acl = aclv1beta1.BucketACL(
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

    # Return early without composing a BucketVersioning MR if the XR doesn't
    # have versioning enabled.
    if not params.versioning:
        return

    desired_versioning = verv1beta1.BucketVersioning(
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


## Use the custom resource

Your control plane now understands `UserDefinedBucket` resources. Create a
`UserDefinedBucket`:

```shell
kubectl apply -f examples/userdefinedbucket/example.yaml
```

Check that the UserDefinedBucket exists:

```shell
kubectl get -f examples/userdefinedbucket/example.yaml
NAME        SYNCED   READY    COMPOSITION   AGE
my-bucket   True     False    bucket        56s
```

Observe how Crossplane created a Bucket because the UserDefinedBucket got
created:

```shell
kubectl get buckets
```

## Do more with your control plane

The example above creates S3 bucket resources in AWS whenever a
UserDefinedBucket gets created. But what if you don't want to create Buckets or
use AWS? The Upbound Marketplace is the hub for finding additional packages to
extend your control plane, such as Providers, or pre-built Functions.

Being a control plane, Upbound Crossplane has an API server to let you
communicate with it, whether over a CLI, GitOps, GUI, or direct REST API calls.


[up]: /manuals/cli/overview
[providers]: /manuals/uxp/packages/providers/
[marketplace]: https://marketplace.upbound.io
[functions]: /manuals/uxp/concepts/composition/composite-resource-definitions
