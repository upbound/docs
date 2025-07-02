---
title: Providers
sidebar_position: 1
description: Providers allow Upbound to provision infrastructure on an external service.
  They handle communication between the control plane and your external resources
draft: true
---

Providers allow Upbound to provision infrastructure on an external service.
Providers handle communication between your Upbound control plane and the
external resource, like AWS, GCP or Azure. Providers capture the external
resources they can create as an API endpoint and result in managed resources.

## Upbound Marketplace
The [Upbound Marketplace][upbound-marketplace] is the central repository for provider information.
Review your provider reference documentation here to determine what specific
resources you need to create or the provider family
group to look for.

The Marketplace contains three provider tiers: 

<!--
| Provider Level | Description |
|---------------|-------------|
| **Upbound Official** <br> <svg width="18" height="18" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg"><path fill="#6553C0" d="M 10.2053 1.01289 L 12.191 2.998 L 14.9982 2.99817 C 15.5505 2.99817 15.9982 3.44589 15.9982 3.99817 L 15.998 6.806 L 17.9835 8.79107 C 18.374 9.18159 18.374 9.81476 17.9835 10.2053 L 15.998 12.19 L 15.9982 14.9982 C 15.9982 15.5505 15.5505 15.9982 14.9982 15.9982 L 12.19 15.998 L 10.2053 17.9835 C 9.81476 18.374 9.18159 18.374 8.79107 17.9835 L 6.806 15.998 L 3.99817 15.9982 C 3.44589 15.9982 2.99817 15.5505 2.99817 14.9982 L 2.998 12.191 L 1.01289 10.2053 C 0.622369 9.81476 0.622369 9.18159 1.01289 8.79107 L 2.998 6.805 L 2.99817 3.99817 C 2.99817 3.44589 3.44589 2.99817 3.99817 2.99817 L 6.805 2.998 L 8.79107 1.01289 C 9.18159 0.622369 9.81476 0.622369 10.2053 1.01289 Z M 11.9057 7.09636 L 8.62317 10.2406 L 7.09063 8.77261 C 6.95395 8.64168 6.73233 8.64168 6.59565 8.77261 L 6.10068 9.24673 C 5.964 9.37766 5.964 9.58993 6.10068 9.72085 L 8.37569 11.9 C 8.51236 12.0309 8.73396 12.0309 8.87066 11.9 L 12.8957 8.0446 C 13.0323 7.91367 13.0323 7.7014 12.8957 7.57048 L 12.4007 7.09636 C 12.264 6.96545 12.0424 6.96545 11.9057 7.09636 Z"/></svg> | Developed, maintained, and fully supported by **Upbound**. They undergo testing, security audits, and follow Upbound's best practices to ensure high reliability and enterprise-grade support. |
| **Partner** <br> 🏅 | Developed and maintained by **trusted partners** in collaboration with Upbound. They follow best practices and have some level of verification, but the **partner** provides long-term maintenance and support. |
| **Community** <br> 🌍 | Developed and maintained by the **open source community**. They may not be officially verified by Upbound, and their maintenance and support depend on community contributors. |
-->
<!--- TODO(tr0njavolta): breaks --->

### Provider families

The Marketplace segments the AWS, Azure, and GCP providers into distinct resource areas
called **provider families**. For instance, the `provider-family-aws` handles the
`ProviderConfig` for your deployments, but sub-providers like `provider-aws-s3`
manages individual S3 resources. When you install a sub-provider, the
root family provider is also installed automatically.

## Install a Provider

You can install providers into your control plane project as a dependency or you can
use Helm to deploy directly to an Upbound control plane.

### `up` CLI

In your control plane project file, you can add your providers with the `up add
dependency` command.

```shell
up add dependency xpkg.upbound.io/upbound/provider-aws-s3:v1.16.0
```

In your `upbound.yaml` file, the provider information is in the
`spec.dependsOn` value:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: <projectName>
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-aws-s3
    version: v1.16.0
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/<userOrg>/<userProject>
```

### Control plane creation

You can manually install a provider in your control plane with a `Provider`
manifest and `kubectl apply`.

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:<version>
EOF
```


[upbound-marketplace]: https://marketplace.upbound.io
