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

<CodeBlock cloud="aws" language="kcl">

```yaml title="tests/test-storagebucket/main.k"
import models.com.example.platform.v1alpha1 as platformv1alpha1
import models.io.upbound.awsm.s3.v1beta1 as awsms3v1beta1
import models.io.upbound.dev.meta.v1alpha1 as metav1alpha1

_items = [
    metav1alpha1.CompositionTest{
        metadata.name="test-storagebucket"
        spec = {
            assertResources: [
                platformv1alpha1.StorageBucket{
                    metadata.name: "example"
                    spec.parameters: {
                        acl: "public-read"
                        region: "us-west-1"
                        versioning: True
                    }
                }
                awsms3v1beta1.Bucket{
                    metadata = {
                        generateName = "example-bucket"
                        labels = {
                            "platform.example.com/bucket" = "example-bucket"
                        }
                    }
                    spec.forProvider: {
                        region: "us-west-1"
                    }
                }
                awsms3v1beta1.BucketOwnershipControls{
                    metadata.generateName: "example-boc"
                    spec.forProvider: {
                        bucketSelector = {
                            matchLabels = {
                                "platform.example.com/bucket" = "example-bucket"
                            }
                        }
                        region: "us-west-1"
                        rule: {
                            objectOwnership: "BucketOwnerPreferred"
                        }
                    }
                }
                awsms3v1beta1.BucketPublicAccessBlock{
                    metadata.generateName: "example-pab"
                    spec.forProvider: {
                        blockPublicAcls: False
                        blockPublicPolicy: False
                        bucketSelector = {
                            matchLabels = {
                                "platform.example.com/bucket" = "example-bucket"
                            }
                        }
                        ignorePublicAcls: False
                        region: "us-west-1"
                        restrictPublicBuckets: False
                    }
                }
                awsms3v1beta1.BucketACL{
                    metadata.generateName: "example-acl"
                    spec.forProvider:{
                        acl: "public-read"
                        bucketSelector = {
                            matchLabels = {
                                "platform.example.com/bucket" = "example-bucket"
                            }
                        }
                        region: "us-west-1"
                    }
                }
                awsms3v1beta1.BucketServerSideEncryptionConfiguration{
                    metadata.generateName: "example-encryption"
                    spec.forProvider: {
                        bucketSelector = {
                            matchLabels = {
                                "platform.example.com/bucket" = "example-bucket"
                            }
                        }
                        region: "us-west-1"
                        rule: [
                            {
                                applyServerSideEncryptionByDefault: {
                                    sseAlgorithm: "AES256"
                                }
                                bucketKeyEnabled: True
                            }
                        ]
                    }
                }
                awsms3v1beta1.BucketVersioning{
                    metadata.generateName: "example-versioning"
                    spec.forProvider: {
                        bucketSelector = {
                            matchLabels = {
                                "platform.example.com/bucket" = "example-bucket"
                            }
                        }
                        region: "us-west-1"
                        versioningConfiguration: {
                            status: "Enabled"
                        }
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
</CodeBlock>

<CodeBlock cloud="azure" language="kcl">

```yaml title="tests/test-storagebucket/main.k"
import models.com.example.platform.v1alpha1 as platformv1alpha1
import models.io.upbound.azurem.storage.v1beta1 as azuremstoragev1beta1
import models.io.upbound.azurem.v1beta1 as azuremv1beta1
import models.io.upbound.dev.meta.v1alpha1 as metav1alpha1


_items = [
    metav1alpha1.CompositionTest{
        metadata.name="test-storagebucket"
        spec= {
            assertResources: [
                platformv1alpha1.AzureBucket {
                    metadata.name: "example"
                    spec.parameters: {
                        location: "eastus"
                        versioning: True
                        acl: "public"
                    }
                }
                azuremv1beta1.ResourceGroup {
                    metadata.name = "example-group"
                    spec.forProvider = {
                        location = "eastus"
                    }
                }
                azuremstoragev1beta1.Account {
                    metadata.name = "example"
                    spec.forProvider = {
                        accountTier = "Standard"
                        accountReplicationType = "LRS"
                        location = "eastus"
                        blobProperties = {
                            versioningEnabled = True
                        }
                        infrastructureEncryptionEnabled = True
                        resourceGroupNameRef = {
                            name = "example-group"
                        }
                    }
                }
                azuremstoragev1beta1.Container {
                    metadata.name = "example-container"
                    spec.forProvider = {
                        containerAccessType = "blob"
                        storageAccountNameRef = {
                            name = "example"
                        }
                    }
                }
            ]
            compositionPath: "apis/azurebuckets/composition.yaml"
            xrPath: "examples/azurebucket/example.yaml"
            xrdPath: "apis/azurebuckets/definition.yaml"
            timeoutSeconds: 120
            validate: False
        }
    }
]
items= _items
```
</CodeBlock>


## Review your test

### Import the testing models

<CodeBlock cloud="aws" language="kcl">

```yaml-noCopy title="tests/test-storagebucket/main.k"
import models.com.example.platform.v1alpha1 as platformv1alpha1
import models.io.upbound.awsm.s3.v1beta1 as awsms3v1beta1
import models.io.upbound.dev.meta.v1alpha1 as metav1alpha1
```

This section imports:

* Your custom StorageBucket XRD
* AWS S3 resource schemas for validation
* Upbound testing framework components

</CodeBlock>

<CodeBlock cloud="azure" language="kcl">

```yaml-noCopy title="tests/test-storagebucket/main.k"
import models.com.example.platform.v1alpha1 as platformv1alpha1
import models.io.upbound.azurem.storage.v1beta1 as azuremstoragev1beta1
import models.io.upbound.azurem.v1beta1 as azuremv1beta1
import models.io.upbound.dev.meta.v1alpha1 as metav1alpha1
```

This section imports:

* Your custom StorageBucket XRD
* Azure Storage and Azure Resource Group schemas for validation
* Upbound testing framework components

</CodeBlock>

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

<CodeBlock cloud="aws" language="kcl">

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

* Your composition receives the user's claim
* Your control plane processes the `acl`, `region` and `versioning` parameters
* The control plane maintains the resource name and structure

</CodeBlock>

<CodeBlock cloud="azure" language="kcl">

```yaml-noCopy title="tests/test-storagebucket/main.k"
assertResources: [
    platformv1alpha1.AzureBucket {
        metadata.name: "example"
        spec.parameters: {
            region: "eastus"
            versioning: True
            acl: "public"
        }
    }
```

This assertion verifies:

* Your composition receives the user's claim
* Your control plane processes the `acl`, `location` and `versioning` parameters
* The control plane maintains the resource name and structure

</CodeBlock>



<CodeBlock cloud="aws" language="kcl">
### Test the core S3 bucket


```yaml-noCopy title="tests/test-storagebucket/main.k"
awsms3v1beta1.Bucket{
    metadata = {
        generateName = "example-bucket"
        labels = {
            "platform.example.com/bucket" = "example-bucket"
        }
    }
    spec.forProvider: {
        region: "us-west-1"
    }
}
```


This assertion verifies that:

* The main S3 bucket resource exists
* The bucket uses the expected generated naming pattern (`example-bucket`)
* The bucket uses the user's specified region parameter
* The bucket has the correct label added `platform.example.com/bucket` with value `example-bucket`

### Test security configurations


```yaml-noCopy title="tests/test-storagebucket/main.k"
awsms3v1beta1.BucketOwnershipControls{
    metadata.generateName: "example-boc"
    spec.forProvider: {
        bucketSelector = {
            matchLabels = {
                "platform.example.com/bucket" = "example-bucket"
            }
        }
        region: "us-west-1"
        rule: {
            objectOwnership: "BucketOwnerPreferred"
        }
    }
}
awsms3v1beta1.BucketPublicAccessBlock{
    metadata.generateName: "example-pab"
    spec.forProvider: {
        blockPublicAcls: False
        blockPublicPolicy: False
        bucketSelector = {
            matchLabels = {
                "platform.example.com/bucket" = "example-bucket"
            }
        }
        ignorePublicAcls: False
        region: "us-west-1"
        restrictPublicBuckets: False
    }
}
```


This section tests to verify:

* Correct bucket selection to apply configuration to
* Proper object ownership configuration
* Correct settings for public bucket access
* Security configuration applied to the bucket

### Test access control and encryption


```yaml-noCopy title="tests/test-storagebucket/main.k"
awsms3v1beta1.BucketACL{
    metadata.generateName: "example-acl"
    spec.forProvider:{
        acl: "public-read"
        bucketSelector = {
            matchLabels = {
                "platform.example.com/bucket" = "example-bucket"
            }
        }
        region: "us-west-1"
    }
}
awsms3v1beta1.BucketServerSideEncryptionConfiguration{
    metadata.generateName: "example-encryption"
    spec.forProvider: {
        bucketSelector = {
            matchLabels = {
                "platform.example.com/bucket" = "example-bucket"
            }
        }
        region: "us-west-1"
        rule: [
            {
                applyServerSideEncryptionByDefault: {
                    sseAlgorithm: "AES256"
                }
                bucketKeyEnabled: True
            }
        ]
    }
}
```


These tests ensure the control plane:

* Correct bucket selection to apply configuration to
* Applies the user's access control preference
* Enabled encryption by default
* Applies security configurations consistently

</CodeBlock>

<CodeBlock cloud="azure" language="kcl">

</CodeBlock>

### Test conditional features

<CodeBlock cloud="aws" language="kcl">
```yaml-noCopy title="tests/test-storagebucket/main.k"
awsms3v1beta1.BucketVersioning{
    metadata.generateName: "example-versioning"
    spec.forProvider: {
        bucketSelector = {
            matchLabels = {
                "platform.example.com/bucket" = "example-bucket"
            }
        }
        region: "us-west-1"
        versioningConfiguration: {
            status: "Enabled"
        }
    }
}
```

</CodeBlock>

<CodeBlock cloud="azure" language="kcl">

</CodeBlock>


This assertion verifies:

* Correct bucket selection to configure versioning
* Versioning resource only exists when `versioning: True`
* The control plane sets versioning to "Enabled" 
* The control plane links versioning to the bucket 

### Final test structure

Your complete test now:
<!-- vale write-good.Passive = NO -->
* Simulates a user's StorageBucket claim
* Verifies resource creation
* Ensures resources are linked together
* Confirms user inputs flow through to AWS resources
<!-- vale write-good.Passive = YES -->

<CodeBlock cloud="gcp" language="kcl">

</CodeBlock>

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
* **Resource validation**: Confirmation for resource creation
* **Error details**: Specific information about any failures
* **Coverage summary**: Overview of the assertions

### What successful tests prove

Passing tests show:

<!-- vale Microsoft.Adverbs = NO -->
<!-- vale write-good.Passive = NO -->
* Your composition function logic is correct
* User parameters processed properly
* All required AWS resources are created
* Security configurations are applied consistently
* Conditional logic works as expected

## Next steps

Now that you have tested your composition:
<!-- vale write-good.Weasel = NO -->
<!-- vale gitlab.FutureTense = NO -->
<!-- vale Google.Will = NO -->
* **Deploy with confidence**: Your tests prove the composition works
* **Iterate safely**: Make changes knowing tests will catch regressions
* **Add more test cases**: Test different parameter combinations and edge cases
* **Integrate with CI/CD**: Automate testing as part of your development workflow
<!-- vale write-good.Passive = YES -->
<!-- vale Microsoft.Adverbs = YES -->
<!-- vale Google.Will = YES -->
<!-- vale write-good.Weasel = YES -->

In the next guide, you'll deploy your tested composition to a control plane and see your infrastructure API in action.

<!-- vale gitlab.FutureTense = YES -->

[project-foundations]: /getstarted/builders-workshop/project-foundations
[up-account]: https://www.upbound.io/register/?utm_source=docs&utm_medium=cta&utm_campaign=docs_get_started

[up-cli]: /manuals/cli/overview
[kubectl-installed]: https://kubernetes.io/docs/tasks/tools/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
