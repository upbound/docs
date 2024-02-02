---
title: Auto Upgrade Crossplane
weight: 100
description: How to configure automatic upgrades of Crossplane in a managed control plane
---

Upbound Spaces can automatically upgrade the version of Crossplane in your Managed Control Planes. You can edit the `spec.crossplane.autoUpgrade` field in your `ControlPlane` specification with the available release channels below.

| Channel  | Description                                                                                                                                                                              | Example |
|------------|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| **None**    | Disables auto upgrades.  | _Uses version specified in `spec.crossplane.version`._ |
| **Patch**   | Upgrades to the latest supported patch release. | _Control plane version 1.12.2-up.2 auto upgrades to 1.12.3-up.1 upon release._    |
| **Stable**  | Default setting. Upgrades to the latest supported patch release on minor version _N-1_ where N is the latest supported minor version. | _If latest supported minor version is 1.14, auto upgrades to latest patch - 1.13.2-up.3_ |
| **Rapid**   | Upgrades to the latest supported patch release on the latest supported minor version.  | _If the latest supported minor version is 1.14, auto upgrades to the latest patch of minor version. 1.14 upgrades to 1.14.5-up.1_ |

{{< hint "warning" >}}

The `Rapid` channel is only recommended for users willing to accept the risk of new features and potentially breaking changes.

{{< /hint >}}

## Examples

The specs below are examples of how to edit the `autoUpgrade` channel in your `ControlPlane` specification.

To run a control plane with the `Rapid` auto upgrade channel, your spec should look like this:

```yaml
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  name: example-ctp
spec:
  crossplane:
    autoUpgrade:
      channel: Rapid
  writeConnectionSecretToRef:
    name: kubeconfig-example-ctp
```

To run a control plane with a pinned version of Crossplane, specify in the `version` field:

```yaml
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  name: example-ctp
spec:
  crossplane:
    version: 1.14.3-up.1
    autoUpgrade:
      channel: None
  writeConnectionSecretToRef:
    name: kubeconfig-example-ctp
```

## Supported Crossplane versions

Spaces supports the three [preceding minor versions](https://docs.upbound.io/reference/lifecycle/#maintenance-and-updates) from the last supported minor version. For example, if the last supported minor version is `1.14`, minor versions `1.13` and `1.12` are also supported. Versions older than the three most recent minor versions aren't supported. Only supported Crossplane versions are valid specifications for new managed control planes.

Upbound offers extended support for all installed Crossplane versions released within a 12 month window since the last Spaces release. Contact your Upbound sales representative for more information on version support.

{{< hint "warning" >}}

If the auto upgrade channel is `Stable` or `Rapid`, the Crossplane version will always stay within the support window after auto upgrade. If set to `Patch` or `None`, the minor version may be outside the support window. You are responsible for upgrading to a supported version

{{< /hint >}}

To view the support status of a control plane instance, use `kubectl get ctp`.

```bash
kubectl get ctp
NAME           CROSSPLANE VERSION   SUPPORTED   READY   MESSAGE   AGE
example-ctp    1.13.2-up.3          True        True              31m

```

Unsupported versions return `SUPPORTED: False`.

```bash
kubectl get ctp
NAME           CROSSPLANE VERSION   SUPPORTED   READY   MESSAGE   AGE
example-ctp    1.11.5-up.1          False       True              31m

```

For more information, use the `-o yaml` flag to return more information.

```bash
kubectl get ctp example-ctp -o yaml
status:
conditions:
...
- lastTransitionTime: "2024-01-23T06:36:10Z"
  message: Crossplane version 1.11.5-up.1 is outside of the support window.
  Oldest supported minor version is 1.12.
  reason: UnsupportedCrossplaneVersion
  status: "False"
  type: Supported
```
