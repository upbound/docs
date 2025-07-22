---
title: Create a control plane project
sidebar_position: 1
---

Now that you have an Upbound account and the up CLI installed, you are ready to
create a control plane.

In this quickstart, you will:

1. Scaffold a control plane project
2. Define your own resource abstraction and templatization
3. See the changes immediately

:::tip

This quickstart teaches how to use Crossplane to build workflows for templating
resources and exposing them as simplified resource abstraction. If you just want
to manage the lifecycle of resources in an external system through Crossplane
and Kubernetes, read [Manage external resources with providers][providers]

:::

## Prerequisites

This quickstart takes around 10 minutes to complete. You should be familiar with
YAML or programming in Go, Python, and KCL.

Before beginning, make sure you have:

- The [up](up) CLI installed
- A Docker-compatible container runtime installed and running on your system

## Create a control plane project

Crossplane works by letting you define new resource types in Kubernetes that
invoke function pipelines to template and generate other resources. Just like
any other software project, a _control plane project_ is a source-level
representation of your control plane.

Create a control plane project on your machine by running the following command:

```shell
up project init --scratch getting-started
```

This scaffolds a new project in a folder called `getting-started`. Change your
current working directory to the project root folder.

## Deploy your control plane

In the root directory of your project, build and run your project by running the
following:

```shell
up project run --local
```

This launches an instance of Upbound Crossplane on your machine, wrapped and
deployed in a container. Upbound Crossplane comes bundled with a Web UI. Run the
following command to be able to access the UI for your control plane:

```shell
kubectl port-forward -n crossplane-system svc/uxp-webui 8080:80
``` 

Open a browser at [https://localhost:8080](https://localhost:8080).

![image][webUI]

## Define your own resource type

Customize your control plane by defining your own resource type.

Create an example instance of your custom resource type with:


```shell
up example generate \
  --type xr --api-group getting.started --api-version v1alpha1 --kind App --name example
```

Open the project in your IDE of choice and replace the contents of the generated file
`getting-started/examples/app/example.yaml` with the following:

```yaml title="getting-started/examples/app/example.yaml"
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

Next, generate the definition files needed by Crossplane with the following commands:

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

You just created your own resource type called `App`. You generated a function
containing the logic Crossplane uses to determine what should happen when you
create the `App`.

:::tip

To define a new resource type with Crossplane, you need to:

* create a [CompositeResourceDefinition (XRD)][xrd], which defines the API schema of your resource type
* create a [Composition][composition], which defines the implementation of that API schema.
* A Composition is a pipeline of [functions][functions], which contain the user-defined logic of your composition.   

:::

Open the function definition file at
`getting-started/functions/compose-resources/` and replace the contents with the
following:

<Tabs>

<TabItem value="gotempl" label="Templated YAML">
```yaml
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
  address: {{ get (getComposedResource . "service").spec "clusterIP" | default "" | quote }}```
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

Deploy the changes you made to your control plane:

```shell
up project run --local
```

## Use the custom resource

Your control plane now understands _App_ resources. Create an _App_:

```shell
kubectl apply -f examples/app/example.yaml
```


Check that the _App_ is ready:

```shell
kubectl get -f examples/app/example.yaml
NAME     SYNCED   READY   COMPOSITION   AGE
my-app   True     True    app-yaml      56s
```

Observe the `Deployment` and `Service` Crossplane created when you created the
`App`:


```shell
kubectl get deploy,service -l example.crossplane.io/app=my-app
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/my-app-2r2rk   2/2     2            2           11m

NAME                   TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/my-app-xfkzg   ClusterIP   10.96.148.56   <none>        8080/TCP   11m
```


## Next steps

Now that your control plane is running locally, you're ready to package it as a
[Configuration][Configuration] image and push it to the Upbound Marketplace.

Check out the [Build and push your first Configuration][buildAndPush] tutorial
to continue.

[up]: up
[marketplace]: https://marketplace.upbound.io
[functions]: /uxp/composition/composite-resource-definitions
[providers]: https://upbound.io
[Configuration]: /manuals/upbound-crossplane/packages/configurations
[buildAndPush]: build-and-push
[xrd]: /uxp/composition/composite-resource-definitions
[composition]: /uxp/composition/overview
[functions]: /uxp/composition/composite-resource-definitions
[webUI]: /img/uxp-webui.png
