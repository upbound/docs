---
title: Authoring Compositions
sidebar_position: 1
description: Use various programming languages to create resources with your control plane.
aliases:
    - /core-concepts/authoring-compositions
---


After you author an XRD, `up composition generate` allows you to create a
composition based on the parameters of your XRD.

## Scaffold the composition from the XRD

In the root folder of your control plane project, run the [up composition generate][up-composition-generate] command.


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

<Tabs>
<TabItem value="Python" label="Python">
To generate a function based on your composition, run the following command:

```shell
up function generate --language=python test-function apis/xbuckets/composition.yaml
```

This command generates an embedded Python function called `test-function` and
creates a new file in your project under `functions/test-function/main.py`. The
`up function generate` command also creates schema models to help with your
authoring experience.
</TabItem>

<TabItem value="KCL" label="KCL">
To generate a function based on your composition, run the following command:

```shell
up function generate --language=kcl test-function apis/xbuckets/composition.yaml
```

This command generates an embedded KCL function called `test-function` and
creates a new file in your project under `functions/test-function/main.k`. The
`up function generate` command also creates schema models to help with your
authoring experience.
</TabItem>

<TabItem value="Go" label="Go">
To generate a function based on your composition, run the following command:

```shell
up function generate --language=go test-function apis/xbuckets/composition.yaml
```

This command generates an embedded Go function called `test-function` in a new
directory, `functions/test-function`. The `up function generate` command also
generates a Go module containing types you can use when authoring your function.
</TabItem>

<TabItem value="GoTemplating" label="Go Templating">
To generate a function based on your composition, run the following command:

```shell
up function generate --language=go-templating test-function apis/xbuckets/composition.yaml
```

This command generates an embedded Go Templating function called `test-function`
and scaffolds it in a new directory in your project,
`functions/test-function`. The `up function generate` command also creates
schema models to help with your authoring experience.

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
</TabItem>
</Tabs>


## Authoring the composition function

<Tabs>
<TabItem value="Python" label="Python">

For this example, you need Python and the Python Visual Studio Code extension. Refer to
the [Visual Studio Code Extensions documentation][visual-studio-code-extensions-documentation]
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

For more Python best practices, please refer to the [documentation][documentation].
</TabItem>

<TabItem value="KCL" label="KCL">
For this example, make sure you have KCL and the KCL language server installed:

```shell
curl -fsSL "https://kcl-lang.io/script/install-cli.sh" | /bin/bash
curl -fsSL "https://kcl-lang.io/script/install-kcl-lsp.sh" | /bin/bash
```

Next, install and enable the [KCL Visual Studio Code Extension][kcl-visual-studio-code-extension].

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

For more KCL best practices, please refer to the [documentation][documentation-1].
</TabItem>

<TabItem value="Go" label="Go">


For this example, you need Go and the Go Visual Studio Code extension. Refer to
the [Visual Studio Code Extensions documentation][visual-studio-code-extensions-documentation-2]
to learn how to install them.

Open the `fn.go` function file in Visual Studio Code.

```go
package main

import (
	"context"
	"encoding/json"

	"dev.upbound.io/models/com/example/platform/v1alpha1"
	"dev.upbound.io/models/io/upbound/aws/s3/v1beta1"
	"k8s.io/utils/ptr"

	"github.com/crossplane/function-sdk-go/errors"
	"github.com/crossplane/function-sdk-go/logging"
	fnv1 "github.com/crossplane/function-sdk-go/proto/v1"
	"github.com/crossplane/function-sdk-go/request"
	"github.com/crossplane/function-sdk-go/resource"
	"github.com/crossplane/function-sdk-go/resource/composed"
	"github.com/crossplane/function-sdk-go/response"
)

// Function is your composition function.
type Function struct {
	fnv1.UnimplementedFunctionRunnerServiceServer

	log logging.Logger
}

// RunFunction runs the Function.
func (f *Function) RunFunction(_ context.Context, req *fnv1.RunFunctionRequest) (*fnv1.RunFunctionResponse, error) {
	f.log.Info("Running function", "tag", req.GetMeta().GetTag())
	rsp := response.To(req, response.DefaultTTL)

	observedComposite, err := request.GetObservedCompositeResource(req)
	if err != nil {
		response.Fatal(rsp, errors.Wrap(err, "can't get xr"))
		return rsp, nil
	}

	var xr v1alpha1.XStorageBucket
	if err := convertViaJSON(&xr, observedComposite.Resource); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "can't convert xr"))
		return rsp, nil
	}

	params := xr.Spec.Parameters
	if params.Region == nil || *params.Region == "" {
		response.Fatal(rsp, errors.Wrap(err, "missing region"))
		return rsp, nil
	}

	bucket := &v1beta1.Bucket{
		APIVersion: ptr.To("s3.aws.upbound.io/v1beta1"),
		Kind:       ptr.To("Bucket"),
		Spec: &v1beta1.BucketSpec{
			ForProvider: &v1beta1.BucketSpecForProvider{
				Region: params.Region,
			},
		},
	}

	composedBucket := composed.New()
	if err := convertViaJSON(composedBucket, bucket); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "can't convert bucket to unstructured"))
		return rsp, nil
	}
	desiredComposedResources, err := request.GetDesiredComposedResources(req)
	if err != nil {
		response.Fatal(rsp, errors.Wrap(err, "can't get desired resources"))
		return rsp, nil
	}
	desiredComposedResources["bucket"] = &resource.DesiredComposed{Resource: composedBucket}
	if err := response.SetDesiredComposedResources(rsp, desiredComposedResources); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "can't set desired resources"))
		return rsp, nil
	}

	return rsp, nil
}

func convertViaJSON(to, from any) error {
	bs, err := json.Marshal(from)
	if err != nil {
		return err
	}
	return json.Unmarshal(bs, to)
}
```

Use `import` statements to load Crossplane's Go SDK and Upbound's generated
models into your function.

Define your function's logic in the `RunFunction` function. Crossplane calls
this function via gRPC, passing it a `RunFunctionRequest`. It returns a
`RunFunctionResponse` that includes resources for Crossplane to create and
update.

Convert your desired composed resources to the necessary SDK types and add them
to the response with `response.SetDesiredComposedResources`. Crossplane creates
or updates the desired composed resources returned in the response. You can also
use `response.SetDesiredCompositeResource` to update the status of the XR.

With the Visual Studio Code Go extension you get autocompletion, linting, type
errors, and more.

For more Go best practices, please refer to the [documentation][documentation-3].
</TabItem>
<TabItem value="Go Templating" label="Go Templating">


For this example, you need the YAML Visual Studio Code extension and optionally
the Modelines extension. Refer to the [Visual Studio Code Extensions
documentation][visual-studio-code-extensions-documentation-4] to learn how to install them.

A Go templating function is a set of Go templates that produce YAML when
executed. The resulting YAML may contain desired composed resources for
Crossplane to create, or updates for Crossplane to apply to the composite
resource's status. See the documentation for Crossplane's
[function-go-templating][function-go-templating]
for full details on the features available.

Open the `01-compose.yaml.gotmpl` file in Visual Studio Code.

```yaml
# code: language=yaml
# yaml-language-server: $schema=../../.up/json/models/index.schema.json

---
apiVersion: s3.aws.upbound.io/v1beta1
kind: Bucket
metadata:
  annotations:
    {{ setResourceNameAnnotation "bucket" }}
spec:
  forProvider:
    region: "{{ $xr.spec.parameters.region }}"
```

The generated boilerplate code in `00-prelude.yaml.gotmpl` has already loaded
the observed composite resource into the `$xr` Go templating variable. The
function runtime executes template files in lexical order, so subsequent
templates (including `01-compose.yaml.gotmpl`) can use `$xr` to access the
observed XR. In this case, the template copies the region from the XR into the
`Bucket` managed resource.

Use the `setResourceNameAnnotation` Go templating function to set a resource
name on each desired composed resource. Crossplane will generate an appropriate
name, allowing you to update the same resource on subsequent function
invocations.

You can also update the status of the desired XR by including it in your
template:

```yaml
---
apiVersion: devexdemo.upbound.io/v1alpha1
kind: XBucket
status:
  widgets: 42
```

With the Visual Studio Code YAML extension you get autocompletion, linting, type
errors, and more.

For more Go templating best practices, please refer to the
[documentation][documentation-5].

</TabItem>
</Tabs>

<!-- vale gitlab.FutureTense = NO -->
In the next guide, you'll run and test your composition.
<!-- vale gitlab.FutureTense = YES -->

## Next steps

After you author your compositions and embedded functions, you can build and
test your control plane projects in Upbound. To learn more about testing, review
the [testing guide][testing-guide].


[up-composition-generate]: /reference/cli-reference
[visual-studio-code-extensions-documentation]: /reference/usage/vscode-extensions
[documentation]: /guides/projects/authoring-compositions/python
[kcl-visual-studio-code-extension]: /reference/usage/vscode-extensions
[documentation-1]: /guides/projects/authoring-compositions/kcl
[visual-studio-code-extensions-documentation-2]: /reference/usage/vscode-extensions
[documentation-3]: /guides/projects/authoring-compositions/go
[visual-studio-code-extensions-documentation-4]: /reference/usage/vscode-extensions
[documentation-5]: /guides/projects/authoring-compositions/go-templating
[testing-guide]: /guides/projects/testing
[function-go-templating]: https://github.com/crossplane-contrib/function-go-templating?tab=readme-ov-file#function-go-templating

