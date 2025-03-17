---
title: "Models"
weight: 30
---

Upbound Official Providers and some other packages include Go models: packages
containing struct type definitions for their resources. These models enable
in-line documentation, linting, autocompletion, and other features when working
with Crossplane resources in embedded Go functions. You can also use the Go
types from the upstream provider source code with embedded Go functions.

## Make models available to a function

Use `up dependency add` to make models from a dependency available to a
function. Dependencies are most often Crossplane providers, but they can also be
configurations that include XRDs.

```console
up dependency add xpkg.upbound.io/upbound/provider-aws-s3:v1.20.0
```

Use `up project build` to make models available for XRDs defined by your
project.

```console
up project build
```

{{<hint "tip">}}
`up` caches Go models in the `.up/go` directory, at the root of your
project. You shouldn't commit the `.up` directory to source control.
{{</hint>}}

## Import models into a function

Each provider's models are available in their own packages, named after the
provider's resource group and versions. The model packages are all contained in
a single Go module with the path `dev.upbound.io/models`. Note that you always
import this module through a `replace` directive in the `go.mod` file. Go
tooling can't resolve it otherwise.

Import models to your `fn.go` function file with the following syntax:

```golang
import "dev.upbound.io/models/io/upbound/aws/s3/v1alpha1"
```

## Use model in a function

{{<hint "tip">}}
Refer to the [Crossplane Go SDK
documentation](https://pkg.go.dev/github.com/crossplane/function-sdk-go) for
full details on the functions described below.
{{</hint>}}

<!-- vale Upbound.Spelling = NO -->
Once you import the model, you can convert import resources to model types and
construct output resources using model types. The easiest way to convert between
the Crossplane SDK's types and model types is via JSON using a utility function
like the following:
<!-- vale Upbound.Spelling = YES -->

```golang
func convertViaJSON(to, from any) error {
	bs, err := json.Marshal(from)
	if err != nil {
		return err
	}
	return json.Unmarshal(bs, to)
}
```

Crossplane passes resources to your function as protocol buffer structs. Convert
them to model types to take advantage of type checking, linting, and
autocompletion:

```golang
package main

import (
	"context"
	"encoding/json"

	"dev.upbound.io/models/com/example/platform/v1alpha1"

	"github.com/crossplane/function-sdk-go/errors"
	"github.com/crossplane/function-sdk-go/logging"
	fnv1 "github.com/crossplane/function-sdk-go/proto/v1"
	"github.com/crossplane/function-sdk-go/request"
	"github.com/crossplane/function-sdk-go/response"
)

// Function is your composition function.
type Function struct {
	fnv1.UnimplementedFunctionRunnerServiceServer

	log logging.Logger
}

// RunFunction runs the Function.
func (f *Function) RunFunction(_ context.Context, req *fnv1.RunFunctionRequest) (*fnv1.RunFunctionResponse, error) {
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
    
	return rsp, nil
}
```

Use `response.SetDesiredComposedResources` to add composed resources to the
function's response:

```golang
package main

import (
	"context"
	"encoding/json"

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
	rsp := response.To(req, response.DefaultTTL)

	bucket := &v1beta1.Bucket{
		APIVersion: ptr.To("s3.aws.upbound.io/v1beta1"),
		Kind:       ptr.To("Bucket"),
		Spec: &v1beta1.BucketSpec{
			ForProvider: &v1beta1.BucketSpecForProvider{
				Region: ptr.To("us-east-1"),
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

## Supported packages

All Upbound Official Providers include Go models.

<!-- vale Google.WordList = NO -->
When you build your project with `up project build`, the generated artifact
contains the generated models for your XRDs. You can build a project and then
import that project as a dependency for the resources you define. You can also
use your own project's models in your functions as described above.
<!-- vale Google.WordList = YES -->

## Field types in models

<!-- vale write-good.Passive = NO -->
All fields in Upbound's Go models have pointer types so that you can specify
only the fields your function has an opinion about. This can be awkward in Go,
since there's no built-in way to construct a pointer to a constant value. The
`k8s.io/utils/ptr` package contains a function, `ptr.To`, which can be used for
this purpose:
<!-- vale write-good.Passive = YES -->

```golang
package main

import (
	"context"
	"encoding/json"

	"dev.upbound.io/models/io/upbound/aws/s3/v1beta1"
	"k8s.io/utils/ptr"

	"github.com/crossplane/function-sdk-go/logging"
	fnv1 "github.com/crossplane/function-sdk-go/proto/v1"
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

	bucket := &v1beta1.Bucket{
		APIVersion: ptr.To("s3.aws.upbound.io/v1beta1"),
		Kind:       ptr.To("Bucket"),
		Spec: &v1beta1.BucketSpec{
			ForProvider: &v1beta1.BucketSpecForProvider{
				Region: ptr.To("us-east-1"),
			},
		},
	}
    
	return rsp, nil
}
```
