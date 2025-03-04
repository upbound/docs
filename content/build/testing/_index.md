---
title: "Running and testing your Control Plane Projects"
weight: 7
description: "How to run your control plane project on a development controlplane"
cascade:
    product: testing-api
aliases:
    - /core-concepts/testing
    - core-concepts/testing
---

Testing ensures your compositions and control planes work as expected, follow best practices, and meet your organizations requirements. You can generate tests for your compositions with the `up test generate` command.

{{< hint type="important" >}}
This feature is in preview. [Contact Upbound](https://www.upbound.io/contact) if you want to try it out.
{{< /hint >}}


## Prerequisites

To test your compositions and run end-to-end tests, make sure you have:

* The `up` CLI `v0.38` or higher [installed](https://docs.upbound.io/reference/cli/)
* An Upbound account
* The [Kyverno Chainsaw binary installed](https://kyverno.github.io/chainsaw/0.1.1/install/)

## Testing directory

The Upbound testing framework follows a standardized directory structure:

```ini {copy-lines="none"}
    tests/
    │
    ├── <test-suite>/
    │   ├── kcl.mod
    │   └── main.k
    │
    ├── <test-suite>/
    │   ├── requirements.txt
    │   └── main.py
    │
    ├── <e2e-test-name>/
    │   ├── kcl.mod
    │   └── main.k
```

This structure separates tests from your APIs and ensures they aren't bundled
into package deployments. Customize the test directory location by updating the
`ProjectPaths` configuration in your `upbound.yaml` file.

## Composition tests

Composition tests validate the logic of your compositions without requiring a
live environment. They simulate the composition controller's behavior, allowing
you to test resource creation, dependencies, and state transitions with mock
data.

Composition tests validate composition logic without required a live
environment. They simulate the composition controller's behavior, letting you
test resource creation, dependencies, and state transitions with mock data.

### Generate a composition test

You can generate test with `up test generate` for composition tests.
You can write tests in KCL or Python.

For example, to generate a composition test:

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
```ini {copy-lines="all"}
up test generate <name> --language=python
```
<!-- /Python -->

<!-- KCL -->
```ini {copy-lines="all"}
up test generate <name> --language=kcl
```
<!-- /KCL -->
{{< /content-selector >}}

### Author a composition test

Composition tests use a declarative API in KCL or Python. Each test
models a single composition controller loop, making testing more streamlined for
reading and debugging.

This testing command simulates the Crossplane composition controller. The
controller evaluates the current state of resources, processes the composition,
and makes necessary changes. The command recreates this process locally to
verify composition logic.

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
```python
from .model.io.upbound.dev.meta.compositiontest import v1alpha1 as compositiontest
from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as k8s

test = compositiontest.CompositionTest(
    metadata=k8s.ObjectMeta(
        name="test-xstoragebucket-default-python",
    ),
    spec = compositiontest.Spec(
        assertResources=[],
        compositionPath="apis/xstoragebuckets/composition.yaml",
        xrPath="examples/xstoragebuckets/example.yaml",
        xrdPath="apis/xstoragebuckets/definition.yaml",
        timeoutSeconds=120,
        validate=False,
    )
)
```
<!-- /Python -->
<!-- KCL -->
```shell
import models.io.upbound.dev.meta.v1alpha1 as metav1alpha1

_items = [
    metav1alpha1.CompositionTest{
        metadata.name="test-xstoragebucket-default-kcl"
        spec= {
            assertResources: []
            compositionPath: "apis/xstoragebuckets/composition.yaml"
            xrPath: "examples/xstoragebuckets/example.yaml"
            xrdPath: "apis/xstoragebuckets/definition.yaml"
            timeoutSeconds: 120
            validate: False
        }
    }
]
items = _items
```
<!-- /KCL -->
{{< /content-selector >}}

### Complex testing scenarios

For compositions requiring multiple controller loops (with one resource
depending on another, for example), create separate tests for each stage.

Mock states help test scenarios like:

1. Resources that already exist.
2. How your composition handles different resource states.
3. Conditional dependency chains between resources.

### Run a composition test

You can run your composition tests using the `up test run` command.

To run all tests, define the path and `*` to include
everything in that directory.
```shell
up test run tests/*
```

To run a specific test, give the full path of that test:

```shell
up test run tests/xstoragebucket-default/main.k
```

You can provide wildcards to run tests matching a pattern:

```shell
up test run tests/xstoragebucket/**/*.k
```

The command returns a summary of results:

```shell {copy-lines="none"}
up test run tests/*
...
 SUCCESS
 SUCCESS  Tests Summary:
 SUCCESS  ------------------
 SUCCESS  Total Tests Executed: 4
 SUCCESS  Passed tests:         4
 SUCCESS  Failed tests:         0
```

When you run Compositions tests, Upbound:

1. Detects the test language and converts to a unified format.
2. Builds and pushes the project to local daemon.
3. Sets the context to the new control plane.
4. Executes tests and validates results.

## End-to-end tests

End-to-end tests validate compositions in real environments, ensuring creation,
deletion, and operations work as expected.

### Generate an end-to-end test

You can generate test with `up test generate` for end-to-end tests.
You can write tests in KCL or Python.

For example, to generate a end-to-end test:

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
```ini {copy-lines="all"}
up test generate <name> --e2e --language=python
```
<!-- /Python -->

<!-- KCL -->
```ini {copy-lines="all"}
up test generate <name> --e2e --language=kcl
```
<!-- /KCL -->
{{< /content-selector >}}

### Author an end-to-end test

End-to-end tests use the `E2ETest` API, written in KCL or Python.

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
```python
from .model.io.upbound.dev.meta.e2etest import v1alpha1 as e2etest
from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as k8s
from .model.com.example.platform.xstoragebucket import v1alpha1 as xstoragebucket
from .model.io.upbound.aws.providerconfig import v1beta1 as providerconfig

bucket_manifest = xstoragebucket.XStorageBucket(
    metadata=k8s.ObjectMeta(
        name="uptest-bucket-xr",
    ),
    spec=xstoragebucket.Spec(
        parameters=xstoragebucket.Parameters(
            acl="private",
            region="eu-central-1",
            versioning=True,
        ),
    ),
)

provider_config = providerconfig.ProviderConfig(
    metadata=k8s.ObjectMeta(
        name="default",
    ),
    spec=providerconfig.Spec(
        credentials=providerconfig.Credentials(
            source="Upbound",
            upbound=providerconfig.Upbound(
                webIdentity=providerconfig.WebIdentity(
                    roleARN="arn:aws:iam::609897127049:role/example-project-aws-uptest",
                ),
            ),
        ),
    ),
)

test = e2etest.E2ETest(
    metadata=k8s.ObjectMeta(
        name="e2etest-xstoragebucket-python",
    ),
    spec=e2etest.Spec(
        crossplane=e2etest.Crossplane(
            autoUpgrade=e2etest.AutoUpgrade(
                channel=e2etest.Channel.Rapid,
            ),
        ),
        defaultConditions=[
            "Ready",
        ],
        manifests=[bucket_manifest.model_dump()],
        extraResources=[provider_config.model_dump()],
        skipDelete=False,
        timeoutSeconds=4500,
    )
)
```
<!-- /Python -->
<!-- KCL -->
```shell
import models.com.example.platform.v1alpha1 as platformv1alpha1
import models.io.upbound.aws.v1beta1 as awsv1beta1
import models.io.upbound.dev.meta.v1alpha1 as metav1alpha1

_items = [
    metav1alpha1.E2ETest{
        metadata.name = "e2etest-xstoragebucket-kcl"
        spec = {
            crossplane.autoUpgrade.channel = "Rapid"
            defaultConditions = [
                "Ready"
            ]
            manifests = [
                platformv1alpha1.XStorageBucket{
                    metadata.name = "uptest-bucket-xr"
                    spec.parameters = {
                        acl = "private"
                        region = "eu-central-1"
                        versioning: True
                    }
                }
            ]
            extraResources = [
                awsv1beta1.ProviderConfig{
                    metadata.name = "default"
                    spec.credentials = {
                        source = "Upbound"
                        upbound.webIdentity = {
                            roleARN = "arn:aws:iam::123456789101:role/example-project-aws-uptest"
                        }
                    }
                }
            ]
            skipDelete = False
            timeoutSeconds = 4500
        }
    }
]
items = _items
```
<!-- /KCL -->
{{< /content-selector >}}

### Run an end-to-end test

You can run your end-to-end tests using the `up test run` command.

To run all tests, define the path and `*` to include
everything in that directory.
```shell
up test run --e2e tests/*
```

To run a specific test, give the full path of that test:

```shell
up test run --e2e tests/e2etest-xstoragebucket-default/main.k
```

You can provide wildcards to run tests matching a pattern:

```shell
up test run --e2e tests/xstoragebucket/**/*.k
```

The command returns a summary of results:

```shell {copy-lines="none"}
up test run --e2e tests/*
...
 SUCCESS
 SUCCESS  Tests Summary:
 SUCCESS  ------------------
 SUCCESS  Total Tests Executed: 4
 SUCCESS  Passed tests:         4
 SUCCESS  Failed tests:         0
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

To run your control plane projects on a development control plane, use the
`up project run` command.

This command creates a development control plane in the Upbound, and
deploy your project's package to it. A development control plane is a
lightweight, ephemeral control plane that are perfect for testing your
Crossplane configurations.

This command creates a development control plane in Upbound and deploys
your project's package. Development control planes are lightweight and
ephemeral, making them ideal for testing Crossplane configurations.

Now, you can validate your results, and make any changes to test your resources.

For more information, review the [development control plane documentation]({{< ref
"dev-cps" >}}).
<!-- vale write-good.TooWordy = YES -->

<!-- vale off -->

## Test API Explorer

<!-- vale on -->

<!-- ignore "aggregate" -->
<!-- vale write-good.TooWordy = YES -->
