---
weight: 50
title: Up Command Reference
description: "Command reference for the Upbound Up CLI"
---

<!-- vale Google.Headings = NO -->
The `up` command-line provides a suite of tools to configure and interact with Upbound technologies.

The following flags are available for all commands.

{{< table "table table-sm table-striped">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-h`       | `--help`    | Show context-sensitive help. |
|            | `--pretty`  | Pretty print output.         |
| `-q`       | `--quiet`   | Suppress all output.         |
| `-v`       | `--version` | Print version and exit.      |
{{< /table >}}

## configuration

The `up configuration` command provides management operations for Git-synced configurations on Upbound. 

{{<hint "tip" >}}
`up cfg` is an alias for `up configuration`.
{{< /hint >}}

All `up configuration` commands support the following options: 

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|    | `--context=STRING`        | Name of the GitHub account/org |
|    | `--template-id=STRING`        |  Name of the configuration template |
|    | `--private`        | Create the GitHub repository as private. (Default: false) |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|    | `--force`        | Force deletion of the configuration. |
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


The `up controlplane` command provides management operations for managed control planes on Upbound. It also has commands for installing providers or configurations on Crossplane control planes generically.

The `up` CLI relies on a `kubeconfig` file to connect to the target Kubernetes cluster.

{{<hint "tip" >}}
`up ctp` is an alias for `up controlplane`.
{{< /hint >}}

All `up controlplane` commands support the following options: 

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|    | `--kubeconfig=<path>`  | Use a custom `kubeconfig` file located at the given path. The default uses the active `kubeconfig`. |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
{{< /table >}}

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane list

<!-- vale Upbound.Spelling = YES -->

<!-- ignore "controlplane" -->

List the managed control planes in your Upbound account  
`up controlplane list`.

**Examples**

* List the managed control planes associated with an account.

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

Create a managed control plane in Upbound and install referenced configuration on it  
`up controlplane create --configuration-name=STRING <name>`.

View available configurations to install on the managed control plane with `up configuration list`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-d`   | `--description=STRING`        | Provide a text description for the managed control plane |
{{< /table >}}

**Examples**

* Create a managed control plane and install a configuration called `my-control-plane-api` on it.

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


Delete a managed control plane in Upbound  
`up controlplane delete --configuration-name=STRING <name>`.

View available managed control planes to delete with `up controlplane list`.

**Examples**

* Delete a managed control plane.

```shell {copy-lines="1"}
up ctp delete my-control-plane
my-control-plane deleted
```

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane get
<!-- vale Upbound.Spelling = YES -->


Get a managed control plane in Upbound  
`up controlplane get <name>`.

View available managed control planes with `up controlplane list`.

**Examples**

* Get a managed control plane called `my-control-plane`.

```shell {copy-lines="1"}
up ctp get my-control-plane
NAME                ID                                     STATUS   DEPLOYED CONFIGURATION        CONFIGURATION STATUS
my-control-plane    2012c379-5743-4f65-a473-30037861ef6e   ready    my-configuration              ready
```

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane connect
<!-- vale Upbound.Spelling = YES -->


Connect a Kubernetes app cluster outside of Upbound to a managed control plane in Upbound. This command creates an `APIService` resource in the Kubernetes app cluster for every claim API in the managed control plane. As a result, the claim APIs are available in the Kubernetes app cluster just like all native Kubernetes API.
`up controlplane connect <name> <namespace>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|    | `--token=STRING`        |  API token used to authenticate. Creates a new robot and a token if a token isn't provided. |
|    | `--cluster-name=STRING`        |  Name of the cluster connecting to the control plane. Uses the namespace argument if a cluster-name isn't provided. |
|    | `--kubeconfig=STRING`        |   Override the default kubeconfig path. |
| `-n`  | `--installation-namespace="kube-system"`        |   Kubernetes namespace for the Managed Control Plane Connector. Default is kube-system ($MCP_CONNECTOR_NAMESPACE). |
|    | `--set=KEY=VALUE;...`        |   Set parameters. |
| `-f`  | `--file=FILE`        |   Parameters file. |
|    | `--bundle=BUNDLE`        |   Local bundle path. |
{{< /table >}}

**Examples**

* Connect an app cluster to a managed control plane called `my-control-plane` and connected to a namespace `my-app-ns-1`.

```shell {copy-lines="1"}
up ctp connect my-control-plane my-app-ns-1
<install MCP Connector>
```

{{<hint "tip" >}}
Your kubeconfig should be pointing at your **Kubernetes app cluster** in order for this command to succeed.
{{< /hint >}}

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane configuration install
<!-- vale Upbound.Spelling = YES -->


{{< hint "warning" >}}
Do not use this command to install a configuration on a managed control plane in Upbound. Instead, use the built-in support for [Git-synced configurations]({{<ref "concepts/control-plane-configurations" >}}).
{{< /hint >}}

Install a Crossplane configuration packages into a Kubernetes cluster with  
`up controlplane configuration install <package>`.

View packages installed by `up controlplane configuration install` with `kubectl get configuration`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|    | `--name=<name>`        | Manually define a name to apply to the configuration. By default Upbound uses the package name. |
|    | `--package-pull-secrets=<secret>,<secret>...` |  One or more Kubernetes secrets to use to download the configuration package. Comma-seperate more than one secret. |
| `-w` | `-w --wait=<number><unit>`   | The amount of time to wait for a package to install and report `HEALTHY`. If a package isn't healthy when the wait expires the command returns an error. Go's [`ParseDuration`](https://pkg.go.dev/maze.io/x/duration#ParseDuration) defines valid time units. |
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
### controlplane provider install
<!-- vale Upbound.Spelling = YES -->


{{< hint "warning" >}}
Do not use this command to install a provider on a managed control plane in Upbound. Instead, use the built-in support for [Git-synced configurations]({{<ref "concepts/control-plane-configurations" >}}) and declare a provider dependency in the git repo for whichever configuration is installed on your desired managed control plane.
{{< /hint >}}

Install a Crossplane provider packages into a Kubernetes cluster with  
`up controlplane provider install <package>`.

View packages installed by `up controlplane provider install` with `kubectl get configurations` and `kubectl get providers`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|    | `--name=<name>`        | Manually define a name to apply to the configuration. By default Upbound uses the package name. |
|    | `--package-pull-secrets=<secret>,<secret>...` |  One or more Kubernetes secrets to use to download the configuration package. Comma-seperate more than one secret. |
| `-w` | `-w --wait=<number><unit>`   | The amount of time to wait for a package to install and report `HEALTHY`. If a package isn't healthy when the wait expires the command returns an error. Go's [`ParseDuration`](https://pkg.go.dev/maze.io/x/duration#ParseDuration) defines valid time units. |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-f` | `--file=<path>`                   | Path to credentials file. Uses the profile credentials if not specified. |
| `-n` | `--namespace=<namespace>`         | Kubernetes namespace for pull secret ($UPBOUND_NAMESPACE). |
{{< /table >}}

<!-- vale Upbound.Spelling = NO -->

<!-- ignore "controlplane" -->
### controlplane kubeconfig get
<!-- vale Upbound.Spelling = YES -->


Uses a personal access token to create an entry in the default kubeconfig file for the specified managed control plane. 

The `--file` flag uses the supplied configuration instead.

An incorrect token or control plane name produces an error and doesn't change the
current context. 

`up controlplane kubeconfig get --token=STRING`

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-f` | `--file=STRING`                   | File to merge kubeconfig. |
|  | `--token=STRING`         | Required token to use in the generated kubeconfig to access the specified managed control plane. Upbound manages this token. |
{{< /table >}}

{{< hint "warning" >}}
Upbound does not currently support the use of robot tokens for scoped access to control planes. A [personal access token]({{< relref "concepts/console/_index.md#create-a-personal-access-token" >}}) must be used.
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-u` | `--username=STRING` |   The username to authenticate. Defaults to the value of the environmental variable `UP_USER` |
| `-p` | `--password=STRING` |   The password to authenticate. Defaults to the value of the environmental variable `UP_PASS`  |
| `-t` | `--token=STRING`    |   An Upbound user token to use in place of a username and password |
| `-a` | `--account=STRING`  |   Authenticate as a member of an organization.  |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--force`             |   Force deletion of the organization. |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
{{< /table >}}

#### organization user invite

Invite a user to an organization on Upbound  
`up organization user invite <org-name> <email>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-p` | `--permission="member"`             |    Role of the user to invite (owner or member). |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--force`             |    Force deletion of the invite. |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--force`             |    Force deletion of the invite. |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|    | `--kubeconfig=<path>`  | Use a custom `kubeconfig` file located at the given path. The default uses the active `kubeconfig`. |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  `-f`    | `--file = <profile JSON file>`             |   a JSON file of key-value pairs |
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

## repository   

The `up repository` command provides management operations for Upbound repository accounts.

{{<hint "tip" >}}
`up repo` is an alias for `up repository`.
{{< /hint >}}

All `up repository` commands support the following options: 

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
{{< /table >}}

### repository create

Create a repository with the given name  
`up repository create <name>`.

**Examples**

* Create a repository called `my-repo`

```shell {copy-lines="1"}
up repo create my-repo
acmeco/my-repo created
```

### repository delete

Delete a repository with the given name  
`up repository delete <name>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--force`             |   Force deletion of repository. |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
{{< /table >}}

### robot create

Create a robot in your account's organization  
`up robot create <name>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--description=STRING`             |   Description of robot. |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--force`             |   Force deletion of repository. |
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

The `up space` commands allow you to install and manage an [Upbound Space]({{<ref "/spaces/overview.md">}}) on a Kubernetes cluster.

All `up space` commands support the following options: 

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
{{< /table >}}

### space init

Initialize an Upbound Spaces deployment  
`up space init [<version>] --token-file=TOKEN-FILE`.

You must provide the desired version of Spaces to install. You can find a list of available versions in [Product Lifecycle]({{<ref "reference/lifecycle.md" >}}). You must provide a token (given to you by Upbound) for the install to proceed.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|      | `--token-file=TOKEN-FILE`             |   File containing authentication token.  |
|  | `--yes`             |    Answer yes to all questions during the install process. |
|  | `--public-ingress`             |    For AKS, EKS, and GKE, expose ingress publicly |
|  | `--kubeconfig=STRING`             |    Override default kubeconfig path. |
|      | `--set=KEY=VALUE;...`             |   Set parameters.  |
|   `-f`   | `--file=FILE`             |   Parameters file.  |
|      | `--bundle=BUNDLE`             |   Local bundle path.  |
{{< /table >}}

**Examples**

* Install v1.0.0 of Spaces

```shell {copy-lines="1"}
up space init "v1.0.0"
```

* Install v1.0.0 of Spaces and expose public ingress

```shell {copy-lines="1"}
up space init "v1.0.0" --public-ingress=true
```

### space destroy

Remove the Upbound Spaces deployment  
`up space destroy`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--kubeconfig=STRING`             |    Override default kubeconfig path. |
|      | `--set=KEY=VALUE;...`             |   Set parameters.  |
|   `-f`   | `--file=FILE`             |   Parameters file.  |
|      | `--bundle=BUNDLE`             |   Local bundle path.  |
{{< /table >}}

**Examples**

* Remove an installation of an Upbound Space in a Kubernetes cluster

```shell {copy-lines="1"}
up space destroy
```

{{< hint "tip" >}}
This command operates based on the current context in your kubeconfig. Make sure your kubeconfig is pointed at the desired Kubernetes cluster.
{{< /hint >}}

### space upgrade

Upgrade an Upbound Spaces deployment  
`up space upgrade [<version>] --token-file=TOKEN-FILE`.

You must provide the desired version of Spaces to upgrade to. You can find a list of available versions in [Product Lifecycle]({{<ref "reference/lifecycle.md" >}}). You must provide a token (given to you by Upbound) for the install to proceed.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|      | `--token-file=TOKEN-FILE`             |   File containing authentication token.  |
|      | `--rollback`             |   Rollback to the previous installed version on failed upgrade.  |
|  | `--kubeconfig=STRING`             |    Override default kubeconfig path. |
|      | `--set=KEY=VALUE;...`             |   Set parameters.  |
|   `-f`   | `--file=FILE`             |   Parameters file.  |
|      | `--bundle=BUNDLE`             |   Local bundle path.  |
{{< /table >}}

**Examples**

* Upgrade from a release candidate to v1.0.0

```shell {copy-lines="1"}
up space upgrade v1.0.0 --token-file=./token.json
```

### space billing

The `up space billing` commands manages configuration and fetching of billing data in an Upbound Space.

All `up space billing` commands support the following options:

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|      | `--provider=PROVIDER`             |   Storage provider. Must be one of: aws, gcp, azure ($UP_BILLING_PROVIDER).  |
|      | `--bucket=STRING`             |    Storage bucket ($UP_BILLING_BUCKET).  |
|      | `--endpoint=STRING`             |    Custom storage endpoint ($UP_BILLING_ENDPOINT).  |
|      | `--account=STRING`             |    Name of the Upbound account whose billing report is being collected ($UP_BILLING_ACCOUNT).  |
|      | `--azure-storage-account=STRING`             |    Name of the Azure storage account. Required for --provider=azure ($UP_AZURE_STORAGE_ACCOUNT).  |
|      | `--billing-month=TIME`             |    Get a report for a billing period of one calendar month. Format: 2006-01 ($UP_BILLING_MONTH).  |
|      | `--billing-custom=BILLING-CUSTOM`             |    Get a report for a custom billing period. Date range is inclusive. Format: 2006-01-02/2006-01-02 ($UP_BILLING_CUSTOM).  |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
{{< /table >}}

### uxp install

Install UXP into a target Kubernetes app cluster  
`up uxp install`.

UXP installs the latest stable release by default. The list of available UXP versions is in the [charts.upbound.io/stable](https://charts.upbound.io/stable/) listing.

The UXP [install guide]({{<ref "uxp/install" >}}) lists all install-time settings.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--kubeconfig=STRING`             |    Override default kubeconfig path. |
|  `-n`    | `--namespace="upbound-system"`  |   Kubernetes namespace for UXP ($UXP_NAMESPACE).  |
|      | `--unstable`   |   Allow installing unstable versions. |
|      | `--set=KEY=VALUE;...`             |   Set parameters.  |
|   `-f`   | `--file=FILE`             |   Parameters file.  |
|      | `--bundle=BUNDLE`             |   Local bundle path.  |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--kubeconfig=STRING`             |    Override default kubeconfig path. |
|  `-n`    | `--namespace="upbound-system"`  |   Kubernetes namespace for UXP ($UXP_NAMESPACE).  |
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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--kubeconfig=STRING`             |    Override default kubeconfig path. |
|  `-n`    | `--namespace="upbound-system"`  |   Kubernetes namespace for UXP ($UXP_NAMESPACE).  |
|       | `--rollback`  |   Rollback to the last installed version on a failed upgrade. |
|       | `--force`  |   Force upgrade even if versions are incompatible.  |
|       | `--set=KEY=VALUE;...`  |   Set parameters. |
|  `-f`    | `--file=FILE`  |   Parameters file.  |
|      | `--bundle=BUNDLE`  |   Local bundle path.  |
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

## xpkg

The `up xpkg` commands create and interact with Crossplane Packages. Packages are a set of YAML configuration files packaged as a single OCI container image. Read the [Creating and Pushing Packages]({{<ref "upbound-marketplace/packages" >}}) section for information on building and pushing packages to the Upbound Marketplace.

All `up xpkg` commands support the following options: 

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-a` | `--account=STRING`             |   The username or organization to use for authentication. The default uses the authenticated user from `up login`. |
|      | `--domain=<URL>`  |   The managed control plane domain to connect to. The default is `https://upbound.io`  |
|      | `--insecure-skip-tls-verify`   |   **Unsafe** - Don't validate the SSL certificate offered by the remote server. This command isn't recommended. |
|      | `--profile=<path>`             |   Use a custom Up CLI profile at located at the provided path. The default is `~/.up/config.json`  |
{{< /table >}}

### xpkg build

Build an OCI-compliant image of a set of configuration files. Use this image to create a specific Crossplane control-plane or Provider.
`up xpkg build`.

The up xpkg build command supports two different image types:

- **Configuration** - Configuration images consist of Custom Resource Definitions, Compositions and package metadata which define a custom control-plane.
- **Provider** - An image consisting of a provider controller and all related Custom Resource Definitions. The Crossplane crossplane-contrib repository contains the packages used for open source Crossplane Providers. For example, the image contents for [provider-aws](https://github.com/crossplane-contrib/provider-aws/tree/master/package).

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  | `--name=STRING`             |   [DEPRECATED: use --output] Name of the package to build. Uses name in `crossplane.yaml` if not specified. Doesn't correspond to package tag. |
| `-o`     | `--output=STRING`  |   Path for package output.  |
|      | `--controller=STRING`   |   Controller image used as base for package. |
|  `-f`    | `--package-root="."`             |   Path to package directory.  |
|  `-e`    | `--examples-root="./examples"`             |   Path to package examples directory.  |
|  `-a`    | `--auth-ext="auth.yaml"`             |    Path to an authentication extension file.  |
|  `-f`    | `--ignore=IGNORE,...`             |    Paths, specified relative to --package-root, to exclude from the package.  |
{{< /table >}}

**Examples**

* Create a Crossplane configuration package

```shell {copy-lines="1"}
up xpkg build -o my_control_plane.xpkg
xpkg saved to my_control_plane.xpkg
```

* Create a Crossplane provider package

```shell {copy-lines="1"}
up xpkg build \
--controller my_controller-amd64 \
--package-root ./package \
--examples-root ./examples \
--output ./my_provider.xpkg
xpkg saved to my_provider.xpkg
```

### xpkg init

Use a wizard to generate a `crossplane.yaml` file for a configuration or provider with  
`up xpkg init`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
| `-p`  | `--package-root="."`             |   Path to directory to write new package. |
| `-t`     | `--type="configuration"`  |   Package type to initialize.  |
{{< /table >}}

**Examples**

* Generate a configuration package file

```shell {copy-lines="1"}
up xpkg init
Package name: my_configuration
What version contraints of Crossplane will this package be compatible with? [e.g. v1.0.0, >=v1.0.0-0, etc.]: >=v1.8.0-0
Add dependencies? [y/n]: y
Provider URI [e.g. crossplane/provider-aws]: xpkg.upbound.io/crossplane/provider-aws
Version constraints [e.g. 1.0.0, >=1.0.0-0, etc.]: >=v0.24.1
Done? [y/n]: y
xpkg initialized at /home/user/crossplane.yaml

# Looking at contents
cat crossplane.yaml
apiVersion: meta.pkg.crossplane.io/v1
kind: Configuration
metadata:
  name: my_configuration
spec:
  crossplane:
    version: '>=v1.8.0-0'
  dependsOn:
  - provider: xpkg.upbound.io/crossplane/provider-aws
    version: '>=v0.24.1'
```

* Generate a provider package file

```shell {copy-lines="1"}
up xpkg init -t provider -p provider-init/
Package name: my-provider
What version contraints of Crossplane will this package be compatible with? [e.g. v1.0.0, >=v1.0.0-0, etc.]: >=1.9.0-0
Controller image: my-controller
xpkg initialized at /home/user/provider-init/crossplane.yaml

# Looking at contents
cat /home/vagrant/provider-init/crossplane.yaml
apiVersion: meta.pkg.crossplane.io/v1
kind: Provider
metadata:
  name: my-provider
spec:
  controller:
    image: my-controller
  crossplane:
    version: '>=1.9.0-0'
```

### xpkg dep

Download the dependencies of a package for the Crossplane Language Server with  
`up xpkg dep [<package>]`.

{{<hint "tip" >}}
This cache is only for the Crossplane Language Server. This doesn't cache files for Crossplane images.
{{< /hint >}}

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  `-d`    | `--cache-dir`             |    The location of the cache directory. Defaults to `~/.up/cache/`  |
|  `-c`    | `--clean-cache`             |    Removes all files in the cache directory. |
{{< /table >}}

**Examples**

* Download and cache the dependency files for an example Configuration package.

```shell {copy-lines="1"}
up xpkg dep
Dependencies added to xpkg cache:
- crossplane/provider-aws (v0.32.0)
```

### xpkg push

Publish images created by up xpkg build to the Upbound Marketplace with  
`up xpkg push <tag>`.

{{< table "table table-sm table-striped cli-ref">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|  `-f`    | `--package=PACKAGE,...`             |    Path to packages. Uses the current directory if not specified.  |
|      | `--create`             |    Create repository on push if it doesn't exist. |
{{< /table >}}

**Examples**

* Push a package called `getting-started.xpkg` to the test repository inside the `upbound-docs organization`. Mark it as version `v0.2`.

```shell {copy-lines="1"}
up xpkg push upbound-docs/test:v0.2 -f getting-started.xpkg
xpkg pushed to upbound-docs/test:v0.2
```

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
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|      | `--cache="~/.up/cache"`             |    Directory path for dependency schema cache.  |
{{< /table >}}

**Examples**

<!-- vale Upbound.Spelling = NO -->
<!-- ignore xpls -->
* Start xpls
<!-- vale Upbound.Spelling = YES -->

```shell {copy-lines="1"}
up xpls serve
```

## install-completions

Install shell completions with `up install-completions`. You can uninstall shell completions via `up install-completions --uninstall`.

## alpha
Options under the `up alpha` command are "alpha" features and may change in the future.

Upbound uses `up alpha` to try out new features or test new platform behaviors.

### alpha xpkg xp-extract

Extract package contents into a Crossplane cache compatible format. Fetches from a remote registry by default  
`up alpha xpkg xp-extract`

{{< table "table table-sm table-striped">}}
| Short flag | Long flag   | Description                  |
|------------|-------------|------------------------------|
|        | `--from-daemon`    | Fetch the image from the Docker daemon. |
|            | `--from-xpkg`  | Fetch the image from a local xpkg. If package isn't specified the command uses the current directory. |
| `-o`       | `--output="out.gz"`   | Package output path. Extension must be `.gz`.         |
{{< /table >}}

<!-- vale Google.Headings = YES -->