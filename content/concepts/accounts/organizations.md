---
title: Organizations
---

Organizations allow multiple [user accounts]({{<ref "users" >}}) to share Upbound resources and collaborate.  

## Selecting an organization

Upbound displays your current organization below the name of your user account in the top right corner of the console. To select an organization:

1. Select the account profile photo to view a list of all the organizations where you are a member.
2. Select an organization to select it. Upbound changes the console's context to the selected organization.

## Joining and leaving an organization

Organization owners can invite users to join their organization. The user must
accept the email invitation sent by Upbound.

You can leave
an organization from your user account settings.

## Creating an organization

To create an organization, login to Upbound and go the [Organization selection screen](https://console.upbound.io/selectOrg).

{{< hint "tip" >}}
There's no limit to the number of organizations a user can belong to. 

Users are only allowed to create one organization.
{{< /hint >}}

You can also create an organization using the [up CLI]({{<ref "reference/cli/command-reference#organization-create" >}}).

## Organization settings

To view and manage an organization's settings, select Settings gear icon in the top navigation bar.

### User management

Organization owners and users with Admin permissions can invite Upbound users into the organization, cancel invitations, and remove existing members.

The user list combines both active and invited users. 

Edit active users to change the user's granted role or remove them from the
organization. 

Invited users who haven't accepted the invitation show a "Pending" status. 
Select the user to resend the invite or remove them from the organization.

Upbound only supports inviting users by email address, not by Upbound username.

To invite a user to an organization:

1. Select **Invite New User**. 
2. Enter the user's email address and select their role.
3. Select the **Invite** button to send the invite. 
