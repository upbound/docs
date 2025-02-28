---
title: "Running and testing your Control Plane Projects"
weight: 7
description: "How to run your control plane project on a development control
plane"
aliases:
    - /core-concepts/testing
    - core-concepts/testing
---

The Upbound testing framework follows a standardized directory structure:

```ini {copy-lines="none"}
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

This structure separates tests from your APIs and ensures they aren't bundled
into package deployments. Customize the test directory location by updating the
`ProjectPaths` configuration in your `upbound.yaml` file.

## Composition tests

Composition tests validate the logic of your compositions without requiring a live environment. They simulate the composition controller's behavior, allowing you to test resource creation, dependencies, and state transitions with mock data.

Composition tests validate composition logic without required a live
environment. They simulate the composition controller's behavior, letting you
test resource creation, dependencies, and state transitions with mock data.

### Generate a composition test

You can generate test scaffolding automatically when you create a composition or
use `up test generate` for standalone tests. You can write tests in KCL, Python,
or YAML.


For example, to generate a standalone test in KCL for an existing composition,
provide the test name, XR path, and XRD path:

```ini {copy-lines="all"}
up test generate <name> --xr <path> --xrd <path> --language=kcl
```

### Author a composition test

Composition tests use a declarative API in KCL, Python, or YAML. Each test
models a single composition controller loop, making testing more streamlined for
reading and debugging.

This testing framework simulates the Crossplane composition controller. The
controller evaluates the current state of resources, processes the composition,
and makes necessary changes. The framework recreates this process locally to
verify composition logic.

```yaml
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

### Complex testing scenarios


For compositions requiring multiple controller loops (with one resource
depending on another, for example), create separate tests for each stage.

Mock states help test scenarios like:

1. Resources that already exist.
2. How your composition handles different resource states.
3. Conditional dependency chains between resources.


Below is a table of available `spec` fields for authoring tests:
<!-- vale write-good.TooWordy= NO -->
{{< table "table table-sm table-striped">}}
| **Field**                  | **Description**                                          | **Optional** |
|----------------------------|----------------------------------------------------------|-------------|
| `spec.xr`                  | The composite resource (XR) - inline or path       | No          |
| `spec.xrd`                 | The XR definition - inline or path                 | No          |
| `spec.composition`         | The composition definition - inline or path        | No          |
| `spec.timeout`             | Time to wait for test completion (default: 30 seconds)         | Yes         |
| `spec.validate`            | Validate managed resources against schemas              | Yes         |
| `spec.observedResources`   | Additional observed resources - inline or path     | Yes         |
| `spec.extraResources`      | Additional resources - inline or path              | Yes         |
| `spec.context`             | Context for the Function Pipeline - inline or path | Yes         |
| `spec.assert`              | Assertions to validate resources after test completion  | Yes         |
{{< /table >}}

### Run a composition test

You can run your composition tests using the ``up test run`` command.


To run all tests, define the path and `*` to include
everything in that directory.
```shell
up test run tests/*
```

To run a specific test, give the full path of that test:

```shell
up test run tests/xstoragebucket/suite-1/bucket-config.k
```

You can provide wildcards to run tests matching a pattern:

```shell
up test run tests/network/**/*.k
```

The command returns a summary of results:

```shell {copy-lines="none"}
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

## End-to-end tests

End-to-end tests validate compositions in real environments, ensuring creation,
deletion, and operations work as expected.

### Generate an end-to-end test

You can use the `up` CLI to generate end-to-end tests:

```shell
up test generate <name> --xr <path> --xrd <path> --type=e2e --language=kcl
```

### Author an end-to-end test

End-to-end tests use the `E2ETest` API, written in KCL, Python, or YAML.

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

{{< table "table table-sm table-striped">}}
| **Field**                     | **Description**                                           | **Optional** |
|--------------------------------|-----------------------------------------------------------|-------------|
| `spec.crossplane.version`      | Version of Universal Crossplane to install              | No          |
| `spec.crossplane.autoUpgrade`  | Auto upgrade configuration for Crossplane               | No          |
| `spec.timeoutSeconds`          | Timeout value for the test in seconds                   | No          |
| `spec.ttl`                     | Time-to-live for the development control plane in seconds | No          |
| `spec.skipDelete`              | Whether to skip deletion of resources during cleanup    | No          |
| `spec.defaultConditions`       | Default conditions for the resources                    | No          |
|{ `spec.manifests`               | List of manifests for resources to be tested           | No          |
| `spec.extraResources`          | Additional resources - inline or path             | Yes         |
{{< /table >}}

### Run an end-to-end test

To run all end-to-end tests,define the path and `*` to include everything in that directory:

```shell
up test run --e2e tests/**/*.k
```

To run a specific test, give the full path of that test:

```shell
up test run --e2e tests/xstoragebucket/e2e-aws/*.k
```

When you run E2E tests, Upbound:

1. Detects the test language and converts to a unified format.
2. Builds and pushes the project.
3. Creates a development control plane with the specified Crossplane version.
4. Sets the context to the new control plane.
5. Applies extra resources in order and waits for their conditions.
6. Executes tests and validates results.
7. Exports resources for debugging on failure.
8. Cleans up the control plane when tests complete or the TTL expires.


### Run your control plane project

To run your control plane projects on a development control plane, use the `up
project run` command.

This command creates a development control plane in the Upbound cloud, and deploy your project's package to it. A development control plane is a lightweight, ephemeral control plane that are perfect for testing your Crossplane configurations.

This command creates a development control plane in Upbound Cloud and deploys
your project's package. Development control planes are lightweight and
ephemeral, making them ideal for testing Crossplane configurations.

Now, you can validate your results, and make any changes to test your resources.

For more information, review the [development control plane documentation]({{< ref
"dev-cps" >}}).
<!-- vale write-good.TooWordy = YES -->
