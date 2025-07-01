---
title: Composite Resource Definitions
weight: 20
description: "Composite Resource Definitions or XRDs define custom API schemas"
---

Composite resource definitions (`XRDs`) define the schema for a custom API.  
Users create composite resources (`XRs`) using the API schema defined by an
XRD.


:::note
Read the [composite resources](/crossplane/composite-resources) page for more
information about composite resources.
:::

<details>
<summary> "What are XRs, XRDs and Compositions?" </summary>
<!--- TODO(tr0njavolta): link --->
<!-- A [composite resource](/crossplane/composite-resources) or XR is a custom API. -->

You use two Crossplane types to create a new custom API:

* A Composite Resource Definition (XRD) - This page. Defines the XR's schema. 
* A [Composition](/crossplane/compositions) - Configures how the XR creates
  other resources.
</details>

Crossplane XRDs are like 
[Kubernetes custom resource definitions](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/). 
XRDs require fewer fields and add options related to Crossplane, like connection
secrets. 

## Creating a CompositeResourceDefinition

Creating a CompositeResourceDefinition consists of:
* [Defining a custom API group](#xrd-groups).
* [Defining a custom API name](#xrd-names).
* [Defining a custom API schema and version](#xrd-versions).
  
Optionally, CompositeResourceDefinitions also support:
* [Setting composite resource defaults](#set-composite-resource-defaults).
 
Composite resource definitions (`XRDs`) create new API endpoints inside a
Kubernetes cluster. 

Creating a new API requires defining an API 
<Hover label="xrd1" line="6">group</Hover> 
<Hover label="xrd1" line="7">name</Hover> 
<Hover label="xrd1" line="10">version</Hover> .

<div id="xrd1">
```yaml 
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata: 
  name: mydatabases.example.org
spec:
  group: example.org
  names:
    kind: XMyDatabase
    plural: mydatabases
  versions:
  - name: v1alpha1
  # Removed for brevity
```
</div>

After applying an XRD, Crossplane creates a new Kubernetes custom resource
definition matching the defined API.

For example, the XRD
<Hover label="xrd1" line="4">mydatabases.example.org</Hover> creates a custom
resource definition
<Hover label="kubeapi" line="2">mydatabases.example.org</Hover> .

<div id="kubeapi">

```shell
kubectl api-resources
NAME                              SHORTNAMES   APIVERSION          NAMESPACED   KIND
mydatabases.example.org                        v1alpha1            true         mydatabases
# Removed for brevity
```
</div>
:::warning
You can't change the XRD

<Hover label="xrd1" line="6">group</Hover> or
<Hover label="xrd1" line="7">name</Hover> 
You must delete and
recreate the XRD to change the 
<Hover label="xrd1" line="6">group</Hover> or
<Hover label="xrd1" line="7">name</Hover> 
:::


### XRD groups

Groups define a collection of related API endpoints. The `group` can be any
value, but common convention is to map to a fully qualified domain name.

<!-- vale write-good.Weasel = NO -->
Many XRDs may use the same `group` to create a logical collection of APIs.  
<!-- vale write-good.Weasel = YES -->
For example a `database` group may have a `relational` and `nosql` kinds. 

### XRD names

The `names` field defines how to refer to this specific XRD.  
The required name fields are: 

* `kind` - the `kind` value to use when calling this API. The kind is
  [UpperCamelCased](https://kubernetes.io/docs/contribute/style/style-guide/#use-upper-camel-case-for-api-objects).
  Crossplane recommends starting XRD `kinds` with an `X` to show 
  it's a custom Crossplane API definition. 
* `plural` - the plural name used for the API URL. The plural name must be
  lowercase. 

:::warning
The XRD 

<Hover label="xrdName" line="4">metadata.name</Hover> must be
<Hover label="xrdName" line="9">plural</Hover> name, `.` (dot character),
<Hover label="xrdName" line="6">group</Hover>.

For example, <Hover label="xrdName" line="4">mydatabases.example.org</Hover> matches the <Hover label="xrdName" line="9">plural</Hover> name
<Hover label="xrdName" line="9">mydatabases</Hover>, `.` 
<Hover label="xrdName" line="6">group</Hover> name, 
<Hover label="xrdName" line="6">example.org</Hover>.

<div id="xrdName">
```yaml

apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata: 
  name: mydatabases.example.org
spec:
  group: example.org
  names:
    kind: XMyDatabase
    plural: mydatabases
    # Removed for brevity
```

</div>

:::


### XRD versions

<!-- vale gitlab.SentenceLength = NO -->
The XRD `version` is like the 
[API versioning used by Kubernetes](https://kubernetes.io/docs/reference/using-api/#api-versioning).
The version shows how mature or stable the API is and increments when changing,
adding or removing fields in the API.
<!-- vale gitlab.SentenceLength = YES -->

Crossplane doesn't require specific versions or a specific version naming 
convention, but following 
[Kubernetes API versioning guidelines](https://kubernetes.io/docs/reference/using-api/#api-versioning)
is strongly recommended. 

* `v1alpha1` - A new API that may change at any time.
* `v1beta1` - An existing API that's considered stable. Breaking changes are
  strongly discouraged.
* `v1` - A stable API that doesn't have breaking changes. 

#### Define a schema

<!-- vale write-good.Passive = NO -->
<!-- vale write-good.TooWordy = NO -->
The `schema` defines the names
of the parameters, the data types of the parameters and which parameters are
required or optional. 
<!-- vale write-good.Passive = YES -->
<!-- vale write-good.TooWordy = YES -->

:::note
All `schemas` follow the Kubernetes custom resource definition 
[OpenAPIv3 structural schema](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).
:::

Each 
<Hover label="schema" line="11">version</Hover> of the API has a unique 
<Hover label="schema" line="12">schema</Hover>. 

All XRD <Hover label="schema" line="12">schemas</Hover> validate against
the <Hover label="schema" line="13">openAPIV3Schema</Hover>. The schema
is an OpenAPI 
<Hover label="schema" line="14">object</Hover> with the 
<Hover label="schema" line="15">properties</Hover> of a 
<Hover label="schema" line="16">spec</Hover>
<Hover label="schema" line="17">object</Hover>.

Inside the <Hover label="schema" line="18">spec.properties</Hover> is the custom
API definition.

In this example, the key <Hover label="schema" line="19">region</Hover>
is a <Hover label="schema" line="20">string</Hover>.

<div id="schema">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatabases.custom-api.example.org
spec:
  group: custom-api.example.org
  names:
    kind: xDatabase
    plural: xdatabases
  versions:
  - name: v1alpha1
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              region:
                type: string
    # Removed for brevity
```
</div>

A composite resource using this API references the 
<Hover label="xr" line="1">group/version</Hover> and 
<Hover label="xr" line="2">kind</Hover>. The 
<Hover label="xr" line="5">spec</Hover> has the 
<Hover label="xr" line="6">region</Hover> key with a string value. 

<div id="xr">
```yaml
apiVersion: custom-api.example.org/v1alpha1
kind: xDatabase
metadata:
  name: my-composite-resource
spec: 
  region: "US"
```
</div>


:::tip
The custom API defined inside the 
<Hover label="schema" line="18">spec.properties</Hover> is an OpenAPIv3
specification. The 
[data models page](https://swagger.io/docs/specification/data-models/) of 
the Swagger documentation provides a list of examples using data types and input
restrictions. 

The Kubernetes documentation lists 
[the set of special restrictions](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation)
on what your OpenAPIv3 custom API can use.
:::

:::important
Changing or expanding the XRD schema requires restarting the [Crossplane pod](/crossplane/guides/pods#crossplane-pod) to take effect.
:::

##### Required fields

By default all fields in a schema are optional. Define a parameter as required
with the 
<Hover label="required" line="25">required</Hover> attribute. 

In this example the XRD requires 
<Hover label="required" line="19">region</Hover> and 
<Hover label="required" line="21">size</Hover> but
<Hover label="required" line="23">name</Hover> is optional. 
<div id="required">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatabases.custom-api.example.org
spec:
  group: custom-api.example.org
  names:
    kind: xDatabase
    plural: xdatabases
  versions:
  - name: v1alpha1
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              region:
                type: string 
              size:
                type: string  
              name:
                type: string  
            required: 
              - region 
              - size
    # Removed for brevity
```
</div>

According to the OpenAPIv3 specification, the `required` field is per-object. If
a schema contains multiple objects the schema may need multiple `required`
fields.

This XRD defines two objects:
 1. the top-level <Hover label="required2" line="7">spec</Hover> object
 2. a second <Hover label="required2" line="14">location</Hover> object

The <Hover label="required2" line="7">spec</Hover> object 
<Hover label="required2" line="23">requires</Hover> the 
<Hover label="required2" line="10">size</Hover> and 
<Hover label="required2" line="14">location</Hover> but 
<Hover label="required2" line="12">name</Hover> is optional.

Inside the required <Hover label="required2" line="14">location</Hover> 
object,
<Hover label="required2" line="17">country</Hover> is 
<Hover label="required2" line="21">required</Hover> and
<Hover label="required2" line="19">zone</Hover> is optional.

```yaml {copy-lines="none",label="required2"}
# Removed for brevity
- name: v1alpha1
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              size:
                type: string  
              name:
                type: string 
              location:
                type: object
                properties:
                  country: 
                    type: string 
                  zone:
                    type: string
                required:
                  - country
            required:  
              - size
              - location
```

The Swagger "[Describing Parameters](https://swagger.io/docs/specification/describing-parameters/)"
documentation has more examples. 

##### Crossplane reserved fields

Crossplane doesn't allow the following fields in a schema:
* Any field under the object `spec.crossplane`
* Any field under the object `status.crossplane`
* `status.conditions`

Crossplane ignores any fields matching the reserved fields.

#### Serve and reference a schema

To use a schema it must be
<Hover label="served" line="12">served: true</Hover>
and 
<Hover label="served" line="13">referenceable: true</Hover>.

<div id="served">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatabases.custom-api.example.org
spec:
  group: custom-api.example.org
  names:
    kind: xDatabase
    plural: xdatabases
  versions:
  - name: v1alpha1
    served: true
    referenceable: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              region:
                type: string            
```
</div>

Composite resources can use any schema version set as 
<Hover label="served" line="12">served: true</Hover>.  
Kubernetes rejects any composite resource using a schema version set as `served:
false`.

:::tip
Setting a schema version as `served:false` causes errors for users using an older
schema. This can be an effective way to identify and upgrade users before
deleting the older schema version.
:::

The <Hover label="served" line="13">referenceable: true</Hover>
field indicates which version of the schema Compositions use. Only one
version can be `referenceable`. 

:::note
Changing which version is `referenceable:true` requires [updating the `compositeTypeRef.apiVersion`](/crossplane/compositions#match-composite-resources) 
of any Compositions referencing that XRD.
:::


#### Multiple schema versions

:::warning
Crossplane supports defining multiple `versions`, but the schema of each version
can't change any existing fields, also called "making a breaking change."

Breaking schema changes between versions requires the use of [conversion webhooks](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#webhook-conversion).

New versions may define new optional parameters, but new required fields are
a "breaking change."

<!-- vale Crossplane.Spelling = NO -->
<!-- ignore to allow for CRDs -->
<!-- don't add to the spelling exceptions to catch when it's used instead of XRD -->
Crossplane XRDs use Kubernetes custom resource definitions for versioning. 
Read the Kubernetes documentation on 
[versions in CustomResourceDefinitions](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)
for more background on versions and breaking changes. 
<!-- vale Crossplane.Spelling = YES -->

Crossplane recommends implementing breaking schema changes as brand new XRDs.
:::

For XRDs, to create a new version of an API add a new 
<Hover label="ver" line="21">name</Hover> in the
<Hover label="ver" line="10">versions</Hover>
list. 

For example, this XRD version 
<Hover label="ver" line="11">v1alpha1</Hover> only has the field 
<Hover label="ver" line="19">region</Hover>.

A second version, 
<Hover label="ver" line="21">v1</Hover> expands the API to have both 
<Hover label="ver" line="29">region</Hover> and 
<Hover label="ver" line="31">size</Hover>.

<div id="ver">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatabases.custom-api.example.org
spec:
  group: custom-api.example.org
  names:
    kind: xDatabase
    plural: xdatabases
  versions:
  - name: v1alpha1
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              region:
                type: string  
  - name: v1
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              region:
                type: string 
              size:
                type: string            
```
</div>

:::important
Changing or expanding the XRD schema requires restarting the [Crossplane pod](/crossplane/guides/pods#crossplane-pod) to take effect.
:::

### Set composite resource defaults
XRDs can set default parameters for composite resources.

<!-- vale off -->
#### defaultCompositionRef
<!-- vale on -->
It's possible for multiple [Compositions](/crossplane/compositions) to
reference the same XRD. If more than one Composition references the same XRD,
the composite resource must select which Composition to use. 

An XRD can define the default Composition to use with the
`defaultCompositionRef` value. 

Set a
<Hover label="defaultComp" line="6">defaultCompositionRef</Hover> 
to set the default Composition.

<div id="defaultComp">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatabases.custom-api.example.org
spec:
  defaultCompositionRef: 
    name: myComposition
  group: custom-api.example.org
  names:
  # Removed for brevity
  versions:
  # Removed for brevity
```
</div>

<!-- vale off -->
#### defaultCompositionUpdatePolicy
<!-- vale on -->

Changes to a Composition generate a new Composition revision. By default all
composite resources use the updated Composition revision. 

Set the XRD `defaultCompositionUpdatePolicy` to `Manual` to prevent composite
resources from automatically using the new revision. 

The default value is `defaultCompositionUpdatePolicy: Automatic`.

Set <Hover label="compRev" line="6">defaultCompositionUpdatePolicy: Manual</Hover>
to set the default Composition update policy for composite resources and using
this XRD.

<div id="compRev">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatabases.custom-api.example.org
spec:
  defaultCompositionUpdatePolicy: Manual
  group: custom-api.example.org
  names:
  # Removed for brevity
  versions:
  # Removed for brevity
```
</div>

<!-- vale off -->
#### enforcedCompositionRef
<!-- vale on -->
To require all composite resources to use a specific Composition use the
`enforcedCompositionRef` setting in the XRD.

For example, to require all composite resources using this XRD to use the
Composition 
<Hover label="enforceComp" line="6">myComposition</Hover> 
set 
<Hover label="enforceComp" line="6">enforcedCompositionRef.name: myComposition</Hover>.

<div id="defaultComp">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatabases.custom-api.example.org
spec:
  enforcedCompositionRef: 
    name: myComposition
  group: custom-api.example.org
  names:
  # Removed for brevity
  versions:
  # Removed for brevity
```
</div>

## Verify a CompositeResourceDefinition

Verify an XRD with `kubectl get compositeresourcedefinition` or the short form, 
<Hover label="getxrd" line="1">kubectl get xrd</Hover>.

<div id="getxrd">
```yaml
kubectl get xrd                                
NAME                                ESTABLISHED   OFFERED   AGE
xdatabases.custom-api.example.org   True          True      22m
```
</div>

The `ESTABLISHED` field indicates Crossplane installed the Kubernetes custom
resource definition for this XRD.

### XRD conditions
Crossplane uses a standard set of `Conditions` for XRDs.  
View the conditions of a XRD under their `Status` with 
`kubectl describe xrd`. 

```yaml {copy-lines="none"}
kubectl describe xrd
Name:         xpostgresqlinstances.database.starter.org
API Version:  apiextensions.crossplane.io/v1
Kind:         CompositeResourceDefinition
# Removed for brevity
Status:
  Conditions:
    Reason:                WatchingCompositeResource
    Status:                True
    Type:                  Established
# Removed for brevity
```

<!-- vale off -->
#### WatchingCompositeResource
<!-- vale on -->
`Reason: WatchingCompositeResource` indicates Crossplane defined the new
Kubernetes custom resource definitions related to the composite resource and is 
watching for the creation of new composite resources. 

```yaml
Type: Established
Status: True
Reason: WatchingCompositeResource
```

<!-- vale off -->
#### TerminatingCompositeResource
<!-- vale on -->
`Reason: TerminatingCompositeResource` indicates Crossplane is deleting the
custom resource definitions related to the composite resource and is 
terminating the composite resource controller.

```yaml
Type: Established
Status: False
Reason: TerminatingCompositeResource
```
