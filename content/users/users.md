---
title: "Users"
weight: 1
---

User accounts in Upbound belong to individuals. Each user can be a member of one or more [teams]({{<ref "/users/teams" >}}), which are granted permissions on control planes within an [organization]({{<ref "/users/organizations" >}}). A user can be a member of multiple organizations.

## Account settings

You can change your account settings by clicking the profile photo in the top right and selecting `My Account` in the Upbound Console. 

{{<img src="users/images/edit-account.png" alt="Options available in the Account menu" quality="100" >}}

## Change account information

The [Account Settings](https://accounts.upbound.io/settings) screen allows you to change your password, connect to GitHub, Google or email for authentication or delete your Upbound account.

<!-- vale gitlab.Substitutions = NO -->
<!-- allow lowercase kubernetes in the URL -->
{{< hint "warning" >}}
_API Tokens_ are used to log in with the [Up command-line]({{<ref "cli">}}). This token can't be used as a [Kubernetes image pull secret]({{<ref "upbound-marketplace/authentication#kubernetes-image-pull-secrets">}})
{{< /hint >}}
<!-- vale gitlab.Substitutions = YES -->

## Create an account

Create a user account on Upbound by going to the [Upbound registration page](http://accounts.upbound.io/register).

{{< tabs "register" >}}

{{< tab "1. Choose a registration method" >}}
Register with Upbound with your GitHub account, Google account or email.
{{<figure src="/users/images/register/signup.png" alt="Choose to sign up with GitHub, Google or Email" height="500px" >}}

{{< /tab >}}

{{<tab "2. Complete the registration form" >}}
Complete the form and agree to the Terms and Conditions.

{{<figure src="/users/images/register/completed_form.png" alt="Upbound account creation registration form" height="500px" >}}
{{< /tab >}}

{{<tab "3. Choose a username" >}}
Choose a username for your Upbound account. Usernames must be globally unique.

{{<figure src="/users/images/register/choose_username.png" alt="Upbound create a username form" height="500px" >}}
{{< /tab >}}

{{<tab "4. Confirm your email" >}}
Upbound sends you an email containing a 6-digit PIN. Provide this PIN to confirm your email address.

{{<figure src="/users/images/register/confirm_pin.png" alt="Example form to insert email confirmation PIN" height="500px" >}}
After submitting your pin your account is now ready. 

{{<figure src="/users/images/register/account_ready.png" alt="A screen showing that an Upbound account has been created" height="500px" >}}

Clicking `Finish` will send you to the [Upbound Marketplace](http://marketplace.upbound.io). 

To make changes to your account login to [accounts.upbound.io](https://accounts.upbound.io)
{{< /tab >}}
{{< /tabs >}}

## Delete an account

Selecting [Delete Account](https://accounts.upbound.io/settings/delete) in the My Account pane will send a request to Upbound support to have your account deleted. Any organizations associatted with this account _won't_ be deleted. If you are the primary account holder for any of your organizations, you will need to deactivate or transfer ownership of them before you delete your user account.