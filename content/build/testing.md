---
title: "Running and testing your Control Plane Projects"
weight: 5
description: "How to run your control plane project on a development control
plane"
aliases:
    - core-concepts/testing
---

To run and test your control plane projects, run them on development control planes via the following command.

```shell
up project run
```

This command creates a development control plane in the Upbound cloud, and deploy your project's package to it. A development control plane is a lightweight, ephemeral control plane that are perfect for testing your Crossplane configurations.

Now, you can validate your results, and make any changes to test your resources.

For more information, review the [development control plane documentation]({{< ref
"dev-cps" >}}).
