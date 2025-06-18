---
title: "Users"
weight: 4
description: "Creating and managing Upbound users"
aliases:
    - /accounts/identity-management/users
    - "/users"
    - "/users/register"
    - "/users/change"
    - "/concepts/accounts/users"
    - accounts/identity-management/users
---

User accounts in Upbound belong to individuals. Each user can be a member of one or more [teams][teams], which have permissions on control planes within an [organization][organization]. A user can be a member of multiple organizations.

## Account settings

<!-- vale Google.FirstPerson = NO -->
<!-- Allow `My Account` -->
You can change your account settings by clicking the profile photo in the top
right and selecting **My Account** in the Upbound Console.
<!-- vale Google.FirstPerson = YES -->
![Options available in the Account menu](/img/edit-account.png)

## Change account information

The [Account Settings][account-settings] screen allows you to change your password, connect to GitHub, Google or email for authentication or delete your Upbound account.

<!-- vale gitlab.Substitutions = NO -->
<!-- allow lowercase kubernetes in the URL -->
:::warning
_API Tokens_ are used to log in with the [Up command-line][up-command-line]. This token can't be used as a [Kubernetes image pull secret][kubernetes-image-pull-secret]
:::
<!-- vale gitlab.Substitutions = YES -->

## Create an account

Use the [Upbound registration page][upbound-registration-page] to
create a new user account.
<!-- vale Google.Headings = NO -->

### 1. Choose a registration method

Register with Upbound with your GitHub account, Google account or email.
<!-- ![Choose to sign up with GitHub, Google or Email](/img/signup.png) -->



### 2. Complete the registration form
Complete the form and agree to the Terms and Conditions.

<!-- ![Upbound account creation registration form](/img/completed_form.png) -->


### 3. Choose a username
Choose a username for your Upbound account. Usernames must be globally unique.

<!-- ![Upbound create a username form](/img/choose_username.png) -->


### 4. Confirm your email
Upbound sends you an email containing a 6-digit PIN. Provide this PIN to confirm your email address.

<!-- ![Example form to insert email confirmation PIN](/img/confirm_pin.png) -->
After submitting your pin your account is now ready.

<!-- ![A screen showing that an Upbound account has been created](/img/account_ready.png) -->

Clicking `Finish` will send you to the [Upbound Marketplace][upbound-marketplace].

To make changes to your account login to [accounts.upbound.io][accounts-upbound-io]
<!-- vale Google.Headings = YES -->

## Delete an account

<!-- vale Google.FirstPerson = NO -->
Selecting [Delete Account][delete-account] in the
**My Account** pane sends a deletion request to Upbound support.
<!-- vale Google.FirstPerson = YES -->

Organizations associated with this account aren't deleted.

If the user is the primary account for an organization, contact [Upbound
support][upbound-support] to transfer organization ownership.

[teams]: /operate/accounts/identity-management/teams
[organization]: /operate/accounts/identity-management/organizations
[up-command-line]: /operate/cli
[kubernetes-image-pull-secret]: /upbound-marketplace/authentication#kubernetes-image-pull-secrets
[upbound-support]: /usage/support

<!--- TODO(tr0njavolta): support link --->
[account-settings]: https://accounts.upbound.io/settings
[upbound-registration-page]: http://accounts.upbound.io/register
[upbound-marketplace]: http://marketplace.upbound.io
[accounts-upbound-io]: https://accounts.upbound.io
[delete-account]: https://accounts.upbound.io/settings/delete
