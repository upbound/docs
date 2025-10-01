---
title: 2. Build your composition logic
description: Create a composition function
---

import GlobalLanguageSelector, { CodeBlock } from '@site/src/components/GlobalLanguageSelector';

<GlobalLanguageSelector />

In the previous guide, you created a brand new project and reviewed the
foundational components of your project. This guide walks through how to update
those components to create real resources in your Upbound organization.

## Prerequisites

Make sure you've completed the previous guide and have:

* [An Upbound account][up-account]
* [The Up CLI installed][up-cli]
* [kubectl installed][kubectl-installed]
* [Docker Desktop][docker-desktop] running
* A project with the basic structure (`upbound.yaml`, `apis/`,`examples/`)
* Provider dependencies added
* An XRD and Composition generated from your example claim

If you missed any of the previous steps, go to the [project foundations][project-foundations] guide to
get started.

## Generate a function

Composition functions allow you to write the logic for creating cloud resources
with programming languages like KCL, Python, or Go. 

With composition functions you can:

* Write code with familiar programming concepts like variables, loops, and
    conditions
* Catch errors with type safety before deployment
* Keep related logic together in an easier to parse format
* Test your infrastructure logic like any other code

Your composition function is a program you write that translates
your user's requests as the inputs and returns specific cloud resources as the
outputs.

Generate the composition function scaffolding and choose your preferred
language:

<CodeBlock cloud="aws" language="kcl">

```shell
up function generate example-function apis/storagebuckets/composition.yaml --language=kcl
```

</CodeBlock>

<CodeBlock cloud="aws" language="python">

```shell
up function generate example-function apis/storagebuckets/composition.yaml --language=python
```

</CodeBlock>

<!-- <CodeBlock cloud="aws" language="go">

```shell
up function generate example-function apis/storagebuckets/composition.yaml --language=go
```

</CodeBlock> -->

<CodeBlock cloud="azure" language="kcl">

```shell
up function generate example-function apis/storagebuckets/composition.yaml --language=kcl
```

</CodeBlock>

<CodeBlock cloud="azure" language="python">

```shell
up function generate example-function apis/storagebuckets/composition.yaml --language=python
```

</CodeBlock>

<!-- <CodeBlock cloud="azure" language="go">

```shell
up function generate example-function apis/storagebuckets/composition.yaml --language=go
```

</CodeBlock> -->

<CodeBlock cloud="gcp" language="kcl">

```shell
up function generate example-function apis/storagebuckets/composition.yaml --language=kcl
```

</CodeBlock>

<CodeBlock cloud="gcp" language="python">

```shell
up function generate example-function apis/storagebuckets/composition.yaml --language=python
```

</CodeBlock>

<!-- <CodeBlock cloud="gcp" language="go">

```shell
up function generate example-function apis/storagebuckets/composition.yaml --language=go
```

</CodeBlock> -->

This command creates a function directory and creates a new file based on your
chosen language.

## Create your function logic

Next, create the actual program logic that builds your cloud resources.


<CodeBlock cloud="aws" language="kcl">

Paste the following into `main.k`:

```yaml title="upbound-hello-world/functions/example-function/main.k"
import models.io.upbound.awsm.s3.v1beta1 as awsms3v1beta1

oxr = option("params").oxr      # observed composite resource
params = oxr.spec.parameters    # extract parameter values from XR

_metadata = lambda name: str -> any {
    {
        generateName = name         # due to global S3 naming restrictions we'll have 
                                    # Crossplane generate a name to garauntee uniqueness
        annotations = {
            "krm.kcl.dev/composition-resource-name" = name
        }
    }
}

_items: [any] = [
    # Create S3 Bucket
    awsms3v1beta1.Bucket {
        metadata: _metadata("{}-bucket".format(oxr.metadata.name))
        spec = {
            forProvider = {
                region = params.region
            }
        }
    },
    
    # Bucket BOC
    awsms3v1beta1.BucketOwnershipControls {
        metadata: _metadata("{}-boc".format(oxr.metadata.name))
        spec = {
            forProvider = {
                bucketSelector: {
                    matchControllerRef: True
                }
                region = params.region
                rule = {
                    objectOwnership = "BucketOwnerPreferred"
                }
            }
        }
    },
    
    # Bucket PAB
    awsms3v1beta1.BucketPublicAccessBlock {
        metadata: _metadata("{}-pab".format(oxr.metadata.name))
        spec = {
            forProvider = {
                bucketSelector: {
                    matchControllerRef: True
                }
                region = params.region
                blockPublicAcls: False
                ignorePublicAcls: False
                restrictPublicBuckets: False
                blockPublicPolicy: False
            }
        }
    },
    
    # Bucket ACL
    awsms3v1beta1.BucketACL {
        metadata: _metadata("{}-acl".format(oxr.metadata.name))
        spec = {
            forProvider = {
                bucketSelector: {
                    matchControllerRef: True
                }
                region = params.region
                acl = params.acl
            }
        }
    },
    
    # Default encryption for the bucket
    awsms3v1beta1.BucketServerSideEncryptionConfiguration {
        metadata: _metadata("{}-encryption".format(oxr.metadata.name))
        spec = {
            forProvider = {
                region = params.region
                bucketSelector: {
                    matchControllerRef: True
                }
                rule = [
                    {
                        applyServerSideEncryptionByDefault = {
                            sseAlgorithm = "AES256"
                        }
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
        awsms3v1beta1.BucketVersioning{
            metadata: _metadata("{}-versioning".format(oxr.metadata.name))
            spec = {
                forProvider = {
                    region = params.region
                    bucketSelector: {
                        matchControllerRef: True
                    }
                    versioningConfiguration = {
                        status = "Enabled"
                    }
                }
            }
        }
    ]

items = _items

```

</CodeBlock>

<CodeBlock cloud="aws" language="python">

Paste the following into `main.py`:

```python title="upbound-hello-world/functions/example-function/main.py"
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.com.example.platform.storagebucket import v1alpha1
from .model.io.upbound.m.aws.s3.bucket import v1beta1 as mbucketv1beta1
from .model.io.upbound.m.aws.s3.bucketacl import v1beta1 as maclv1beta1
from .model.io.upbound.m.aws.s3.bucketownershipcontrols import v1beta1 as mbocv1beta1
from .model.io.upbound.m.aws.s3.bucketpublicaccessblock import v1beta1 as mpabv1beta1
from .model.io.upbound.m.aws.s3.bucketversioning import v1beta1 as mverv1beta1
from .model.io.upbound.m.aws.s3.bucketserversideencryptionconfiguration import v1beta1 as mssev1beta1

def resource_name(xr, resource):
    return "{}-{}".format(xr.metadata.name, resource)

def default_metadata(name):
    return {
        "generateName": name
    }

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.StorageBucket(**req.observed.composite.resource)
    params = observed_xr.spec.parameters

    # Create S3 Bucket
    desired_bucket = mbucketv1beta1.Bucket(
        metadata = default_metadata(resource_name(observed_xr, "bucket")),
        spec = mbucketv1beta1.Spec(
            forProvider = mbucketv1beta1.ForProvider(
                region = params.region,
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)

    # Bucket BOC
    desired_boc = mbocv1beta1.BucketOwnershipControls(
        metadata = default_metadata(resource_name(observed_xr, "boc")),
        spec = mbocv1beta1.Spec(
            forProvider = mbocv1beta1.ForProvider(
                region = params.region,
                bucketSelector = mbocv1beta1.BucketSelector(matchControllerRef = True),
                rule = {
                    "objectOwnership": "BucketOwnerPreferred"
                }
            )
        ),
    )
    resource.update(rsp.desired.resources["boc"], desired_boc)

    # Bucket PAB
    desired_pab = mpabv1beta1.BucketPublicAccessBlock(
        metadata = default_metadata(resource_name(observed_xr, "pab")),
        spec=mpabv1beta1.Spec(
            forProvider = mpabv1beta1.ForProvider(
                region = params.region,
                bucketSelector = mpabv1beta1.BucketSelector(matchControllerRef = True),
                blockPublicAcls = False,
                ignorePublicAcls = False,
                restrictPublicBuckets = False,
                blockPublicPolicy = False,
            )
        ),
    )
    resource.update(rsp.desired.resources["pab"], desired_pab)

    # Bucket ACL
    desired_acl = maclv1beta1.BucketACL(
        metadata = default_metadata(resource_name(observed_xr, "acl")),
        spec = maclv1beta1.Spec(
            forProvider = maclv1beta1.ForProvider(
                region = params.region,
                bucketSelector = maclv1beta1.BucketSelector(matchControllerRef = True),
                acl = params.acl,
            ),
        ),
    )
    resource.update(rsp.desired.resources["acl"], desired_acl)
    
    # Default encryption for the bucket
    desired_sse = mssev1beta1.BucketServerSideEncryptionConfiguration(
        metadata = default_metadata(resource_name(observed_xr, "encryption")),
        spec = mssev1beta1.Spec(
            forProvider = mssev1beta1.ForProvider(
                region = params.region,
                bucketSelector = mssev1beta1.BucketSelector(matchControllerRef = True),
                rule = [
                    mssev1beta1.RuleItem(
                        applyServerSideEncryptionByDefault = {
                            "sseAlgorithm": "AES256"
                        },
                        bucketKeyEnabled = True
                    )
                ]
            ),
        ),
    )
    resource.update(rsp.desired.resources["sse"], desired_sse)

    # Set up versioning for the bucket if desired
    if params.versioning:    
        desired_versioning = mverv1beta1.BucketVersioning(
            metadata = default_metadata(resource_name(observed_xr, "versioning")),
            spec = mverv1beta1.Spec(
                forProvider = mverv1beta1.ForProvider(
                    region = params.region,
                    bucketSelector = mverv1beta1.BucketSelector(matchControllerRef = True),
                    versioningConfiguration = {
                        "status": "Enabled"
                    }
                ),
            ),
        )
        resource.update(rsp.desired.resources["versioning"], desired_versioning)
```

</CodeBlock>

<!-- <CodeBlock cloud="aws" language="go">

Paste the following into `fn.go`:

```go title="upbound-hello-world/functions/example-function/fn.go"
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

	var xr v1alpha1.StorageBucket
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

</CodeBlock> -->

<CodeBlock cloud="azure" language="kcl">

Paste the following into `main.k`:

```yaml title="upbound-hello-world/functions/example-function/main.k"

import regex
import models.io.upbound.azurem.v1beta1 as azuremv1beta1
import models.io.upbound.azurem.storage.v1beta1 as azuremstoragev1beta1

oxr = option("params").oxr      # observed composite resource
params = oxr.spec.parameters    # extract parameter values from XR
xr_metadata = oxr.metadata      # store XR metadata

_metadata = lambda name: str -> any {
    {
        name = name
        annotations = {
            "krm.kcl.dev/composition-resource-name" = name
        }
    }
}

sanitize_azure_storage_account_name = lambda name: str -> str {
    # Due to Azure's naming restrictions, storage account names must 
    # be between 3-24 characters in length and use numbers and lower-case letters only

    # lower string and remove illegal characters
    sanitized = name.lower()
    sanitized = regex.replace(sanitized, "[^a-z0-9]", "")
    
    # pad with 0s if string name less than 3 characters
    if len(sanitized) < 3:
        sanitized = "{:0<3}".format(sanitized)

    # trim string to 24 characters
    sanitized = sanitized[:24]
}

_items = [
    azuremv1beta1.ResourceGroup {
        metadata = _metadata("{}-group".format(xr_metadata.name))
        spec = {
            forProvider = {
                location = params.location
            }
        }
    },
    azuremstoragev1beta1.Account {
        metadata = _metadata(sanitize_azure_storage_account_name("{}account".format(xr_metadata.name)))
        spec = {
            forProvider = {
                accountTier = "Standard"
                accountReplicationType = "LRS"
                location = params.location
                blobProperties = {
                    versioningEnabled = params.versioning
                }
                infrastructureEncryptionEnabled = True
                resourceGroupNameSelector = {
                    matchControllerRef = True
                }
            }
        }
    },
    azuremstoragev1beta1.Container {
        metadata: _metadata("{}-container".format(xr_metadata.name))
        spec = {
            forProvider = {
                if params.acl == "public":
                    containerAccessType = "blob"
                else:
                    containerAccessType = "private"
                storageAccountNameSelector = {
                    matchControllerRef = True
                }
            }
        }
    }
]
items = _items

```

</CodeBlock>

<CodeBlock cloud="azure" language="python">

Paste the following into `main.py`:


```python title="upbound-hello-world/functions/example-function/main.py"
import re

from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.io.upbound.m.azure.resourcegroup import v1beta1 as rgv1beta1
from .model.io.upbound.m.azure.storage.account import v1beta1 as acctv1beta1
from .model.io.upbound.m.azure.storage.container import v1beta1 as contv1beta1
from .model.com.example.platform.storagebucket import v1alpha1

def resource_name(xr, resource):
    return "{}-{}".format(xr.metadata.name, resource)

def default_metadata(name):
    return {
        "name": name
    }

def sanitize_azure_storage_account_name(account_name):
    # Due to Azure's naming restrictions, storage account names must 
    # be between 3-24 characters in length and use numbers and lower-case letters only

    # Convert to lowercase and remove all non-alphanumeric characters
    sanitized = re.sub(r'[^a-z0-9]', '', account_name.lower())
    
    # Ensure minimum length of 3
    if len(sanitized) < 3:
        sanitized = sanitized.ljust(3, '0')
    
    # Ensure maximum length of 24
    if len(sanitized) > 24:
        sanitized = sanitized[:24]
    
    return sanitized

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.StorageBucket(**req.observed.composite.resource)
    params = observed_xr.spec.parameters

    desired_group = rgv1beta1.ResourceGroup(
        metadata = default_metadata(resource_name(observed_xr, "group")),
        spec = rgv1beta1.Spec(
            forProvider = rgv1beta1.ForProvider(
                location = params.location,
            ),
        ),
    )
    resource.update(rsp.desired.resources["group"], desired_group)

    desired_acct = acctv1beta1.Account(
        metadata = default_metadata(sanitize_azure_storage_account_name(resource_name(observed_xr, "account"))),
        spec = acctv1beta1.Spec(
            forProvider = acctv1beta1.ForProvider(
                accountTier = "Standard",
                accountReplicationType = "LRS",
                location = params.location,
                infrastructureEncryptionEnabled = True,
                blobProperties = {
                    "versioningEnabled": params.versioning
                },
                resourceGroupNameSelector = acctv1beta1.ResourceGroupNameSelector(matchControllerRef = True)
            ),
        ),
    )
    resource.update(rsp.desired.resources["account"], desired_acct)

    desired_cont = contv1beta1.Container(
        metadata = default_metadata(resource_name(observed_xr, "container")),
        spec = contv1beta1.Spec(
            forProvider = contv1beta1.ForProvider(
                containerAccessType = "blob" if params.acl == "public" else "private",
                storageAccountNameSelector = contv1beta1.StorageAccountNameSelector(matchControllerRef = True)
            ),
        ),
    )
    resource.update(rsp.desired.resources["container"], desired_cont)
```

</CodeBlock>

<!-- <CodeBlock cloud="azure" language="go">

Paste the following into `fn.go`:

```go title="upbound-hello-world/functions/example-function/fn.go"
package main

import (
	"context"
	"encoding/json"
	"strings"

	"dev.upbound.io/models/com/example/platform/v1alpha1"
	metav1 "dev.upbound.io/models/io/k8s/meta/v1"
	storagev1beta1 "dev.upbound.io/models/io/upbound/azure/storage/v1beta1"
	azv1beta1 "dev.upbound.io/models/io/upbound/azure/v1beta1"
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

	var xr v1alpha1.StorageBucket
	if err := convertViaJSON(&xr, observedComposite.Resource); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot convert xr"))
		return rsp, nil
	}

	params := xr.Spec.Parameters
	if ptr.Deref(params.Location, "") == "" {
		response.Fatal(rsp, errors.Wrap(err, "missing location"))
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

	resourceGroup := &azv1beta1.ResourceGroup{
		APIVersion: ptr.To("azure.upbound.io/v1beta1"),
		Kind:       ptr.To("ResourceGroup"),
		Spec: &azv1beta1.ResourceGroupSpec{
			ForProvider: &azv1beta1.ResourceGroupSpecForProvider{
				Location: params.Location,
			},
		},
	}
	desiredComposed["rg"] = resourceGroup

	/ Return early if Crossplane hasn't observed the resource group yet. This
	/ means it hasn't been created yet. This function will be called again
	/ after it is.
	observedResourceGroup, ok := observedComposed["rg"]
	if !ok {
		response.Normal(rsp, "waiting for resource group to be created").TargetCompositeAndClaim()
		return rsp, nil
	}

	/ The desired account needs to refer to the resource group by its external
	/ name, which is stored in its external name annotation. Return early if
	/ the ResourceGroup's external-name annotation isn't set yet.
	rgExternalName := observedResourceGroup.Resource.GetAnnotations()["crossplane.io/external-name"]
	if rgExternalName == "" {
		response.Normal(rsp, "waiting for resource group to be created").TargetCompositeAndClaim()
		return rsp, nil
	}

	/ Storage account names must be 3-24 character, lowercase alphanumeric
	/ strings that are globally unique within Azure. We try to generate a valid
	/ one automatically by deriving it from the XR name, which should always be
	/ alphanumeric, lowercase, and separated by hyphens.
	acctExternalName := strings.ReplaceAll(*xr.Metadata.Name, "-", "")

	acct := &storagev1beta1.Account{
		APIVersion: ptr.To("storage.azure.upbound.io/v1beta1"),
		Kind:       ptr.To("Account"),
		Metadata: &metav1.ObjectMeta{
			Annotations: &map[string]string{
				"crossplane.io/external-name": acctExternalName,
			},
		},
		Spec: &storagev1beta1.AccountSpec{
			ForProvider: &storagev1beta1.AccountSpecForProvider{
				ResourceGroupName:               &rgExternalName,
				AccountTier:                     ptr.To("Standard"),
				AccountReplicationType:          ptr.To("LRS"),
				Location:                        params.Location,
				InfrastructureEncryptionEnabled: ptr.To(true),
				BlobProperties: &[]storagev1beta1.AccountSpecForProviderBlobPropertiesItem{{
					VersioningEnabled: params.Versioning,
				}},
			},
		},
	}
	desiredComposed["acct"] = acct

	cont := &storagev1beta1.Container{
		APIVersion: ptr.To("storage.azure.upbound.io/v1beta1"),
		Kind:       ptr.To("Container"),
		Spec: &storagev1beta1.ContainerSpec{
			ForProvider: &storagev1beta1.ContainerSpecForProvider{
				StorageAccountName: &acctExternalName,
			},
		},
	}
	if ptr.Deref(params.ACL, "") == "public" {
		cont.Spec.ForProvider.ContainerAccessType = ptr.To("blob")
	} else {
		cont.Spec.ForProvider.ContainerAccessType = ptr.To("private")
	}
	desiredComposed["cont"] = cont

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

</CodeBlock> -->

<CodeBlock cloud="gcp" language="kcl">

Paste the following into `main.k`:

```yaml title="upbound-hello-world/functions/example-function/main.k"

import models.io.upbound.gcpm.storage.v1beta1 as gcpmstoragev1beta1

oxr = option("params").oxr      # observed composite resource
params = oxr.spec.parameters    # extract parameter values from XR 

_metadata = lambda name: str -> any {
    {
        name = name
        annotations = {
            "krm.kcl.dev/composition-resource-name" = name
        }
    }
}

_items: [any] = [
    # Create GCP Bucket
    gcpmstoragev1beta1.Bucket {
        metadata: _metadata("{}-bucket".format(oxr.metadata.name))
        spec = {
            forProvider = {
                location = params.location
                versioning = {
                    enabled = params.versioning
                }
            }
        }
    },

    # Bucket ACL
    gcpmstoragev1beta1.BucketACL {
        metadata: _metadata("{}-acl".format(oxr.metadata.name))
        spec = {
            forProvider = {
                predefinedAcl = params.acl
                bucketSelector = {
                    matchControllerRef = True
                }
            }
        }
    }
]

items = _items

```

</CodeBlock>

<CodeBlock cloud="gcp" language="python">

Paste the following into `main.py`:

```python title="upbound-hello-world/functions/example-function/main.py"

from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.upbound.m.gcp.storage.bucket import v1beta1 as mbucketv1beta1
from .model.io.upbound.m.gcp.storage.bucketacl import v1beta1 as maclv1beta1
from .model.com.example.platform.storagebucket import v1alpha1

def resource_name(xr, resource):
    return "{}-{}".format(xr.metadata.name, resource)

def default_metadata(name):
    return {
        "name": name
    }

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.StorageBucket(**req.observed.composite.resource)
    params = observed_xr.spec.parameters

    # Create GCP Bucket
    desired_bucket = mbucketv1beta1.Bucket(
        metadata = default_metadata(resource_name(observed_xr, "bucket")),
        spec = mbucketv1beta1.Spec(
            forProvider = mbucketv1beta1.ForProvider(
                location = params.location,
                versioning = {
                    "enabled": params.versioning
                }
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)

    # Bucket ACL
    desired_acl = maclv1beta1.BucketACL(
        metadata = default_metadata(resource_name(observed_xr, "acl")),
        spec = maclv1beta1.Spec(
            forProvider = maclv1beta1.ForProvider(
                predefinedAcl=params.acl,
                bucketSelector = maclv1beta1.BucketSelector(matchControllerRef = True)
            ),
        ),
    )
    resource.update(rsp.desired.resources["acl"], desired_acl)

```

</CodeBlock>

<!-- <CodeBlock cloud="gcp" language="go">

Paste the following into `fn.go`:

```go title="upbound-hello-world/functions/example-function/fn.go"
package main

import (
	"context"
	"encoding/json"

	"dev.upbound.io/models/com/example/platform/v1alpha1"
	"dev.upbound.io/models/io/upbound/gcp/storage/v1beta1"
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

	var xr v1alpha1.StorageBucket
	if err := convertViaJSON(&xr, observedComposite.Resource); err != nil {
		response.Fatal(rsp, errors.Wrap(err, "cannot convert xr"))
		return rsp, nil
	}

	params := xr.Spec.Parameters
	if ptr.Deref(params.Location, "") == "" {
		response.Fatal(rsp, errors.Wrap(err, "missing location"))
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
		APIVersion: ptr.To("storage.gcp.upbound.io/v1beta1"),
		Kind:       ptr.To("Bucket"),
		Spec: &v1beta1.BucketSpec{
			ForProvider: &v1beta1.BucketSpecForProvider{
				Location: params.Location,
				Versioning: &[]v1beta1.BucketSpecForProviderVersioningItem{{
					Enabled: params.Versioning,
				}},
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

	/ The desired ACL needs to refer to the bucket by its external name, which
	/ is stored in its external name annotation. Return early if the Bucket's
	/ external-name annotation isn't set yet.
	bucketExternalName := observedBucket.Resource.GetAnnotations()["crossplane.io/external-name"]
	if bucketExternalName == "" {
		response.Normal(rsp, "waiting for bucket to be created").TargetCompositeAndClaim()
		return rsp, nil
	}

	acl := &v1beta1.BucketACL{
		APIVersion: ptr.To("storage.gcp.upbound.io/v1beta1"),
		Kind:       ptr.To("BucketACL"),
		Spec: &v1beta1.BucketACLSpec{
			ForProvider: &v1beta1.BucketACLSpecForProvider{
				Bucket:        &bucketExternalName,
				PredefinedACL: params.ACL,
			},
		},
	}
	desiredComposed["acl"] = acl

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

</CodeBlock> -->

Save your composition file.

## Review your function

### Resource imports and user inputs

<CodeBlock cloud="aws" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
import models.io.upbound.awsm.s3.v1beta1 as awsms3v1beta1

oxr = option("params").oxr      # observed composite resource
params = oxr.spec.parameters    # extract parameter values from XR

```

This section:
<!-- vale Microsoft.Terms = NO -->
* Imports the cloud resource definitions required to create the resource
* Extracts the user-specified values in the claim (`params = oxr.spec.parameters`)
<!-- vale Microsoft.Terms = YES -->

</CodeBlock>

<CodeBlock cloud="aws" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.com.example.platform.storagebucket import v1alpha1
from .model.io.upbound.m.aws.s3.bucket import v1beta1 as mbucketv1beta1
from .model.io.upbound.m.aws.s3.bucketacl import v1beta1 as maclv1beta1
from .model.io.upbound.m.aws.s3.bucketownershipcontrols import v1beta1 as mbocv1beta1
from .model.io.upbound.m.aws.s3.bucketpublicaccessblock import v1beta1 as mpabv1beta1
from .model.io.upbound.m.aws.s3.bucketversioning import v1beta1 as mverv1beta1
from .model.io.upbound.m.aws.s3.bucketserversideencryptionconfiguration import v1beta1 as mssev1beta1

```

This section:
<!-- vale Microsoft.Terms = NO -->
* Imports the specific api version (e.g. `v1beta1`) of the python models for each cloud resource
* Imports the python model for our API we are building `.model.com.example.platform.storagebucket`
<!-- vale Microsoft.Terms = YES -->

</CodeBlock>

<!-- <CodeBlock cloud="aws" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
package main

import (
    "fmt"
    "context"
)

type BucketParams struct {
    Region string `json:"region"`
    Name   string `json:"name"`
}

func createBucketLogic(oxr *CompositeResource) (*BucketParams, error) {
    bucketName := fmt.Sprintf("%s-bucket", oxr.Metadata.Name)
    
    return &BucketParams{
        Region: oxr.Spec.Parameters.Region,
        Name:   bucketName,
    }, nil
}
```

</CodeBlock> -->

<CodeBlock cloud="azure" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"

import regex
import models.io.upbound.azurem.v1beta1 as azuremv1beta1
import models.io.upbound.azurem.storage.v1beta1 as azuremstoragev1beta1

oxr = option("params").oxr      # observed composite resource
params = oxr.spec.parameters    # extract parameter values from XR
xr_metadata = oxr.metadata      # store XR metadata

```

This section:
<!-- vale Microsoft.Terms = NO -->
* Imports the cloud resource definitions required to create the resource
* Extracts the user-specified values in the claim (`params = oxr.spec.parameters`)
* Stores the XR metadata to be used later on in the composition function
<!-- vale Microsoft.Terms = YES -->

</CodeBlock>

<CodeBlock cloud="azure" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
import re

from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.io.upbound.m.azure.resourcegroup import v1beta1 as rgv1beta1
from .model.io.upbound.m.azure.storage.account import v1beta1 as acctv1beta1
from .model.io.upbound.m.azure.storage.container import v1beta1 as contv1beta1
from .model.com.example.platform.storagebucket import v1alpha1
```

This section:
<!-- vale Microsoft.Terms = NO -->
* Imports the specific api version (e.g. `v1beta1`) of the python models for each cloud resource
* Imports the python model for our API we are building `.model.com.example.platform.storagebucket`
* Imports python regex library for use in a helper function
<!-- vale Microsoft.Terms = YES -->

</CodeBlock>

<!-- <CodeBlock cloud="azure" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
package main

import (
    "fmt"
    "context"
)

type StorageParams struct {
    Location string `json:"location"`
    Name     string `json:"name"`
}

func createStorageLogic(oxr *CompositeResource) (*StorageParams, error) {
    accountName := fmt.Sprintf("%s-storage", oxr.Metadata.Name)
    
    return &StorageParams{
        Location: oxr.Spec.Parameters.Location,
        Name:     accountName,
    }, nil
}
```

</CodeBlock> -->

<CodeBlock cloud="gcp" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
import models.io.upbound.gcpm.storage.v1beta1 as gcpmstoragev1beta1

oxr = option("params").oxr      # observed composite resource
params = oxr.spec.parameters    # extract parameter values from XR 
```

This section:
<!-- vale Microsoft.Terms = NO -->
* Imports the cloud resource definitions required to create the resource
* Extracts the user-specified values in the claim (`params = oxr.spec.parameters`)
<!-- vale Microsoft.Terms = YES -->


</CodeBlock>

<CodeBlock cloud="gcp" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.upbound.m.gcp.storage.bucket import v1beta1 as mbucketv1beta1
from .model.io.upbound.m.gcp.storage.bucketacl import v1beta1 as maclv1beta1
from .model.com.example.platform.storagebucket import v1alpha1
```

This section:
<!-- vale Microsoft.Terms = NO -->
* Imports the specific api version (e.g. `v1beta1`) of the python models for each cloud resource
* Imports the python model for our API we are building `.model.com.example.platform.storagebucket`
<!-- vale Microsoft.Terms = YES -->

</CodeBlock>

<!-- <CodeBlock cloud="gcp" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
package main

import (
    "fmt"
    "context"
    "cloud.google.com/go/storage"
)

type GCPBucketParams struct {
    Location string `json:"location"`
    Name     string `json:"name"`
}

func createGCPBucketLogic(oxr *CompositeResource) (*GCPBucketParams, error) {
    bucketName := fmt.Sprintf("%s-bucket", oxr.Metadata.Name)
    
    return &GCPBucketParams{
        Location: oxr.Spec.Parameters.Location,
        Name:     bucketName,
    }, nil
}
```

</CodeBlock> -->

### Metadata and helper functions

<CodeBlock cloud="aws" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"

_metadata = lambda name: str -> any {
    {
        generateName = name         # due to global S3 naming restrictions we'll have 
                                    # Crossplane generate a name to garauntee uniqueness
        annotations = {
            "krm.kcl.dev/composition-resource-name" = name
        }
    }
}

```

</CodeBlock>

<CodeBlock cloud="aws" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"

def resource_name(xr, resource):
    return "{}-{}".format(xr.metadata.name, resource)

def default_metadata(name):
    return {
        "generateName": name
    }

```

</CodeBlock>

<!-- <CodeBlock cloud="aws" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
func createMetadata(name string) map[string]interface{} {
    return map[string]interface{}{
        "name": name,
        "annotations": map[string]string{
            "krm.kcl.dev/composition-resource-name": name,
        },
    }
}
```

</CodeBlock> -->

<CodeBlock cloud="azure" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
_metadata = lambda name: str -> any {
    {
        name = name
        annotations = {
            "krm.kcl.dev/composition-resource-name" = name
        }
    }
}

sanitize_azure_storage_account_name = lambda name: str -> str {
    # Due to Azure's naming restrictions, storage account names must 
    # be between 3-24 characters in length and use numbers and lower-case letters only

    # lower string and remove illegal characters
    sanitized = name.lower()
    sanitized = regex.replace(sanitized, "[^a-z0-9]", "")
    
    # pad with 0s if string name less than 3 characters
    if len(sanitized) < 3:
        sanitized = "{:0<3}".format(sanitized)

    # trim string to 24 characters
    sanitized = sanitized[:24]
}
```

</CodeBlock>

<CodeBlock cloud="azure" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"

def resource_name(xr, resource):
    return "{}-{}".format(xr.metadata.name, resource)

def default_metadata(name):
    return {
        "name": name
    }

def sanitize_azure_storage_account_name(account_name):
    # Due to Azure's naming restrictions we know that a storage account name must 
    # be between 3-24 characters in length and only use numbers and lower-case letters only

    # Convert to lowercase and remove all non-alphanumeric characters
    sanitized = re.sub(r'[^a-z0-9]', '', account_name.lower())
    
    # Ensure minimum length of 3
    if len(sanitized) < 3:
        sanitized = sanitized.ljust(3, '0')
    
    # Ensure maximum length of 24
    if len(sanitized) > 24:
        sanitized = sanitized[:24]
    
    return sanitized

```

</CodeBlock>

<!-- <CodeBlock cloud="azure" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
func createMetadata(name string) map[string]interface{} {
    return map[string]interface{}{
        "name": name,
        "annotations": map[string]string{
            "krm.kcl.dev/composition-resource-name": name,
        },
    }
}
```

</CodeBlock> -->

<CodeBlock cloud="gcp" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
_metadata = lambda name: str -> any {
    {
        name = name
        annotations = {
            "krm.kcl.dev/composition-resource-name" = name
        }
    }
}
```

</CodeBlock>

<CodeBlock cloud="gcp" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
def resource_name(xr, resource):
    return "{}-{}".format(xr.metadata.name, resource)

def default_metadata(name):
    return {
        "name": name
    }
```

</CodeBlock>

<!-- <CodeBlock cloud="gcp" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
func createMetadata(name string) map[string]interface{} {
    return map[string]interface{}{
        "name": name,
        "annotations": map[string]string{
            "krm.kcl.dev/composition-resource-name": name,
        },
    }
}
```

</CodeBlock> -->

This section:

* Standardizes resource naming
* Adds required labels and annotations where needed
* Leverages helper functions to sanitize naming where applicable
* Reduces metadata duplication

### Cloud resource definition

<CodeBlock cloud="aws" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Create S3 Bucket
    awsms3v1beta1.Bucket {
        metadata: _metadata("{}-bucket".format(oxr.metadata.name))
        spec = {
            forProvider = {
                region = params.region
            }
        }
    },
```

</CodeBlock>

<CodeBlock cloud="aws" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# Create S3 Bucket
desired_bucket = mbucketv1beta1.Bucket(
    metadata = default_metadata(resource_name(observed_xr, "bucket")),
    spec = mbucketv1beta1.Spec(
        forProvider = mbucketv1beta1.ForProvider(
            region = params.region,
        ),
    ),
)
resource.update(rsp.desired.resources["bucket"], desired_bucket)
```

</CodeBlock>

<!-- <CodeBlock cloud="aws" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
func createS3Bucket(bucketName, region string) map[string]interface{} {
    return map[string]interface{}{
        "apiVersion": "s3.aws.upbound.io/v1beta1",
        "kind":       "Bucket",
        "metadata":   createMetadata(bucketName),
        "spec": map[string]interface{}{
            "forProvider": map[string]interface{}{
                "region": region,
            },
        },
    }
}
```

</CodeBlock> -->

<CodeBlock cloud="azure" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
azuremstoragev1beta1.Account {
    metadata = _metadata(sanitize_azure_storage_account_name("{}account".format(xr_metadata.name)))
    spec = {
        forProvider = {
            accountTier = "Standard"
            accountReplicationType = "LRS"
            location = params.location
            blobProperties = {
                versioningEnabled = params.versioning
            }
            infrastructureEncryptionEnabled = True
            resourceGroupNameSelector = {
                matchControllerRef = True
            }
        }
    }
},
```

</CodeBlock>

<CodeBlock cloud="azure" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
desired_acct = acctv1beta1.Account(
    metadata = default_metadata(sanitize_azure_storage_account_name(resource_name(observed_xr, "account"))),
    spec = acctv1beta1.Spec(
        forProvider = acctv1beta1.ForProvider(
            accountTier = "Standard",
            accountReplicationType = "LRS",
            location = params.location,
            infrastructureEncryptionEnabled = True,
            blobProperties = {
                "versioningEnabled": params.versioning
            },
            resourceGroupNameSelector = acctv1beta1.ResourceGroupNameSelector(matchControllerRef = True)
        ),
    ),
)
resource.update(rsp.desired.resources["account"], desired_acct)
```

</CodeBlock>

<!-- <CodeBlock cloud="azure" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
func createStorageAccount(accountName, location, resourceGroup string) map[string]interface{} {
    return map[string]interface{}{
        "apiVersion": "storage.azure.upbound.io/v1beta1",
        "kind":       "Account",
        "metadata":   createMetadata(accountName),
        "spec": map[string]interface{}{
            "forProvider": map[string]interface{}{
                "location":               location,
                "resourceGroupName":      resourceGroup,
                "accountTier":           "Standard",
                "accountReplicationType": "LRS",
            },
        },
    }
}
```

</CodeBlock> -->

<CodeBlock cloud="gcp" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Create GCP Bucket
gcpmstoragev1beta1.Bucket {
    metadata: _metadata("{}-bucket".format(oxr.metadata.name))
    spec = {
        forProvider = {
            location = params.location
            versioning = {
                enabled = params.versioning
            }
        }
    }
},
```

</CodeBlock>

<CodeBlock cloud="gcp" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# Create GCP Bucket
desired_bucket = mbucketv1beta1.Bucket(
    metadata = default_metadata(resource_name(observed_xr, "bucket")),
    spec = mbucketv1beta1.Spec(
        forProvider = mbucketv1beta1.ForProvider(
            location = params.location,
            versioning = {
                "enabled": params.versioning
            }
        ),
    ),
)
resource.update(rsp.desired.resources["bucket"], desired_bucket)
```

</CodeBlock>

<!-- <CodeBlock cloud="gcp" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
func createGCSBucket(bucketName, location, project string) map[string]interface{} {
    return map[string]interface{}{
        "apiVersion": "storage.gcp.upbound.io/v1beta1",
        "kind":       "Bucket",
        "metadata":   createMetadata(bucketName),
        "spec": map[string]interface{}{
            "forProvider": map[string]interface{}{
                "location": location,
                "project":  project,
            },
        },
    }
}
```

</CodeBlock> -->

This section:

* Creates the primary resource for your chosen cloud provider
* Inserts your claim parameters as required fields
* Applies the metadata function to the resource


### Security configuration

<CodeBlock cloud="aws" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Bucket BOC
awsms3v1beta1.BucketOwnershipControls {
    metadata: _metadata("{}-boc".format(oxr.metadata.name))
    spec = {
        forProvider = {
            bucketSelector: {
                matchControllerRef: True
            }
            region = params.region
            rule = {
                objectOwnership = "BucketOwnerPreferred"
            }
        }
    }
},

# Bucket PAB
awsms3v1beta1.BucketPublicAccessBlock {
    metadata: _metadata("{}-pab".format(oxr.metadata.name))
    spec = {
        forProvider = {
            bucketSelector: {
                matchControllerRef: True
            }
            region = params.region
            blockPublicAcls: False
            ignorePublicAcls: False
            restrictPublicBuckets: False
            blockPublicPolicy: False
        }
    }
},
```
</CodeBlock>

<CodeBlock cloud="aws" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# Bucket BOC
desired_boc = mbocv1beta1.BucketOwnershipControls(
    metadata = default_metadata(resource_name(observed_xr, "boc")),
    spec = mbocv1beta1.Spec(
        forProvider = mbocv1beta1.ForProvider(
            region = params.region,
            bucketSelector = mbocv1beta1.BucketSelector(matchControllerRef = True),
            rule = {
                "objectOwnership": "BucketOwnerPreferred"
            }
        )
    ),
)
resource.update(rsp.desired.resources["boc"], desired_boc)

# Bucket PAB
desired_pab = mpabv1beta1.BucketPublicAccessBlock(
    metadata = default_metadata(resource_name(observed_xr, "pab")),
    spec=mpabv1beta1.Spec(
        forProvider = mpabv1beta1.ForProvider(
            region = params.region,
            bucketSelector = mpabv1beta1.BucketSelector(matchControllerRef = True),
            blockPublicAcls = False,
            ignorePublicAcls = False,
            restrictPublicBuckets = False,
            blockPublicPolicy = False,
        )
    ),
)
resource.update(rsp.desired.resources["pab"], desired_pab)
```

</CodeBlock>

<!-- <CodeBlock cloud="aws" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
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

```

</CodeBlock> -->

<CodeBlock cloud="azure" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Azure handles security through the storage account configuration
# infrastructureEncryptionEnabled is set to True in the Account spec

azuremstoragev1beta1.Account {
    ...
    spec = {
        forProvider = {
            ...
            infrastructureEncryptionEnabled = True
            ...
        }
    }
},
```

</CodeBlock>

<CodeBlock cloud="azure" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# Security is configured in the storage account spec

desired_acct = acctv1beta1.Account(
    ...
    spec = acctv1beta1.Spec(
        forProvider = acctv1beta1.ForProvider(
            ...
            infrastructureEncryptionEnabled = True,
            ...
        ),
    ),
)
resource.update(rsp.desired.resources["account"], desired_acct)

```

</CodeBlock>

<!-- <CodeBlock cloud="azure" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
// Security is configured in the storage account
InfrastructureEncryptionEnabled: ptr.To(true),
```

</CodeBlock> -->

<CodeBlock cloud="gcp" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# GCP buckets have default encryption enabled automatically
```

</CodeBlock>

<CodeBlock cloud="gcp" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# GCP buckets have default encryption enabled automatically
```

</CodeBlock>

<!-- <CodeBlock cloud="gcp" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
# GCP buckets have default encryption enabled automatically
```

</CodeBlock> -->


This section:

* Applies object ownership to the bucket
* Allows for public access to the bucket

### Access control and encryption

<CodeBlock cloud="aws" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Bucket ACL
awsms3v1beta1.BucketACL {
    metadata: _metadata("{}-acl".format(oxr.metadata.name))
    spec = {
        forProvider = {
            bucketSelector: {
                matchControllerRef: True
            }
            region = params.region
            acl = params.acl
        }
    }
},

# Default encryption for the bucket
awsms3v1beta1.BucketServerSideEncryptionConfiguration {
    metadata: _metadata("{}-encryption".format(oxr.metadata.name))
    spec = {
        forProvider = {
            region = params.region
            bucketSelector: {
                matchControllerRef: True
            }
            rule = [
                {
                    applyServerSideEncryptionByDefault = {
                        sseAlgorithm = "AES256"
                    }
                    bucketKeyEnabled = True
                }
            ]
        }
    }
}
```
</CodeBlock>

<CodeBlock cloud="aws" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# Bucket ACL
desired_acl = maclv1beta1.BucketACL(
    metadata = default_metadata(resource_name(observed_xr, "acl")),
    spec = maclv1beta1.Spec(
        forProvider = maclv1beta1.ForProvider(
            region = params.region,
            bucketSelector = maclv1beta1.BucketSelector(matchControllerRef = True),
            acl = params.acl,
        ),
    ),
)
resource.update(rsp.desired.resources["acl"], desired_acl)

# Default encryption for the bucket
desired_sse = mssev1beta1.BucketServerSideEncryptionConfiguration(
    metadata = default_metadata(resource_name(observed_xr, "encryption")),
    spec = mssev1beta1.Spec(
        forProvider = mssev1beta1.ForProvider(
            region = params.region,
            bucketSelector = mssev1beta1.BucketSelector(matchControllerRef = True),
            rule = [
                mssev1beta1.RuleItem(
                    applyServerSideEncryptionByDefault = {
                        "sseAlgorithm": "AES256"
                    },
                    bucketKeyEnabled = True
                )
            ]
        ),
    ),
)
resource.update(rsp.desired.resources["sse"], desired_sse)
```

</CodeBlock>

<!-- <CodeBlock cloud="aws" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
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
```

</CodeBlock> -->

<CodeBlock cloud="azure" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Container access control
azuremstoragev1beta1.Container {
    ...
    spec = {
        forProvider = {
            if params.acl == "public":
                containerAccessType = "blob"
            else:
                containerAccessType = "private"
            ...
        }
    }
}
```

</CodeBlock>

<CodeBlock cloud="azure" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
desired_cont = contv1beta1.Container(
    ...
    spec = contv1beta1.Spec(
        forProvider = contv1beta1.ForProvider(
            containerAccessType = "blob" if params.acl == "public" else "private",
            ...
        ),
    ),
)
resource.update(rsp.desired.resources["container"], desired_cont)
```

</CodeBlock>

<!-- <CodeBlock cloud="azure" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
cont := &storagev1beta1.Container{
    APIVersion: ptr.To("storage.azure.upbound.io/v1beta1"),
    Kind:       ptr.To("Container"),
    Spec: &storagev1beta1.ContainerSpec{
        ForProvider: &storagev1beta1.ContainerSpecForProvider{
            StorageAccountName: &acctExternalName,
        },
    },
}
if ptr.Deref(params.ACL, "") == "public" {
    cont.Spec.ForProvider.ContainerAccessType = ptr.To("blob")
} else {
    cont.Spec.ForProvider.ContainerAccessType = ptr.To("private")
}
desiredComposed["cont"] = cont
```

</CodeBlock> -->

<CodeBlock cloud="gcp" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Bucket ACL
gcpmstoragev1beta1.BucketACL {
    ...
    spec = {
        forProvider = {
            predefinedAcl = params.acl
            ...
        }
    }
}
```

</CodeBlock>

<CodeBlock cloud="gcp" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# Bucket ACL
desired_acl = maclv1beta1.BucketACL(
    ...
    spec = maclv1beta1.Spec(
        forProvider = maclv1beta1.ForProvider(
            predefinedAcl=params.acl,
            ...
        ),
    ),
)
resource.update(rsp.desired.resources["acl"], desired_acl)
```

</CodeBlock>

<!-- <CodeBlock cloud="gcp" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
acl := &v1beta1.BucketACL{
    APIVersion: ptr.To("storage.gcp.upbound.io/v1beta1"),
    Kind:       ptr.To("BucketACL"),
    Spec: &v1beta1.BucketACLSpec{
        ForProvider: &v1beta1.BucketACLSpecForProvider{
            Bucket:        &bucketExternalName,
            PredefinedACL: params.ACL,
        },
    },
}
desiredComposed["acl"] = acl
```

</CodeBlock> -->


This section:

* Sets the access level using the user's ACL parameter
* Automatically enables encryption for all objects

### Bucket versioning

<CodeBlock cloud="aws" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Set up versioning for the bucket if desired
if params.versioning:
    _items += [
        awsms3v1beta1.BucketVersioning{
            metadata: _metadata("{}-versioning".format(oxr.metadata.name))
            spec = {
                forProvider = {
                    region = params.region
                    bucketSelector: {
                        matchControllerRef: True
                    }
                    versioningConfiguration = {
                        status = "Enabled"
                    }
                }
            }
        }
    ]

```

</CodeBlock>

<CodeBlock cloud="aws" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# Set up versioning for the bucket if desired
if params.versioning:    
    desired_versioning = mverv1beta1.BucketVersioning(
        metadata = default_metadata(resource_name(observed_xr, "versioning")),
        spec = mverv1beta1.Spec(
            forProvider = mverv1beta1.ForProvider(
                region = params.region,
                bucketSelector = mverv1beta1.BucketSelector(matchControllerRef = True),
                versioningConfiguration = {
                    "status": "Enabled"
                }
            ),
        ),
    )
    resource.update(rsp.desired.resources["versioning"], desired_versioning)
```

</CodeBlock>

<!-- <CodeBlock cloud="aws" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
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
```

</CodeBlock> -->

<CodeBlock cloud="azure" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Versioning is configured in the storage account blob properties
azuremstoragev1beta1.Account {
    ...
    spec = {
        forProvider = {
            ...
            blobProperties = {
                versioningEnabled = params.versioning
            }
            ...
        }
    }
},
```

</CodeBlock>

<CodeBlock cloud="azure" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# Versioning is configured in the storage account blob properties
desired_acct = acctv1beta1.Account(
    ...
    spec = acctv1beta1.Spec(
        forProvider = acctv1beta1.ForProvider(
            ...
            blobProperties = {
                "versioningEnabled": params.versioning
            },
            ...
        ),
    ),
)
resource.update(rsp.desired.resources["account"], desired_acct)
```

</CodeBlock>

<!-- <CodeBlock cloud="azure" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
// Versioning is configured in the storage account
BlobProperties: &[]storagev1beta1.AccountSpecForProviderBlobPropertiesItem{{
    VersioningEnabled: params.Versioning,
}},
```

</CodeBlock> -->

<CodeBlock cloud="gcp" language="kcl">

```yaml-noCopy title="upbound-hello-world/functions/example-function/main.k"
# Versioning is configured directly in the bucket spec
gcpmstoragev1beta1.Bucket {
    ...
    spec = {
        forProvider = {
            ...
            versioning = {
                enabled = params.versioning
            }
        }
    }
},
```

</CodeBlock>

<CodeBlock cloud="gcp" language="python">

```python-noCopy title="upbound-hello-world/functions/example-function/main.py"
# Versioning is configured directly in the bucket spec
desired_bucket = mbucketv1beta1.Bucket(
    ...
    spec = mbucketv1beta1.Spec(
        forProvider = mbucketv1beta1.ForProvider(
            ...
            versioning = {
                "enabled": params.versioning
            }
        ),
    ),
)
resource.update(rsp.desired.resources["bucket"], desired_bucket)
```

</CodeBlock>

<!-- <CodeBlock cloud="gcp" language="go">

```go-noCopy title="upbound-hello-world/functions/example-function/fn.go"
// Versioning is configured in the bucket spec
bucket := &v1beta1.Bucket{
    APIVersion: ptr.To("storage.gcp.upbound.io/v1beta1"),
    Kind:       ptr.To("Bucket"),
    Spec: &v1beta1.BucketSpec{
        ForProvider: &v1beta1.BucketSpecForProvider{
            Location: params.Location,
            Versioning: &[]v1beta1.BucketSpecForProviderVersioningItem{{
                Enabled: params.Versioning,
            }},
        },
    },
}
```

</CodeBlock> -->


This section:

* Only creates versioning if requested in the claim
* Captures the items defined in the function as a single variable.

Save your changes.

## Render your composition locally

The `up composition render` command allows you to review your desired composed
resources. 

Render the composition against your XR file:

```shell
up composition render apis/storagebuckets/composition.yaml examples/storagebucket/example.yaml
```

This process ensures the build, configuration, and orchestration runs as
expected before you deploy to a development control plane.
<!-- vale write-good.TooWordy = NO -->
Errors in the render command can indicate a malformed function or other issues
within the composition itself.

<!-- vale write-good.TooWordy = YES -->
## Next steps

You constructed a new embedded function that allows user input from your claim
file. This function uses your composition to create a fully configured storage
resources to your specifications.

The next guide walks through how to test your composition function logic with
the built-in test suite.

[up-account]: https://www.upbound.io/register/?utm_source=docs&utm_medium=cta&utm_campaign=docs_get_started
[project-foundations]: /getstarted/builders-workshop/project-foundations
[up-cli]: /manuals/cli/overview
[kubectl-installed]: https://kubernetes.io/docs/tasks/tools/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
