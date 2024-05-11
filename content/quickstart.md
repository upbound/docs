---
title: "Quickstart"
weight: 0
icon: "person-running-regular"
description: "Create your first Upbound Managed Control Plane and connect it to your cloud provider."
---

This quickstart guides you through how to create your first managed control
plane in Upbound. A managed control plane is an instance of Crossplane that's hosted and managed for you by Upbound. Learn how to configure your managed control plane and use it to invoke and manage a set of resources.

## Prerequisites

You need the following:

- An Upbound account.
- The [up CLI]({{<ref "reference/cli#install-the-up-command-line">}}) installed on your machine.

{{< hint "tip" >}}
If you don't have an Upbound account, [sign up for a free trial](https://accounts.upbound.io/register).
{{< /hint >}}

## Get started

After you register your Upbound account and create an organization, walk through the interactive "Get
Started" demo below.

<div style="position: relative; padding-bottom: calc(76.04621072088725% + 42px); height: 0;"><iframe src="https://app.supademo.com/embed/clvydptrx0ty8phe2252uwuzz" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Connect to your managed control plane

Use the `up` CLI to grab the connection details for your managed control plane. First, login to Upbound:

```shell
up web-login --account=${yourOrganization}
```

After you login, connect directly to your control plane with the `up ctx` command:

```shell
up ctx ${yourOrganization}/${yourSpace}/default/${yourControlPlane}
```

This command sets an `upbound` kubecontext in your kubeconfig. You're ready to use `up` or `kubectl` to interact with your managed control plane.

## Install the getting started configuration

When you create a new managed control plane, Upbound provides you with a fully isolated instance of Crossplane. Configure your control plane by installing packages that extend its capabilities, like to create and manage the lifecycle of new types of infrastructure resources. 

Upbound recommends installing [Crossplane Configurations](https://docs.crossplane.io/concepts/configurations), a package type that extends the capabilities of your control plane. For this quickstart, install [`configuration-getting-started](https://marketplace.upbound.io/configurations/configuration-getting-started) using the `up` CLI:

```shell
up ctp configuration install upbound/configuration-getting-started
```

## Create and manage resources with your control plane

When you install a configuration, the new API types it defines become available on your control plane. Create one of these resource types by applying a _claim_ to your control plane using your terminal:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  labels:
    org: foo
  name: my-awesome-ctp
  namespace: default
spec:
  writeConnectionSecretToRef:
    name: kubeconfig-my-awesome-ctp
```

In the Console, select the corresponding resource type on your control plane and observe the claim you created now shows up. Select the claim resource and observe how you can use the control plane explorer to inspect the resources your control plane is now managing. After the resource creates and your control plane actively manages it, it's health status turns green.

## Explaining what just happened

As a control plane, Crossplane can manage anything. To manage something, Crossplane depends [providers](https://docs.crossplane.io/concepts/providers), another core package type in Crossplane. They contain the basic building blocks that contain representations for things to Crossplane. You didn't need to install a provider directly because Crossplane contains a package manager. When given a Configuration, Crossplane's package manager resolve its dependencies automatically for you.

The configuration you installed, `configuration-getting-started`, depends on a provider called `provider-nop`, a stub provider that defines a fake resource. When you created your first resource in the previous section, provider-nop created a fake resource inside your control plane. But the process is almost identical if you want to use Crossplane to manage real cloud resources in AWS, Azure, GCP, and more.

## Next steps

To learn more about the core concepts of Upbound, read the [managed control planes]({{<ref "mcp">}}) documentation.