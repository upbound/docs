---
title: "up configuration"
---
_Alias_: `up cfg`

Commands in the Configuration group manage and interact with control plane configurations. A control plane configuration follows the [xpkg specification] and stores its package contents in a GitHub repository that the control plane is aware of.

### `up configuration create`

#### Arguments
* `<configuration name>` - name of the control plane configuration.

Creates a new configuration. Opens a web browser if you haven't authorized or installed the Upbound GitHub app.

#### Flags
* `--template-id = STRING` - (Required) Name of the configuration template to use.
* `--context = STRING` - (Required) Name of the GitHub account or org to use. Clones the configuration template into this GitHub org.
* `--private` - Create a private GitHub repository.

### `up configuration list`


#### Arguments
- _none_

Lists all control plane configurations in the current organization.

#### Examples
```shell
up configuration list
NAME                     TEMPLATE ID                 PROVIDER   REPO                     BRANCH   CREATED AT                      SYNCED AT                           
config-rds               upbound/configuration-rds   github     config-rds               main     2023-03-23 00:25:02 +0000 UTC   2023-03-23 00:25:18.077104 +0000 UTC
```

### `up configuration get`


#### Arguments
* `<configuration name>` - name of the control plane configuration.

Gets a single control plane configuration in the current organization.


### `up configuration delete`


#### Arguments
* `<configuration name>` - name of the control plane configuration.

Deletes a single control plane configuration in the current organization.

Returns an error if the configuration is still in use by at least one control plane.

#### Flags
* `--force` - Force deletion of the configuration.


### `up configuration template list`


#### Arguments
- _none_

List the configuration templates you can specify as a `template-id` to the create command.

#### Examples
```shell
up configuration template list
ID                               DESCRIPTION             REPO                                     
upbound/configuration-rds        RDS as a Service        github.com/upbound/configuration-rds     
upbound/configuration-eks        EKS as a Service        github.com/upbound/configuration-eks     
upbound/configuration-cloudsql   CloudSQL as a Service   github.com/upbound/configuration-cloudsql
```

<!-- Named Links -->
[xpkg specification]: https://docs.crossplane.io/v1.11/concepts/packages/