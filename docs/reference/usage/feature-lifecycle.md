---
title: Feature Lifecycle
sidebar_position: 30
---

# Feature lifecycle

Crossplane follows a similar feature lifecycle to [upstream
Kubernetes][kube-features]. All major new features start in alpha. Alpha
<!-- vale write-good.Passive = NO -->
<!-- vale write-good.Weasel = NO -->
<!-- vale gitlab.FutureTense = NO -->
features are expected to eventually graduate to beta, and then to general
availability (GA). Features that languish at alpha or beta may be subject to
deprecation.

## Alpha features

Alpha features are off by default and must be enabled by a feature flag, for example
`--enable-composition-revisions`. API types about alpha features use a
`vNalphaN` style API version, like `v1alpha`. **Alpha features are subject to
removal or breaking changes without notice** and not considered ready
for production use. 

<!-- vale write-good.TooWordy = NO -->
Sometimes alpha features require adding fields to existing beta or GA
<!-- vale write-good.TooWordy = YES -->
<!-- vale alex.Condescending = NO -->
API types. In these cases fields must be marked (for instance in their OpenAPI
<!-- vale alex.Condescending = YES -->
schema) as alpha and subject to alpha API constraints (or lack thereof).

All alpha features should have an issue tracking their graduation to beta.

## Beta features

Beta features are on by default, but may be disabled by a feature flag. API
types about beta features use a `vNbetaN` style API version, like
`v1beta1`. Beta features are considered to be well tested, and won't be
<!-- vale write-good.TooWordy = NO -->
removed completely without being marked deprecated for at least two releases.

<!-- vale Google.Will = NO -->
The schema and/or semantics of objects may change in incompatible ways in a
subsequent beta or stable release. When this happens, Upbound will provide
instructions for migrating to the next version. This may require deleting,
editing, and recreating API objects. The editing process may require some
thought. This may require downtime for applications that rely on the feature.
<!-- vale write-good.TooWordy = YES -->
<!-- vale Google.Will = YES -->

<!-- vale alex.Condescending = NO -->
<!-- vale write-good.TooWordy = NO -->
Sometimes beta features require adding fields to existing GA API types. In
these cases fields must be marked (for instance in their OpenAPI schema) as beta
and subject to beta API constraints (or lack thereof).
<!-- vale write-good.TooWordy = YES -->
<!-- vale alex.Condescending = YES -->

All beta features should have an issue tracking their graduation to GA.

## GA features
<!-- vale Microsoft.Adverbs = NO -->
GA features are always enabled - they can't be disabled. API types pertaining
to GA features use `vN` style API versions, like `v1`. GA features are widely
used and thoroughly tested. They guarantee API stability - only backward
compatible changes are allowed.
<!-- vale write-good.Weasel = YES -->
<!-- vale Microsoft.Adverbs  = YES -->
<!-- vale write-good.Passive = YES -->
<!-- vale gitlab.FutureTense = YES -->

[kube-features]: https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#feature-stages
