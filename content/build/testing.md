---
title: "Running and testing your Control Plane Projects"
weight: 7
description: "How to run your control plane project on a development control
plane"
aliases:
    - /core-concepts/testing
    - core-concepts/testing
---
TESTING YOUR COMPOSITIONS WITH UPBOUND

The Upbound testing framework follows a standardized directory structure:
```shell
    tests/<xrd-plural>/
    │
    ├── <test-suite>/
    │   ├── kcl.mod
    │   └── test.k
    │
    ├── <test-suite>/
    │   ├── requirements.txt
    │   └── test.py
    │
    ├── <e2e-test-name>/
    │   ├── kcl.mod
    │   └── e2e.k
```

This structure keeps tests separate from your APIs, preventing them from being bundled into your package deployments. You can customize the test directory location by updating the ProjectPaths configuration in your upbound.yaml file.

COMPOSITION TESTS

Composition tests validate the logic of your compositions without requiring a live environment. They simulate the composition controller's behavior, allowing you to test resource creation, dependencies, and state transitions with mock data.

GENERATE A COMPOSITION TEST
You can generate test stubs automatically when creating a composition or you can generate standalone tests using the up test generate command. Composition tests can be written in KCL, Python or YAML.

```shell
    # Generate a standalone test in KCL for an existing composition
    up test generate <name> --xr <path> --xrd <path> --language=kcl
```

AUTHORING A COMPOSITION TEST
Composition tests use a declarative API that can be written in KCL, Python, or YAML. Each test models a single loop of the composition controller. This makes tests tests easy to understand and simple to debug. 

The testing framework simulates how the Crossplane composition controller works in a real environment. Normally, the controller looks at the current state of resources, processes your composition to figure out what should exist, and then makes changes to create, update, or delete resource. The testing framework recreates this process locally, letting you verify your composition logic works correctly.

```shell
    import models.io.upbound.dev.meta.v1alpha1.test as testv1alpha1

    test = testv1alpha1.CompositionTest{
        metadata.name="default"
        spec={
            composition="apis/xstoragebucket/composition.yaml"
            xr="examples/xstroagebucket/example.yaml"
            xrd="apis/xstoragebucket/definition.yaml"
        }
    }
```

TESTING COMPLEX SCENARIOS
For compositions that need multiple controller loops (like when one resource depends on another being ready), you create separate tests for each stage.

You can also provide mock states, that lets you test scenarios like
1. What happens when resources are already created
2. How your composition handles various resource states
3. Conditional dependency chains between resources

Below is a table of the specification fields you can use to author your tests
- spec.xr : The composite resource (XR) - inline or file path
- spec.xrd : The XR definition - inline or file path
- spec.composition : The composition definition - inline or file path
- spec.timeout : Optional. Time to wait for test completion (default: 30s)
- spec.validate : Optional. Validate managed resources against schemas
- spec.observedResources : Optional. Additional observed resources - inline or file path
- spec.extraResources : Optional. Additional resources - inline or file path
- spec.context : Optional. Context for the Function Pipeline - inline or file path
- spec.assert : Optional. Assertions to validate resources after test completion

RUNNING A COMPOSITION TEST
You can run your composition tests using the up test run command.

```shell
    # Run all tests in a directory
    up test run tests/*

    # Run a specific test file
    up test run tests/xstoragebucket/suite-1/bucket-config.k

    # Run tests matching a pattern
    up test run tests/network/**/*.k
```

The command will output a summary of results:

```shell
    Execution Summary:
    ------------------
    Total Tests Executed: 8
    Successful Tests:     6
    Warnings:             1
    Errors:               1
    Timeouts:             0

    Details:
    - tests/network/suite-1/vpc-test.k:      SUCCESS
    - tests/network/suite-2/subnet-test.k:   SUCCESS
    - tests/storage/suite-1/bucket-large.k:  ERROR (Loop: Policy: validate-bucket-policy)
    - tests/storage/suite-2/small-bucket.k:  WARNING
```
E2E TESTS

E2E tests validate the full lifecycle of your compositions by interacting with real providers and resources. They ensure that creation, deletion, and other operations work correctly in real-world scenarios.

CREATING E2E TESTS
Similarly to composition tests, you can use the Up CLI to generate end-to-end tests. 

```shell
    # Generate an e2e test for an existing composition
    up test generate <name> --xr <path> --xrd <path> --type=e2e --language=kcl
```

WRITING E2E TESTS
E2E tests use the E2ETest API, which can be written in KCL, Python, or YAML.

```shell
    import models.com.example.platform.v1alpha1.xstoragebucket as xstoragebucketv1alpha1
    import models.io.upbound.dev.meta.v1alpha1.e2etest as t
    import models.io.upbound.aws.v1beta1 as pc

    _test1 = t.E2ETest{
        spec:{
            timeoutSeconds: 3600
            crossplane:{
                version: "1.16.4-up.1"
            }
            manifests: [
                xstoragebucketv1alpha1.XStorageBucket{
                    metadata.name: "test-bucket"
                    spec.parameters: {
                        region: "eu-central-1"
                        acl: "private"
                        versioning: True
                    }
                },
            ]
            extraResources: [
                pc.ProviderConfig{
                    metadata.name: "default"
                    spec.credentials: {
                        source: "Upbound"
                        upbound: {
                            webIdentity: {
                                roleARN: "arn:aws:iam::123456789012:role/upbound-access"
                            }
                        }
                    }
                }
            ]
        }
    }

    items = [_test1]
```
Below is a list of specification fields you can use to author your e2e tests
- spec.crossplane.version : Version of Universal Crossplane to install
- spec.crossplane.autoUpgrade : Auto upgrade configuration for Crossplane
- spec.timeoutSeconds : Timeout value for the test in seconds
- spec.ttl : Time-to-live for the development control plane in seconds
- spec.skipDelete : Whether to skip deletion of resources during cleanup
- spec.defaultConditions : Default conditions for the resources
- spec.manifests: List of manifests for resources to be tested
- spec.extraResources : Optional. Additional resources - inline or file path

RUNNING E2E TESTS

Run E2E tests using the following command

```shell
    # Run all E2E tests
    up test run --e2e tests/**/*.k

    # Run specific E2E tests
    up test run --e2e tests/xstoragebucket/e2e-aws/*.k
```

When you run E2E tests, Upbound
1. Detects the test language and converts to a unified format
2. Builds and pushes the project
3. Creates a development control plane with the specified Crossplane version
4. Sets the context to the new control plane
5. Applies extra resources in order and waits for their conditions
6. Executes the tests and validates results
7. On failure, exports resources for debugging
8. Cleans up the control plane when tests complete or the TTL expires

RUN YOUR CONTROL PLANE PROJECTS
To run your control plane projects, run them on development control planes via the following command.

```shell
up project run
```

This command creates a development control plane in the Upbound cloud, and deploy your project's package to it. A development control plane is a lightweight, ephemeral control plane that are perfect for testing your Crossplane configurations.

Now, you can validate your results, and make any changes to test your resources.

For more information, review the [development control plane documentation]({{< ref
"dev-cps" >}}).
