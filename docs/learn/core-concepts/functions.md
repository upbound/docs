---
title: Functions
weight: 6
description: Custom programs that dynamically template resources.
---

Embedded functions are composition functions you can build, package, and manage directly in your configuration. These functions enable shared logic across multiple compositions within your configuration.

Create custom functions in your control plane project using Python, KCL, Go, or Go templating.
Functions provide advanced logic and programmability when defining resource provisioning, going beyond static YAML configuration files.

When a user creates a composite resource (XR), your control plane calls composition functions to determine:

* What managed resources to create
* How to configure these resources based on user input
* What conditional logic to apply for customizing the deployment

Some benefits of using embedded functions:

* **Write configurations in familiar languages** Choose from KCL, Python, Go, or Go templating to control your resources
* **Integration with your existing workflow.** Write functions in your configuration
  project and avoid tool drift
* **Full IDE support.** Auto completion, syntax highlighting, and other coding tools
  help you write functions using best practices
* **Deploy seamlessly.** Package and push your functions with your configuration in
  a single step.

<!-- vale gitlab.FutureTense = NO -->
Embedded functions are composition functions that you can build, package, and manage directly in your configuration. Instead of relying on a YAML-based patch-and-transform workflow, you can write composition logic in Python or configuration languages like KCL. Embedded functions allow for shared logic across multiple compositions within your configuration.
<!-- vale gitlab.FutureTense = YES -->
