---
title: Organizations
weight: 3
---

Organizations allow multiple [user accounts]({{<ref "users" >}}) to share Upbound resources and collaborate.  

## Selecting an organization

Upbound displays your current organization below the name of your user account in the top right corner of the console. To select an organization:

1. Click the account profile photo to view a list of all the organizations where you are a member.
2. Click an organization to select it. Upbound will change the console's context to the selected organization.

## Joining and Leaving Organizations

To join an organization, you must be first invited by one of its owners. Once you are invited, you will recieve an email invitation that you must accept. You can leave an organization from your user account settings.

## Creating an organization

To create an organization, go the [Organization selection screen](https://console.upbound.io/selectOrg).

{{< hint "tip" >}}
Users are allowed to belong to as many organizations as they wish, but they are only allowed to create 1 additional org. Attempts to create more than 1 additional org will result in an error being returned.
{{< /hint >}}

You can also create an organization using the [up CLI]({{<ref "cli/command-reference#organization-create" >}}).

## Organization Settings

To view and manage an organization's settings, click Settings gear icon in the top navigation bar.

### User management

Organization owners and users with Admin permissions can invite Upbound users into the organization, cancel invitations, and remove existing members.

The user list combines both active and invited users. Users who have been invited but haven't accepted the inivitation will show a "Pending" status in their row. Each active user can be edited to change the user's granted role or remove them from the organization. In the case of invited users, you can click to resend the invite or remove them from the organization.

User invitations are always sent by email; you can't invite someone using their Upbound username To invite a user to an organization:

1. Click `Invite New User`. 
2. Enter the user's email address and specify which role they will be granted upon joining the organization.
3. Click the `Invite` button to send the invite. 
