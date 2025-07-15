---
title: Build your first control plane project
slug: "/getstarted/"
sidebar_position: 1
---

Welcome to Upbound Crossplane, the AI-native distribution of Crossplane. Control
planes are the only way to build and support autonomous infrastructure platforms
ready for the age of autonomous systems, serving both humans and AI. One
Crossplane's is it lets you build workflows to template resources and expose
them as simplified resource abstractions.

:::tip

This quickstart is suitable for users who want use Crossplane to build workflows
for templating resources and exposing them as simplified resource abstraction.

To manage the lifecycle of any resource in an external system through
Kubernetes, read [Manage external resources with providers][providers]

:::


## Prerequisites

This quickstart takes around 10 minutes to complete. You should
be familiar with YAML or programming in Go, Python, or KCL.

For this quickstart, you need:

- the [Upbound CLI](up) installed.
- a Docker-compatible container runtime installed on your system and running.

## Create a control plane project

Crossplane lets you define new resource types in Kubernetes that invoke function
pipelines to template and generate other resources.

A _control plane project_ is a source-level representation of your control
plane. When you build a control plane project, it's bundled as an OCI package
and installed into a running instance of Upbound Crossplane.

Create a control plane project with the `up project init` command:

```shell
up project init --scratch my-new-project && cd my-new-project
```
This command scaffolds the basic structure with the necessary
configuration files for your project.

## Deploy your control plane

In the root directory of your project, use `up project run` to run your project
locally:

```shell
up project run --local
```

This launches an instance of Upbound Crossplane on your machine, wrapped and
deployed in a container. Upbound Crossplane comes bundled with a Web UI. Run the
following command to view the UI for your control plane, then open a browser at
[https://localhost:8080](https://localhost:8080):

This command deploys a container with an Upbound Crossplane instance on your
machine. 


Upbound Crossplane provides a built in Web UI for you to browse your control
plane resources. Create a forwarding service from the instance to a port on your
machine with `kubectl`:

```shell
kubectl port-forward -n crossplane-system svc/uxp-webui 8080:80
``` 

Open your browser and go to [http://localhost:8080](http://localhost:8080).


```shell
TODO: a picture of the web UI
+-----+
+-----+
```

## Define your own resource type

You can use the `up` CLI to define a custom resource type:

```shell
up example generate \
  --type xr --api-group getting.started --api-version v1alpha1 --kind App --name example
```
Customize your control plane by defining your own resource type. Start by
creating an example instance of your custom resource type and define the
properties you want to exist, then use the _up_ CLI to generate the definition
files Crossplane requires. Scaffold a new resource type example with:

This command generates the scaffolding for a custom resource type. You modify
this file to define the properties you want to exist. 

Open the new file and paste the following:

```yaml
apiVersion: example.crossplane.io/v1
kind: App
metadata:
  namespace: default
  name: my-app
spec:
  image: nginx
status:
  replicas: 2  # Copied from the Deployment's status
  address: 10.0.0.1  # Copied from the Service's status
```

Choose the language to write your custom resource function pipeline and generate
the definition file your custom resource file needs:


<Tabs>

<TabItem value="gotempl" label="Templated YAML">
```shell
up xrd generate examples/app/example.yaml
up composition generate apis/apps/definition.yaml
up function generate --language=go-templating compose-resources apis/apps/composition.yaml
```
</TabItem>
<TabItem value="Python" label="Python">
```shell
up xrd generate examples/app/example.yaml
up composition generate apis/apps/definition.yaml
up function generate --language=python compose-resources apis/apps/composition.yaml
```
</TabItem>
<TabItem value="Go" label="Go">
```shell
up xrd generate examples/app/example.yaml
up composition generate apis/apps/definition.yaml
up function generate --language=go compose-resources apis/apps/composition.yaml
```
</TabItem>
<TabItem value="KCL" label="KCL">
```shell
up xrd generate examples/app/example.yaml
up composition generate apis/apps/definition.yaml
up function generate --language=kcl compose-resources apis/apps/composition.yaml
```
</TabItem>
</Tabs>

These commands create several files based on the simple `App` example you
created. 

One of those is a _function_, that contains the logic that determines what
should happen when your `App` resource is created.


Open the `functions/apps/compose-resources/` directory. Find the file name of
your function and paste the function below based on the language you chose in
the previous step:

<Tabs>

<TabItem value="gotempl" label="Templated YAML">
```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    gotemplating.fn.crossplane.io/composition-resource-name: deployment
    {{ if eq (.observed.resources.deployment | getResourceCondition "Available").Status "True" }}
    gotemplating.fn.crossplane.io/ready: "True"
    {{ end }}
  labels:
    example.crossplane.io/app: {{ .observed.composite.resource.metadata.name }}
spec:
  replicas: 2
  selector:
    matchLabels:
      example.crossplane.io/app: {{ .observed.composite.resource.metadata.name }}
  template:
    metadata:
      labels:
        example.crossplane.io/app: {{ .observed.composite.resource.metadata.name }}
    spec:
      containers:
      - name: app
        image: {{ .observed.composite.resource.spec.image }}
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  annotations:
    gotemplating.fn.crossplane.io/composition-resource-name: service
    {{ if (get (getComposedResource . "service").spec "clusterIP") }}
    gotemplating.fn.crossplane.io/ready: "True"
    {{ end }}
  labels:
    example.crossplane.io/app: {{ .observed.composite.resource.metadata.name }}
spec:
  selector:
    example.crossplane.io/app: {{ .observed.composite.resource.metadata.name }}
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 80
---
apiVersion: example.crossplane.io/v1
kind: App
status:
  replicas: {{ get (getComposedResource . "deployment").status "availableReplicas" | default 0 }}
  address: {{ get (getComposedResource . "service").spec "clusterIP" | default "" | quote }}
```
</TabItem>
<TabItem value="Python" label="Python">
```python
todo
```
</TabItem>
<TabItem value="Go" label="Go">
```shell
todo
```
</TabItem>
<TabItem value="KCL" label="KCL">
```shell
todo
```
</TabItem>

</Tabs>

Now, you're ready to deploy your custom resource function and other necessary
files to a control plane:

```shell
up project run --local
```

## Use the custom resource

With your project running, the control plane in the project can understand your
`App` custom resource type. 

Use `kubectl apply` with your custom resource example to use the resource:

```shell
kubectl apply -f examples/app/example.yaml
```


Check that the _App_ is ready:

```shell
kubectl get -f examples/app/example.yaml
NAME     SYNCED   READY   COMPOSITION   AGE
my-app   True     True    app-yaml      56s
```

Observe how Crossplane created a _Deployment_ and _Service_ because the _App_
got created:

```shell
kubectl get deploy,service -l example.crossplane.io/app=my-app
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/my-app-2r2rk   2/2     2            2           11m

NAME                   TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/my-app-xfkzg   ClusterIP   10.96.148.56   <none>        8080/TCP   11m
```

## Next Steps

In this guide, you created a local Upbound Crossplane instance, created a
control plane project with a custom resource and function logic, and created
Kubernetes app resources in the same local Upbound Crossplane cluster.

Next, learn more about how Crossplane can deploy cloud resources and manage
external services:

* [Create a custom AWS resource type][aws]
* [Create a custom Azure resource type][azure]
* [Create a custom GCP resource type][gcp]
* [Perform an operation on a resource][operations]
* [Manage external resources with providers][providers]

[up]: up
[marketplace]: https://marketplace.upbound.io
[functions]: /uxp/composition/composite-resource-definitions
[aws]: /uxp/quickstart/aws-composition 
[azure]: /uxp/quickstart/azure-composition 
[gcp]:  /uxp/quickstart/gcp-composition
[operations]:  /uxp/quickstart/operation
[providers]:  /uxp/quickstart/external-resources
