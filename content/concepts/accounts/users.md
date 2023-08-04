---
title: "Users"
aliases:
    - "/users"
    - "/users/register"
    - "/users/change"
---

User accounts in Upbound belong to individuals. Each user can be a member of one or more [teams]({{<ref "./teams" >}}), which have permissions on control planes within an [organization]({{<ref "./organizations" >}}). A user can be a member of multiple organizations.

## Account settings

<!-- vale Google.FirstPerson = NO -->
<!-- Allow `My Account` -->
You can change your account settings by clicking the profile photo in the top
right and selecting **My Account** in the Upbound Console. 
<!-- vale Google.FirstPerson = YES -->

{{<img src="concepts/images/accounts/edit-account.png" alt="Options available in the Account menu" quality="100" >}}

## Change account information

The [Account Settings](https://accounts.upbound.io/settings) screen allows you to change your password, connect to GitHub, Google or email for authentication or delete your Upbound account.

<!-- vale gitlab.Substitutions = NO -->
<!-- allow lowercase kubernetes in the URL -->
{{< hint "warning" >}}
_API Tokens_ are used to log in with the [Up command-line]({{<ref "cli">}}). This token can't be used as a [Kubernetes image pull secret]({{<ref "upbound-marketplace/authentication#kubernetes-image-pull-secrets">}})
{{< /hint >}}
<!-- vale gitlab.Substitutions = YES -->

## Create an account

Use the [Upbound registration page](http://accounts.upbound.io/register) to
create a new user account.

{{< tabs "register" >}}

{{< tab "1. Choose a registration method" >}}
Register with Upbound with your GitHub account, Google account or email.
{{<img src="concepts/images/accounts/register/signup.png" alt="A user can be in multiple organizations and multiple groups" quality="100" size="tiny" lightbox="true">}}

{{< /tab >}}

{{<tab "2. Complete the registration form" >}}
Complete the form and agree to the Terms and Conditions.

{{<img src="concepts/images/accounts/register/completed_form.png" alt="Fill out the form" quality="100" size="tiny" lightbox="true">}}
{{< /tab >}}

{{<tab "3. Choose a username" >}}
Choose a username for your Upbound account. Usernames must be globally unique.

{{<img src="concepts/images/accounts/register/choose_username.png" alt="Choose a unique username" quality="100" size="tiny" lightbox="true">}}
{{< /tab >}}

{{<tab "4. Confirm your email" >}}
Upbound sends you an email containing a 6-digit PIN. Provide this PIN to confirm your email address.

{{<img src="concepts/images/accounts/register/confirm_pin.png" alt="Confirm your account PIN" quality="100" size="tiny" lightbox="true">}}
After submitting your pin your account is now ready. 

{{<img src="concepts/images/accounts/register/account_ready.png" alt="Confirm your account PIN" quality="100" size="tiny" lightbox="true">}}

Clicking `Finish` sends you to the [Upbound Marketplace](http://marketplace.upbound.io). 

To make changes to your account login to [accounts.upbound.io](https://accounts.upbound.io)
{{< /tab >}}
{{< /tabs >}}

## Delete an account

<!-- vale Google.FirstPerson = NO -->
Selecting [Delete Account](https://accounts.upbound.io/settings/delete) in the
**My Account** pane sends a deletion request to Upbound support. 
<!-- vale Google.FirstPerson = YES -->

Organizations associated with this account aren't deleted. 

If the user is the primary account for an organization, contact [Upbound
support]({{<ref "/support">}}) to transfer organization ownership.
