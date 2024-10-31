---
title: "Running and Testing Control Plane Projects"
weight: 4
description: "How to run your control plane project on a development control plane"
---

To test your control planes projects, use the `up project run` command to deploy a development control plane.

```shell
up project run
```

This command has will instantaneously create a development control plane in the cloud, and deploy your project's package that you built to it. A development control plane is a lightweight, ephemeral control plane that are perfect for testing your Crossplane configurations.

Now, you can validate your results, and make any changes to test your resources. 

For more information about development control planes, please read our documentation on development control planes.
