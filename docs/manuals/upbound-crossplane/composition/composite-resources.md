---
title: Composite Resources
sidebar_position: 2
description: Composite resources, an XR or XRs, represent a collection of related
  cloud resources.
---

A composite resource, or XR, represents a set of resources as a
single object. Crossplane creates composite resources when users
access a custom API, defined in the CompositeResourceDefinition. 

:::tip
Composite resources are a _composite_ of resources.  
A _Composition_ defines how to _compose_ the resources together.
:::

<details>
  <summary>What are XRs, XRDs and Compositions?</summary>
  A composite resource or XR (this page) is a custom API.

You use two Crossplane types to create a new custom API:

* A [Composite Resource Definition](/crossplane/composite-resource-definitions)
  (XRD) - Defines the XR's schema.
* A [Composition](/crossplane/compositions) - Configures how the XR creates
  other resources.
</details>

## Create composite resources

Creating composite resources requires a 
[Composition](/crossplane/compositions) and a 
[CompositeResourceDefinition](/crossplane/composite-resource-definitions) 
(XRD).  

The Composition defines the set of resources to create. The XRD defines the
custom API users call to request the set of resources.


XRDs define the API used to create a composite resource. For example, 
this <Hover label="xrd1" line="2">CompositeResourceDefinition</Hover>
creates a custom API endpoint 
<Hover label="xrd1" line="4">mydatabases.example.org</Hover>.

<div id="xrd1">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata: 
  name: mydatabases.example.org
spec:
  group: example.org
  names:
    kind: MyDatabase
    plural: mydatabases
  # Removed for brevity
```
</div>

When a user calls the custom API, 
<Hover label="xrd1" line="4">mydatabases.example.org</Hover>, 
Crossplane chooses the Composition to use based on the Composition's 
<Hover label="typeref" line="6">compositeTypeRef</Hover>

<div id="typeref">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-composition
spec:
  compositeTypeRef:
    apiVersion: example.org/v1alpha1
    kind: MyDatabase
  # Removed for brevity
```
</div>

The Composition
<Hover label="typeref" line="6">compositeTypeRef</Hover> matches the 
XRD <Hover label="xrd1" line="6">group</Hover> and 
<Hover label="xrd1" line="9">kind</Hover>.

Crossplane creates the resources defined in the matching Composition and
represents them as a single `composite` resource. 

```shell{copy-lines="1"}
kubectl get composite
NAME                    SYNCED   READY   COMPOSITION         AGE
my-composite-resource   True     True    my-composition      4s
```

### Composition selection

Select a specific Composition for a composite resource to use with 
<Hover label="compref" line="7">compositionRef</Hover>

:::important
The selected Composition must allow the composite resource to use it with a
`compositeTypeRef`. Read more about the `compositeTypeRef` field in the
[Enable Composite Resources](/crossplane/compositions#match-composite-resources)
section of the Composition documentation.
:::

<div id="compref">
```yaml
apiVersion: example.org/v1alpha1
kind: MyDatabase
metadata:
  namespace: default
  name: my-composite-resource
spec:
  crossplane:
    compositionRef:
      name: my-other-composition
  # Removed for brevity
```
</div>

A composite resource can also select a Composition based on labels instead of 
the exact name with a
<Hover label="complabel" line="7">compositionSelector</Hover>.

Inside the <Hover label="complabel" line="7">matchLabels</Hover> section
provide one or more Composition labels to match.

<div id="complabel">
```yaml
apiVersion: example.org/v1alpha1
kind: MyDatabase
metadata:
  namespace: default
  name: my-composite-resource
spec:
  crossplane:
    compositionSelector:
      matchLabels:
        environment: production
    # Removed for brevity
```
</div>

### Composition revision policy

Crossplane tracks changes to Compositions as 
[Composition revisions](/crossplane/composition-revisions) . 

A composite resource can use
a <Hover label="comprev" line="7">compositionUpdatePolicy</Hover> to
manually or automatically reference newer Composition revisions.

The default 
<Hover label="comprev" line="7">compositionUpdatePolicy</Hover> is 
"Automatic." Composite resources automatically use the latest Composition
revision. 

Change the policy to 
<Hover label="comprev" line="7">Manual</Hover> to prevent composite
resources from automatically upgrading.

<div id="comprev">
```yaml
apiVersion: example.org/v1alpha1
kind: MyDatabase
metadata:
  namespace: default
  name: my-composite-resource
spec:
  crossplane:
    compositionUpdatePolicy: Manual
    # Removed for brevity
```
</div>

### Composition revision selection

Crossplane records changes to Compositions as 
[Composition revisions](/crossplane/composition-revisions).    
A composite resource can
select a specific Composition revision.


Use <Hover label="comprevref" line="7">compositionRevisionRef</Hover> to
select a specific Composition revision by name.

For example, to select a specific Composition revision use the name of the
desired Composition revision. 

<div id="comprevref">
```yaml
apiVersion: example.org/v1alpha1
kind: MyDatabase
metadata:
  namespace: default
  name: my-composite-resource
spec:
  crossplane:
    compositionUpdatePolicy: Manual
    compositionRevisionRef:
      name: my-composition-b5aa1eb
    # Removed for brevity
```
</div>

:::note
Find the Composition revision name from 
<Hover label="getcomprev" line="1">kubectl get compositionrevision</Hover>

<div id="getcomprev">
```shell
kubectl get compositionrevision
NAME                         REVISION   XR-KIND        XR-APIVERSION            AGE
my-composition-5c976ad       1          mydatabases    example.org/v1alpha1     65m
my-composition-b5aa1eb       2          mydatabases    example.org/v1alpha1     64m
```
</div>
:::

A Composite resource can also select Composition revisions based on labels
instead of the exact name with a 
<Hover label="comprevsel" line="7">compositionRevisionSelector</Hover>.

Inside the <Hover label="comprevsel" line="7">matchLabels</Hover> 
section provide one or more Composition revision labels to match.


<div id="comprevsel">
```yaml
apiVersion: example.org/v1alpha1
kind: MyDatabase
metadata:
  namespace: default
  name: my-composite-resource
spec:
  crossplane:
    compositionRevisionSelector:
      matchLabels:
        channel: dev
    # Removed for brevity
```
</div>

### Pausing composite resources

<!-- vale Google.WordList = NO -->
Crossplane supports pausing composite resources. A paused composite resource
doesn't check or make changes on its external resources.
<!-- vale Google.WordList = YES -->

To pause a composite resource apply the 
<Hover label="pause" line="4">crossplane.io/paused</Hover> annotation. 

<div id="pause">
```yaml
apiVersion: example.org/v1alpha1
kind: MyDatabase
metadata:
  namespace: default
  name: my-composite-resource
  annotations:
    crossplane.io/paused: "true"
spec:
  # Removed for brevity
```
</div>

## Verify composite resources
Use 
<Hover label="getcomposite" line="1">kubectl get composite</Hover>
to view all the composite resources Crossplane created.

```shell{copy-lines="1",label="getcomposite"}
kubectl get composite
NAME                    SYNCED   READY   COMPOSITION         AGE
my-composite-resource   True     True    my-composition      4s
```

Use `kubectl get` for the specific custom API endpoint to view
only those resources.

```shell {copy-lines="1"}
kubectl get mydatabases
NAME                    SYNCED   READY   COMPOSITION        AGE
my-composite-resource   True     True    my-composition     12m
```

Use 
<Hover label="desccomposite" line="1">kubectl describe composite</Hover>
to view the linked 
<Hover label="desccomposite" line="16">Composition Ref</Hover>,
and unique resources created in the
<Hover label="desccomposite" line="22">Resource Refs</Hover>.


```yaml {copy-lines="1",label="desccomposite"}
kubectl describe composite my-composite-resource
Name:         my-composite-resource
Namespace:    default
API Version:  example.org/v1alpha1
Kind:         MyDatabase
Spec:
  Composition Ref:
    Name:  my-composition
  Composition Revision Ref:
    Name:                     my-composition-cf2d3a7
  Composition Update Policy:  Automatic
  Resource Refs:
    API Version:  s3.aws.m.upbound.io/v1beta1
    Kind:         Bucket
    Name:         my-composite-resource-fmrks
    API Version:  dynamodb.aws.m.upbound.io/v1beta1
    Kind:         Table
    Name:         my-composite-resource-wnr9t
# Removed for brevity
```

### Composite resource conditions

A composite resource has two status conditions: Synced and Ready.

Crossplane sets the Synced status condition to True when it's able to
successfully reconcile the composite resource. If Crossplane can't reconcile the
composite resource it'll report an error in the Synced condition.

Crossplane sets the Ready status condition to True when the composite resource's
composition function pipeline reports that all of its composed resources are
ready. If a composed resource isn't ready Crossplane will report it in the
Ready condition.

## Composite resource labels

Crossplane adds labels to composed resources to show their relationship to
other Crossplane components.

Crossplane adds the 
<Hover label="complabel" line="4"> crossplane.io/composite</Hover> label
to all composed resources. The label matches the name of the composite.
Crossplane applies the composite label to anyresource created by a composite,
creating a reference between the resource and owning composite resource. 

<div id="complabel">
```shell
kubectl describe mydatabase.example.org/my-database-x9rx9
Name:         my-database2-x9rx9
Namespace:    default
Labels:       crossplane.io/composite=my-database-x9rx9
```
</div>
