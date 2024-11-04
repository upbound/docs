---
title: "Authoring a Composition in your Control Plane Projects"
weight: 4
description: "Define your first composition in your control plane project"
---

Let's take the XRD we authored in our previous step, and use it to generate a composition.

## Scaffold the composition from the XRD
In the root folder of your control plane project, run the [up composition generate]({{< ref
"content/reference/cli/command-reference" >}}) command.
<!--- TODO(tr0njavolta): update CLI link --->

```shell
up composition generate apis/xbuckets/definition.yaml
```

This will scaffold a composition for you in `apis/xbuckets/composition.yaml`

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  creationTimestamp: null
  name: xbuckets.devexdemo.upbound.io
spec:
  compositeTypeRef:
    apiVersion: devexdemo.upbound.io/v1alpha1
    kind: XBucket
  mode: Pipeline
  pipeline:
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: crossplane-contrib-function-auto-ready
```

## Generate an embedded function
Now we want to generate an embedded function to define the logic of our composition. Embedded functions are composition functions that are built, packaged, and managed as part of a configuration. They allow you to write composition logic in familiar programming languages rather than using the YAML-based patch-and-transform system built into Crossplane.

Run the following command
```shell
up function generate --language=kcl test-function apis/xbuckets/composition.yaml
```

This command will generate an embedded function in KCL called `test-function` inside `functions/test-function/main.k`. This command also generates schema models that we will soon utilize for a delightful composition authoring experience.

Your composition file should also have updated to include the newly generated function in its pipeline. Your pipeline should look something like the YAML below.

```yaml
  pipeline:
  - functionRef:
      name: acmeco-devexdemotest-function
    step: test-function
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: crossplane-contrib-function-auto-ready
```

## Authoring the composition function
Before we go any further, please run the following commands to install KCL and the KCL Language Server on your machine.

```shell
curl -fsSL https://kcl-lang.io/script/install-cli.sh | /bin/bash
curl -fsSL https://kcl-lang.io/script/install-kcl-lsp.sh | /bin/bash
```

Lastly, please make sure you have the KCL VSCode Extension installed and enabled.

Now, open up the `main.k` function file. You should see the following scaffolded content.

``` shell
import models.v1beta1 as v1beta1
import models.v1beta2 as v1beta2
import models.k8s.apimachinery.pkg.apis.meta.v1 as metav1

oxr = option("params").oxr # observed composite resource
_ocds = option("params").ocds # observed composed resources
_dxr = option("params").dxr # desired composite resource
dcds = option("params").dcds # desired composed resources

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}

_items = [

]
items = _items
```

In the first 3 lines, the function automatically imports the schema models into our function to be picked up by the KCL language server and used for linting during development.

Now, let's modify our function. Update the `_items` stanza of your function to match below.

``` shell
_items = [
  v1beta1.Bucket{
    metadata.name = oxr.metadata.name
    spec.forProvider: {
      objectLockEnabled = True
      forceDestroy = False
    }
  }

  v1beta1.BucketVersioning {
    spec.forProvider: {
        bucketRef.name = oxr.metadata.name
    }
   }   if oxr.spec.versioning and oxr.status.conditions == 'True' else {}

   v1beta1.BucketServerSideEncryptionConfiguration {
    spec.forProvider = {
        bucketRef.name = oxr.metadata.name
        rule: [
          {
            applyServerSideEncryptionByDefault: [
                {
                    sseAlgorithm = "AES256"
                }
            ]
            bucketKeyEnabled = True
          }
        ]
    }
   } if oxr.spec.versioning and oxr.status.conditions == 'True' else {}
]
```

When writing out this part of your function, you'll see the magic at work. Because the KCL VSCode extension and the KCL Language server is able to pick up the schema models in the function, you'll get autocompletion, linting for type mismatches, missing variables and more.

We were able to refer to our composite resources that we defined via our XRD through `oxr`, and wrote custom logic so that the bucket generated will have server side encryption. All that is now left is to run and test our composition.

For more KCL best practices, please refer to our documentation({{<ref "./kcl/overview.md">}}).
