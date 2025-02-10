---
title: Functions
weight: 6
description: Custom programs that dynamically template resources.
---

Embedded functions are composition functions that you can build, package, and manage directly in your configuration. Embedded functions allow for shared logic across multiple compositions within your configuration.

You can use Python or KCL to create a custom function in your control plane
project.

Instead of using YAML to write static configuration files, functions allow for advanced logic and programmability when defining how resources should be provisioned.

When a user creates a composite resource (XR), your control plane calls composition functions to determine:

* What managed resources should be created.
* How these resources should be configured based on user input.
* Whether any conditional logic should be applied to customize the deployment.


Some benefits of using embedded functions:

* **Write configurations in familiar languages** Choose from KCL, Python, or Go to control your resources
* **Integration with your existing workflow.** Write functions in your configuration
  project and avoid tool drift
* **Full IDE support.** Auto completion, syntax highlighting, and other coding tools
  help you write functions using best practices
* **Deploy seamlessly.** Package and push your functions with your configuration in
  a single step.

<!-- vale gitlab.FutureTense = NO -->
Embedded functions are composition functions that you can build, package, and manage directly in your configuration. Instead of relying on a YAML-based patch-and-transform workflow, you can write composition logic in Python or configuration languages like KCL. Embedded functions allow for shared logic across multiple compositions within your configuration.
<!-- vale gitlab.FutureTense = YES -->
