---
title: Create Project Schemas
sidebar_position: 4
description: Define your first API in your control plane project
---

Your control plane relies on an API to communicate with your external resources.
You can create an API with a Composite Resource Definition (XRD). XRDs are API
schemas that define the structure of your desired resources. You provide the
fields and acceptable values and your control plane can communicate with your
external systems based on that structure.

<!-- vale write-good.Passive = NO -->
<!-- vale Google.Headings = NO -->
<!-- vale Microsoft.HeadingAcronyms = NO -->
## Generate an XRD from a XRC
<!-- vale Google.Headings = YES -->
<!-- vale Microsoft.HeadingAcronyms = YES -->

Instead of creating an XRD from scratch, you can create an XRD that's based on a
Claim (XRC). Claims are the primary interface through which users provision
resources. Claims define the minimal input parameters required from users, which
the `up` CLI then interprets to generate a comprehensive resource
configuration schema.

### Generate an example claim

In the root folder of your control plane project, run the [up example generate][up-example-generate] command.

```shell
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: Bucket
What is the API group named?: platform.upbound.io
What is the API Version named?: v1alpha1
What is the metadata name?: example
What is the metadata namespace?: default
Successfully created resource and saved to examples/bucket/example.yaml
```

After following the interactive steps, you should have an empty claim generated
under `examples/bucket/example.yaml`. Next, open the claim file you generated,
and paste in the content below.

```yaml
apiVersion: platform.upbound.io/v1alpha1
kind: Bucket
metadata:
  name: example
  namespace: default
spec:
  parameters:
    versioning: true
    encrypted: true
    visibility: public
```

Claims contain configuration parameters in the `spec` object rather than the top
level like XRDs. Crossplane adds its own fields to the spec when it processes the XRD
at installation time.

<!-- vale Google.Headings = NO -->
### Generate the XRD
<!-- vale Google.Headings = YES -->

Next, run the `up xrd generate` command with the path to your example claim.

```shell
up xrd generate examples/bucket/example.yaml
```

The `up` CLI automatically generates the XRD and places it in
`apis/xbuckets/definition.yaml` in your directory. Open the XRD to examine the structure.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xbuckets.platform.upbound.io
spec:
  claimNames:
    kind: Bucket
    plural: buckets
  group: platform.upbound.io
  names:
    categories:
    - crossplane
    kind: XBucket
    plural: xbuckets
  versions:
  - name: v1alpha1
    referenceable: true
    schema:
      openAPIV3Schema:
        description: Bucket is the Schema for the Bucket API.
        properties:
          spec:
            description: BucketSpec defines the desired state of Bucket.
            properties:
              parameters:
                properties:
                  encrypted:
                    type: boolean
                  versioning:
                    type: boolean
                  visibility:
                    type: string
                type: object
          status:
            description: BucketStatus defines the observed state of Bucket.
            type: object
        required:
        - spec
        type: object
    served: true
status:
  controllers:
    compositeResourceClaimType:
      apiVersion: ""
      kind: ""
    compositeResourceType:
      apiVersion: ""
      kind: ""
```

## XRD construction
<!-- vale gitlab.FutureTense = NO -->
Generating XRDs from basic claims is the most efficient way to build your
schemas. In this section, you'll review an XRD to understand the parts of the
schema and how they relate back to your claims and compositions.

<!-- vale gitlab.FutureTense = YES -->
For the full example XRD, expand the XRD below.

<!--- TODO(tr0njavolta): collapsable XRD --->

<details>

<summary>Example XRD</summary>

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xbuckets.platform.upbound.io
spec:
  claimNames:
    kind: Bucket
    plural: buckets
  group: platform.upbound.io
  names:
    categories:
    - crossplane
    kind: XBucket
    plural: xbuckets
  versions:
  - name: v1alpha1
    referenceable: true
    schema:
      openAPIV3Schema:
        description: Bucket is the Schema for the Bucket API.
        properties:
          spec:
            description: BucketSpec defines the desired state of Bucket.
            properties:
              parameters:
                properties:
                  encrypted:
                    type: boolean
                  versioning:
                    type: boolean
                  visibility:
                    type: string
                type: object
          status:
            description: BucketStatus defines the observed state of Bucket.
            type: object
        required:
        - spec
        type: object
    served: true
status:
  controllers:
    compositeResourceClaimType:
      apiVersion: ""
      kind: ""
    compositeResourceType:
      apiVersion: ""
      kind: ""
```

### API versioning and kind

XRDs use Kubernetes-style API versioning for objects. Crossplane owns and
maintains the XRD objects' API version and kind.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
```
### `metadata`
The `metadata` section contains the identifying information for the XRD. This
example has a `name` that corresponds with the group. The control plane
registers this metadata when compositions or composite resources are requested.

* `name`
    ```yaml
    metadata:
      name: xbuckets.platform.upbound.io
    ```
<!-- vale write-good.TooWordy = NO -->
The `x` naming convention isn't a strict requirement, but helps
distinguish this as an XRD instead of the requested object itself.
<!-- vale write-good.TooWordy = YES -->

You must pluralize the resource type in this section. The schema and rules of this XRD
apply to all buckets created with it, not a specific instance of the resource.

The `.platform.upbound.io` is the group this XRD applies to. Group definition
conventions are covered in the `spec` section of this document.


### `spec`

The `spec` section defines the actual schema and behavior for your composite
resources. The `spec` can vary based on the kinds of resources and providers you
are using.


#### `group`
You can set the `group` field in a way that best meets your organization's needs.
In this example, `platform` describes the project name with `upbound.io` being
the organization's domain. This field is required.

`group: platform.upbound.io`

Your `group` name must be lowercase and follow DNS-style subdomain naming.

You can create your group names by function `data.upbound.io` , owner
`dba.engineering.upbound.io`, or cloud environment `aws-dbs.upbound.io`.

This group name is appended in the `metadata.name` field. Creating group names
allows your resources to be unique across domains.

#### `names`

This field is required.
<!--- TODO(tr0njavolta): moreinfo --->
```yaml
  names:
    categories:
    - crossplane
    kind: XBucket
    plural: xbuckets
```

#### `versions`

The `versions` section of an XRD defines the API version and schema of the set
of resources. This field is required.

##### `versions.name`

The `versions.name` is a required field that defines the API version of the composite resource. You
can explicitly declare the version of your API schema to capture changes to your
XRDs. You must manually add a new version when your API changes.

As your XRD changes you should format your versions as
`v<major><stability><revision>`. This XRD is the first created for these
resources and is named `v1alpha1`. As your API schema changes or matures, you
can update to `v1beta1`, `v1beta2`, and `v1` for production-ready APIs.


```yaml
  versions:
  - name: v1alpha1
```

##### **`spec.versions.referenceable`**

<!-- vale gitlab.SentenceLength = NO -->

A `referenceable` schema means Compositions can reference this XRD in
their `compositeTypeRef`. This field is required.


```yaml
    referenceable: true
```

**`spec.versions.schema.openAPIV3Schema`**

The `schema.openAPIV3Schema` standardizes the API schema in a format Crossplane
can parse.


```yaml
    schema:
      openAPIV3Schema:
```

##### **`spec.versions.schema.openAPIV3Schema.description`**

The `description` field is a string to document what this schema does.

```yaml
        description: Bucket is the Schema for the Bucket API.
```

##### **`spec.versions.schema.openAPIV3Schema.properties.spec`**

The `properties.spec` fields define the desired state of the resources in your
Composition. This field includes all the required parameters to provision and
manage the resource. In the example below, you must include if the bucket
encryption status, if the bucket supports versioning, and public visibility.

These fields aren't _declaring_ the values. The Composition includes
and declares these values.

The properties of your resources vary based on the resource type.

```yaml
        properties:
          spec:
            description: BucketSpec defines the desired state of Bucket.
            properties:
              parameters:
                properties:
                  encrypted:
                    type: boolean
                  versioning:
                    type: boolean
                  visibility:
                    type: string
                type: object
```

##### **`spec.versions.schema.openAPIV3Schema.properties.status`**


The `properties.status` field of the XRD allows you to assign a description for
the observed state of this resource.

```yaml
          status:
            description: BucketStatus defines the observed state of Bucket.
            type: object
```

##### **`spec.versions.required`**

The `required` field captures the requirements for your Composition to declare.

```yaml
      required:
        - spec
        type: object
```

##### **`spec.versions.served`**


`served` indicates that this version of the API is the current one to use. This field is required.

```yaml
    served: true
```


### `status`

Your control plane uses the `status` field to track the observed state of the
controllers that manage this composite resource.

```yaml
status:
  controllers:
    compositeResourceClaimType:
      apiVersion: ""
      kind: ""
    compositeResourceType:
      apiVersion: ""
      kind: ""
```
<!-- vale gitlab.FutureTense = NO -->
Because this XRD hasn't been referenced and called by a Composition, the status
fields are empty. Your control plane automatically updates these with values
when it creates a controller to assign to this resource.

## XRD design

To create an XRD based on your organization's needs, consider what resources and
services your users need provisioned.

1. First, identify your goals:
   1. What resources do you need to manage?
   2. What teams or users need these resources?
   3. What level of abstraction can you provide in the XRD to help your users
      self-serve these resources?
2. Plan your API design:
   1. What parameters should your users have control over?
   2. What are sensible defaults for other parameters?
   3. What settings should be explicitly denied?

With these questions answered, you can review your resource needs and find
information on the individual managed resources you require in the Upbound
Marketplace.

### Example

A team in your organization requires an RDS instance, an S3 instance for backups,
CloudWatch Alarms for monitoring, an `SNS` alert topic, and a Security Group with
ingress rules, you could create a claim including the resource parameters
that team needs:

<!-- vale gitlab.SentenceLength = YES -->
```yaml
apiVersion: db.example.org/v1alpha1
kind: ProductionDatabase
metadata:
  name: customer-db
spec:
  parameters:
    size: large
    engine: postgresql
    backupRetentionDays: 30
    alertEmail: dba@company.com
    cpuUtilizationThreshold: 75
    allowedCIDRs:
      - "10.0.0.0/16"
      - "172.16.0.0/12"
```

Then generate an XRD from that claim with `up xrd generate claim.yaml`:

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xproductiondatabases.db.example.org
spec:
  group: db.example.org
  names:
    categories:
    - crossplane
    kind: ProductionDatabase
    plural: productiondatabases
  versions:
  - name: v1alpha1
    referenceable: true
    schema:
      openAPIV3Schema:
        description: ProductionDatabase is the Schema for the ProductionDatabase API.
        properties:
          spec:
            description: ProductionDatabaseSpec defines the desired state of ProductionDatabase.
            properties:
              parameters:
                properties:
                  alertEmail:
                    type: string
                  allowedCIDRs:
                    items:
                      type: string
                    type: array
                  backupRetentionDays:
                    type: number
                  cpuUtilizationThreshold:
                    type: number
                  engine:
                    type: string
                  size:
                    type: string
                type: object
            type: object
          status:
            description: ProductionDatabaseStatus defines the observed state of ProductionDatabase.
            type: object
        required:
        - spec
        type: object
    served: true
```

</details>

#### Defining requirements and defaults

From this generated XRD, you can add more validation and requirements. For
example, to explicitly declare the allowed sizes and defaults of the database,
update the `properties.size` field in the `spec`.


```yaml
                    size:
                      type: string
                      enum: ["small", "medium", "large"]
                      default: "small"
                      description: "Size of the database instance"
```

<!-- vale gitlab.FutureTense = YES -->
<!-- vale write-good.Passive = YES -->

## Next steps

Next, learn how to [build compositions][build-compositions]
that reference your XRD using various programming languages.

[up-example-generate]: /reference/cli-reference
[build-compositions]: /guides/projects/authoring-compositions
