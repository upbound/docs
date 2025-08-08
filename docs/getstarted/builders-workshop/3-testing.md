---
title: 3. Test your composition
description: Create a composition function test
---

In the previous guide, you used an embedded function to create composition logic
for your cloud resources. This guide walks through how to create a test plan.
Tests allow you to:

* Validate your composition configuration without impacting actual resources in your control planes. 
* Catch errors earlier in your workflow
* Verify resource creation
* Validate input parameters

## Prerequisites

Make sure you've completed the previous guide and have:

* [An Upbound account][up-account]
* [The Up CLI installed][up-cli]
* [kubectl installed][kubectl-installed]
* [Docker Desktop][docker-desktop] running
* A project with the basic structure (`upbound.yaml`, `apis/`, `examples/`)
* Provider dependencies added 
* An XRD generated from your example claim
* An embedded function that defines your composition logic

If you missed any of the previous steps, go to the [project
foundations][project-foundations] guide to get started.

## Generate a composition function test 

Create the test scaffolding:

```shell
up test generate storagebucket
```

This command:

* Creates a test directory in `tests/test-storagebucket`
* Generates the basic structure for writing tests

:::note
The default testing language is KCL. You can specify `--langauage=python` in
the test command
:::

## Set up your test imports

Open `tests/test-storagebucket/main.k` and replace the scaffolding with the
following configuration:

```yaml title="tests/test-storagebucket/main.k"
import models.com.example.platform.v1alpha1 as platformv1alpha1
import models.io.upbound.aws.s3.v1beta1 as s3v1beta1
import models.io.upbound.dev.meta.v1alpha1 as metav1alpha1

_items = [
    metav1alpha1.CompositionTest{
        metadata.name="test-storagebucket"
        spec= {
            assertResources: [
                platformv1alpha1.StorageBucket{
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
            compositionPath: "apis/storagebuckets/composition.yaml"
            xrPath: "examples/storagebucket/example.yaml"
            xrdPath: "apis/storagebuckets/definition.yaml"
            timeoutSeconds: 120
            validate: False
        }
    }
]
items = _items
```



## Review your test

### Import the testing models

```yaml-noCopy title="tests/test-storagebucket/main.k"
import models.com.example.platform.v1alpha1 as platformv1alpha1
import models.io.upbound.aws.s3.v1beta1 as s3v1beta1
import models.io.upbound.dev.meta.v1alpha1 as metav1alpha1
```


This section imports:

* Your custom StorageBucket XRD
* AWS S3 resource schemas for validation
* Upbound testing framework components

### Define your test case

Create the main test structure:

```yaml-noCopy title="tests/test-storagebucket/main.k"
_items = [
    metav1alpha1.CompositionTest{
        metadata.name="test-storagebucket"
        spec= {
            assertResources: [
                # Test assertions will go here
            ]
            compositionPath: "apis/storagebuckets/composition.yaml"
            xrPath: "examples/storagebucket/example.yaml"
            xrdPath: "apis/storagebuckets/definition.yaml"
            timeoutSeconds: 120
            validate: False
        }
    }
]
```


This section:
* Identifies your test case
* Sets up the `assertResources` section to define expected outputs
* Links to your composition, XR and XRD files
* Defines how long to wait for the test to complete
* Defines Whether to validate against live schemas

### Test the input claim


```yaml-noCopy title="tests/test-storagebucket/main.k"
assertResources: [
    platformv1alpha1.StorageBucket{
        metadata.name: "example"
        spec.parameters: {
            acl: "public-read"
            region: "us-west-1"
            versioning: True
        }
    }
```


This assertion verifies:

* Your composition receives the user's claim correctly
* The `acl`, `region`, and `versioning` parameters are processed
* The name and structure are maintained

### Test the core S3 bucket


```yaml-noCopy title="tests/test-storagebucket/main.k"
    s3v1beta1.Bucket{
        metadata.name: "example-bucket"
        spec.forProvider: {
            region: "us-west-1"
        }
    }
```


This assertion verifies that:

* The main S3 bucket resource exists
* The bucket uses the expected naming pattern (`example-bucket`)
* The bucket uses the user's specified region parameter

### Test security configurations


```yaml-noCopy title="tests/test-storagebucket/main.k"
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
```


This section tests to verify:

* Proper object ownership configuration
* Correct settings for public bucket access
* Security configuration applied to the bucket

### Test access control and encryption


```yaml-noCopy title="tests/test-storagebucket/main.k"
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
```


These tests ensure:

* User's access control preference is applied
* AES256 encryption is enabled by default
* Security configurations are applied consistently

### Test conditional features


```yaml-noCopy title="tests/test-storagebucket/main.k"
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
items = _items

```


This assertion verifies:

* Versioning resource only exists when `versioning: True`
* When enabled, versioning is set to "Enabled" status
* Versioning is correctly linked to the bucket


### Final test structure

Your complete test now:

* Simulates a user's StorageBucket claim
* Verifies all AWS resources are created correctly
* Ensures resources are properly linked together
* Confirms user inputs flow through to AWS resources

## Run your tests

Next, run your composition tests with the `up test run` command.

```shell {copy-lines=1}
up test run tests/*
  ✓   Parsing tests                                                                                                                                
  ✓   Checking dependencies
  ✓   Generating language schemas
  ✓   Building functions
  ✓   Checking dependencies
  ✓   Generating language schemas
  ✓   Building functions
  ✓   Building configuration package
  ✓   Pushing embedded functions to local daemon
  ✓   Assert test-storagebucket
 SUCCESS  
 SUCCESS  Tests Summary:
 SUCCESS  ------------------
 SUCCESS  Total Tests Executed: 1
 SUCCESS  Passed tests:         1
 SUCCESS  Failed tests:         0
```


### Understanding test results

Your test results return:

* **Pass/fail status**: Whether each assertion succeeded
* **Resource validation**: Confirmation that expected resources are created
* **Error details**: Specific information about any failures
* **Coverage summary**: Overview of what was tested

### What successful tests prove

Passing tests demonstrate:

* Your composition function logic is correct
* User parameters are processed properly
* All required AWS resources are created
* Security configurations are applied consistently
* Conditional logic works as expected

## Next steps

Now that you have tested your composition:

* **Deploy with confidence**: Your tests prove the composition works correctly
* **Iterate safely**: Make changes knowing tests will catch regressions
* **Add more test cases**: Test different parameter combinations and edge cases
* **Integrate with CI/CD**: Automate testing as part of your development workflow

In the next guide, you'll deploy your tested composition to a control plane and see your infrastructure API in action.


[project-foundations]: /getstarted/builders-workshop/project-foundations
[up-account]: https://www.upbound.io/register/a
[up-cli]: /manuals/cli/overview
[kubectl-installed]: https://kubernetes.io/docs/tasks/tools/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
