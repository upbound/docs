---
title: "Variables"
weight: 40
---

This guide describes how to define and use variables in your KCL function.
Variables can simplify your composition function and reduce repetition in your code. You can
define complex expressions as a variable and reference that variable throughout
your function.

## Define variables

To define a variable, use the `=` operator to assign a value. You can define two types of variables: a global, immutable variable or a mutable variable. Learn more at the [KCL docs](https://www.kcl-lang.io/docs/reference/lang/spec/variables)

```yaml
# This is an immutable variable
myvar = "value"

# This is a mutable variable
_myothervar = "value2"
```

Variables are valid within the current scope. Below is an example of
defining a new managed resource as a variable:

```yaml
myresource = v1beta1.Instance {
    spec.forProvider = {
        region: "us-west-1"
    }
}
```

In KCL, you don't need to specify the variable data type. KCL infers the type
from the value.

## Special variables

The `items` and the `options` variables are important required variables in your
KCL embedded function.

KCL functions requore the special [items]({{<ref "inputs-outputs#outputs">}}) variable to
capture the desired state of your resources and pass those changes to your
control plane to create or change.
The special [options]({{<ref "read-pipeline-state">}}) variables provides
context specific information to use in your function.