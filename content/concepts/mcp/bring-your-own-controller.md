---
title: Orchestrate internal resources 
weight: 500
description: Manage internal resources with managed control planes even if their APIs are not exposed to the internet.
aliases:
  - byoc
---

Most enterprises have internal systems they would like to manage from their
managed control planes just like their public cloud resources. Your managed control plane needs to be able to reach those resources. You
may prefer not to expose those internal systems over the public internet for
your managed control planes to reach and make API calls.

Bring Your Own Controller (BYOC) is a pattern you can use in this case. It enables you to install the
controller piece of a Crossplane provider to your internal network while connecting back to your control plane in Upbound. The
controller is able to make requests to the managed control plane to see deployed
custom resources and then make the API calls internally. The
requests are always made by the controller to your control plane, not the
other way around.

This guide shows you how it all works with a step-by-step reference example.

{{<hint "warning" >}} Installing custom providers not allowed in a free trial session of Upbound. 
[Contact Upbound](https://www.upbound.io/support/contact) to upgrade to a
higher tier to enable this feature.{{< /hint >}}

## Installation

This example uses:

- a provider with a single managed resource type called `Robot`
- a server that it talks to the control plane to manage robots.

### Install the provider

Install the provider to your control plane to get the
`CustomResourceDefinition`s of your managed resources installed together with
necessary RBAC machinery. The provider installed to the control plane has its controller turned off via a flag by default. It idles because it would not be able to reach the APIs anyway.

In Upbound, you configure a managed control plane via a Git repository. In
order to install a provider, you need to add it to the `crossplane.yaml`
file in your control plane's repository like below:

```yaml
apiVersion: meta.pkg.crossplane.io/v1alpha1
kind: Configuration
...
spec:
  dependsOn:
    - provider: xpkg.upbound.io/upbound/provider-dummy
      version: "v0.1.0-4.gc52e44d"
```

Once you commit your change, go to the console and update your control plane
with the latest build of your repository.

{{<img src="knowledge-base/images/update-cp.png" alt="Update configuration" size="small" unBlur="true" lightbox="true">}}

### Deploy internal API

Don't expose the `server-dummy` to your own Kubernetes cluster. The cluster
isn't exposed to the internet to mimic the company internal network.

You can use a `kind` or any other cluster that has access to internet.

```bash
kubectl apply -f https://raw.githubusercontent.com/upbound/provider-dummy/dc0f51d/cluster/server-deployment.yaml
```

You can see
[in the code](https://github.com/upbound/provider-dummy/blob/dc0f51d/cmd/server/main.go)
that it's a server with in-memory bookkeeping.

### Deploy internal controller

Your CRDs and internal API are ready. The last piece is to install the
actual controller that reconciles resources in the control plane and make
API calls in your internal network.

First, you need to get a kubeconfig of your control plane. Mount it to your
controller's file system.

Go to `My Account` and then `API Tokens` page in the console to generate a new
API token. Use the API token to authenticate to your control plane.

Once your token is ready, run the following command to produce a kubeconfig in
your local file system.
```bash
# Replace CONTROL_PLANE_NAME, ORGANIZATION_NAME and TOKEN with appropriate values.
up ctp kubeconfig get CONTROL_PLANE_NAME --account ORGANIZATION_NAME --token='TOKEN' --file /tmp/kube.yaml
```

Store this kubeconfig in a `Secret` in your cluster that runs in your
internal network.
```bash
kubectl create secret generic mcp-kubeconfig --from-file=kubeconfig=/tmp/kube.yaml
```

Deploy the controller that mounts this `Secret`.
```bash
kubectl apply -f https://raw.githubusercontent.com/upbound/provider-dummy/d8941da/cluster/controller-deployment.yaml
```

You are now ready to create your first resources.

## Usage

As usual, you need to configure your provider with credentials before
creation of any resources.

Always interact with control plane for all operations since that's what your controller
is watching even if it's in another cluster and network.

Make sure your `kubectl` now points to your control plane.
```bash
export KUBECONFIG=/tmp/kube.yaml
```

Create a default `ProviderConfig`.
```bash
kubectl apply -f https://raw.githubusercontent.com/upbound/provider-dummy/dc0f51d/examples/providerconfig/incluster.yaml
```

Create your first resource. The configuration looks like the following:
```yaml
apiVersion: iam.dummy.crossplane.io/v1alpha1
kind: Robot
metadata:
  name: example
spec:
  forProvider:
    color: yellow
```

Run the following to create the resource:
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
control plane.

## Notes

* Do you need to install the server or controller in a Kubernetes cluster?
  * No. You can deploy the server and the controller anywhere since they're
    Docker containers as long as controller can reach the server and the
    kubeconfig is in place for it to talk with the control plane. You can use
    Google CloudRun or AWS Fargate.
* Is the traffic between the controller and control plane secure?
  * The requests are essentially native Kubernetes calls done with the
    authentication information in the kubeconfig, hence over TLS. You can always
    revoke the token in Upbound Console.
* How do connection secrets work?
  * They're created in the control plane just like a normal provider. If you'd
    like to mount them to an application running in a cluster in your internal
    network, take a look at [MCP
    Connector](https://docs.upbound.io/concepts/mcp/control-plane-connector/).