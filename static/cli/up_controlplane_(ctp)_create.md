Create a control plane.

#### Options

##### `--group`
*Shorthand:* `-g`  
The control plane group that the control plane is contained in. This defaults to the group specified in the current context

##### `--crossplane-version`
The version of Universal Crossplane to use. The default depends on the selected auto-upgrade channel.

##### `--crossplane-channel`
*Default:* `Stable`  
The Crossplane auto-upgrade channel to use. Must be one of: None, Patch, Stable, Rapid

##### `--secret-name`
The name of the control plane's secret. Defaults to `kubeconfig-{control plane name}`. Only applicable for Space control planes.

