---
title: "ControlPlane"
weight: 1
---

`ControlPlane` defines a managed Crossplane instance.

An example of a `controlplane.yaml` file:

```yaml
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  name: example-controlplane
  namespace: default
spec:
  # Configure details about the Crossplane instance running in the managed control plane environment.
  crossplane:

    # [Optional] Specify the desired UXP (Crossplane) version for this control plane to run. If not specified, 
    # it's inferred from the autoUpgrade.channel.
    version: 1.13.2-up.3

    # Configure the auto upgrade feature of this managed contro lplane.
    autoUpgrade:

      # [Optional] The upgrade channel determines the cadence by which a control plane upgrades to the next version.
      # Can be either 'None', 'Patch', 'Stable', or 'Rapdi'. By default, it's 'Stable'.
      channel: Stable 

  # THIS IS AN ALPHA FIELD. Do not use it in production. Source points to a Git repository containing a 
  # ControlPlaneSource manifest with the desired state of the ControlPlane's configuration.
  source:

    # Git is the configuration for a Git repository to pull the Control Plane source from.
    git:

      # This is the URL of the Git repository to pull the Control Plane source.
      url: https://github.com/upbound/source-example

      #  Auth is the authentication configuration to access the Git repository. Default is no authentication.
      auth:

        # Other optons are 'Basic', 'BearerToken', and 'SSH'
        type: None

      # Path is the path within the Git repository to pull the Control Plane Source from. The folder it points
      # to must contain a valid ControlPlaneSource manifest. Default is the root of the repository.
      path: /

      # PullInterval is the interval at which the Git repository should be polled for changes. The format is
      # 1h2m3s. Default is 90s. Minimum is 15s.
      pullInterval: 15s

      # Ref is the git reference to checkout, which can be a branch, tag, or commit SHA. Default is the main branch.
      ref:
        
        # Other optons are 'commit' and 'tag'.
        branch: main
  
  # This field specifies the namespace and name of a Secret to which any connection details (i.e. kubeconfig) 
  # for the control plane should be written
  writeConnectionSecretToRef:
    name: kubeconfig-example-controlplane
    namespace: default
```