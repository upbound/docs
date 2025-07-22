---
title: "Pipeline inputs and outputs"
weight: 2
---

Crossplane sends requests to your functions to ask them what resources to
compose for a given composite resource (XR). Your function answers with a
response.

:::tip

The examples on this page convert between generated model types and protobuf
structs using a helper function called `convertViaJSON`. You can find this
function's definition and more details about this process on the
[Models][models] page.
:::

## Inputs

Compositions execute a pipeline of one or more sequential functions. A
function updates desired resource state and returns it to Crossplane. Function
requests contain four pieces of information:

1. The observed state of the composite resource, and any composed resources.
2. The desired state of the composite resource, and any composed resources.
3. The function's input.
4. The function pipeline's context.

Each composition pipeline provides this information as _inputs_ into the
function.

Crossplane passes these pieces of information to the function as part of the
`req *fnv1.RunFunctionRequest` argument:

```go
package main

import (
	fnv1 "github.com/crossplane/function-sdk-go/proto/v1"
	"github.com/crossplane/function-sdk-go/request"
)

// Function is your composition function.
type Function struct {
	fnv1.UnimplementedFunctionRunnerServiceServer
}

// RunFunction runs the Function.
func (f *Function) RunFunction(_ context.Context, req *fnv1.RunFunctionRequest) (*fnv1.RunFunctionResponse, error) {
	observedComposite, _ := request.GetObservedCompositeResource(req) / Observed XR
	observedComposed, _ := request.GetObservedComposedResources(req)  / Observed composed resources
	desiredComposite, _ := request.GetDesiredCompositeResource(req)   / Desired XR
	desiredComposed, _ := request.GetDesiredComposedResources(req)    / Desired composed resources

	var input MyInputType                                             / Function input
	_ = request.GetInput(req, &input)

	ctxItem, _ := request.GetContextKey(req, "some-context")          / Function pipeline context
	extra, _ := request.GetExtraResources(req)                        / Any extra resources the function pipeline requested
}
```

:::tip
You can select the `RunFunctionRequest` object in Visual Studio Code to see what
fields it has.

The Go function SDK generates the `RunFunctionRequest` object from a protobuf
definition. Read the [Go Generated Code
Guide][go-generated-code-guide] to learn about protobuf
generated code.
:::

Most functions reference the observed composite resource (XR) to produce
composed resources, typically managed resources (MRs). In Go, you can extract
the observed XR from the request with `request.GetObservedCompositeResource`.

<!-- vale Upbound.Spelling = NO -->
When you generate an embedded function with `up function generate`, the command
creates a Go library that includes type definitions based on your XRDs. You can
use these generated types by converting the protobuf struct to JSON and then
unmarshaling it into your XR type as follows:
<!-- vale Upbound.Spelling = YES -->
```go
package main

import (
	"context"
	"encoding/json"

	"dev.upbound.io/models/com/example/platform/v1alpha1"

	"github.com/crossplane/function-sdk-go/errors"
	fnv1 "github.com/crossplane/function-sdk-go/proto/v1"
	"github.com/crossplane/function-sdk-go/request"
)

// Function is your composition function.
type Function struct {
	fnv1.UnimplementedFunctionRunnerServiceServer
}

// RunFunction runs the Function.
func (f *Function) RunFunction(_ context.Context, req *fnv1.RunFunctionRequest) (*fnv1.RunFunctionResponse, error) {
	observedComposite, err := request.GetObservedCompositeResource(req)
	if err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot get xr"))
		return rsp, nil
	}

	var xr v1alpha1.XStorageBucket
	if err := convertViaJSON(&xr, observedComposite.Resource); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot convert xr"))
		return rsp, nil
	}

	return rsp, nil
}
```

After this, Visual Studio Code adds tab-completion and type checking when
working with the XR.

## Outputs

Composition functions influence the state of the control plane via three kinds
of outputs:

<!-- vale write-good.TooWordy = NO -->
1. The desired state of the composite resource, and composed resources.
2. Status conditions to apply to the composite resource and, optionally,
   its claim.
3. Context to pass to subsequent functions in the pipeline.
<!-- vale write-good.TooWordy = YES -->

Most functions produce a set of composed resources as part of the desired
state.

In Go, outputs are part of the `rsp *fnv1.RunFunctionResponse` return value. You
can construct a response pre-populated with the request's desired state and
context using the `response.To` function. A Go function only needs to update any
fields in the response that it wishes to change.

:::tip
You can select the `RunFunctionResponse` object in Visual Studio Code to see
what fields it has.

The Go function SDK generates the `RunFunctionResponse` object from a protobuf
definition. Read the [Go Generated Code
Guide][go-generated-code-guide-1] to learn about protobuf
generated code.
:::

You can add or update composed resources using the
`response.SetDesiredComposedResources` helper function in the Crossplane Go SDK:

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
		response.Fatal(rsp, errors.Wrap(err, "cannot get xr"))
		return rsp, nil
	}

	var xr v1alpha1.XStorageBucket
	if err := convertViaJSON(&xr, observedComposite.Resource); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot convert xr"))
		return rsp, nil
	}

	params := xr.Spec.Parameters
	if ptr.Deref(params.Region, "") == "" {
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

	desiredComposedResources, err := request.GetDesiredComposedResources(req)
	if err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot get desired resources"))
		return rsp, nil
	}

	c := composed.New()
	if err := convertViaJSON(c, bucket); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot convert bucket to unstructured"))
		return rsp, nil
	}
	desiredComposedResources["bucket"] = &resource.DesiredComposed{Resource: c}

	if err := response.SetDesiredComposedResources(rsp, desiredComposedResources); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot set desired resources"))
		return rsp, nil
	}

	return rsp, nil
}
```

Similarly, you can update the status of the composite resource by updating it in
the response with the `response.SetDesiredCompositeResource` helper function:

```go
package main

import (
	"context"
	"encoding/json"

	"dev.upbound.io/models/com/example/platform/v1alpha1"
	"k8s.io/utils/ptr"

	"github.com/crossplane/function-sdk-go/errors"
	"github.com/crossplane/function-sdk-go/logging"
	fnv1 "github.com/crossplane/function-sdk-go/proto/v1"
	"github.com/crossplane/function-sdk-go/request"
	"github.com/crossplane/function-sdk-go/resource"
	"github.com/crossplane/function-sdk-go/resource/composite"
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
		response.Fatal(rsp, errors.Wrap(err, "cannot get observed composite"))
		return rsp, nil
	}

	var xr v1alpha1.XStorageBucket
	if err := convertViaJSON(&xr, observedComposite.Resource); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot convert observed composite"))
		return rsp, nil
	}

	xr.Status.SomeInformation = ptr.To("cool-status")
	desiredComposite := composite.New()
	if err := convertViaJSON(&desiredComposite.Unstructured, &xr); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot convert desired composite"))
		return rsp, nil
	}

	if err := response.SetDesiredCompositeResource(rsp, &resource.Composite{Resource: desiredComposite}); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot set desired composite"))
		return
	}

	return rsp, nil
}
```


[models]: /guides/projects/authoring-compositions/go/models
[go-generated-code-guide]: https://protobuf.dev/reference/go/go-generated/
[go-generated-code-guide-1]: https://protobuf.dev/reference/go/go-generated/
