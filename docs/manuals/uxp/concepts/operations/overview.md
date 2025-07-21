---
title: Overview 
sidebar_position: 1
description: Understand Crossplane's Operations workflow
---

Operations lets you build workflows using function pipelines that execute tasks on resources under management by your control plane. Operations run once to completion and then stop. 

An example use case is to create an `Operation` object to execute a control
plane managed database backup. The `Operation` object invokes a function to
perform the task.

If you want to perform an Operation on a schedule or in response to state change of a resource, see [CronOperation][cronOperation] and [WatchOperation][watchOperation] respectively.

## Example

This example `Operation` creates a `ConfigMap` object and emits an event indicating it performed an operation.

```yaml
apiVersion: ops.crossplane.io/v1alpha1
kind: Operation
metadata:
  name: basic
spec:
  mode: Pipeline
  pipeline:
  - step: create-a-configmap
    functionRef:
      name: function-dummy-ops-basic
    input:
      apiVersion: dummy.fn.crossplane.io/v1beta1
      kind: Response
      response:
        desired:
          resources:
            configmap:
              resource:
                apiVersion: v1
                kind: ConfigMap
                metadata:
                  namespace: default
                  name: cool-map
                data:
                  coolData: "I'm cool!"
        results:
         - severity: SEVERITY_NORMAL
           message: "I am doing an operation!"
```
Apply it to a control plane and check on the status of the Operation with kubectl:
```shell
kubectl get Operation basic -o yaml

<TODO>
```

## Writing an Operation spec

<!-- vale alex.Condescending = NO -->
Like [Compositions][compositions], Operations consist of a function pipeline.
This means users can define Operations that run simple or complex workflows to
do any manner of tasks within their control plane. 
<!-- vale alex.Condescending = YES -->

An operation function can instruct Crossplane to create or update arbitary resources by including server-side apply [fully specified intent][ssa] (FSI) patches in rsp.desired.resources, just like a composition function.

### Bootstrap an operation

Operation function pipelines can be bootstrapped with a set of required resources by using the `requirements` field in a pipeline step, like below:

```yaml
apiVersion: ops.crossplane.io/v1alpha1
kind: Operation
metadata:
  name: example
spec:
  mode: Pipeline
  pipeline:
  - step: example
    functionRef: function-example
    requirements:
      requiredResources:
      - requirementName: function-needs-these-resources
        apiVersion: example.org/v1
        kind: App
        namespace: default # Namespace is optional.
        name: example-xr   # One of name or matchLabels is required.
```
### Retries
Operations run once to completion. If an Operation fails, it will retry up to its `spec.retryLimit` if the function pipeline returns an error.

### Function capabilities

Because Operations share the same function pipeline mode, this means you can use any function found in the [Upbound Marketplace][functionMarketplace] to augment the Operation with the logic contained in the function.

To distinguish whether the function applicable for Composition, Operations, or both, refer to the `capabilities` field of the function:

```yaml
apiVersion: meta.pkg.crossplane.io/v1
kind: Function
metadata:
  name: function-python
spec:
  capabilities:
  - composition
  - operation
```

## Next steps

Read about [CronOperation][cronOperation] and [WatchOperation][watchOperation] to learn how to invoke Operations in response to certain triggers.

[cronOperation]: cron-operation
[watchOperation]: watch-operation
[compositions]: /manuals/uxp/composition/overview
[ssa]: https://kubernetes.io/docs/reference/using-api/server-side-apply/
[functionMarketplace]: https://marketplace.upbound.io/functions
