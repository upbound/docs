---
title: Provider Terraform
sidebar_position: 1
description: Execute Terraform modules from Crossplane
---

The Upbound Terraform Provider enables you to execute Terraform modules directly from Crossplane. This allows you to integrate existing Terraform configurations into your Crossplane-managed infrastructure.

## Overview

Provider Terraform bridges the gap between Terraform and Crossplane, enabling you to:

- Execute existing Terraform modules as Crossplane managed resources
- Leverage your team's existing Terraform expertise
- Gradually migrate infrastructure from Terraform to native Crossplane providers
- Use Terraform for resources not yet available in Crossplane providers

## Installation

Install the provider from the [Upbound Marketplace][upbound-marketplace]:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-terraform
spec:
  package: xpkg.upbound.io/upbound/provider-terraform:v0.19.0
```

## Release notes

Release notes for provider-terraform are published on the [Upbound Marketplace listing][upbound-marketplace]. The marketplace includes:

- Current and historical release notes
- Version-specific changelogs
- Installation instructions
- API documentation

## Migration guides

If you're migrating from standalone Terraform to provider-terraform, or migrating existing provider-terraform configurations, see the following guides:

- [Migrate Terraform configurations](./migrate-hcl.md) - Convert HCL configurations to provider-terraform
- [Migrate provider-terraform configurations](./migrate-provider-tf.md) - Update between provider-terraform versions

## Support

For more information on the release cadence and support protocol refer to the provider [support and maintenance][support-and-maintenance] page.

[upbound-marketplace]: https://marketplace.upbound.io/providers/upbound/provider-terraform/latest
[support-and-maintenance]: /reference/usage/support
