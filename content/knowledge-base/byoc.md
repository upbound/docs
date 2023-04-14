---
title: Manage Internal Resources with Managed Control Planes
weight: 5
description: Manage internal resources with managed control planes
even if their APIs are not exposed to the internet.
---

# Manage Internal Resources with Managed Control Planes

Many enterprises have internal systems that they would like to manage from their
managed control planes just like their public cloud resources. However, they
would not prefer to expose their internal systems over public internet for
their managed control plane to reach and make API calls.

Bring Your Own Controller (BYOC) is a pattern that enables users to install the
controller piece of their provider to their internal network in a way that will
point it to their managed control plane hosted by Upbound. In this way, the
controller is able to make requests to the managed control plane to see what
custom resources are deployed and then make the API calls internally. The
requests are always made by controller to managed control plane but not the
other way around.

This guide will show you how it all works with a simple example step by step.

{{<hint "warning" >}} Installing custom providers is not part of the Free Tier. 
[Contact Upbound](https://www.upbound.io/support/contact) to upgrade to a
higher tier to enable this feature.{{< /hint >}}

## Installation

We will use a provider with a single managed resource type called `Robot`
and a simple server that it will talk to in order to manage robots.

### Install The Provider

We will install the provider to our control plane in order to get the
`CustomResourceDefinition`s of our managed resources installed together with
necessary RBAC machinery. Note that the provider we are installing to the
control plane has its controller disabled by a flag by default, so it will do
nothing because it would not be able to reach the APIs anyway.

Control planes configurations are backed by a Git repository in Upbound. In
order to install a provider, we will need to add it to the `crossplane.yaml`
file in our repository like below:

```yaml
apiVersion: meta.pkg.crossplane.io/v1alpha1
kind: Configuration
...
spec:
  dependsOn:
    ...
    - provider: xpkg.upbound.io/upbound/provider-dummy
      version: "v0.1.0-4.gc52e44d"
```

Once you commit your change, go to the console and update your control plane
with the latest build of your repository.

{{<img src="knowledge-base/images/update-cp.png" alt="Update configuration"
size="small" lightbox="true">}}

### Deploy Internal API

We will deploy the `server-dummy` to our own Kubernetes cluster. The cluster
will not be exposed to the internet to mimic the company internal network.

You can use a `kind` or any other cluster that has access to internet.

```bash
kubectl apply -f https://raw.githubusercontent.com/upbound/provider-dummy/dc0f51d/cluster/server-deployment.yaml
```

You can see
[here](https://github.com/upbound/provider-dummy/blob/dc0f51d/cmd/server/main.go)
that it's a very simple server with in-memory bookkeeping.

### Deploy Internal Controller

We have the CRDs and our internal API is ready. The last piece is to install the
actual controller that will reconcile resources in the control plane and make
API calls in our internal network.

We will first need to get a kubeconfig of our control plane to be mounted to our
controller's file system.

Go to `My Account` and then `API Tokens` page in the console to generate a new
API token to be used to authenticate to your control plane.


Once your token is ready, run the following command to produce a kubeconfig in
your local file system.
```bash
# Replace CONTROL_PLANE_NAME, ORGANIZATION_NAME and TOKEN with appropriate values.
up ctp kubeconfig get CONTROL_PLANE_NAME --account ORGANIZATION_NAME --token='TOKEN' --file /tmp/kube.yaml
```

We will store this kubeconfig in a `Secret` in our cluster that runs in our
internal network.
```bash
kubectl create secret generic mcp-kubeconfig --from-file=kubeconfig=/tmp/kube.yaml
```

Let's deploy our controller that mounts this `Secret`.
```bash
kubectl apply -f https://raw.githubusercontent.com/upbound/provider-dummy/dc0f51d/cluster/server-deployment.yaml
```

That's it! We are now ready to create our first resources!

## Usage

As usual, we will need to configure our provider with credentials before
creation of any resources.

One thing to keep in mind here is that we will always
interact with control plane for all operations since that's what our controller
is watching even if it's in another cluster and network.

Make sure your `kubectl` now points to your control plane.
```bash
export KUBECONFIG=/tmp/kube.yaml
```

Create a default `ProviderConfig`.
```bash
kubectl apply -f https://raw.githubusercontent.com/upbound/provider-dummy/dc0f51d/examples/providerconfig/incluster.yaml
```

Let's create our first resource!
```yaml
apiVersion: iam.dummy.crossplane.io/v1alpha1
kind: Robot
metadata:
  name: example
spec:
  forProvider:
    color: yellow
```

Run the following to create the YAML above.
```bash
cat <<EOF | kubectl apply -f -
apiVersion: iam.dummy.crossplane.io/v1alpha1
kind: Robot
metadata:
  name: example
spec:
  forProvider:
    color: yellow
EOF
```

Check its progress.
```bash
kubectl describe robot.iam.dummy.crossplane.io/example
```
```bash
kubectl get robot.iam.dummy.crossplane.io/example -o yaml
```

And this is how you can manage resources in your internal network from your
control plane!

## Notes

* Does the server or controller need to be installed in a Kubernetes cluster?
  * No. You can deploy the server and the controller anywhere since they are
    simply Docker containers as long as controller can reach the server and the
    kubeconfig is in place for it to talk with the control plane. You can use
    Google CloudRun or AWS Fargate.
* Is the traffic between the controller and control plane secure?
  * The requests are essentially native Kubernetes calls done with the
    authentication information in the kubeconfig, hence over TLS. You can always
    revoke the token in Upbound Console.
* How do connection secrets work?
  * They are created in the control plane just like a normal provider. If you'd
    like to mount them to an application running in a cluster in your internal
    network, take a look at [MCP
    Connector](https://docs.upbound.io/concepts/control-plane-connector/).
