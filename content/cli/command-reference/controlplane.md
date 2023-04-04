---
title: "up controlplane"
---
_Alias_: `up ctp`

Use commands under `controlplane` to interact with managed control planes on Upbound.

{{<hint "note" >}}
This command set was promoted to stable maturity in v0.16.0. 
For compatibility with CI and other automated systems, the `alpha` variant is supported, but hidden.
{{< /hint >}}

### `up controlplane create`

<!-- omit in toc -->
#### Arguments
* `<control plane name>` - name of the control plane to create.

Creates a managed control plane in Upbound.  

<!-- omit in toc -->
#### Flags
* `--configuration-name = STRING` _(required)_ - name of the configuration to use to bootstrap the control plane with.
* `--description = STRING` - Description for the control plane.

<!-- vale gitlab.SubstitutionWarning = NO-->
<!-- don't flag an error on shortcode information argument -->
{{< hint "note" >}}
<!-- vale gitlab.SubstitutionWarning = YES-->
Upbound requires authentication with [`up login`]({{<ref "login" >}}) before using `up controlplane`.
{{< /hint >}}


<!-- omit in toc -->
#### Example 
```shell
up controlplane create my-control-plane --configuration-name=my-api
```

### `up controlplane delete`

<!-- omit in toc -->
#### Arguments
* `<control plane name>` - name of the control plane to delete.

Deletes a managed control plane from Upbound.

<!-- omit in toc -->
#### Example
```shell
up controlplane delete my-control-plane
```


### `up controlplane list`
<!-- omit in toc -->
#### Arguments
- _none_

Lists all managed control planes in the current organization.

<!-- omit in toc -->
#### Example
```shell
up controlplane list
NAME                         ID                                     STATUS   DEPLOYED CONFIGURATION   CONFIGURATION STATUS
my-control-plane             154079fc-15e1-4259-b3d6-12416943a48b   ready    configuration-rds-prod   ready               
another-control-plane        31be0bb9-4e35-47f7-b799-d8ace055b254   ready    config-rds               ready  
```


### `up controlplane connect`
<!-- omit in toc -->
#### Arguments
* `<control plane name>` - name of the control plane to connect to.
* `<namespace in the control plane>` - the Kubernetes namespace in the control plane to create resources in.

Connects the current cluster to the specified control plane's namespace. This means that all claim APIs in your control plane will be available in your application cluster for consumption.

<!-- omit in toc -->
#### Flags
* `--token = STRING`: Optional token for the connector to use. If not provided, a new user token will be created.
* `--cluster-name = STRING`: Optional name for the cluster that will be connected to the control plane. If not provided, namespace argument will be used.
* `--kubeconfig = STRING`: sets `kubeconfig` path. Same defaults as `kubectl` are used if not provided.


### `up controlplane kubeconfig get`

<!-- omit in toc -->
#### Arguments
* `<control plane name>` - name of the control plane to connect to.

#### Flags
* `--token = STRING`: Required token to be used in the generated kubeconfig to access the specified control plane. This token is managed in Upbound.
* `-f, --file = STRING`: Optional file path to write the kubeconfig to. If not provided, the default kubeconfig file will be used.

The `up controlplane kubeconfig get` command uses an access token to create an entry in the default kubeconfig file for the specified control plane
and sets it as the current Kubernetes context.

<!-- omit in toc -->
#### Example
```shell
up controlplane kubeconfig get --token <my-token> --account my-org my-mcp
Current context set to upbound-my-org-my-mcp

kubectl api-resources | grep "crossplane.io"
compositeresourcedefinitions                xrd,xrds     apiextensions.crossplane.io/v1                        false        CompositeResourceDefinition
compositionrevisions                                     apiextensions.crossplane.io/v1beta1                   false        CompositionRevision
compositions                                             apiextensions.crossplane.io/v1                        false        Composition
environmentconfigs                                       apiextensions.crossplane.io/v1alpha1                  false        EnvironmentConfig
configurationrevisions                                   pkg.crossplane.io/v1                                  false        ConfigurationRevision
configurations                                           pkg.crossplane.io/v1                                  false        Configuration
controllerconfigs                                        pkg.crossplane.io/v1alpha1                            false        ControllerConfig
locks                                                    pkg.crossplane.io/v1beta1                             false        Lock
providerrevisions                                        pkg.crossplane.io/v1                                  false        ProviderRevision
providers                                                pkg.crossplane.io/v1                                  false        Provider
storeconfigs                                             secrets.crossplane.io/v1alpha1                        false        StoreConfig
```


### `up controlplane pull-secret create`

<!-- omit in toc -->
#### Arguments
* `<secret name>`  - name of the Kubernetes secret object to create. Default is `package-pull-secret`.

#### Flags
* `-f,--file = <file>` - path to a token credentials file created by [`up robot token create`]({{<ref "robot" >}}).
* `--kubeconfig = <path>` - path to a kubeconfig file. The default is the kubeconfig file used by `kubectl`.
* `-n,--namespace = <namespace>` - namespace to install the Kubernetes secret into.  
The default is the value of the environmental variable `UPBOUND_NAMESPACE`.  
If the variable isn't set the command uses the namespace `upbound-system`.

The `up controlplane pull-secret create` command is a simplified alias to the command `kubectl create secret docker-registry package-pull-secret [...]`.  

The command `up controlplane pull-secret create <secret name>` executes the following Kubernetes command:

```shell
kubectl create secret docker-registry <secret name> \
--namespace=upbound-system \
--docker-server=xpkg.upbound.io \
--docker-username=<generated accessId> \
--docker-password=<generated token>
```

#### Automatic token generation
If a `-f <file>` isn't provided the command generates a _user token_ based on the current `up login` profile. Logging out with `up logout` deactivates the token.

{{< hint "warning" >}}
User tokens can't install Upbound Official Providers. Only robot tokens can install Official Providers.
{{< /hint >}}
If you use `-f <file>` the `accessId` and `token` values from a token JSON file are the `--docker-username` and `--docker-password` values. 

<!-- vale gitlab.Substitutions = NO -->
<!-- ignore lowercase 'k' in kubernetes -->
For more information on creating robot account tokens to install Official providers reference the [Authentication]({{<ref "upbound-marketplace/authentication#kubernetes-image-pull-secrets" >}}) section.
<!-- vale gitlab.Substitutions = YES -->

<!-- omit in toc -->
#### Examples

##### Create a pull-secret and automatically generate a user token
```shell
up controlplane pull-secret create my-token
WARNING: Using temporary user credentials that will expire within 30 days.
upbound-system/my-token created
```

##### View a created pull-secret
```shell
kubectl describe secret my-token -n upbound-system
Name:         my-token
Namespace:    upbound-system
Labels:       <none>
Annotations:  <none>

Type:  kubernetes.io/dockerconfigjson

Data
====
.dockerconfigjson:  1201 bytes
```
