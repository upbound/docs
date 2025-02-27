---
title: Authoring Compositions
weight: 2
description: Use KCL or Python to create resources with your control plane.
aliases:
    - /core-concepts/authoring-compositions
---


After you author an XRD, `up composition generate` allows you to create a
composition based on the parameters of your XRD.

## Scaffold the composition from the XRD

In the root folder of your control plane project, run the [up composition generate]({{< ref
"reference/cli/command-reference" >}}) command.

<!--- TODO(tr0njavolta): update CLI link --->

```shell
up composition generate apis/xbuckets/definition.yaml
```

This generates a new composition for you in `apis/xbuckets/composition.yaml`.
Open the file in your editor to review the minimal file created.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  creationTimestamp: null
  name: xbuckets.devexdemo.upbound.io
spec:
  compositeTypeRef:
    apiVersion: devexdemo.upbound.io/v1alpha1
    kind: XBucket
  mode: Pipeline
  pipeline:
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: crossplane-contrib-function-auto-ready
```

## Generate an embedded function

Functions allow you to define the logic of your composition. Composition
functions build, package, and manage deployment logic as part of your
configuration. You can write functions in familiar programming languages rather
than using the built-in patch-and-transform YAML workflow.

{{< content-selector options="Python,KCL" default="Python" >}}

<!-- Python -->
To generate a function based on your composition, run the following command:

```shell
up function generate --language=python test-function apis/xbuckets/composition.yaml
```

This command generates an embedded Python function called `test-function` and
creates a new file in your project under `functions/test-function/main.py`. The
`up function generate` command also creates schema models to help with your
authoring experience.
<!-- /Python -->
<!-- KCL -->
To generate a function based on your composition, run the following command:

```shell
up function generate --language=kcl test-function apis/xbuckets/composition.yaml
```

This command generates an embedded KCL function called `test-function` and
creates a new file in your project under `functions/test-function/main.k`. The
`up function generate` command also creates schema models to help with your
authoring experience.

<!-- /KCL -->

{{< /content-selector >}}

The Upbound CLI automatically updates your `apis/xbuckets/composition.yaml` file
with your new function.

Your composition now contains new function references in the `pipeline` section.

```yaml
  pipeline:
  - functionRef:
      name: acmeco-devexdemotest-function
    step: test-function
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: crossplane-contrib-function-auto-ready
```

## Authoring the composition function

{{< content-selector options="Python,KCL" default="Python" >}}

<!-- Python -->

For this example, you need Python and the Python Visual Studio Code extension. Refer to
the [Visual Studio Code Extensions documentation]({{<ref "vscode-extensions.md">}})
to learn how to install them.

Open the `main.py` function file in Visual Studio Code.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.upbound.aws.s3.bucket import v1beta1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    # Specify an S3 Bucket, using a generated model.
    bucket = v1beta1.Bucket(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="Bucket",
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                # Derive the bucket's region from the XR's region.
                region=req.observed.composite.resource["spec"]["region"],
            ),
        ),
    )

    # Update the function's desired composed resources to include the bucket.
    resource.update(rsp.desired.resources["bucket"], bucket)
```


Use `import` statements to load Crossplane's Python SDK and Upbound's generated
models into your function.

Define your function's logic in the `compose` function. Crossplane calls this
function. It passes it a `RunFunctionRequest` and a `RunFunctionResponse`.

Specify your desired composed resources by passing them to `resource.update`.
You can pass `resource.update` a model object, or a Python dictionary.

You can also use `resource.update` to update the desired XR:

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    # Update the function's desired XR's status using a dictionary.
    resource.update(rsp.desired.composite, {"status": {"widgets": 42}})
```

With the Visual Studio Code Python extension you get autocompletion, linting, type errors,
and more.

<!-- vale gitlab.FutureTense = NO -->
In the next guide, you'll run and test your composition.
<!-- vale gitlab.FutureTense = YES -->

For more Python best practices, please refer to the [documentation]({{<ref "python/_index.md">}}).

<!-- /Python -->
<!-- KCL -->

For this example, make sure you have KCL and the KCL language server installed:

```shell
curl -fsSL "https://kcl-lang.io/script/install-cli.sh" | /bin/bash
curl -fsSL "https://kcl-lang.io/script/install-kcl-lsp.sh" | /bin/bash
```

Next, install and enable the [KCL Visual Studio Code Extension]({{<ref "vscode-extensions.md">}}).

Open the `main.k` function file in Visual Studio Code. The schema scaffold here builds your
composition logic and contains placeholders for your desired inputs.

``` shell
import models.v1beta1 as v1beta1
import models.v1beta2 as v1beta2
import models.k8s.apimachinery.pkg.apis.meta.v1 as metav1

oxr = option("params").oxr # observed composite resource
_ocds = option("params").ocds # observed composed resources
_dxr = option("params").dxr # desired composite resource
dcds = option("params").dcds # desired composed resources

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}

_items = [

]
items = _items
```


First, the function uses an `import` statement to load KCL language server
logic into your composition.

``` shell
import models.v1beta1 as v1beta1
import models.v1beta2 as v1beta2
import models.k8s.apimachinery.pkg.apis.meta.v1 as metav1
```

Next, the variable statements capture your desired resources and observed resources.

```shell
oxr = option("params").oxr # observed composite resource
_ocds = option("params").ocds # observed composed resources
_dxr = option("params").dxr # desired composite resource
dcds = option("params").dcds # desired composed resources
```


The `_items` stanza is empty and expects a resource object. Your function uses
this assignment to pass your desired infrastructure to the control plane for management.

``` shell
_items = [
  v1beta1.Bucket{
    metadata.name = oxr.metadata.name
    spec.forProvider: {
      objectLockEnabled = True
      forceDestroy = False
    }
  }

  v1beta1.BucketVersioning {
    spec.forProvider: {
        bucketRef.name = oxr.metadata.name
    }
   }   if oxr.spec.versioning and oxr.status.conditions == 'True' else {}

   v1beta1.BucketServerSideEncryptionConfiguration {
    spec.forProvider = {
        bucketRef.name = oxr.metadata.name
        rule: [
          {
            applyServerSideEncryptionByDefault: [
                {
                    sseAlgorithm = "AES256"
                }
            ]
            bucketKeyEnabled = True
          }
        ]
    }
   } if oxr.spec.versioning and oxr.status.conditions == 'True' else {}
]
```

The statement in the `_items` variable is a fully functional KCL function. With
the Visual Studio Code KCL extension and KCL language server, you get autocompletion,
linting, type errors, and more.

In this example, the `oxr` assignment captures the composite resources and the
function adds server side encryption to the buckets your deployment creates.

<!-- vale gitlab.FutureTense = NO -->
In the next guide, you'll run and test your composition.
<!-- vale gitlab.FutureTense = YES -->

For more KCL best practices, please refer to the [documentation]({{<ref "build/authoring-compositions/kcl">}}).

<!-- /KCL -->

{{< /content-selector >}}
