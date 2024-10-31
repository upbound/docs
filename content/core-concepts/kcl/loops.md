---
title: "Loops (for)"
weight: 50
---

This article shows you how to use the `for` syntax and `lambda` support to iterate over items in a collection. You can use loops to define multiple copies of a resource. Use loops to avoid repeating syntax in your function and to dynamically set the number of copies to create during function execution. 

To use loops to create multiple resources, each instance must have a unique value for the `.metadata.name` property. You can use the index value or unique values in arrays or collections to create the names.

## Loop syntax

KCL supports what it calls [comprehensions](https://www.kcl-lang.io/docs/reference/lang/spec/expressions#list-expressions), which lets users construct a list or dictionary value by looping over one ore more iterables and evaluating an expression.

The syntax for a simple loop is:

```yaml
myVar = [x * x for x in range(5)] # returns an array containing [0, 1, 4, 9, 16]
```

Learn more about comprehensions at the [KCL docs](https://www.kcl-lang.io/docs/reference/lang/spec/expressions#comprehensions)

## Procedural for loop

KCL _doesn't_ support procedural for loops natively, but it's possible to create a procedural loop using a lambda function. The syntax for this looks like:

```yaml
result = [(lambda x: int -> int {
    # Write procedural for loop logic in the lambda function.
    z = x + 2
    x * 2
})(x, y) for x in [1, 2]]  # [2, 4]
```

For example, if you want to create multiple managed resources of the same kind based on a provided input, you could write:

```yaml
awsRouteTableAssociationsPublic = [(lambda i: int, -> v1beta1.RouteTableAssociation {
    v1beta1.RouteTableAssociation {
        spec.forProvider = {
            subnetIdSelector.matchControllerRef: True
            routeTableId: _ocds["${var.name}-${i}"]
        }
    }
})(i) for i in range(oxr.spec.parameters.numberOfSubnets)]
```


