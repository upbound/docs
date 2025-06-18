---
title: Compositions
weight: 5
description: Compositions are declarative templates that enable the creation of multiple managed resources
---

<!-- vale write-good.Passive = NO -->
Compositions are declarative templates that allow you to create multiple
managed resources in a single file. Instead of provisioning resources
individually, you can combine resources into a reusable solution that
you can deploy as a single object with your control plane.

Compositions define how your individual resources should be created and managed.
When a user or system requests a resources that matches a composition, your
control plane:

1. Parses the composition to understand what resources to create
2. Provisions the resources according to the rules and definitions in your XRD.
3. Links the resources it creates together to define them as a single unit.

<!-- vale Google.Headings = NO -->
## Compositions and Composite Resource Definitions (XRDs)
<!-- vale Google.Headings = YES -->

Composite Resource Definitions (XRDs) and Compositions are structures to help you
define and manage resources, and they serve distinct purposes while working
together.

XRDs define the underlying API schema required when requesting resources.
Compositions are linked to an XRD and the control plane uses the Composition to
provision the resources requested.
<!-- vale write-good.Passive = YES -->

