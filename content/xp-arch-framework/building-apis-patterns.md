---
title: "Building APIs | Patterns"
weight: 7
description: "how to build APIs"
---

When it comes to combining XRDs and compositions to define and implement your custom APIs, there are four design patterns we recommend.

## Patterns

### 1. Product Pattern

When you create an API following the product pattern, the goal is to simplify the creation of infrastructure by providing a very simple claim with a "class" field following the MapExpand pattern. This pattern is useful for when teams want to get infrastructure quickly for testing purposes and they don't need to have lots of knobs and buttons to configure the infrastructure. The output of this pattern is a low-context Crossplane composition which can be deployed by an operator who is not a service owner.

{{< hint "note" >}}
The basic configuration of the infrastucture is “baked into” the composition; only environment parameters are exposed. As a consequence, tweaking the definition of compositions following this pattern for a specific environment is not fast or easy. Global reconfigurations of the compositions are achieved by rebuilding and deploying the new definition.
{{< /hint >}}

### 2. Kiosk Pattern

When you create an API following the kiosk pattern, the goal is to give users a greater degree of control over the infrastructure. You can use this pattern when you are working with users who want to control what features are enabled on the underlying infrastructure & desire to have an input on how things are implemented.

Compositions which follow this pattern are usually built based upon a single Crossplane managed resource (such as a database). The platform team retains control over which values can be exposed in the composition. The platform team can also bake-in support (such as adding a standard group of users to a database) and security (such as acls or security groups).

### 3. Helper Pattern

When you create an API following the helper pattern, you end up with a handy and reusable abstraction. This pattern allows you to increase reusability and standardize on larger compositions.

As a result, compositions are highly specialized to a use case. Outside of their intended scope, they’re not generally useful.
Environment Config Pattern
The intent of this pattern is to encapsulate an environment configuration in a composition. This establishes a principal source of truth for an environment’s configuration.

As a result, compositions are highly specialized to their built-for use case.
