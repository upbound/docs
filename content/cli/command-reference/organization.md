---
title: "up organization"
---
_Alias_: `up org`

Commands under `up organization` create and manage Upbound organizations.

{{< hint "important" >}}
Only organizations can create [repositories]({{<ref "cli/command-reference/repository">}}), [robots]({{<ref "robot">}}) or [push packages]({{<ref "upbound-marketplace/packages" >}}) to the Upbound Marketplace. 
{{< /hint >}}

### `up organization create`


#### Arguments
_None_

Create an organization with the given name.  


#### Examples
```shell
up org create my-org
```

### `up organization list`


#### Arguments
_None_

List all organizations associated to the current user.


#### Examples
```shell
up org list
NAME           ROLE
my-org         owner
my-other-org   owner
```

### `up organization delete`


#### Arguments
* <organization name> _(required)_ - the name of the organization to delete

Deletes the given organization.


#### Flags
* `--force` - Force deletion of the organization.

{{<hint "warning" >}}
Deleting an organization removes all users from the organization, deletes all robots, robot tokens, teams, and repositories.

This can not be undone.
{{< /hint >}}


#### Examples
```shell
up org delete my-org
Are you sure you want to delete this organization? [y/n]: y
Deleting organization my-org. This cannot be undone.
my-org deleted
```