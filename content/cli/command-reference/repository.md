---
title: "up repository"
---
_Alias_: `up repo`  

Commands under `up repository` create and manage Upbound repository accounts.

### `up repository create`


#### Arguments
_None_

Create a repository with the given name.  


#### Examples
```shell
up repository create my-org
```

### `up repository list`


#### Arguments
_None_

List all repository associated to the current user.


#### Examples
```shell
up repo list
NAME      TYPE      PUBLIC   UPDATED
my-repo   unknown   false    n/a
```

### `up repository delete`


#### Arguments
* <repository name> _(required)_ - the name of the repository to delete

Deletes the given repository.


#### Flags
* `--force` - Force deletion of the repository.

{{<hint "warning" >}}
Deleting a repository removes all packages from the repository and impacts all users in an organization. 

Deleting a public repository will also impact any users that attempt to pull any packages in
that repository or have it declared as a dependency in their cluster.

This can not be undone.
{{< /hint >}}


#### Examples
```shell
up repository delete my-repo
Are you sure you want to delete this repository? [y/n]: y
Deleting repository my-repo. This cannot be undone.
my-repo deleted
```