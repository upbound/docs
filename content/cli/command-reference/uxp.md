---
title: "up uxp"
---

Install and manage Upbound Universal Crossplane (UXP) with `up uxp` commands.

Read the [Upbound Universal Crossplane]({{<ref "/uxp" >}}) section more information about UXP.

- [`up uxp install`](#up-uxp-install)
  - [Arguments](#arguments)
  - [Examples](#examples)
    - [Install the latest version of `UXP`](#install-the-latest-version-of-uxp)
    - [Install the latest version of `UXP` and set the image pull policy](#install-the-latest-version-of-uxp-and-set-the-image-pull-policy)
- [`up uxp uninstall`](#up-uxp-uninstall)
  - [Arguments](#arguments-1)
  - [Examples](#examples-1)
- [`up uxp upgrade`](#up-uxp-upgrade)
  - [Arguments](#arguments-2)
  - [Examples](#examples-2)
    - [Upgrade to `UXP` version v1.7.0-up.1](#upgrade-to-uxp-version-v170-up1)
    - [Upgrade Crossplane to `UXP`](#upgrade-crossplane-to-uxp)
### `up uxp install`


#### Arguments
* `<version>` - the desired UXP version to install. Default is `latest`.
* `--kubeconfig = <path>` - path to a kubeconfig file to connect to a Kubernetes cluster to install UXP into. The default is the kubeconfig file used by `kubectl`.
* `-n,--namespace=<namespace>` - the namespace to install UXP into. The default is the value of the environmental variable `$UXP_NAMESPACE` or `upbound-system`.
* `--unstable` - install a version of UXP from the `unstable` channel.
* `--set=KEY=VALUE;...` - a series of semi-colon separated key-value pairs to set UXP parameters at install time. 
* `-f,--file = <path>` - a parameters file with key-value pairs to set UXP settings at install time.

UXP installs the latest stable release by default. 

The list of available UXP versions is in the [charts.upbound.io/stable](https://charts.upbound.io/stable/) listing.

The [UXP install guide]({{<ref "/uxp/install" >}}) lists all install-time settings. 


#### Examples


##### Install the latest version of `UXP`
```shell
up uxp install
```


##### Install the latest version of `UXP` and set the image pull policy
```shell
up uxp install --set image.pullPolicy=IfNotPresent
```

### `up uxp uninstall`


#### Arguments
* `--kubeconfig = <path>` - path to a kubeconfig file to connect to a Kubernetes cluster to remove UXP. The default is the kubeconfig file used by `kubectl`.
* `-n,--namespace=<namespace>` - the namespace to uninstall UXP from. The default is the value of the environmental variable `$UXP_NAMESPACE` or `upbound-system`.

Uninstall UXP from the cluster. 


#### Examples
```shell
up uxp uninstall
```

### `up uxp upgrade`


#### Arguments
* `<version>` - the target version to upgrade UXP to. Default is `latest`
* `--kubeconfig = <path>` - path to a kubeconfig file to connect to a Kubernetes cluster to remove UXP. The default is the kubeconfig file used by `kubectl`.
* `-n,--namespace=<namespace>` - the namespace to uninstall UXP from. The default is the value of the environmental variable `$UXP_NAMESPACE` or `upbound-system`.
* `--unstable` - install a version of UXP from the `unstable` channel.
* `--set=KEY=VALUE;...` - a series of semi-colon separated key-value pairs to set UXP parameters at install time. 
* `-f,--file = <path>` - a parameters file with key-value pairs to set UXP settings at install time.
* `--rollback` - rollback to the last installed version of UXP if the upgrade fails.
* `--force` - upgrade UXP even if the versions are incompatible.
  

<!-- vale gitlab.SentenceLength = NO -->
UXP upgrades can be from one UXP version to another or from open source Crossplane to a [compatible UXP version]({{<ref "/uxp/upgrade#upgrade-from-open-source-crossplane" >}}).
<!-- vale gitlab.SentenceLength = YES -->


#### Examples

##### Upgrade to `UXP` version v1.7.0-up.1
```shell
up uxp upgrade v1.7.0-up.1
```

<!-- vale Google.Headings = NO -->
##### Upgrade Crossplane to `UXP`
<!-- vale Google.Headings = YES -->
```shell
up uxp upgrade v1.7.0-up.1 -n crossplane-system
```