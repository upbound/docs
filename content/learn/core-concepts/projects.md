---
title: "Control Plane Projects"
weight: 3
description: "The source of your control plane configurations. A control plane project contains the `upbound.yaml` file and any dependencies for your project."
aliases:
    - /core-concepts/projects
    - core-concepts/projects
---

<!-- vale gitlab.Substitutions = NO -->
Control plane projects are source-level representations of your control plane. A
control plane project is any folder that contains an `upbound.yaml` project
file. Create a project with the [up project init]({{< ref
"reference/cli/command-reference" >}}) command. A control plane project houses
the definition of your control plane.
<!-- vale gitlab.Substitutions = YES-->

For more information on control plane projects, review the [Control Plane Project
guide]({{< ref "build/control-plane-projects" >}}).
