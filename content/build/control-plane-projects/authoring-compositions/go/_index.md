---
title: "Build with Go"
weight: 1
---

Upbound supports defining your control plane APIs in the
[Go](https://www.golang.org) language.

Go functions can make use of all built-in Go features, the Go standard library,
and other Go modules including the Crossplane [Go Function
SDK](https://github.com/crossplane/function-sdk-go).

{{<hint "tip">}}
If you'd like to become more familiar with Go, the [official
tutorials](https://go.dev/learn/) are a good place to start.
{{</hint>}}

## Prerequisites

To define your control plane APIs in Go you need Go and the Go Visual Studio
Code extension. Refer to the [Visual Studio Code Extensions
documentation]({{<ref "reference/vscode-extensions">}}) to learn how to install
them.

## Example

The following example function composes an S3 bucket based on a simplified
bucket XRD.

{{< content-selector options="Function,XRD,Composition" default="Function" >}}

<!-- Function -->

The function `fn.go` file below takes a composite resource (XR) as input. It
produces a Bucket managed resource (MR) from the
[S3 provider](https://marketplace.upbound.io/providers/upbound/provider-aws-s3)
based on its parameters.

```golang
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

func convertViaJSON(to, from any) error {
	bs, err := json.Marshal(from)
	if err != nil {
		return err
	}
	return json.Unmarshal(bs, to)
}
```

Expand the example below to see a more advanced Go function.

{{<expand "A more advanced Go function">}}

The function `fn.go` file below takes a composite resource (XR) as input and
produces managed resources (MRs) from the
[S3 provider](https://marketplace.upbound.io/providers/upbound/provider-aws-s3)
based on its parameters.

The function always composes an S3 bucket. When the S3 bucket exists, it also
composes a bucket access control list (ACL). The ACL references the bucket by
name.

If the composite resource's `spec.versioning` field is `true`, the function
enables versioning by composing a bucket versioning configuration. Like the ACL,
the versioning configuration references the bucket by name.

```golang
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

	observedComposed, err := request.GetObservedComposedResources(req)
	if err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot get observed resources"))
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

	// We'll collect our desired composed resources into this map, then convert
	// them to the SDK's types and set them in the response when we return.
	desiredComposed := make(map[resource.Name]any)
	defer func() {
		desiredComposedResources, err := request.GetDesiredComposedResources(req)
		if err != nil {
			response.Fatal(rsp, errors.Wrap(err, "cannot get desired resources"))
			return
		}

		for name, obj := range desiredComposed {
			c := composed.New()
			if err := convertViaJSON(c, obj); err != nil {
				response.Fatal(rsp, errors.Wrapf(err, "cannot convert %s to unstructured", name))
				return
			}
			desiredComposedResources[name] = &resource.DesiredComposed{Resource: c}
		}

		if err := response.SetDesiredComposedResources(rsp, desiredComposedResources); err != nil {
			response.Fatal(rsp, errors.Wrap(err, "cannot set desired resources"))
			return
		}
	}()

	bucket := &v1beta1.Bucket{
		APIVersion: ptr.To("s3.aws.upbound.io/v1beta1"),
		Kind:       ptr.To("Bucket"),
		Spec: &v1beta1.BucketSpec{
			ForProvider: &v1beta1.BucketSpecForProvider{
				Region: params.Region,
			},
		},
	}
	desiredComposed["bucket"] = bucket

	// Return early if Crossplane hasn't observed the bucket yet. This means it
	// hasn't been created yet. This function will be called again after it is.
	observedBucket, ok := observedComposed["bucket"]
	if !ok {
		response.Normal(rsp, "waiting for bucket to be created").TargetCompositeAndClaim()
		return rsp, nil
	}

	// The desired ACL, encryption, and versioning resources all need to refer
	// to the bucket by its external name, which is stored in its external name
	// annotation. Return early if the Bucket's external-name annotation isn't
	// set yet.
	bucketExternalName := observedBucket.Resource.GetAnnotations()["crossplane.io/external-name"]
	if bucketExternalName == "" {
		response.Normal(rsp, "waiting for bucket to be created").TargetCompositeAndClaim()
		return rsp, nil
	}

	acl := &v1beta1.BucketACL{
		APIVersion: ptr.To("s3.aws.upbound.io/v1beta1"),
		Kind:       ptr.To("BucketACL"),
		Spec: &v1beta1.BucketACLSpec{
			ForProvider: &v1beta1.BucketACLSpecForProvider{
				Bucket: &bucketExternalName,
				Region: params.Region,
				ACL:    params.ACL,
			},
		},
	}
	desiredComposed["acl"] = acl

	boc := &v1beta1.BucketOwnershipControls{
		APIVersion: ptr.To("s3.aws.upbound.io/v1beta1"),
		Kind:       ptr.To("BucketOwnershipControls"),
		Spec: &v1beta1.BucketOwnershipControlsSpec{
			ForProvider: &v1beta1.BucketOwnershipControlsSpecForProvider{
				Bucket: &bucketExternalName,
				Region: params.Region,
				Rule: &[]v1beta1.BucketOwnershipControlsSpecForProviderRule{{
					ObjectOwnership: ptr.To("BucketOwnerPreferred"),
				}},
			},
		},
	}
	desiredComposed["boc"] = boc

	pab := &v1beta1.BucketPublicAccessBlock{
		APIVersion: ptr.To("s3.aws.upbound.io/v1beta1"),
		Kind:       ptr.To("BucketPublicAccessBlock"),
		Spec: &v1beta1.BucketPublicAccessBlockSpec{
			ForProvider: &v1beta1.BucketPublicAccessBlockSpecForProvider{
				Bucket:                &bucketExternalName,
				Region:                params.Region,
				BlockPublicAcls:       ptr.To(false),
				RestrictPublicBuckets: ptr.To(false),
				IgnorePublicAcls:      ptr.To(false),
				BlockPublicPolicy:     ptr.To(false),
			},
		},
	}
	desiredComposed["pab"] = pab

	sse := &v1beta1.BucketServerSideEncryptionConfiguration{
		APIVersion: ptr.To("s3.aws.upbound.io/v1beta1"),
		Kind:       ptr.To("BucketServerSideEncryptionConfiguration"),
		Spec: &v1beta1.BucketServerSideEncryptionConfigurationSpec{
			ForProvider: &v1beta1.BucketServerSideEncryptionConfigurationSpecForProvider{
				Bucket: &bucketExternalName,
				Region: params.Region,
				Rule: &[]v1beta1.BucketServerSideEncryptionConfigurationSpecForProviderRule{{
					ApplyServerSideEncryptionByDefault: &[]v1beta1.BucketServerSideEncryptionConfigurationSpecForProviderRuleApplyServerSideEncryptionByDefault{{
						SseAlgorithm: ptr.To("AES256"),
					}},
					BucketKeyEnabled: ptr.To(true),
				}},
			},
		},
	}
	desiredComposed["sse"] = sse

	if ptr.Deref(params.Versioning, false) {
		versioning := &v1beta1.BucketVersioning{
			APIVersion: ptr.To("s3.aws.upbound.io/v1beta1"),
			Kind:       ptr.To("BucketVersioning"),
			Spec: &v1beta1.BucketVersioningSpec{
				ForProvider: &v1beta1.BucketVersioningSpecForProvider{
					Bucket: &bucketExternalName,
					Region: params.Region,
					VersioningConfiguration: &[]v1beta1.BucketVersioningSpecForProviderVersioningConfiguration{{
						Status: ptr.To("Enabled"),
					}},
				},
			},
		}
		desiredComposed["versioning"] = versioning
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

{{</expand>}}

<!-- /Function -->

<!-- XRD -->

The Go function operates on an XR that looks like this:

```yaml
apiversion: platform.example.com
kind: XStorageBucket
metadata:
  name: example-bucket
spec:
  region: us-west-1
  acl: private
  versioning: true
```

The following is the composite resource definition (XRD) for this example, which
generated the `v1alpha1.XStorageBucket` type used in the embedded function.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xstoragebuckets.platform.example.com
spec:
  claimNames:
    kind: StorageBucket
    plural: storagebuckets
  group: platform.example.com
  names:
    categories:
    - crossplane
    kind: XStorageBucket
    plural: xstoragebuckets
  versions:
  - name: v1alpha1
    referenceable: true
    schema:
      openAPIV3Schema:
        description: StorageBucket is the Schema for the StorageBucket API.
        properties:
          spec:
            description: StorageBucketSpec defines the desired state of StorageBucket.
            properties:
              acl:
                type: string
              region:
                type: string
              versioning:
                type: boolean
            type: object
          status:
            description: StorageBucketStatus defines the observed state of StorageBucket.
            type: object
        required:
        - spec
        type: object
    served: true
```

<!-- /XRD -->

<!-- Composition -->

The composition invokes the function to compose resources for an XR, then
invokes [`function-auto-ready`](https://marketplace.upbound.io/functions/crossplane-contrib/function-auto-ready/v0.3.0).
`function-auto-ready` automatically marks the XR as ready when the composed MRs
are ready.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xstoragebuckets.platform.example.com
spec:
  compositeTypeRef:
    apiVersion: platform.example.com/v1alpha1
    kind: XStorageBucket
  mode: Pipeline
  pipeline:
  - functionRef:
      name: upbound-example-project-awscompose-bucket-go
    step: compose-bucket-go
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: crossplane-contrib-function-auto-ready
```

<!-- /Composition -->

{{< /content-selector >}}

## Control plane project model

The Upbound programming model defines the core concepts you can use when
creating your control plane using Upbound.

<!--- TODO(tr0njavolta): add link to control plane projects --->

Upbound builds embedded Go functions on top of Crossplane's [Go function
SDK](https://github.com/crossplane/function-sdk-go), offering a simplified,
Upbound-specific development experience.
