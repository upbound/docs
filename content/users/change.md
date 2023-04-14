---
title: "Change an existing account"
weight: 42
---

Manage an existing Upbound account at [accounts.upbound.io](https://accounts.upbound.io/settings)

The `My Account` screen allows you to change your password, connect to GitHub, Google or email for authentication or delete your Upbound account.

{{<img src="users/images/my-account.png" alt="Options available in the Account menu" size="xtiny" >}}

<!-- vale gitlab.Substitutions = NO -->
<!-- allow lowercase kubernetes in the URL -->
{{< hint "warning" >}}
_API Tokens_ are used to log in with the [Up command-line]({{<ref "cli">}}). This token can't be used as a [Kubernetes image pull secret]({{<ref "upbound-marketplace/authentication#kubernetes-image-pull-secrets">}})
{{< /hint >}}
<!-- vale gitlab.Substitutions = YES -->