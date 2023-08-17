---
title: Robots
---

Robot accounts are non-user accounts with unique credentials and permissions. Organization _admins_ grant robot accounts access to individual repositories. Robot accounts access the repositories without using credentials tied to an individual user. 

{{< hint "warning" >}}
Upbound strongly recommends using robot accounts for any Kubernetes related authentication. For example, providing secrets required to install Kubernetes manifests. Use Upbound user accounts only with the _up_ command-line or [Upbound console](https://console.upbound.io/).
{{< /hint >}}

## Create a robot

You can create robot account from the `Robots` tab in the org settings pane. You can also create robots using the [up CLI]({{<ref "/reference/cli/command-reference#robot-token-create" >}}).

## Assign a robot to a team

Make sure you've created the desired robot before assigning it to a team. To assign a robot to a team, do the following:

1. Go to the **Teams** tab in the org settings pane.
2. Select the team you want to assign a robot account.
3. Select the **Robot accounts** tab
4. Select the **Add Robot Account** button and select the robot you want.
