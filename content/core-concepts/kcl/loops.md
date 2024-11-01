---
title: "Loops (for)"
weight: 50
---

This guide shows you how to use the `for` syntax and `lambda` support to iterate
over items in a collection. Loops can dynamically define multiple copies of a resource and
avoid repeating syntax in your function.

To create multiple resources with a `for` loop, each resource instance must have
a unique `composition-resource-name` value. You can use the index value or unique values in
arrays or collections to assign unique names. KCL sets it equal to `.metadata.name` by default unless you override it with the `krm.kcl.dev/composition-resource-name` annotation.

## Loop syntax

KCL supports [comprehensions](https://www.kcl-lang.io/docs/reference/lang/spec/expressions#list-expressions), which lets users construct a list or dictionary value by looping over one or more iterables and evaluating an expression.

An example loop follows the syntax below:

```yaml
myVar = [x * x for x in range(5)] # returns an array containing [0, 1, 4, 9, 16]
```

For example, if you want to compose a collection of role policy attachments in AWS, you could write:

```yaml
import models.v1beta1 as v1beta1

nodeGroupRolePolicies = [
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
]
nodeGroupRolePolicyAttachments = [{
    v1beta1.RolePolicyAttachment {
        metadata.name = xrName + "-nodegroup-rpa-{}".format(i)
        spec.providerConfigRef.name = providerConfigName
        spec.deletionPolicy = deletionPolicy
        spec.forProvider = {
        policyArn = p
        roleSelector = {
            matchControllerRef = True
            matchLabels = {
            "role" = "nodegroup"
            }
        }
        }
    }
    
} for i, p in nodeGroupRolePolicies]

items = [nodeGroupRolePolicyAttachments]
```

For more information on comprehensions, review the [KCL docs](https://www.kcl-lang.io/docs/reference/lang/spec/expressions#comprehensions).


## Procedural for loop

KCL _doesn't_ support procedural for loops natively, but it's possible to create a procedural loop using a lambda function:

```yaml
result = [(lambda x: int -> int {
    # Write procedural for loop logic in the lambda function.
    z = x + 2
    x * 2
})(x, y) for x in [1, 2]]  # [2, 4]
```

For example, if you want to create multiple managed resources of the same kind based on a provided input, you could write:

```yaml
import models.v1beta1 as v1beta1

awsRouteTableAssociationsPublic = [(lambda i: int, -> v1beta1.RouteTableAssociation {
    v1beta1.RouteTableAssociation {
        spec.forProvider = {
            subnetIdSelector.matchControllerRef: True
            routeTableId: _ocds["${xrName}-${i}"]
        }
    }
})(i) for i in range(oxr.spec.parameters.numberOfSubnets)]

items = [awsRouteTableAssociationsPublic]
```


