---
weight: 50
title: Up Command Reference
description: "Command reference for the Upbound Up CLI"
---
<!-- vale off -->
<!-- vale Google.Headings = NO -->
The `up` command-line provides a suite of tools to configure and interact with Upbound technologies.

The following flags are available for all commands.

{{< table "table table-sm table-striped">}}

| Short flag | Long flag   | Description                  |
| ---------- | ----------- | ---------------------------- |
| `-h`       | `--help`    | Show context-sensitive help. |
|            | `--pretty`  | Pretty print output.         |
| `-q`       | `--quiet`   | Suppress all output.         |

{{< /table >}}

## up composition

The `up composition` command manages Compositions.

### composition generate

Generate a Composition.

**Arguments:**

* `<xrd>`    File path to the Crossplane Resource Definition (XRD) YAML file.

All `up composition generate` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                       | Description                                                                                                                      |
| ---------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `-h`       | `--help`                        | Show context-sensitive help.                                                                                                     |
|            | `--format="default"`            | Format for get/list commands. Can be: `json`, `yaml`, `default`                                                                  |
| `-q`       | `--quiet`                       | Suppress all output.                                                                                                             |
|            | `--pretty`                      | Pretty print output.                                                                                                             |
|            | `--dry-run`                     | Dry-run output.                                                                                                                  |
|            | `--path=STRING`                 | Optional path to the output file where the generated Composition will be saved.                                                  |
| `-f`       | `--project-file="upbound.yaml"` | Path to project definition file.                                                                                                 |
| `-o`       | `--output="file"`               | Output format for the results: `file` to save to a file, `yaml` to print XRD in YAML format, `json` to print XRD in JSON format. |
| `-d`       | `--cache-dir="~/.up/cache/"`    | Directory used for caching dependency images (`$CACHE_DIR`).                                                                     |
{{< /table >}}

### composition render

Run a composition locally to render an XR into composed resources.


**Arguments:**

* `<composition>`           A YAML file specifying the Composition to use to render the Composite Resource (XR).

* `<composite-resource>`    A YAML file specifying the Composite Resource (XR) to render.

The `render` command shows you what composed resources Crossplane would create by printing them to stdout. It also prints any changes that would be made to the status of the XR. It doesn't talk to Crossplane.
Instead it runs the Composition Function pipeline specified by the Composition locally, and uses that to render the XR.

Use the standard `DOCKER_HOST`, `DOCKER_API_VERSION`, `DOCKER_CERT_PATH`, and `DOCKER_TLS_VERIFY` environment variables to configure how this command connects to the Docker daemon.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                               | Description                                                                                                                               |
| ---------- | ----------------------------------------| ----------------------------------------------------------------------------------------------------------------------------------------- |
|            | `--context-files=KEY=VALUE;...`         | Comma-separated context key-value pairs to pass to the Function pipeline. Values must be files containing JSON.                           |
|            | `--context-values=KEY=VALUE;...`        | Comma-separated context key-value pairs to pass to the Function pipeline. Values must be JSON. Keys take precedence over --context-files. |
| `-r`       | `--include-function-results`            | Include informational and warning messages from Functions in the rendered output as resources of kind: Result.                            |
| `-x`       | `--include-full-xr`                     | Include a direct copy of the input XR's spec and metadata fields in the rendered output.                                                  |
| `-o`       | `--observed-resources=PATH`             | A YAML file or directory of YAML files specifying the observed state of composed resources.                                               |
| `-e`       | `--extra-resources=PATH`                | A YAML file or directory of YAML files specifying extra resources to pass to the Function pipeline.                                       |
| `-c`       | `--include-context`                     | Include the context in the rendered output as a resource of kind: Context.                                                                |
|            | `--function-credentials=PATH`           | A YAML file or directory of YAML files specifying credentials to use for Functions to render the XR.                                      |
|            | `--timeout=1m`                          | How long to run before timing out.                                                                                                        |
|            | `--max-concurrency=8`                   | Maximum number of functions to build  at once ($UP_MAX_CONCURRENCY).                                                                      |
| `-f`       | `--project-file="upbound.yaml"`         | Path to project definition file.                                                                                                          |
| `-d`       | `--cache-dir="~/.up/cache/"`            | Directory used for caching dependency images ($CACHE_DIR).                                                                                |
|            | `--no-build-cache`                      | Don't cache image layers while building.                                                                                                  |
|            | `--build-cache-dir="~/.up/build-cache"` | Path to the build cache directory.                                                                                                        |
{{< /table >}}

**Examples**

* Simulate creating a new XR.

```shell
composition render composition.yaml xr.yaml
```

* Simulate updating an XR that already exists.
```shell
composition render composition.yaml xr.yaml \
--observed-resources=existing-observed-resources.yaml
```

* Pass context values to the Function pipeline.

```shell
composition render composition.yaml xr.yaml \
--context-values=apiextensions.crossplane.io/environment='{"key": "value"}'
```

* Pass extra resources Functions in the pipeline can request.

```shell

composition render composition.yaml xr.yaml \
--extra-resources=extra-resources.yaml
```

* Pass credentials to Functions in the pipeline that need them.

```shell
composition render composition.yaml xr.yaml \
--function-credentials=credentials.yaml
```

## configuration

The `up configuration` command provides management operations for Git-synced configurations on Upbound.

{{<hint "tip" >}}
`up cfg` is an alias for `up configuration`.
{{< /hint >}}

All `up configuration` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

### configuration list

List the configurations in your Upbound account
`up configuration list --configuration-name=STRING <name>`.

**Examples**

* List the configurations associated with an account in Upbound.

```shell {copy-lines="1"}
up cfg list
NAME                          TEMPLATE ID                      PROVIDER   REPO                          BRANCH   CREATED AT                      SYNCED AT
gcp-control-plane-api         upbound/configuration-cloudsql   github     gcp-control-plane-api         main     2023-03-27 13:48:12 +0000 UTC   2023-03-29 21:09:13.503641 +0000 UTC
internal-cloud-platform-api   upbound/configuration-aws-icp    github     internal-cloud-platform-api   main     2023-03-28 12:52:24 +0000 UTC   2023-04-03 12:35:56.650919 +0000 UTC
my-platform-api               upbound/configuration-eks        github     my-platform-api               main     2023-04-03 13:12:11 +0000 UTC   2023-04-03 13:12:28.722019 +0000 UTC
```

### configuration create

Create a Git-synced configuration in Upbound
`up configuration create --context=STRING --template-id=STRING <name>`.

You can find a list of available templates by `up configuration template list`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag              | Description                                               |
| ---------- | ---------------------- | --------------------------------------------------------- |
|            | `--context=STRING`     | Name of the GitHub account/org                            |
|            | `--template-id=STRING` | Name of the configuration template                        |
|            | `--private`            | Create the GitHub repository as private. (Default: false) |
{{< /table >}}

**Examples**

* Create a configuration in Upbound synced from a public repository from scratch

```shell {copy-lines="1"}
up cfg create --context=upbound --template-id=upbound/configuration-scratch my-platform-apis
No need to authorize Upbound Github App: already authorized
```

* Create a configuration in Upbound synced from a private repository from [configuration-eks](https://marketplace.upbound.io/configurations/upbound/configuration-eks)

```shell {copy-lines="1"}
up cfg create --context=upbound --template-id=upbound/configuration-eks my-platform-apis-2 --private
No need to authorize Upbound Github App: already authorized
```

{{<hint "tip" >}}
Replace `context` with the name of your org/account in GitHub.
{{< /hint >}}

### configuration get

Get a Git-synced configuration in Upbound
`up configuration get <name>`.

You can find a list of available configurations by `up configuration list`.

**Examples**

* Get a reference to a Git-synced configuration in Upbound called `my-platform-apis`

```shell {copy-lines="1"}
up cfg get my-platform-apis
NAME               TEMPLATE ID                     PROVIDER   REPO               BRANCH   CREATED AT                      SYNCED AT
my-platform-apis   upbound/configuration-scratch   github     my-platform-apis   main     2023-04-03 18:25:28 +0000 UTC   2023-04-03 18:25:43.964217 +0000 UTC
```

### configuration delete

Delete a Git-synced configuration in Upbound. This command requires confirmation unless using the `--force` option.
`up configuration create --context=STRING --template-id=STRING <name>`.

You can find a list of available configurations by `up configuration list`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag | Description                          |
| ---------- | --------- | ------------------------------------ |
|            | `--force` | Force deletion of the configuration. |
{{< /table >}}

**Examples**

* Delete a configuration in Upbound called `my-platform-apis`

```shell {copy-lines="1"}
up cfg delete my-platform-apis
Are you sure you want to delete this configuration? [y/n]: y
Deleting configuration my-platform-apis. This cannot be undone,
my-platform-apis deleted
```

* Force-delete a configuration in Upbound called `my-platform-apis-2`

```shell {copy-lines="1"}
up cfg delete my-platform-apis-2 --force
my-platform-apis-2 deleted
```

### configuration template list

List the available Crossplane configurations that are available to create a new Git-synced configuration from
`up configuration template list`.

**Examples**

* List the configuration templates available to create a new Git-synced configuration from

```shell {copy-lines="1"}
up cfg template list
ID                               DESCRIPTION                   REPO
upbound/configuration-rds        RDS as a Service              github.com/upbound/configuration-rds
upbound/configuration-eks        EKS as a Service              github.com/upbound/configuration-eks
upbound/configuration-aws-icp    AWS Internal Cloud Platform   github.com/upbound/configuration-aws-icp
upbound/configuration-cloudsql   CloudSQL as a Service         github.com/upbound/configuration-cloudsql
upbound/configuration-scratch    Scratch                       github.com/upbound/configuration-scratch
```

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
## controlplane
<!-- vale Upbound.Spelling = YES -->


The `up controlplane` command provides management operations for control planes on Upbound. It also has commands for installing providers or configurations on Crossplane control planes generically.

The `up` CLI relies on a `kubeconfig` file to connect to the target Kubernetes cluster.

{{<hint "tip" >}}
`up ctp` is an alias for `up controlplane`.
{{< /hint >}}

All `up controlplane` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--kubeconfig=<path>`        | Use a custom `kubeconfig` file located at the given path. The default uses the active `kubeconfig`.              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane list

<!-- vale Upbound.Spelling = YES -->

<!-- ignore "controlplane" -->

List the control planes in your Upbound account
`up controlplane list`.

**Examples**

* List the control planes associated with an account.

```shell {copy-lines="1"}
up ctp list
NAME                           ID                                     STATUS   DEPLOYED CONFIGURATION        CONFIGURATION STATUS
first-control-plane            b93baazd-a426-4a9b-8c85-c402bb67ba05   ready    first-configuration           ready
second-control-plane           cb1sb6aa-3b22-4c69-a5a8-ae3dd5b5eb80   ready    first-configuration           ready
third-control-plane            f2h88eb1-59e0-4211-96af-f92428a4561f   ready    second-configuration          ready
```
<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane create
<!-- vale Upbound.Spelling = YES -->

<!-- ignore "controlplane" -->

Create a control plane in Upbound and install referenced configuration on it
`up controlplane create --configuration-name=STRING <name>`.

View available configurations to install on the control plane with `up configuration list`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag              | Description                                              |
| ---------- | ---------------------- | -------------------------------------------------------- |
| `-d`       | `--description=STRING` | Provide a text description for the control plane |
{{< /table >}}

**Examples**

* Create a control plane and install a configuration called `my-control-plane-api` on it.

```shell {copy-lines="1"}
up ctp create --configuration-name=my-control-plane-api my-control-plane
my-control-plane created
```

{{<hint "tip" >}}
The configuration `my-control-plane-api` must first exist and have already been created in your account for this command to succeed.
{{< /hint >}}

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane delete
<!-- vale Upbound.Spelling = YES -->


Delete a control plane in Upbound
`up controlplane delete --configuration-name=STRING <name>`.

View available control planes to delete with `up controlplane list`.

**Examples**

* Delete a control plane.

```shell {copy-lines="1"}
up ctp delete my-control-plane
my-control-plane deleted
```

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane get
<!-- vale Upbound.Spelling = YES -->

Get a control plane in Upbound
`up controlplane get <name>`.

View available control planes with `up controlplane list`.

**Examples**

* Get a control plane called `my-control-plane`.

```shell {copy-lines="1"}
up ctp get my-control-plane
NAME                ID                                     STATUS   DEPLOYED CONFIGURATION        CONFIGURATION STATUS
my-control-plane    2012c379-5743-4f65-a473-30037861ef6e   ready    my-configuration              ready
```

<!-- vale Upbound.Spelling = NO -->
<!-- ignore "controlplane" -->
 ### controlplane connect
<!-- vale Upbound.Spelling = YES -->

Set the current context of your kubeconfig to a control plane
`up controlplane connect <name> --token=STRING`.

Providing a token is only required when connecting to a control plane in Upbound's SaaS environment. The token is an API token. This flag gets ignored when used in the context of an Upbound Space.

**Examples**

* Connect to a control plane called `my-control-plane` in an Upbound Space.

```shell {copy-lines="1"}
up ctp connect my-control-plane
```

* Connect to a control plane called `second-control-plane` in Upbound's SaaS environment.

```shell {copy-lines="1"}
up ctp connect second-control-plane --token=<redacted>
```

<!-- vale Upbound.Spelling = NO -->
<!-- ignore "controlplane" -->
### controlplane connector
<!-- vale Upbound.Spelling = YES -->

The `up controlplane connector` commands connect or disconnect a Kubernetes app cluster from a control plane in Upbound.

All `up controlplane connector` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

<!-- vale Upbound.Spelling = NO -->
<!-- ignore "controlplane" -->
#### controlplane connector install
<!-- vale Upbound.Spelling = YES -->

Connect a Kubernetes app cluster outside of Upbound to a control plane in Upbound. This command creates an `APIService` resource in the Kubernetes app cluster for every claim API in the control plane. As a result, the claim APIs are available in the Kubernetes app cluster just like all native Kubernetes API.
`up controlplane connector install <control-plane-name> <namespace-to-sync-to>`.

{{<hint "important" >}}
Your kubeconfig should be pointing at your **Kubernetes app cluster** in order for this command to succeed.
{{< /hint >}}

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                                | Description                                                                                                        |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
|            | `--token=STRING`                         | API token used to authenticate. Creates a new robot and a token if a token isn't provided.                         |
|            | `--cluster-name=STRING`                  | Name of the cluster connecting to the control plane. Uses the namespace argument if a cluster-name isn't provided. |
|            | `--kubeconfig=STRING`                    | Override the default kubeconfig path.                                                                              |
| `-n`       | `--installation-namespace="kube-system"` | Kubernetes namespace for the Managed Control Plane Connector. Default is kube-system ($MCP_CONNECTOR_NAMESPACE).   |
|            | `--control-plane-secret=STRING`          | Name of the secret that contains the kubeconfig for a control plane.                                               |
|            | `--set=KEY=VALUE;...`                    | Set parameters.                                                                                                    |
| `-f`       | `--file=FILE`                            | Parameters file.                                                                                                   |
|            | `--bundle=BUNDLE`                        | Local bundle path.                                                                                                 |
{{< /table >}}

**Examples**

* Connect an app cluster to a control plane called `my-control-plane` and connected to a namespace `my-app-ns-1` in the control plane.

```shell {copy-lines="1"}
up ctp connect my-control-plane my-app-ns-1
<install Control Plane Connector>
```

<!-- vale Upbound.Spelling = NO -->
<!-- ignore "controlplane" -->
#### controlplane connector uninstall
<!-- vale Upbound.Spelling = YES -->

Disconnect an Kubernetes app cluster from a control plane in Upbound
`up controlplane connector uninstall <namespace`.

The command uninstalls the control plane connector helm chart and moves any claims in the app cluster into the control plane at the specified namespace.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                                | Description                                                                                                        |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
|            | `--cluster-name=STRING`                  | Name of the cluster connecting to the control plane. Uses the namespace argument if a cluster-name isn't provided. |
|            | `--kubeconfig=STRING`                    | Override the default kubeconfig path.                                                                              |
| `-n`       | `--installation-namespace="kube-system"` | Kubernetes namespace for the Managed Control Plane Connector. Default is kube-system ($MCP_CONNECTOR_NAMESPACE).   |
{{< /table >}}

**Examples**

* Disconnect an app cluster from a control plane called `my-control-plane` and move the claims to the `default` namespace in the control plane.

```shell {copy-lines="1"}
up ctp connector uninstall default
<uninstall Control Plane Connector>
```

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane configuration install
<!-- vale Upbound.Spelling = YES -->


{{< hint "warning" >}}
Do not use this command to install a configuration on a control plane in Upbound. Instead, use the built-in support for [Git-synced configurations]({{<ref "reference/legacy-spaces/control-plane-configurations" >}}).
{{< /hint >}}

Install a Crossplane configuration packages into a Kubernetes cluster with
`up controlplane configuration install <package>`.

View packages installed by `up controlplane configuration install` with `kubectl get configuration`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                                     | Description                                                                                                                                                                                                                                                    |
| ---------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|            | `--name=<name>`                               | Manually define a name to apply to the configuration. By default Upbound uses the package name.                                                                                                                                                                |
|            | `--package-pull-secrets=<secret>,<secret>...` | One or more Kubernetes secrets to use to download the configuration package. Comma-seperate more than one secret.                                                                                                                                              |
| `-w`       | `-w --wait=<number><unit>`                    | The amount of time to wait for a package to install and report `HEALTHY`. If a package isn't healthy when the wait expires the command returns an error. Go's [`ParseDuration`](https://pkg.go.dev/maze.io/x/duration#ParseDuration) defines valid time units. |
{{< /table >}}

{{< hint "warning" >}}
When using `--wait`, packages that aren't `HEALTHY` when the wait time expires aren't removed and continue to install in the background.
{{< /hint >}}

**Examples**

* Install the [Upbound AWS reference platform](https://marketplace.upbound.io/configurations/upbound/platform-ref-aws/).

```shell {copy-lines="1"}
up ctp configuration install xpkg.upbound.io/upbound/platform-ref-aws
upbound-platform-ref-aws installed
```

* Install a package and name it `my-package` in Kubernetes.
```shell {copy-lines="1"}
up ctp configuration install xpkg.upbound.io/upbound/platform-ref-aws --name my-package
my-package installed
```

<!-- vale Upbound.Spelling = NO -->
<!-- ignore "controlplane" -->
### controlplane disconnect
<!-- vale Upbound.Spelling = YES -->

Reset the current context of your kubeconfig to the previous value before connecting to a control plane
`up controlplane disconnect`.

**Examples**

* Disconnect from a control plane you connected to prior.

```shell {copy-lines="1"}
up ctp disconnect
```

<!-- vale Upbound.Spelling = NO -->
<!-- ignore "controlplane" -->
### controlplane provider install
<!-- vale Upbound.Spelling = YES -->


{{< hint "warning" >}}
Do not use this command to install a provider on a control plane in Upbound. Instead, use the built-in support for [Git-synced configurations]({{<ref "reference/legacy-spaces/control-plane-configurations" >}}) and declare a provider dependency in the git repo for whichever configuration is installed on your desired control plane.
{{< /hint >}}

Install a Crossplane provider packages into a Kubernetes cluster with
`up controlplane provider install <package>`.

View packages installed by `up controlplane provider install` with `kubectl get configurations` and `kubectl get providers`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                                     | Description                                                                                                                                                                                                                                                    |
| ---------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|            | `--name=<name>`                               | Manually define a name to apply to the configuration. By default Upbound uses the package name.                                                                                                                                                                |
|            | `--package-pull-secrets=<secret>,<secret>...` | One or more Kubernetes secrets to use to download the configuration package. Comma-seperate more than one secret.                                                                                                                                              |
| `-w`       | `-w --wait=<number><unit>`                    | The amount of time to wait for a package to install and report `HEALTHY`. If a package isn't healthy when the wait expires the command returns an error. Go's [`ParseDuration`](https://pkg.go.dev/maze.io/x/duration#ParseDuration) defines valid time units. |
{{< /table >}}

{{< hint "warning" >}}
When using `--wait`, packages that aren't `HEALTHY` when the wait time expires aren't removed and continue to install in the background.
{{< /hint >}}

**Examples**

* Install the [Upbound AWS reference platform](https://marketplace.upbound.io/configurations/upbound/platform-ref-aws/).

```shell {copy-lines="1"}
up ctp configuration install xpkg.upbound.io/upbound/provider-aws
upbound-provider-aws installed
```

* Install a package and name it `my-package` in Kubernetes.
```shell {copy-lines="1"}
up ctp configuration install xpkg.upbound.io/upbound/provider-aws --name my-provider
my-provider installed
```
<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane pull-secret create
<!-- vale Upbound.Spelling = YES -->


Create a new Kubernetes secret object with
`up controlplane pull-secret create`

This command creates secrets the same as described in the Kubernetes documentation
on [pulling images from private registries](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry)
using `kubectl create secret`.

View secrets created by `up controlplane pull-secret create` with `kubectl get secrets`

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                 | Description                                                              |
| ---------- | ------------------------- | ------------------------------------------------------------------------ |
| `-f`       | `--file=<path>`           | Path to credentials file. Uses the profile credentials if not specified. |
| `-n`       | `--namespace=<namespace>` | Kubernetes namespace for pull secret ($UPBOUND_NAMESPACE).               |
{{< /table >}}

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane kubeconfig get
<!-- vale Upbound.Spelling = YES -->


Uses a personal access token to create an entry in the default kubeconfig file for the specified control plane.

The `--file` flag uses the supplied configuration instead.

An incorrect token or control plane name produces an error and doesn't change the
current context.

`up controlplane kubeconfig get --token=STRING`

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag        | Description                                                                                                                  |
| ---------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `-f`       | `--file=STRING`  | File to merge kubeconfig.                                                                                                    |
|            | `--token=STRING` | Required token to use in the generated kubeconfig to access the specified control plane. Upbound manages this token. |
{{< /table >}}

{{< hint "warning" >}}
Upbound does not currently support the use of robot tokens for scoped access to control planes. A personal access token must be used.
{{< /hint >}}

**Examples**

* Configure your kubeconfig to connect to `my-control-plane` and grep APIs for Crossplane installed on it

```shell {copy-lines="1"}
up ctp kubeconfig get --token <my-token> -a my-org my-control-plane
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

## ctx

**Description:** Select an Upbound kubeconfig context.

**Options:**

{{< table "table table-sm table-striped cli-ref">}}
| Long flag  | Short flag | Description                                                             | Default Value |
| ---------- | ---------- | ----------------------------------------------------------------------- | ------------- |
| short      | `-s`       | Short output.                                                           |               |
| context    |            | Kubernetes context to operate on.                                       | upbound       |
| kubeconfig | `-f`       | Kubeconfig to modify when saving a new context. `-f -` prints to stout. |               |
{{< /table >}}

## dependency

Manage configuration dependencies.
The dependency command manages crossplane package dependencies of the project
in the current directory. It caches package information in a local file system
cache (by default in `~/.up/cache`), to be used e.g. for the upbound language
server.

### dependency add
Add a dependency to the current project using `up dependency add <package>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                       | Description                                            |
| ---------- | ------------------------------- | ------------------------------------------------------ |
| `-f`       | `--project-file="upbound.yaml"` | Path to project definition file                        |
| `-d`       | `--cache-dir="~/.up/cache/"`    | Directory used for caching package images ($CACHE_DIR) |
{{< /table >}}

### dependency update-cache
Update the dependency cache for the current project.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                       | Description                                            |
| ---------- | ------------------------------- | ------------------------------------------------------ |
| `-f`       | `--project-file="upbound.yaml"` | Path to project definition file                        |
| `-d`       | `--cache-dir="~/.up/cache/"`    | Directory used for caching package images ($CACHE_DIR) |
{{< /table >}}

### dependency clean-cache
Clean the dependency cache.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                            |
| ---------- | ---------------------------- | ------------------------------------------------------ |
| `-d`       | `--cache-dir="~/.up/cache/"` | Directory used for caching package images ($CACHE_DIR) |
{{< /table >}}

## example

Manage Claim(XRC) or Composite Resource(XR).

### example generate

Generate an Example Claim(XRC) or Composite Resource(XR) using `up example generate [<xrd-file-path>]`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag              | Description                                                                                                                                                                                                    |
| ---------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|            | `--path=STRING`        | Specifies the path to the output file where the Composite Resource (XR) or Composite Resource Claim (XRC) will be saved                                                                                        |
| `-o`       | `--output="file"`      | Specifies the output format for the results. Use 'file' to save to a file, 'yaml' to display the Composite Resource (XR) or Composite Resource Claim (XRC) in YAML format, or 'json' to display in JSON format |
|            | `--type=""`            | Specifies the type of resource to create: 'xrc' for Composite Resource Claim (XRC), 'xr' for Composite Resource (XR)                                                                                           |
|            | `--api-group=STRING`   | Specifies the API group for the resource                                                                                                                                                                       |
|            | `--api-version=STRING` | Specifies the API version for the resource                                                                                                                                                                     |
|            | `--kind=STRING`        | Specifies the Kind of the resource                                                                                                                                                                             |
|            | `--name=STRING`        | Specifies the Name of the resource                                                                                                                                                                             |
|            | `--namespace=STRING`   | Specifies the Namespace of the resource                                                                                                                                                                        |
{{< /table >}}

## function
Manage Functions.

### function generate
Generate a Function for a Composition using `up function generate <composition-path>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                       | Description                                                                              |
| ---------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| `-f`       | `--project-file="upbound.yaml"` | Path to project definition file                                                          |
|            | `--repository=STRING`           | Repository for the built package. Overrides the repository specified in the project file |
| `-d`       | `--cache-dir="~/.up/cache/"`    | Directory used for caching dependency images ($CACHE_DIR)                                |
| `-l`       | `--language="kcl"`              | Language for function                                                                    |
{{< /table >}}

## license

The `up license` command prints the license of the `up` command-line software.

**Examples**

* Print the license of the up CLI

```shell {copy-lines="1"}
up license
By using Up, you are accepting to comply with terms and conditions in https://licenses.upbound.io/upbound-software-license.html
```

## login

The `up login` command authenticates to Upbound, generates and stores a JSON credentials file locally in `~/.up/config.json`. Commands requiring authentication to Upbound services use the JSON file to authenticate (such as interacting with Upbound or the Marketplace)
`up login`.

If run without arguments, `up login` asks for the username and password from the terminal. View the current authentication status with `up organization list`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag                                        | Long flag           | Description                                                                                 |
| ------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `-u`                                              | `--username=STRING` | The username to authenticate. Defaults to the value of the environmental variable `UP_USER` |
| `-p`                                              | `--password=STRING` | The password to authenticate. Defaults to                                                   |
| the value of the environmental variable `UP_PASS` |
| `-t`                                              | `--token=STRING`    | An Upbound user token to use in place of a username and password                            |
| `-a`                                              | `--account=STRING`  | Authenticate as a member of an organization.                                                |
{{< /table >}}

**Examples**

* Login without arguments

```shell {copy-lines="1"}
up login
Username: my-name
Password:
my-name logged in
```

* Login with a token

```shell {copy-lines="1"}
up login -t eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYWY2NmFjMi1iY2NhLTRkOWUtODRjNy1kZDJhOTFlNzNjODEiLCJzdWIiOiJ1c2VyfDE0NjMifQ.EEk1Ukei$fkhKKx2yQKeq0pIs3dnjkbOvvjD22_osdKXntGE39G8CsrORO0XT7w300Apw1HW8f21GyGAeO0ilxW6B8efKAqILd0V4-9eAL-VnCK6iLU6wHVt_vP6JwRLyEJrnn7ldYbaz1i4LONZhd5UfsRe4bOztnohkWNsUeIEOnRj_PBntGA5o1VQEyv4kwOS5vp5aVNF9zYWyW7RFKjpmgPdDqLQ_SSKrqmUQPXW4X886lfNWsgtdcTthoo3NEiKPDfrpSh1ZW-4jurGvrgdhfOO2kMRkk-5lZQ0usPYZ62gqTnayjxYP4TCKA7HCKhjoZlX5MS2WlObeTIgA
2af6a653-abcd-4d9e-84c7-dd3a91e73c81 logged in
```

* Login to an organization

```shell {copy-lines="1"}
up organization list
NAME           ROLE
my_org        owner
```

If not logged in, the command returns an error.

```shell
up org list
up: error: permission denied: {"message":"Unauthorized"}
```

## logout

Log out of Upbound services by invalidating the current login token.

**Examples**

* Log out of Upbound

```shell {copy-lines="1"}
up logout
my-name logged out
```

## organization

The `up organization` commands create and manage organizations on Upbound.

{{<hint "tip" >}}
`up org` is an alias for `up organization`.
{{< /hint >}}

All `up configuration` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

### organization create

Create an organization in Upbound
`up organization create <name>`.

**Examples**

* Create an organization called `my-org` in Upbound

```shell {copy-lines="1"}
up org create my-org
my-org created
```

{{<hint "tip" >}}
Individuals are allowed to belong to as many organizations as they wish, but they are only allowed to create 1 additional org. Attempts to create more than 1 additional org will result in an error being returned.
{{< /hint >}}

### organization delete

Delete an organization in Upbound
`up organization delete <name>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag | Description                         |
| ---------- | --------- | ----------------------------------- |
|            | `--force` | Force deletion of the organization. |
{{< /table >}}

{{<hint "warning" >}}
Deleting an organization removes all users from the organization, deletes all robots, robot tokens, teams, and repositories. **This can not be undone.**
{{< /hint >}}

**Examples**

* Delete an organization called `my-org` in Upbound

```shell {copy-lines="1"}
up org delete my-org
Are you sure you want to delete this organization? [y/n]: y
Deleting organization my-org. This cannot be undone.
my-org deleted
```

### organization list

List the organizations belonged to by the account currently logged in
`up organization list`.

**Examples**

* List all organizations belonged to by the user

```shell {copy-lines="1"}
up org list
ID    NAME      ROLE
433   my-org    owner
```

### organization get

Get an organization in Upbound
`up organization get <name>`.

**Examples**

* Get an organization called `my-org`

```shell {copy-lines="1"}
up org get my-org
ID    NAME      ROLE
433   my-org    owner
```

### organization user

The `up organization user` commands create and manage users in an organization on Upbound.

All `up organization user` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

#### organization user invite

Invite a user to an organization on Upbound
`up organization user invite <org-name> <email>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag               | Description                                   |
| ---------- | ----------------------- | --------------------------------------------- |
| `-p`       | `--permission="member"` | Role of the user to invite (owner or member). |
{{< /table >}}

**Examples**

* Invite a user into AcmeCo org on Upbound

```shell {copy-lines="1"}
up org user invite acmeco idontexist@acmeco.org
idontexist@acmeco.org invited
```

#### organization user delete-invite

Delete an invite for a user to an organization on Upbound
`up organization user delete-invite <org-name> <email>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag | Description                   |
| ---------- | --------- | ----------------------------- |
|            | `--force` | Force deletion of the invite. |
{{< /table >}}

**Examples**

* Delete an invite for a user to the AcmeCo org on Upbound

```shell {copy-lines="1"}
up org user delete-invite acmeco idontexist@acmeco.org
Are you sure you want to delete this invite? [y/n]: y
Deleting invite idontexist@acmeco.org. This cannot be undone.
Invitation 517 deleted
```

#### organization user list-invite

List the pending invites for an organization on Upbound
`up organization user list-invites <org-name>`.

**Examples**

* List the invites for AcmeCo org on Upbound

```shell {copy-lines="1"}
up org user list-invites acmeco
ID    EMAIL                   PERMISSION
517   idontexist@acmeco.org
```

#### organization user list-members

List the members of an organization on Upbound
`up organization user list-members <org-name>`.

**Examples**

* List the members of AcmeCo org on Upbound

```shell {copy-lines="1"}
up org user list-members acmeco
ID     NAME              PERMISSION
517    Test User         owner
518    Test User2        member
```

#### organization user remove-members

Remove a members from an organization on Upbound
`up organization user remove-member <org-name> <user-id>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag | Description                   |
| ---------- | --------- | ----------------------------- |
|            | `--force` | Force deletion of the invite. |
{{< /table >}}

**Examples**

* Remove a user from an org in Upbound

```shell {copy-lines="1"}
up org user remove-user acmeco 517
Are you sure you want to remove this member? [y/n]: y
Removing member 517. This cannot be undone.
User 517 removed from acmeco
```

## profile

The `up profile` command lets you view and manage `up` command-line profiles with up profile commands.

All `up profile` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--kubeconfig=<path>`        | Use a custom `kubeconfig` file located at the given path. The default uses the active `kubeconfig`.              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

### profile current

Get the current Upbound profile
`up profile current`.

**Examples**

* Print the current Upbound profile

```shell {copy-lines="1"}
up profile current
{
    "default": {
        "id": "my-name",
        "type": "user",
        "session": "REDACTED",
        "account": "my-org",
        "base": {
            "color": "blue"
        }
    }
}
```

### profile list

List all configured profiles.
`up profile list`.

**Examples**

* Print the available profiles

```shell {copy-lines="1"}
up profile list
CURRENT   NAME      TYPE   ACCOUNT
*         default   user   my-org
```

### profile use

Select a profile to use for all commands in `up`
`up profile use`.

**Examples**

* use an Upbound profile called `test`

```shell {copy-lines="1"}
up profile use test
```

### profile view

Prints all configured profiles for `up`.
`up profile view`.

**Examples**

* view all profiles for `up`

```shell {copy-lines="1"}
up profile view
{
    "default": {
        "id": "my-name",
        "type": "user",
        "session": "REDACTED",
        "account": "my-org",
        "base": {
            "color": "blue"
        }
    }
}
```
<!-- vale Upbound.Spelling = NO -->

<!-- vale gitlab.SubstitutionWarning = NO -->
<!-- ignore "config" -->
### profile config
<!-- vale Upbound.Spelling = YES -->

<!-- vale gitlab.SubstitutionWarning = YES -->

Settings apply to the current profile in use. Supply a JSON file of settings for bulk changes.
`up profile config`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                      | Description                    |
| ---------- | ------------------------------ | ------------------------------ |
| `-f`       | `--file = <profile JSON file>` | a JSON file of key-value pairs |
{{< /table >}}

**Examples**

* set a key-value pair

```shell {copy-lines="1"}
up profile config set color blue
```

* unset a key-value pair

```shell {copy-lines="1"}
up profile config unset color
```

## project

The `up project` command manages Upbound development projects.

All `up project` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag            | Description                                                     |
| ---------- | -------------------- | --------------------------------------------------------------- |
| `-h`       | `--help`             | Show context-sensitive help.                                    |
|            | `--format="default"` | Format for get/list commands. Can be: `json`, `yaml`, `default` |
| `-q`       | `--quiet`            | Suppress all output.                                            |
|            | `--pretty`           | Pretty print output.                                            |
|            | `--dry-run`          | Dry-run output.                                                 |
{{< /table >}}

### project init

Initialize a new project.

This command initializes a new project using a specified template. You can use any Git repository as the template source.

You can specify the template by providing either a full Git URL or a well-known template name. The following well-known template names are supported:

  - `project-template` (https://github.com/upbound/project-template)
  - `project-template-ssh` (git@github.com:upbound/project-template.git)

Examples:

    # Initialize a new project using a public template repository:
    up project init --template="project-template" example-project

    # Initialize a new project from a private template using Git token authentication:
    up project init --template="https://github.com/example/private-template.git" --method=https --username="<username>" --password="<token>" example-project

    # Initialize a new project from a private template using SSH authentication:
    up project init --template="git@github.com:upbound/project-template.git" --method=ssh --ssh-key=/Users/username/.ssh/id_rsa example-project

    # Initialize a new project from a private template using SSH authentication with an SSH key password:
    up project init --template="git@github.com:upbound/project-template.git" --method=ssh --ssh-key=/Users/username/.ssh/id_rsa --password="<ssh-key-password>" example-project

**Arguments:**

* `<name>`    The name of the new project to initialize.

All `up project init` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                       | Description                                                                                   |
| ---------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| `-h`       | `--help`                        | Show context-sensitive help.                                                                  |
|            | `--format="default"`            | Format for get/list commands. Can be: `json`, `yaml`, `default`                               |
| `-q`       | `--quiet`                       | Suppress all output.                                                                          |
|            | `--pretty`                      | Pretty print output.                                                                          |
|            | `--dry-run`                     | Dry-run output.                                                                               |
|            | `--template="project-template"` | The template name or URL to use to initialize the new project.                                |
|            | `--directory=STRING`            | The directory to initialize. It must be empty. It will be created if it doesn't exist.        |
|            | `--ref-name="main"`             | The branch or tag to clone from the template repository.                                      |
|            | `--method="https"`              | Specify the method to access the repository: `https` or `ssh`.                                |
|            | `--ssh-key=STRING`              | Optional. Specify an SSH key for authentication when initializing the new package.            |
|            | `--username="git"`              | Optional. Specify a username for HTTP(S) authentication.                                      |
|            | `--password=STRING`             | Optional. Specify a password for authentication.                                              |
|            | `--domain=https://upbound.io`   | Root Upbound domain (`$UP_DOMAIN`).                                                           |
|            | `--profile=STRING`              | Profile used to execute command (`$UP_PROFILE`).                                              |
| `-a`       | `--account=STRING`              | Account used to execute command (`$UP_ACCOUNT`).                                              |
|            | `--insecure-skip-tls-verify`    | Skip verifying TLS certificates (`$UP_INSECURE_SKIP_TLS_VERIFY`).                             |
| `-d`       | `--debug`                       | Run with debug logging. Repeat to increase verbosity. Output might contain confidential data. |
{{< /table >}}

### project build

Build a project into a Crossplane package.

All `up project build` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                               | Description                                                                               |
| ---------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `-h`       | `--help`                                | Show context-sensitive help.                                                              |
|            | `--format="default"`                    | Format for get/list commands. Can be: `json`, `yaml`, `default`                           |
| `-q`       | `--quiet`                               | Suppress all output.                                                                      |
|            | `--pretty`                              | Pretty print output.                                                                      |
|            | `--dry-run`                             | Dry-run output.                                                                           |
| `-f`       | `--project-file="upbound.yaml"`         | Path to project definition file.                                                          |
|            | `--repository=STRING`                   | Repository for the built package. Overrides the repository specified in the project file. |
| `-o`       | `--output-dir="_output"`                | Path to the output directory, where packages will be written.                             |
|            | `--no-build-cache`                      | Don't cache image layers while building.                                                  |
|            | `--build-cache-dir="~/.up/build-cache"` | Path to the build cache directory.                                                        |
|            | `--max-concurrency=8`                   | Maximum number of functions to build at once (`$UP_MAX_CONCURRENCY`).                     |
| `-d`       | `--cache-dir="~/.up/cache/"`            | Directory used for caching dependencies (`$CACHE_DIR`).                                   |
{{< /table >}}

### up project push

Push a project's packages to the Upbound Marketplace.

All `up project push` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                       | Description                                                                                   |
| ---------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| `-h`       | `--help`                        | Show context-sensitive help.                                                                  |
|            | `--format="default"`            | Format for get/list commands. Can be: `json`, `yaml`, `default`                               |
| `-q`       | `--quiet`                       | Suppress all output.                                                                          |
|            | `--pretty`                      | Pretty print output.                                                                          |
|            | `--dry-run`                     | Dry-run output.                                                                               |
| `-f`       | `--project-file="upbound.yaml"` | Path to project definition file.                                                              |
|            | `--repository=STRING`           | Repository to push to. Overrides the repository specified in the project file.                |
| `-t`       | `--tag=""`                      | Tag for the built package. If not provided, a semver tag will be generated.                   |
|            | `--package-file=STRING`         | Package file to push. Discovered by default based on repository and tag.                      |
|            | `--create`                      | Create the configuration repository before pushing if it does not exist.                      |
|            | `--max-concurrency=8`           | Maximum number of functions to build at once (`$UP_MAX_CONCURRENCY`).                         |
|            | `--domain=https://upbound.io`   | Root Upbound domain (`$UP_DOMAIN`).                                                           |
|            | `--profile=STRING`              | Profile used to execute command (`$UP_PROFILE`).                                              |
| `-a`       | `--account=STRING`              | Account used to execute command (`$UP_ACCOUNT`).                                              |
|            | `--insecure-skip-tls-verify`    | Skip verifying TLS certificates (`$UP_INSECURE_SKIP_TLS_VERIFY`).                             |
| `-d`       | `--debug`                       | Run with debug logging. Repeat to increase verbosity. Output might contain confidential data. |
{{< /table >}}

## repository

The `up repository` command provides management operations for Upbound repository accounts.

{{<hint "tip" >}}
`up repo` is an alias for `up repository`.
{{< /hint >}}

All `up repository` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

### repository create

Create a repository with the given name
`up repository create <name>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                                                    |
| ---------- | ----------- | -------------------------------------------------------------- |
|            | `--publish` | Sets the Marketplace publishing policy of the new repository.  |
|            | `--private` | Sets the visibility of the repository. Set `=false` for public.|
{{< /table >}}

**Examples**

* Create a repository called `my-repo`

```shell {copy-lines="1"}
up repo create my-repo
acmeco/my-repo created
```

### repository update

Update a repository with the given name, visibility, and publishing setting for the Marketplace.
`up repository update <name> --private <BOOL> --publish <BOOL>`

{{< table "table table-sm table-striped cli-ref">}}

| Short flag | Long flag   | Description                                                    |
| ---------- | ----------- | -------------------------------------------------------------- |
|            | `--force`   | Force the update of repository.                                |
|            | `--publish` | Creates or deletes the Marketplace listing for the repository. |
|            | `--private` | Sets the visibility of the repository. Set `=false` for public.|

{{< /table >}}

{{<hint "warning" >}}
Updating a repository is a full replacement operation requiring the user to specify full intent.

Changing the visibility of the repository will inherently affect authentication. For example, updating a repository
from public to private will now require clients to provide a package pull secret.

Similarly, removing a published Marketplace listing will delete page documents and potentially break bookmarked web pages.

To bypass the confirmation prompt (e.g. for automation), pass the `--force` flag.
{{< /hint >}}

**Examples:**

* Update a public repository named `my-repo` and publish it to the Marketplace

```shell {copy-lines="1"}
up repo update my-repo --private=false --publish
Updating a repository may delete Marketplace listings
or force clients to require authentication. Continue? [y/n]: y
acmeco/my-repo updated
```

### repository delete

Delete a repository with the given name
`up repository delete <name>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag | Description                   |
| ---------- | --------- | ----------------------------- |
|            | `--force` | Force deletion of repository. |
{{< /table >}}

{{<hint "warning" >}}
Deleting a repository removes all packages from the repository and impacts all users in an organization. Deleting a public repository will also impact any users that attempt to pull any packages in that repository or have it declared as a dependency in their cluster. **This can not be undone.**
{{< /hint >}}

**Examples**

* Delete a repository called `my-repo`

```shell {copy-lines="1"}
up repo delete my-repo
Are you sure you want to delete this repository? [y/n]: y
Deleting repository acmeco/my-repo. This cannot be undone.
acmeco/my-repo deleted
```

### repository list

List the repositories belonging to this account
`up repository list`.

**Examples**

* List the repositories in Upbound belonging to this account

```shell {copy-lines="1"}
up repo list
NAME                                   TYPE            PUBLIC   UPDATED
c934895d-7271-422b-9f50-0c7553962891   configuration   false    7d6h
375e8c55-7684-4a4d-9fc4-886ca2d0630a   configuration   false    6d7h
c7fcd651-d370-4773-b688-da128338b599   configuration   false    4d21h
```

### repository get

Get a repository in this account
`up repository get`.

**Examples**

* Get a repository called `my-repo`

```shell {copy-lines="1"}
up repo get my-repo
NAME      TYPE      PUBLIC   UPDATED
my-repo   unknown   true     n/a
```

## robot

The `up robot` command provides management operations for robots in Upbound. Robots are identities used for authentication that are independent from a single user and aren't tied to specific usernames or passwords. Robots have their own authentication credentials and configurable permissions.

All `up robot` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

### robot create

Create a robot in your account's organization
`up robot create <name>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag              | Description           |
| ---------- | ---------------------- | --------------------- |
|            | `--description=STRING` | Description of robot. |
{{< /table >}}

**Examples**

* Create a robot called `my-robot`

```shell {copy-lines="1"}
up robot create my-robot
my-org/my-robot created
```

### robot delete

Delete a robot from your account's organization
`up robot delete <name>`.

**Examples**

* Delete a robot called `my-robot`

```shell {copy-lines="1"}
up robot delete my-robot
Are you sure you want to delete this robot? [y/n]: y
Deleting robot my-org/my-robot. This cannot be undone.
my-org/my-robot deleted
```

### robot list

List the robots in your account's organization
`up robot delete <name>`.

**Examples**

* List all robots in this account's organization

```shell {copy-lines="1"}
up robot list
NAME              ID                                     DESCRIPTION   CREATED
my-robot          3f76eec5-b7e0-4f6e-aeec-8adbec2c44a6                 28m
```

### robot get

Get a robot from your account's organization
`up robot get <name>`.

**Examples**

* Get a robot called `my-robot`

```shell {copy-lines="1"}
up robot get
NAME              ID                                     DESCRIPTION   CREATED
my-robot          3f76eec5-b7e0-4f6e-aeec-8adbec2c44a6                 28m
```

### robot token

Manage robot authentication tokens for existing robot accounts with
`up robot token`.

#### robot token create

Create a robot authentication tokens for an robot accounts with
`up robot token create --output=STRING <robot-name> <token-name>`.

**Examples**

* Create a robot token

```shell {copy-lines="1"}
up robot token create my-robot my-token --output=~/my-robot-token.json
my-org/my-robot/my-token created
cat ~/my-robot-token.json
{"accessId":"a857e667-526a-8424-8dff-d29d3204adae","token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhODU3ZTY2Ny01MjZhLTQwNDItOGRlMy1kMjlkMzIwNGFkYWUiLCJzdWIiOiJyb2JvdHwzZjc2ZWVjNS1iN2UwLTRmNmUtYWVlYy04YWRiZWMyYzQ0YTYifQ.F00nFGsINl3wrRvI6YQd4AlwevdiZZZeiJFZXi7QxZ3pYEhDjeL0pLw-ln-qyFLQXNX42jw-n0sAlmV6T1IVU9fLjQOaPIiFbhovlf4uNlPL51ih3qwswMC7kgdzCpg3e4l3HngEsHsIhnv_5ipliJXx7Pk7eRfybDQyGM7nodbd5Zk-bOI9MMRJPrwxanlRoPnt3oiUhSBcmHaJh7GbSs_8bCKq1hSK1HK6nj8nHgS2zOI3oe1Xrk1SKnNw2wC_MpPDxpoW9xitMapjzhKdzdl5T3peIrsEW9z2i-Sm1yKFpe80a6wRKNgiK1caxj7gjPVuvEoVop-uKayN9DMViQ"}
```

#### robot token delete

Delete a robot authentication tokens from a robot account with
`up robot token delete <robot-name> <token-name>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag | Description                   |
| ---------- | --------- | ----------------------------- |
|            | `--force` | Force deletion of repository. |
{{< /table >}}

**Examples**

* Delete a token called `my-token` from a robot called `my-robot`

```shell {copy-lines="1"}
up robot token delete my-robot my-token
Are you sure you want to delete this robot token? [y/n]: y
Deleting robot token my-org/my-robot/my-token. This cannot be undone.
my-org/my-robot/my-token deleted
```

#### robot token list

List the authentication tokens of a robot account with
`up robot token list <robot-name>`.

**Examples**

* List the tokens for a robot called `my-robot`

```shell {copy-lines="1"}
up robot token list my-robot
NAME       ID                                     CREATED
my-token   1987b8c2-b364-4787-9ce2-39493f3db6ad   3m40s
```

#### robot token get

Get an authentication tokens of a robot account with
`up robot token get <robot-name> <token-name>`.

**Examples**

* Get a token called `my-token` from a robot called `my-robot`

```shell {copy-lines="1"}
up robot token get my-robot my-token
NAME       ID                                     CREATED
my-token   1987b8c2-b364-4787-9ce2-39493f3db6ad   5m20s
```

## space

The `up space` commands allow you to install and manage an Upbound Space on a Kubernetes cluster.

All `up space` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

### space init

Initialize an Upbound Spaces deployment
`up space init [<version>] --token-file=TOKEN-FILE`.

You must provide the desired version of Spaces to install. You can find a list of available versions in [Product Lifecycle]({{<ref "reference/lifecycle.md" >}}). You must provide a token (given to you by Upbound) for the install to proceed.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                 | Description                                             |
| ---------- | ------------------------- | ------------------------------------------------------- |
|            | `--token-file=TOKEN-FILE` | File containing authentication token.                   |
|            | `--yes`                   | Answer yes to all questions during the install process. |
|            | `--public-ingress`        | For AKS, EKS, and GKE, expose ingress publicly          |
|            | `--kubeconfig=STRING`     | Override default kubeconfig path.                       |
|            | `--set=KEY=VALUE;...`     | Set parameters.                                         |
| `-f`       | `--file=FILE`             | Parameters file.                                        |
|            | `--bundle=BUNDLE`         | Local bundle path.                                      |
{{< /table >}}

**Examples**

* Install v1.0.1 of Spaces

```shell {copy-lines="1"}
up space init "v1.0.1"
```

* Install v1.0.1 of Spaces and expose public ingress

```shell {copy-lines="1"}
up space init "v1.0.1" --public-ingress=true
```

### space destroy

Remove the Upbound Spaces deployment
`up space destroy`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag             | Description                       |
| ---------- | --------------------- | --------------------------------- |
|            | `--kubeconfig=STRING` | Override default kubeconfig path. |
|            | `--set=KEY=VALUE;...` | Set parameters.                   |
| `-f`       | `--file=FILE`         | Parameters file.                  |
|            | `--bundle=BUNDLE`     | Local bundle path.                |
{{< /table >}}

**Examples**

* Remove an installation of an Upbound Space in a Kubernetes cluster

```shell {copy-lines="1"}
up space destroy
```

{{< hint "tip" >}}
This command operates based on the current context in your kubeconfig. Make sure your kubeconfig is pointed at the desired Kubernetes cluster.
{{< /hint >}}

### space mirror

Managing the mirroring of artifacts to local storage or private container registries.

The 'mirror' command mirrors all required OCI artifacts for a specific Space version.

**Examples:**

This command mirrors all artifacts for Space version 1.9.0 into a local directory as .tar.gz files, using the token file for authentication.

```shell
space mirror -v 1.9.0 --output-dir=/tmp/output --token-file=upbound-token.json
```

This command mirrors all artifacts for Space version 1.9.0 to a specified container registry, using the token file for authentication.

```shell        
space mirror -v 1.9.0 --destination-registry=myregistry.io --token-file=upbound-token.json
```

Note: Ensure you log in to the registry first using a command like 'docker login myregistry.io'.

This command performs a dry run to verify mirroring of all artifacts for Space version 1.9.0 into a local directory as .tar.gz files, using the token file for authentication. A request is made to the Upbound registry to confirm network access.

```shell
space mirror -v 1.9.0 --output-dir=/tmp/output --token-file=upbound-token.json --dry-run
```

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                       | Description                                                                                   |
|------------|---------------------------------|-----------------------------------------------------------------------------------------------|
|            | `--token-file=TOKEN-FILE`       | File containing authentication token. Expecting a JSON file with "accessId" and "token" keys. |
| `-t`       | `--output-dir=STRING`           | The local directory path where exported artifacts will be saved as .tgz files.                |
| `-d`       | `--destination-registry=STRING` | The target container registry where the artifacts will be mirrored.                           |
| `-v`       | `--version=STRING`              | The specific Spaces version for which the artifacts will be mirrored.                         |

{{< /table >}}


### space upgrade

Upgrade an Upbound Spaces deployment
`up space upgrade [<version>] --token-file=TOKEN-FILE`.

You must provide the desired version of Spaces to upgrade to. You can find a list of available versions in [Product Lifecycle]({{<ref "reference/lifecycle.md" >}}). You must provide a token (given to you by Upbound) for the install to proceed.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag                 | Long flag                 | Description                           |
| -------------------------- | ------------------------- | ------------------------------------- |
|                            | `--token-file=TOKEN-FILE` | File containing authentication token. |
|                            | `--rollback`              | Rollback to the previous installed    |
| version on failed upgrade. |
|                            | `--kubeconfig=STRING`     | Override default kubeconfig path.     |
|                            | `--set=KEY=VALUE;...`     | Set parameters.                       |
| `-f`                       | `--file=FILE`             | Parameters file.                      |
|                            | `--bundle=BUNDLE`         | Local bundle path.                    |
{{< /table >}}

**Examples**

* Upgrade from a release candidate to v1.0.1

```shell {copy-lines="1"}
up space upgrade v1.0.1 --token-file=./token.json
```

### space billing

The `up space billing` commands manages configuration and fetching of billing data in an Upbound Space.

All `up space billing` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

#### space billing get

Get a billing report for submission to Upbound
`up space billing get --provider=PROVIDER --bucket=STRING --account=STRING --billing-month=TIME`.

Supply the storage location for the billing data used to create the report using the optional `--provider`, `--bucket`, and `--endpoint` flags. If these flags are missing, it retrieves values from the Spaces cluster from your kubeconfig. Set `--endpoint=""` to use the storage provider's default endpoint without checking your Spaces cluster for a custom
endpoint.

Supply the credentials other storage provider configuration according to the instructions for each provider below.

##### AWS S3

Supply configuration by setting these environment variables: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY`. For more options, see the documentation at
https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html.

##### GCP Cloud Storage

Supply credentials by setting the environment variable `GOOGLE_APPLICATION_CREDENTIALS` with the location of a credential JSON file. For more options, see the documentation at
https://cloud.google.com/docs/authentication/application-default-credentials.

##### Azure Blob Storage

Supply configuration by setting these environment variables: `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET`. For more options, see the documentation at
https://learn.microsoft.com/en-us/azure/developer/go/azure-sdk-authentication.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                         | Description                                                                                   |
| ---------- | --------------------------------- | --------------------------------------------------------------------------------------------- |
|            | `--provider=PROVIDER`             | Storage provider. Must be one of: aws, gcp, azure ($UP_BILLING_PROVIDER).                     |
|            | `--bucket=STRING`                 | Storage bucket ($UP_BILLING_BUCKET).                                                          |
|            | `--endpoint=STRING`               | Custom storage endpoint ($UP_BILLING_ENDPOINT).                                               |
|            | `--account=STRING`                | Name of the Upbound account whose billing report is collected ($UP_BILLING_ACCOUNT).          |
|            | `--azure-storage-account=STRING`  | Name of the Azure storage account. Required for --provider=azure ($UP_AZURE_STORAGE_ACCOUNT). |
|            | `--billing-month=TIME`            | Get a report for a billing period of one calendar month. Format: 2006-01 ($UP_BILLING_MONTH). |
|            | `--billing-custom=BILLING-CUSTOM` | Get a report for a custom                                                                     |
billing period. Date range is inclusive. Format: 2006-01-02/2006-01-02
($UP_BILLING_CUSTOM).  |
|      | `--force-incomplete`             |    Get a report for an incomplete billing period ($UP_BILLING_FORCE_INCOMPLETE).  |
|  `-o`   | `--out="upbound_billing_report.tgz"`             |   Name of the output file ($UP_BILLING_OUT).  |
|      | `--token-file=TOKEN-FILE`             |   File containing authentication token.  |
|      | `--rollback`             |   Rollback to the previous installed version on failed upgrade.  |
|  | `--kubeconfig=STRING`             |    Override default kubeconfig path. |
|      | `--set=KEY=VALUE;...`             |   Set parameters.  |
|   `-f`   | `--file=FILE`             |   Parameters file.  |
|      | `--bundle=BUNDLE`             |   Local bundle path.  |
{{< /table >}}

**Examples**

* Get the billing data from an AWS bucket for 09/2023.

```shell {copy-lines="1"}
up space billing get --provider=aws --bucket=my-bucket --account=acmeco --billing-month=2023-09
```

## uxp

The `up uxp` commands allow you to install and manage Upbound Universal Crossplane (UXP) on a Kubernetes cluster.

All `up uxp` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                    | Description                                                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `-a`       | `--account=STRING`           | The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|            | `--domain=<URL>`             | The control plane domain to connect to. The default is `https://upbound.io`                              |
|            | `--insecure-skip-tls-verify` | **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended.    |
|            | `--profile=<path>`           | Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`                  |
{{< /table >}}

### uxp install

Install UXP into a target Kubernetes app cluster
`up uxp install`.

UXP installs the latest stable release by default. The list of available UXP versions is in the [charts.upbound.io/stable](https://charts.upbound.io/stable/) listing.

The UXP [install guide]({{<ref "uxp/install" >}}) lists all install-time settings.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag        | Long flag                      | Description                         |
| ----------------- | ------------------------------ | ----------------------------------- |
|                   | `--kubeconfig=STRING`          | Override default kubeconfig path.   |
| `-n`              | `--namespace="upbound-system"` | Kubernetes namespace for UXP        |
| ($UXP_NAMESPACE). |
|                   | `--unstable`                   | Allow installing unstable versions. |
|                   | `--set=KEY=VALUE;...`          | Set parameters.                     |
| `-f`              | `--file=FILE`                  | Parameters file.                    |
|                   | `--bundle=BUNDLE`              | Local bundle path.                  |
{{< /table >}}

**Examples**

* Install the latest version of UXP

```shell {copy-lines="1"}
up uxp install
```

* Install the latest version of UXP and set the image pull policy

```shell {copy-lines="1"}
up uxp install --set image.pullPolicy=IfNotPresent
```

### uxp uninstall

Uninstall UXP from a Kubernetes app cluster
`up uxp uninstall`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag        | Long flag                      | Description                       |
| ----------------- | ------------------------------ | --------------------------------- |
|                   | `--kubeconfig=STRING`          | Override default kubeconfig path. |
| `-n`              | `--namespace="upbound-system"` | Kubernetes namespace for UXP      |
| ($UXP_NAMESPACE). |
{{< /table >}}

**Examples**

* Uninstall UXP

```shell {copy-lines="1"}
up uxp uninstall
```

### uxp upgrade

UXP upgrades can be from one UXP version to another or from open source Crossplane to a compatible UXP version
`up uxp upgrade [<version>]`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag                      | Description                                                 |
| ---------- | ------------------------------ | ----------------------------------------------------------- |
|            | `--kubeconfig=STRING`          | Override default kubeconfig path.                           |
| `-n`       | `--namespace="upbound-system"` | Kubernetes namespace for UXP ($UXP_NAMESPACE).              |
|            | `--rollback`                   | Rollback to the last installed version on a failed upgrade. |
|            | `--force`                      | Force upgrade even if versions are incompatible.            |
|            | `--set=KEY=VALUE;...`          | Set parameters.                                             |
| `-f`       | `--file=FILE`                  | Parameters file.                                            |
|            | `--bundle=BUNDLE`              | Local bundle path.                                          |
{{< /table >}}

**Examples**

* Upgrade to UXP version v1.7.0-up.1

```shell {copy-lines="1"}
up uxp upgrade v1.7.0-up.1
```

* Upgrade Crossplane to UXP

```shell {copy-lines="1"}
up uxp upgrade v1.7.0-up.1 -n crossplane-system
```

## version

The `up version` command prints the client and server version information for the current context.

<!-- vale Upbound.Spelling = NO -->
<!-- ignore xpls -->
## xpls


The `up xpls` starts the xpls language server.

<!-- vale Upbound.Spelling = NO -->
<!-- ignore xpls -->
### xpls serve
<!-- vale Upbound.Spelling = YES -->

run a server for Crossplane definitions using the Language Server Protocol with
`up xpls serve`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag               | Description                                 |
| ---------- | ----------------------- | ------------------------------------------- |
|            | `--cache="~/.up/cache"` | Directory path for dependency schema cache. |
{{< /table >}}

**Examples**

<!-- vale Upbound.Spelling = NO -->
<!-- ignore xpls -->
* Start xpls
<!-- vale Upbound.Spelling = YES -->

```shell {copy-lines="1"}
up xpls serve
```

## xpls

Start xpls language server.

### xpls serve

Run a server for Crossplane definitions using the Language Server Protocol.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag               | Description                                |
| ---------- | ----------------------- | ------------------------------------------ |
|            | `--cache="~/.up/cache"` | Directory path for dependency schema cache |
|            | `--verbose`             | Run server with verbose logging            |
{{< /table >}}

## xrd

Manage XRDs from Composite Resources(XR) or Claims(XRC).

### xrd generate
Generate an XRD from a Composite Resource (XR) or Claim (XRC) using `up xrd generate <file>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag         | Description                                                                                                                     |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
|            | `--path=STRING`   | Path to the output file where the Composite Resource Definition (XRD) will be saved                                             |
|            | `--plural=STRING` | Optional custom plural form for the Composite Resource Definition (XRD)                                                         |
| `-o`       | `--output="file"` | Output format for the results: `file` to save to a file, `yaml` to print XRD in YAML format, `json` to print XRD in JSON format |
{{< /table >}}

## install-completions

Install shell completions with `up install-completions`. You can uninstall shell completions via `up install-completions --uninstall`.


## alpha

**Description:** Alpha features. Commands may be removed in future releases.

---

### up alpha get

The `up alpha get` command prints information about a given object within the current kubeconfig
context.

{{< table "table table-sm table-striped">}}
| Short Flag | Long Flag                           | Description                                                                                                                                                                                                                                                |
| ---------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h`       | `--help`                            | Show context-sensitive help.                                                                                                                                                                                                                               |
|            | `--format="default"`                | Format for get/list commands. Can be: json, yaml, default.                                                                                                                                                                                                 |
| `-q`       | `--quiet`                           | Suppress all output.                                                                                                                                                                                                                                       |
|            | `--pretty`                          | Pretty print output.                                                                                                                                                                                                                                       |
|            | `--dry-run`                         | Dry-run output.                                                                                                                                                                                                                                            |
| `-o`       | `--output=STRING`                   | Output format. One of: json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file, custom-columns, custom-columns-file, wide.                                                                      |
|            | `--no-headers`                      | When using the default or custom-column output format, don't print headers.                                                                                                                                                                                |
|            | `--show-labels`                     | When printing, show all labels as the last column (default hide labels column).                                                                                                                                                                            |
|            | `--sort-by=STRING`                  | If non-empty, sort list types using this field specification. The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. |
|            | `--label-columns=LABEL-COLUMNS,...` | Accepts a comma-separated list of labels that are going to be presented as columns. Names are case-sensitive. You can also use multiple flag options like -L label1 -L label2...                                                                           |
|            | `--show-kind`                       | If present, list the resource type for the requested object or objects.                                                                                                                                                                                    |
| `-t`       | `--template=STRING`                 | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].                                                                     |
|            | `--allow-missing-template-keys`     | If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.                                                                                                            |
|            | `--show-managed-fields`             | If true, keep the managedFields when printing objects in JSON or YAML format.                                                                                                                                                                              |
|            | `--domain=https://upbound.io`       | Root Upbound domain ($UP_DOMAIN).                                                                                                                                                                                                                          |
| `-a`       | `--account=STRING`                  | Account used to execute command ($UP_ACCOUNT).                                                                                                                                                                                                             |
|            | `--insecure-skip-tls-verify`        | [INSECURE] Skip verifying TLS certificates ($UP_INSECURE_SKIP_TLS_VERIFY).                                                                                                                                                                                 |
| `-d`       | `--debug=INT`                       | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens ($UP_DEBUG).                                                                                                                           |
| `-n`       | `--namespace=STRING`                | If present, the namespace scope for this CLI request.                                                                                                                                                                                                      |
| `-A`       | `--all-namespaces`                  | If present, list the requested object or objects across all namespaces. Namespace in current context is ignored even if specified with --namespace.                                                                                                        |
{{< /table >}}

**Examples**

#### get resources across all namespaces

`up alpha get configmaps -A`

#### get managed

Get all managed resources within this control plane.
`up alpha get managed`

#### get claim

Get all claims managed by this control plane.
`up alpha get claim`

#### get composite

Get all composite resources managed by this control plane.
`up alpha get composite`
<
---

### up alpha migration

**Description:** Migrate control planes to Upbound Managed Control Planes.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag  | Short flag | Description                       | Default Value |
| ---------- | ---------- | --------------------------------- | ------------- |
| kubeconfig |            | Override default kubeconfig path. |               |
{{< /table >}}

---

#### up alpha migration export

**Description:** Export the current state of a Crossplane or Universal Crossplane control plane into an archive, preparing it for migration to Upbound Managed Control Planes.




**Options:**

{{< table "table table-sm table-striped">}}
| Long flag               | Short flag | Description                                                                                                                                                                          | Default Value                                              |
| ----------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| yes                     |            | When set to true, automatically accepts any confirmation prompts that may appear during the export process.                                                                          | false                                                      |
| output                  | o          | Specifies the file path where the exported archive will be saved. Defaults to 'xp-state.tar.gz'.                                                                                     | xp-state.tar.gz                                            |
| include-extra-resources |            | A list of extra resource types to include in the export in "resource.group" format in addition to all Crossplane resources. By default, it includes namespaces, configmaps, secrets. | namespaces,configmaps,secrets                              |
| exclude-resources       |            | A list of resource types to exclude from the export in "resource.group" format. No resources are excluded by default.                                                                |                                                            |
| include-namespaces      |            | A list of specific namespaces to include in the export. If not specified, all namespaces are included by default.                                                                    |                                                            |
| exclude-namespaces      |            | A list of specific namespaces to exclude from the export. Defaults to 'kube-system', 'kube-public', 'kube-node-lease', and 'local-path-storage'.                                     | kube-system,kube-public,kube-node-lease,local-path-storage |
| pause-before-export     |            | When set to true, pauses all managed resources before starting the export process. This can help ensure a consistent state for the export. Defaults to false.                        | false                                                      |
{{< /table >}}

---

#### up alpha migration import

**Description:** Import a previously exported control plane state into an Upbound control plane, completing the migration process.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag            | Short flag | Description                                                                                                                                                                                                                            | Default Value   |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| yes                  |            | When set to true, automatically accepts any confirmation prompts that may appear during the import process.                                                                                                                            | false           |
| input                | i          | Specifies the file path of the archive to be imported. The default path is 'xp-state.tar.gz'.                                                                                                                                          | xp-state.tar.gz |
| unpause-after-import |            | When set to true, automatically unpauses all managed resources that were paused during the import process. This helps in resuming normal operations post-import. Defaults to false, requiring manual unpausing of resources if needed. | false           |
{{< /table >}}

---

### up alpha query

The `up alpha query` command lets you view list of objects of any kind within all the control planes in your space. Supports filtering.

{{< table "table table-sm table-striped cli-ref">}}
| Short Flag | Long Flag                           | Description                                                                                                                                                                                                                                                |
| ---------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h`       | `--help`                            | Show context-sensitive help.                                                                                                                                                                                                                               |
|            | `--format="default"`                | Format for get/list commands. Can be: json, yaml, default.                                                                                                                                                                                                 |
| `-q`       | `--quiet`                           | Suppress all output.                                                                                                                                                                                                                                       |
|            | `--pretty`                          | Pretty print output.                                                                                                                                                                                                                                       |
|            | `--dry-run`                         | Dry-run output.                                                                                                                                                                                                                                            |
| `-o`       | `--output=STRING`                   | Output format. One of: json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file, custom-columns, custom-columns-file, wide.                                                                      |
|            | `--no-headers`                      | When using the default or custom-column output format, don't print headers.                                                                                                                                                                                |
|            | `--show-labels`                     | When printing, show all labels as the last column (default hide labels column).                                                                                                                                                                            |
|            | `--sort-by=STRING`                  | If non-empty, sort list types using this field specification. The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. |
|            | `--label-columns=LABEL-COLUMNS,...` | Accepts a comma-separated list of labels that are going to be presented as columns. Names are case-sensitive. You can also use multiple flag options like -L label1 -L label2...                                                                           |
|            | `--show-kind`                       | If present, list the resource type for the requested object or objects.                                                                                                                                                                                    |
| `-t`       | `--template=STRING`                 | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].                                                                     |
|            | `--allow-missing-template-keys`     | If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.                                                                                                            |
|            | `--show-managed-fields`             | If true, keep the managedFields when printing objects in JSON or YAML format.                                                                                                                                                                              |
|            | `--domain=https://upbound.io`       | Root Upbound domain ($UP_DOMAIN).                                                                                                                                                                                                                          |
| `-a`       | `--account=STRING`                  | Account used to execute command ($UP_ACCOUNT).                                                                                                                                                                                                             |
|            | `--insecure-skip-tls-verify`        | [INSECURE] Skip verifying TLS certificates ($UP_INSECURE_SKIP_TLS_VERIFY).                                                                                                                                                                                 |
| `-d`       | `--debug=INT`                       | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens ($UP_DEBUG).                                                                                                                           |
| `-n`       | `--namespace=STRING`                | Namespace name for resources to query. By default, it's all namespaces if not on a control plane profile, the profile's current namespace or "default" ($UPBOUND_NAMESPACE).                                                                               |
| `-g`       | `--group=STRING`                    | Control plane group. By default, it's the kubeconfig's current namespace or "default" ($UPBOUND_GROUP).                                                                                                                                                    |
| `-c`       | `--controlplane=STRING`             | Control plane name. Defaults to the current kubeconfig context if it points to a control plane ($UPBOUND_CONTROLPLANE).                                                                                                                                    |
| `-A`       | `--all-groups`                      | Query in all groups.                                                                                                                                                                                                                                       |
{{< /table >}}

**Examples**

#### query across a Space

To query across all control plane groups within a Space.

`up alpha query -A`

#### query managed

Get the managed resources within all control plane groups.
`up alpha query managed -A`

#### query claim

Get the claims within all control plane groups.
`up alpha query claim -A`

#### query composite

Get the composite resources within all control plane groups.
`up alpha query managed -A`

---

### up alpha space

**Description:** Interact with Spaces.

---

#### up alpha space attach

**Description:** Connect an Upbound Space to the Upbound web console.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag                  | Short flag | Description                                                                                                          | Default Value      |
| -------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- | ------------------ |
| domain                     |            | Root Upbound domain.                                                                                                 | https://upbound.io |
| profile                    |            | Profile used to execute command.                                                                                     |                    |
| account                    | a          | Account used to execute command.                                                                                     |                    |
| insecure-skip-tls-verify   |            | [INSECURE] Skip verifying TLS certificates.                                                                          |                    |
| debug                      | d          | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens. |                    |
| override-api-endpoint      |            | Overrides the default API endpoint.                                                                                  |                    |
| override-auth-endpoint     |            | Overrides the default auth endpoint.                                                                                 |                    |
| override-proxy-endpoint    |            | Overrides the default proxy endpoint.                                                                                |                    |
| override-registry-endpoint |            | Overrides the default registry endpoint.                                                                             |                    |
| kubeconfig                 |            | Override default kubeconfig path.                                                                                    |                    |
| kubecontext                |            | Override default kubeconfig context.                                                                                 |                    |
| robot-token                |            | The Upbound robot token contents used to authenticate the connection.                                                |                    |
| up-environment             |            | Override the default Upbound Environment.                                                                            | prod               |
{{< /table >}}

---

#### up alpha space billing

**Description:** ""

---

##### up alpha space billing export

**Description:** Export a billing report for submission to Upbound.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag             | Short flag | Description                                                                                          | Default Value              |
| --------------------- | ---------- | ---------------------------------------------------------------------------------------------------- | -------------------------- |
| out                   | o          | Name of the output file.                                                                             | upbound_billing_report.tgz |
| provider              |            | Storage provider. Must be one of: aws, gcp, azure.                                                   |                            |
| bucket                |            | Storage bucket.                                                                                      |                            |
| endpoint              |            | Custom storage endpoint.                                                                             |                            |
| account               |            | Name of the Upbound account whose billing report is being collected.                                 |                            |
| azure-storage-account |            | Name of the Azure storage account. Required for --provider=azure.                                    |                            |
| billing-month         |            | Export a report for a billing period of one calendar month. Format: 2006-01.                         |                            |
| billing-custom        |            | Export a report for a custom billing period. Date range is inclusive. Format: 2006-01-02/2006-01-02. |                            |
| force-incomplete      |            | Export a report for an incomplete billing period.                                                    |                            |
{{< /table >}}

---

#### up alpha space destroy

**Description:** Remove the Upbound Spaces deployment.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag                            | Short flag | Description                                                                                                                             | Default Value                                                    |
| ------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| domain                               |            | Root Upbound domain.                                                                                                                    | https://upbound.io                                               |
| profile                              |            | Profile used to execute command.                                                                                                        |                                                                  |
| account                              | a          | Account used to execute command.                                                                                                        |                                                                  |
| insecure-skip-tls-verify             |            | [INSECURE] Skip verifying TLS certificates.                                                                                             |                                                                  |
| debug                                | d          | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens.                    |                                                                  |
| override-api-endpoint                |            | Overrides the default API endpoint.                                                                                                     |                                                                  |
| override-auth-endpoint               |            | Overrides the default auth endpoint.                                                                                                    |                                                                  |
| override-proxy-endpoint              |            | Overrides the default proxy endpoint.                                                                                                   |                                                                  |
| override-registry-endpoint           |            | Overrides the default registry endpoint.                                                                                                |                                                                  |
| registry-repository                  |            | Set registry for where to pull OCI artifacts from. This is an OCI registry reference, i.e. a URL without the scheme or protocol prefix. | us-west1-docker.pkg.dev/orchestration-build/upbound-environments |
| registry-endpoint                    |            | Set registry endpoint, including scheme, for authentication.                                                                            | https://us-west1-docker.pkg.dev                                  |
| kubeconfig                           |            | Override default kubeconfig path.                                                                                                       |                                                                  |
| kubecontext                          |            | Override default kubeconfig context.                                                                                                    |                                                                  |
| yes-really-delete-space-and-all-data |            | Bypass safety checks and destroy Spaces                                                                                                 |                                                                  |
| orphan                               |            | Remove Space components but retain Control Planes and data                                                                              |
{{< /table >}}

---

#### up alpha space detach

**Description:** Detach an Upbound Space from the Upbound web console.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag                  | Short flag | Description                                                                                                          | Default Value      |
| -------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- | ------------------ |
| domain                     |            | Root Upbound domain.                                                                                                 | https://upbound.io |
| profile                    |            | Profile used to execute command.                                                                                     |                    |
| account                    | a          | Account used to execute command.                                                                                     |                    |
| insecure-skip-tls-verify   |            | [INSECURE] Skip verifying TLS certificates.                                                                          |                    |
| debug                      | d          | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens. |                    |
| override-api-endpoint      |            | Overrides the default API endpoint.                                                                                  |                    |
| override-auth-endpoint     |            | Overrides the default auth endpoint.                                                                                 |                    |
| override-proxy-endpoint    |            | Overrides the default proxy endpoint.                                                                                |                    |
| override-registry-endpoint |            | Overrides the default registry endpoint.                                                                             |                    |
| kubeconfig                 |            | Override default kubeconfig path.                                                                                    |                    |
| kubecontext                |            | Override default kubeconfig context.                                                                                 |                    |
{{< /table >}}

---

#### up alpha space init

**Description:** Initialize an Upbound Spaces deployment.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag                  | Short flag | Description                                                                                                                             | Default Value                                                    |
| -------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| kubeconfig                 |            | Override default kubeconfig path.                                                                                                       |                                                                  |
| kubecontext                |            | Override default kubeconfig context.                                                                                                    |                                                                  |
| registry-repository        |            | Set registry for where to pull OCI artifacts from. This is an OCI registry reference, i.e. a URL without the scheme or protocol prefix. | us-west1-docker.pkg.dev/orchestration-build/upbound-environments |
| registry-endpoint          |            | Set registry endpoint, including scheme, for authentication.                                                                            | https://us-west1-docker.pkg.dev                                  |
| token-file                 |            | File containing authentication token.                                                                                                   |                                                                  |
| registry-username          |            | Set the registry username.                                                                                                              |                                                                  |
| registry-password          |            | Set the registry password.                                                                                                              |                                                                  |
| set                        |            | Set parameters.                                                                                                                         |                                                                  |
| file                       | f          | Parameters file.                                                                                                                        |                                                                  |
| bundle                     |            | Local bundle path.                                                                                                                      |                                                                  |
| domain                     |            | Root Upbound domain.                                                                                                                    | https://upbound.io                                               |
| profile                    |            | Profile used to execute command.                                                                                                        |                                                                  |
| account                    | a          | Account used to execute command.                                                                                                        |                                                                  |
| insecure-skip-tls-verify   |            | [INSECURE] Skip verifying TLS certificates.                                                                                             |                                                                  |
| debug                      | d          | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens.                    |                                                                  |
| override-api-endpoint      |            | Overrides the default API endpoint.                                                                                                     |                                                                  |
| override-auth-endpoint     |            | Overrides the default auth endpoint.                                                                                                    |                                                                  |
| override-proxy-endpoint    |            | Overrides the default proxy endpoint.                                                                                                   |                                                                  |
| override-registry-endpoint |            | Overrides the default registry endpoint.                                                                                                |                                                                  |
| yes                        |            | Answer yes to all questions                                                                                                             |                                                                  |
| public-ingress             |            | For AKS,EKS,GKE expose ingress publically                                                                                               |                                                                  |
{{< /table >}}

---

#### up alpha space list

**Description:** List all accessible spaces in Upbound.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag                  | Short flag | Description                                                                                                          | Default Value      |
| -------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- | ------------------ |
| domain                     |            | Root Upbound domain.                                                                                                 | https://upbound.io |
| profile                    |            | Profile used to execute command.                                                                                     |                    |
| account                    | a          | Account used to execute command.                                                                                     |                    |
| insecure-skip-tls-verify   |            | [INSECURE] Skip verifying TLS certificates.                                                                          |                    |
| debug                      | d          | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens. |                    |
| override-api-endpoint      |            | Overrides the default API endpoint.                                                                                  |                    |
| override-auth-endpoint     |            | Overrides the default auth endpoint.                                                                                 |                    |
| override-proxy-endpoint    |            | Overrides the default proxy endpoint.                                                                                |                    |
| override-registry-endpoint |            | Overrides the default registry endpoint.                                                                             |                    |
{{< /table >}}

---

#### up alpha space upgrade

**Description:** Upgrade the Upbound Spaces deployment.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag                  | Short flag | Description                                                                                                                             | Default Value                                                    |
| -------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| domain                     |            | Root Upbound domain.                                                                                                                    | https://upbound.io                                               |
| profile                    |            | Profile used to execute command.                                                                                                        |                                                                  |
| account                    | a          | Account used to execute command.                                                                                                        |                                                                  |
| insecure-skip-tls-verify   |            | [INSECURE] Skip verifying TLS certificates.                                                                                             |                                                                  |
| debug                      | d          | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens.                    |                                                                  |
| override-api-endpoint      |            | Overrides the default API endpoint.                                                                                                     |                                                                  |
| override-auth-endpoint     |            | Overrides the default auth endpoint.                                                                                                    |                                                                  |
| override-proxy-endpoint    |            | Overrides the default proxy endpoint.                                                                                                   |                                                                  |
| override-registry-endpoint |            | Overrides the default registry endpoint.                                                                                                |                                                                  |
| kubeconfig                 |            | Override default kubeconfig path.                                                                                                       |                                                                  |
| kubecontext                |            | Override default kubeconfig context.                                                                                                    |                                                                  |
| registry-repository        |            | Set registry for where to pull OCI artifacts from. This is an OCI registry reference, i.e. a URL without the scheme or protocol prefix. | us-west1-docker.pkg.dev/orchestration-build/upbound-environments |
| registry-endpoint          |            | Set registry endpoint, including scheme, for authentication.                                                                            | https://us-west1-docker.pkg.dev                                  |
| token-file                 |            | File containing authentication token.                                                                                                   |                                                                  |
| registry-username          |            | Set the registry username.                                                                                                              |                                                                  |
| registry-password          |            | Set the registry password.                                                                                                              |                                                                  |
| set                        |            | Set parameters.                                                                                                                         |                                                                  |
| file                       | f          | Parameters file.                                                                                                                        |                                                                  |
| bundle                     |            | Local bundle path.                                                                                                                      |                                                                  |
| rollback                   |            | Rollback to previously installed version on failed upgrade.                                                                             |                                                                  |
{{< /table >}}

---

### up alpha upbound

**Description:** Interact with Upbound.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag                  | Short flag | Description                                                                                                          | Default Value      |
| -------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- | ------------------ |
| kubeconfig                 |            | Override default kubeconfig path.                                                                                    |                    |
| namespace                  | n          | Kubernetes namespace for Upbound.                                                                                    | upbound-system     |
| domain                     |            | Root Upbound domain.                                                                                                 | https://upbound.io |
| profile                    |            | Profile used to execute command.                                                                                     |                    |
| account                    | a          | Account used to execute command.                                                                                     |                    |
| insecure-skip-tls-verify   |            | [INSECURE] Skip verifying TLS certificates.                                                                          |                    |
| debug                      | d          | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens. |                    |
| override-api-endpoint      |            | Overrides the default API endpoint.                                                                                  |                    |
| override-auth-endpoint     |            | Overrides the default auth endpoint.                                                                                 |                    |
| override-proxy-endpoint    |            | Overrides the default proxy endpoint.                                                                                |                    |
| override-registry-endpoint |            | Overrides the default registry endpoint.                                                                             |                    |
{{< /table >}}

---

### up alpha xpkg

**Description:** Interact with Crossplane packages.

---

#### up alpha xpkg batch

**Description:** Batch build and push a family of service-scoped provider packages.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag                  | Short flag | Description                                                                                                                                                                                          | Default Value                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| family-base-image          |            | Family image used as the base for the smaller provider packages.                                                                                                                                     |                                |
| provider-name              |            | Provider name, such as provider-aws to be used while formatting smaller provider package repositories.                                                                                               |                                |
| family-package-url-format  |            | Family package URL format to be used for the smaller provider packages. Must be a valid OCI image URL with the format specifier "%s", which will be substituted with <provider name>-<service name>. |                                |
| smaller-providers          |            | Smaller provider names to build and push, such as ec2, eks or config.                                                                                                                                | monolith                       |
| concurrency                |            | Maximum number of packages to process concurrently. Setting it to 0 puts no limit on the concurrency, i.e., all packages are processed in parallel.                                                  | 0                              |
| push-retry                 |            | Number of retries when pushing a provider package fails.                                                                                                                                             | 3                              |
| platform                   |            | Platforms to build the packages for. Each platform should use the <OS>_<arch> syntax. An example is: linux_arm64.                                                                                    | linux_amd64,linux_arm64        |
| provider-bin-root          | p          | Provider binary paths root. Smaller provider binaries should reside under the platform directories in this folder.                                                                                   |                                |
| output-dir                 | o          | Path of the package output directory.                                                                                                                                                                |                                |
| store-packages             |            | Smaller provider names whose provider package should be stored under the package output directory specified with the --output-dir option.                                                            |                                |
| package-metadata-template  |            | Smaller provider metadata template. The template variables {{ .Service }} and {{ .Name }} will be substituted when the template is executed among with the supplied template variable substitutions. | ./package/crossplane.yaml.tmpl |
| template-var               |            | Smaller provider metadata template variables to be used for the specified template.                                                                                                                  |                                |
| examples-group-override    |            | Overrides for the location of the example manifests folder of a smaller provider.                                                                                                                    |                                |
| crd-group-override         |            | Overrides for the locations of the CRD folders of the smaller providers.                                                                                                                             |                                |
| package-repo-override      |            | Overrides for the package repository names of the smaller providers.                                                                                                                                 |                                |
| providers-with-auth-ext    |            | Smaller provider names for which we need to configure the authentication extension.                                                                                                                  | monolith,config                |
| examples-root              | e          | Path to package examples directory.                                                                                                                                                                  | ./examples                     |
| crd-root                   |            | Path to package CRDs directory.                                                                                                                                                                      | ./package/crds                 |
| auth-ext                   |            | Path to an authentication extension file.                                                                                                                                                            | ./package/auth.yaml            |
| ignore                     |            | Paths to exclude from the smaller provider packages.                                                                                                                                                 |                                |
| create                     |            | Create repository on push if it does not exist.                                                                                                                                                      |                                |
| build-only                 |            | Only build the smaller provider packages and do not attempt to push them to a package repository.                                                                                                    | false                          |
| domain                     |            | Root Upbound domain.                                                                                                                                                                                 | https://upbound.io             |
| profile                    |            | Profile used to execute command.                                                                                                                                                                     |                                |
| account                    | a          | Account used to execute command.                                                                                                                                                                     |                                |
| insecure-skip-tls-verify   |            | [INSECURE] Skip verifying TLS certificates.                                                                                                                                                          |                                |
| debug                      | d          | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens.                                                                                 |                                |
| override-api-endpoint      |            | Overrides the default API endpoint.                                                                                                                                                                  |                                |
| override-auth-endpoint     |            | Overrides the default auth endpoint.                                                                                                                                                                 |                                |
| override-proxy-endpoint    |            | Overrides the default proxy endpoint.                                                                                                                                                                |                                |
| override-registry-endpoint |            | Overrides the default registry endpoint.                                                                                                                                                             |                                |
{{< /table >}}

---

#### up alpha xpkg xp-extract

**Description:** Extract package contents into a Crossplane cache compatible format. Fetches from a remote registry by default.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag                      | Short flag | Description                                                                                                                                         | Default Value      |
| ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `--from-daemon`                |            | Indicates that the image should be fetched from the Docker daemon.                                                                                  |                    |
| `--from-xpkg`                  |            | Indicates that the image should be fetched from a local xpkg. If package is not specified and only one exists in current directory it will be used. |                    |
| `--output`                     | `-o`       | Package output file path. Extension must be .gz or will be replaced.                                                                                | out.gz             |
| `--domain`                     |            | Root Upbound domain.                                                                                                                                | https://upbound.io |
| `--profile`                    |            | Profile used to execute command.                                                                                                                    |                    |
| `--account`                    | `-a`       | Account used to execute command.                                                                                                                    |                    |
| `--insecure-skip-tls-verify`   |            | [INSECURE] Skip verifying TLS certificates.                                                                                                         |                    |
| `--debug`                      | `-d`       | [INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens.                                |                    |
| `--override-api-endpoint`      |            | Overrides the default API endpoint.                                                                                                                 |                    |
| `--override-auth-endpoint`     |            | Overrides the default auth endpoint.                                                                                                                |                    |
| `--override-proxy-endpoint`    |            | Overrides the default proxy endpoint.                                                                                                               |                    |
| `--override-registry-endpoint` |            | Overrides the default registry endpoint.                                                                                                            |                    |
{{< /table >}}

---

#### up alpha xpkg append

**Description:** Append additional files to an xpkg, such as images, documentation and release notes.

**Usage:** `up alpha xpkg append <ref> [options]`

**Example:** To add custom files from a local directory named "assets" to your Marketplace image in acmeco/my-repo

`up alpha xpkg append --extensions-root=./assets xpkg.upbound.io/acmeco/my-repo@sha256:<digest>`

{{<hint "important" >}}
This command appends the additional package content under a new [index manifest](https://github.com/opencontainers/image-spec/blob/main/image-index.md).

The interpretation of the manifest may vary based on the consumer, but the Marketplace has specific conventions:

1. The `extensions-root` directory must be a directory of directories, each of which represents a separate layer. Top-level files are ignored.
2. The layers in the manifest are automatically annotated with the name of the subdirectory in `extensions-root`.
3. The Marketplace will only interpret the following directory and file names relative to `extensions-root`:
    * `readme/readme.md`, annotated as `"io.crossplane.xpkg": "readme"`
    * `icons/icon.svg`, annotated as `"io.crossplane.xpkg": "icons"`
    * `release-notes/release_notes.md`, annotated as `"io.crossplane.xpkg": "release-notes"`
    * `sbom/sbom.spdx.json`, annotated as `"io.crossplane.xpkg": "sbom"`
{{< /hint >}}

**Options:**

{{< table "table table-sm table-striped">}}

| Long flag            | Short flag | Description                                                                           | Default Value      |
| ---------------------| ---------- | ------------------------------------------------------------------------------------- | ------------------ |
| `--destination`      |            | Optional remote OCI reference to write to. If not set, the xpkg is modified in-place. |                    |
| `--extensions-root`  |            | Path to a local directory of additional files to append to the xpkg.                  | ./extensions       |

{{< /table >}}

---

### up alpha xpls

**Description:** Start xpls language server.

---

#### up alpha xpls serve

**Description:** run a server for Crossplane definitions using the Language Server Protocol.

**Options:**

{{< table "table table-sm table-striped">}}
| Long flag   | Short flag | Description                                 | Default Value |
| ----------- | ---------- | ------------------------------------------- | ------------- |
| `--cache`   |            | Directory path for dependency schema cache. | ~/.up/cache   |
| `--verbose` |            | Run server with verbose logging.            |               |
{{< /table >}}

---
<!-- vale on -->
