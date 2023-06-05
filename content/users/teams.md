---
title: "Teams"
weight: 2
---

Teams are groups of Upbound [users]({{<ref "users" >}}) within an [organization]({{<ref "organizations" >}}). Teams provide more fine-grained permissions controls for users and robots accessing control planes and repositories.

## Manage Teams

Only organization admins can create teams, assign teams permissions, or view the full list of teams. Other users can view any teams marked as visible within the organization, plus any secret teams they are members of.

To manage teams:

1. go to the `Teams` tab in the org settings pane
2. Click a team to go to its settings pane, which lists the team's members, robots, and permissions.

### Create a team

Create a team on Upbound by going to the `Teams` tab in the org settings pane and clicking the "+" button. Give your new team a name and click `Create Team`. Newly created teams have no members, robots, or permissions assigned.

### Delete a team

To delete a team:

1. select the team from the `Teams` tab in the org settings pane. 
2. Select the team's `Settings` tab.
3. Click the `delete` button.

{{< hint "warning" >}}
Deleting a team permanently removes any permissions its members and robot accounts have and cannot be undone.
{{< /hint >}}

## Manage Membership

Users can be members of more than one team inside an organization.

The following illustrates a user that's a member of two different organizations and multiple teams. 
![A user in multiple groups and multiple organizations.](/users/images/user-org-team.png "A user can be in multiple orgs and multiple groups")
<!-- vale Upbound.Spelling = NO -->
<!-- ignore "Lando" -->
The user _Lando_ has a unique _user account_.  
Lando is a member of both _Organization-1_ and _Organization-2_.  
Inside _Organization-1_, Lando belongs to _Team-A_ and _Team-B_.  
Lando is only a member of _Team-Y_ inside _Organization-2_.
<!-- vale Upbound.Spelling = YES -->

### Add users

If the user is not yet in the organization, invite them to join the organization. Once the user has accepted their invite you can add them to team(s). To do this:

1. select the team from the `Teams` tab in the org settings pane. 
2. Click the team's `Members` tab.
3. Click `Add Team Member`.
4. You can select from the list of available members in the organization who do not already belong to this team. You can select multiple users at a time.

{{< hint "tip" >}}
The default role that will be assigned to a team member is `owner`. Select the role to open a menu and change it to `member` if you wish.
{{< /hint >}}

### Remove users

To remove a user from a team:

1. select the team from the `Teams` tab in the org settings pane. 
2. Click the team's `Members` tab.
3. Click the `edit` button next to the user's name in the team list.
4. Click the `Remove From Team` button.

### Robot management

You can manage adding and removing robots from teams. To assign a robot to a team, see instructions in the [robots documentation]({{<ref "robots/#assign-a-robot-to-a-team" >}}).

## Manage Repo Permissions

Repository permissions for the Upbound Marketplace are managed at the team level. To create a new permission, do the following:

1. select the team from the `Teams` tab in the org settings pane. 
2. Click the team's `Permissions` tab.
3. Click the `Create Repository Permission`.


