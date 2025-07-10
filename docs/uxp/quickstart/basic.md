---
title: Create a custom resource type
sidebar_position: 1
---

Welcome to Upbound Crossplane, the AI-native distribution of Crossplane. Control planes are the only way to build and support autonomous infrastructure platforms ready for the age of autonomous systems, serving both humans and AI. One of the core features of Crossplane is it lets you build workflows to template resources and expose them as a simplified resource abstraction. 

:::tip

This quickstart is suitable for users who want use Crossplane to build workflows for templating resources and exposing them as simplified resource abstractiosn. If you just want to use Crossplane to manage the lifecycle of any resource in an external system through Kubernetes, read [Manage external resources with providers][providers]

:::


## Prerequisites

This quickstart will take you approximately 10 minutes to complete. You should be familiar with YAML or programming in Go, Python, and KCL.

Before beginning, make sure that:

- you have installed the [Upbound CLI](up).
- you have a Docker-compatible container runtime installed on your system and running.

## Create a control plane project

Crossplane works by letting you define new resource types in Kubernetes that invoke function pipelines to template and generate lower-level resources. Just like any other software project, a _control plane project_ is a source-level representation of your control plane. A control plane project gets built into an OCI package and installed into a running instance of Upbound Crossplane.

Create a control plane project on your machine by running the following command:

```shell
up project init --scratch my-new-project
```

This scaffolds a new project in a folder called `my-new-project`. Change your current working directory to the project root folder and notice the `upbound.yaml` file. 

## Deploy your control plane

In the root directory of your project, build and run your project by running the following:

```shell
up project run --local
```

This launches an instance of Upbound Crossplane on your machine, wrapped and deployed in a container. Upbound Crossplane comes bundled with a Web UI. Run the following command to view the UI for your control plane, then open a browser at [https://localhost:8080](https://localhost:8080):

```shell
kubectl port-forward -n crossplane-system svc/uxp-webui 8080:80
``` 

```shell
TODO: a picture of the web UI
+-----+
+-----+
```

## Define your own resource type

Customize your control plane by defining your own resource type. Start by creating an example instance of your custom resource type and define the properties you want to exist, then use the _up_ tooling to generate the definition files Crossplane needs. Scaffold a new resource type example with:

```shell
up example generate \
  --type xr --api-group getting.started --api-version v1alpha1 --kind App --name example
```

Open the project in your IDE of choice and edit the generated file `my-new-project/examples/app/example.yaml`:

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

Generate the definition files needed by Crossplane with the following commands:

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

What you just did is created your own resource type called `App` and created a single function to contain the logic that defines what should happen when one of these _Apps_ get created. Open the function definition file at `my-new-project/functions/compose-resources/` and add some logic:

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

Observe how Crossplane created a _Deployment_ and _Service_ because the _App_ got created:

```shell
kubectl get deploy,service -l example.crossplane.io/app=my-app
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/my-app-2r2rk   2/2     2            2           11m

NAME                   TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/my-app-xfkzg   ClusterIP   10.96.148.56   <none>        8080/TCP   11m
```

## Next Steps

The example above creates Kubernetes app resources in the same cluster as where Upbound Crossplane is installed. Now that you know the basics of Crossplaen, continue your journey with the resources below:

* [Create a custom AWS resource type][aws]
* [Create a custom Azure resource type][azure]
* [Create a custom GCP resource type][gcp]
* [Perform an operation on a resource][operations]
* [Manage external resources with providers][providers]

[up]: up
[providers]: /uxp/packages/providers
[marketplace]: https://marketplace.upbound.io
[functions]: /uxp/composition/composite-resource-definitions
[aws]: /uxp/quickstart/aws-composition 
[azure]: /uxp/quickstart/azure-composition 
[gcp]:  /uxp/quickstart/gcp-composition
[operations]:  /uxp/quickstart/operation
[providers]:  /uxp/quickstart/external-resources