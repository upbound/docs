---
title: "Variables"
weight: 40
---

This article describes how to define and use variables in your KCL function. You use variables to simplify your composition function. Rather than repeating complicated expressions throughout your function, you define a variable that contains the complicated expression. Then, you use that variable as needed throughout your function.

## Define variables

The syntax for defining a variable is:

```yaml
myvar = "value"
```

Once you define a variable, you can use it until the end of the current scope. Below is an example of defining a new managed resource as a variable:

```yaml
myresource = v1beta1.Instance {
    spec.forProvider = {
        region: "us-west-1"
    }
}
```

In KCL, you don't need to specify a data type for the variable. The type is inferred from the value. KCL also supports defining two types of variables: one that is global and cannot be changed after being set, and one that can. Learn more at the [KCL docs](https://www.kcl-lang.io/docs/reference/lang/spec/variables)

## Special variables

When using KCL as your embedded function language, it's important to remember:

- the special [items]({{<ref "inputs-outputs#outputs">}}) variable used to pass along the desired state of resources to create/modify
- the special [options]({{<ref "read-pipeline-state">}}) variables, which provide important context information for use in your function.