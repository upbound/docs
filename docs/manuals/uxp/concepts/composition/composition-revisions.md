---
title: Composition Revisions
sidebar_position: 5
---

This guide discusses the use of "Composition Revisions" to safely make and roll
back changes to a Crossplane [`Composition`][composition type]. It assumes
familiarity with Crossplane, and particularly with
[Compositions].

A `Composition` configures how Crossplane should reconcile a Composite Resource
(XR). Put otherwise, when you create an XR the selected `Composition` determines
what resources Crossplane will create in response. Let's say for example that
you define a `PlatformDB` XR, which represents your organisation's common
database configuration of an Azure MySQL Server and a few firewall rules. The
`Composition` contains the 'base' configuration for the MySQL server and the
firewall rules that are extended by the configuration for the `PlatformDB`.

A `Composition` is associated with multiple XRs that make use of it. You might 
define a `Composition` named `big-platform-db` that's used by ten different 
`PlatformDB` XRs. Usually, in the interest of self-service, the `Composition` 
is managed by a different team from the actual `PlatformDB` XRs. For example 
the `Composition` may be written and maintained by a platform team member,
while individual application teams create `PlatformDB` XRs that use said
`Composition`.

Each `Composition` is mutable - you can update it as your organisation's needs
change. However, updating a `Composition` without Composition Revisions can be a
risky process. Crossplane constantly uses the `Composition` to ensure that your
actual infrastructure - your MySQL Servers and firewall rules - match your
desired state. If you have 10 `PlatformDB` XRs all using the `big-platform-db`
`Composition`, all 10 of those XRs will be instantly updated in accordance with
any updates you make to the `big-platform-db` `Composition`.

Composition Revisions allow XRs to opt out of automatic updates. Instead you can
update your XRs to use the latest `Composition` settings at your own pace.
This enables you to [canary] changes to your infrastructure, or to roll back
some XRs to previous `Composition` settings without rolling back all XRs.


