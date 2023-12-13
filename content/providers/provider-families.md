---
title: "Provider families"
weight: 10
description: "Install and configure Crossplane Provider families"
---

Upbound packages each of the official providers for Amazon AWS, Google GCP and Microsoft Azure as a "family." 

A provider family organizes the provider's resources into unique packages, organized by a common set of services.

Provider families reduce the resources required to install and run providers and
improve performance over a single monolithic provider.

### Provider family requirements

Provider families have the following requirements and restrictions:

* Crossplane version 1.12.1 or [UXP]({{<ref "/uxp">}}) version 1.12.1-up.1 or later
* Remove existing [monolithic providers]({{<ref "monolithic">}}) matching the new provider family.

{{<hint "warning" >}}
If a provider family installs into a cluster with an existing monolithic provider, the family provider doesn't take effect. 

The monolithic provider continues to own all provider resource endpoints until it's removed.

For information on migrating from monolithic providers to provider families read the 
[family providers migration guide]({{<ref "/providers/migration">}})
{{< /hint >}}

### Installing a provider family

Installing a provider family is identical to installing other Crossplane providers.
Create a Provider object with the provider package to install.

For example, to install the provider family AWS S3 provider:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
```

Install multiple services with multiple Provider objects. For example to install both AWS S3 and EC2 providers:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-ec2
spec:
  package: xpkg.upbound.io/upbound/provider-aws-ec2:v0.37.0
```

{{<hint "tip" >}}
Browse the [Upbound Marketplace](https://marketplace.upbound.io/providers?tier=official) to find the provider services to install. 
{{</ hint >}}

{{< expand "Install Providers in an offline environment" >}}

To install Providers in an offline environment set 
{{<hover label="air" line="7">}}skipDependencyResolution: true{{</hover>}} in
the Provider.

```yaml {label="air"}
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
  skipDependencyResolution: true
```

When installing multiple providers, apply `skipDependencyResolution` to every
Provider.

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
  skipDependencyResolution: true
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-ec2
spec:
  package: xpkg.upbound.io/upbound/provider-aws-ec2:v0.37.0
  skipDependencyResolution: true
```

{{< /expand >}}

View the installed providers with `kubectl get providers`

```shell {copy-lines="1",label="getproviders"}
kubectl get providers
NAME                          INSTALLED   HEALTHY   PACKAGE                                               AGE
upbound-provider-aws-ec2      True        True      xpkg.upbound.io/upbound/provider-aws-ec2:v0.37.0      25m
upbound-provider-aws-s3       True        True      xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0       25m
upbound-provider-family-aws   True        True      xpkg.upbound.io/upbound/provider-family-aws:v0.37.0   24m
```

The first provider installed of a family also installs an extra
{{<hover label="getproviders" line="5">}}provider-family{{</hover>}} Provider.
The `provider-family` provider manages the ProviderConfig
for all other providers in the same family. 

{{<hint "note" >}}
Each family provider defines a dependency on the *latest available version* of the corresponding `provider-family`,
which is automatically resolved and installed by the Crossplane package manager.

Hence, when you install an older version of a family provider, you can expect to receive newer versions of the
`provider-family` provider, and it is safe to ignore this version mismatch.

If you still want to control the version of the `provider-family`, consider using the
{{<hover label="air" line="7">}}skipDependencyResolution: true{{</hover>}} option as described in the
**Install Providers in an offline environment** section above.
{{< /hint >}}

### Using ControllerConfigs

The [ControllerConfig](https://docs.crossplane.io/latest/concepts/packages/#speccontrollerconfigref) applies settings to a Provider Pod. With family providers
each provider is a unique Pod running in the cluster. 

When using ControllerConfigs with family providers, each provider needs
a ControllerConfig applied.

For example, both providers reference the same 
{{<hover label="cc" line="8">}}controllerConfigRef.name{{</hover >}}.

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
  controllerConfigRef:
    name: my-controllerconfig
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-ec2
spec:
  package: xpkg.upbound.io/upbound/provider-aws-ec2:v0.37.0
  controllerConfigRef:
    name: my-controllerconfig
---
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controllerconfig
```