---
title: Control Plane Projects
sidebar_position: 1
description: The source of your control plane configurations. A control plane project
  contains the `upbound.yaml` file and any dependencies for your project.
---

<!-- vale gitlab.Substitutions = NO -->
Control plane projects are source-level representations of your control plane. A
control plane project is any folder that contains an `upbound.yaml` project
file. Create a project with the [up project init][cli-ref] command. A control plane project houses
the definition of your control plane.
<!-- vale gitlab.Substitutions = YES-->

For more information on control plane projects, review the [Control Plane Project
guide][ctp-guide].

[cli-ref]: /apis-cli/cli-reference
[ctp-guide]: /build/control-plane-projects
