---
title: "Overview"
sidebar_position: 1
---

Upbound supports defining your control plane APIs in the
[Go][go] language.

Go functions can make use of all built-in Go features, the Go standard library,
and other Go modules including the Crossplane [Go Function
SDK][go-function-sdk].

:::tip
If you'd like to become more familiar with Go, the [official
tutorials][official-tutorials] are a good place to start.
:::

## Prerequisites

To define your control plane APIs in Go you need Go and the Go Visual Studio
Code extension. Refer to the [Visual Studio Code Extensions
documentation][visual-studio-code-extensions-documentation] to learn how to install
them.

## Example

The following example function composes an S3 bucket based on a simplified
bucket XRD.


<Tabs>
<TabItem value="Function" label="Function">

The function `fn.go` file below takes a composite resource (XR) as input. It
produces a Bucket managed resource (MR) from the
[S3 provider][s3-provider]
based on its parameters.

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

func convertViaJSON(to, from any) error {
	bs, err := json.Marshal(from)
	if err != nil {
		return err
	}
	return json.Unmarshal(bs, to)
}
```

Expand the example below to see a more advanced Go function.

<details>

<summary>A more advanced Go function</summary>

The function `fn.go` file below takes a composite resource (XR) as input and
produces managed resources (MRs) from the
[S3 provider][s3-provider-1]
based on its parameters.

The function always composes an S3 bucket. When the S3 bucket exists, it also
composes a bucket access control list (ACL). The ACL references the bucket by
name.

If the composite resource's `spec.versioning` field is `true`, the function
enables versioning by composing a bucket versioning configuration. Like the ACL,
the versioning configuration references the bucket by name.

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

	/ We'll collect our desired composed resources into this map, then convert
	/ them to the SDK's types and set them in the response when we return.
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

	/ Return early if Crossplane hasn't observed the bucket yet. This means it
	/ hasn't been created yet. This function will be called again after it is.
	observedBucket, ok := observedComposed["bucket"]
	if !ok {
		response.Normal(rsp, "waiting for bucket to be created").TargetCompositeAndClaim()
		return rsp, nil
	}

	/ The desired ACL, encryption, and versioning resources all need to refer
	/ to the bucket by its external name, which is stored in its external name
	/ annotation. Return early if the Bucket's external-name annotation isn't
	/ set yet.
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

</details>

</TabItem>
<TabItem value="XRD" label="XRD">

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
</TabItem>

<TabItem value="Composition" label="Composition">

The composition invokes the function to compose resources for an XR, then
invokes [`function-auto-ready`][function-auto-ready].
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
</TabItem>
</Tabs>

## Control plane project model

The Upbound programming model defines the core concepts you can use when
creating your control plane using Upbound.


Upbound builds embedded Go functions on top of Crossplane's [Go function
SDK][go-function-sdk-2], offering a simplified,
Upbound-specific development experience.


[visual-studio-code-extensions-documentation]: /reference/usage/vscode-extensions

[go]: https://www.golang.org
[go-function-sdk]: https://github.com/crossplane/function-sdk-go
[official-tutorials]: https://go.dev/learn/
[s3-provider]: https://marketplace.upbound.io/providers/upbound/provider-aws-s3
[s3-provider-1]: https://marketplace.upbound.io/providers/upbound/provider-aws-s3
[function-auto-ready]: https://marketplace.upbound.io/functions/crossplane-contrib/function-auto-ready/v0.3.0
[go-function-sdk-2]: https://github.com/crossplane/function-sdk-go
