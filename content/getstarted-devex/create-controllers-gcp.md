---
title: "APIs and Controllers for AWS"
description: "Define a control plane for resource abstractions in AWS"
---
APIs and Controllers for AWS
Now that you have an idea of how Upbound works in a [development environment](link to 101), let's take a look at creating real resources.

The Relation Database Server (RDS) resource allows you to operate and maintain a relational database in the cloud. Crossplane can provision, scale, and manage your RDS instance with continuous reconciliation and a declarative IaC workflow.

In this guide, you are responsible for enabling your development teams to deploy and configure AWS infrastructure as your company expands its online services. The development team plans to launch several new microservices and your organization relies heavily on AWS services like RDS and S3 storage.

To streamline this process, you decide to build a resource abstraction using Upbound. You'll create an API that enables self-service deployments of RDS instances and other infrastructure. This reusable and extensible API allows your dev team to launch and manage additional services themselves. With the Upbound control plane model, you can provision, scale, and manage RDS instances with a declarative Infrastructure-as-Code workflow. You'll have the added benefit of reliable continuous reconciliation and avoid infrastructure drift.

This guide walks you through defining a control plane, how to provide APIs for self-service infrastructure, and how Upbound helps streamline your infrastructure workflow.

Overview

By the end of this guide, you'll have Composite Resources that define your AWS resources. You'll have an API that exposes a set of inputs for reusability. You'll have a control plane project with the API to reliably interact with your cloud provider resources. In this guide, you'll create a Composite Resource to deploy a set of AWS resources. You'll build this with Crossplane with the following steps:

Creating a control plane object
Defining the schema for an API to provision an RDS instance, subnet group, and parameter group
Defining parameters to make the API reusable across multiple services
Implementing a controller to manage the API using Crossplane's composition
Setting up outputs to send necessary data back to teams, like RDS endpoint names or IP addresses

Prerequisites
Before starting, ensure you're familiar with AWS, including key concepts like accounts, regions, VPCs, and resources. You will need the following software installed locally: 
Before you begin, make sure you have:

The up CLI installed
An AWS account
Visual Studio Code

For an introduction to the Upbound workflow, review the [Upbound CLI](link to 101) guide.
Create a control plane project

First, create and initialize a new project directory with up project init. The `up project` command pulls down the necessary scaffolding files for your project.

up project init up-aws-rds

Change into your project directory. You'll notice that you have new files and subdirectories:


$ tree .
├── LICENSE
├── apis
├── examples
└── upbound.yaml

The upbound.yaml file is the entry point for your project and will contain basic information about your project. Initially this file contains placeholders for your project. 


apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  creationTimestamp: null
  name: up-aws-rds
spec:
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
	This is where you can add a readme for your project.
  repository: xpkg.upbound.io/example/project-template
  source: github.com/upbound/project-template

Upbound uses the YAML markup language to build your APIs and configurations. 

Let's analyze this file first to get a basic understanding of how Upbound builds with this file type - sometimes referred to as a Kubernetes manifest. You don't have to be a Kubernetes expert to build with Upbound, but parsing this structure is helpful going forward.

The first three fields apiVersion, kind, and metadata contain specific values to help Upbound deploy your desired infrastructure.

| Field | Description |
| :---- | :---- |
| `apiVersion` |  |
| `kind` |  |
| `metadata` |  |

The spec section is the most important part of any manifest file as it contains the specifications for whatever kind you are creating. In this case, the spec contains information about the project you're creating. We'll see more about specs in the next section and how they change based on the kind of object you are creating.
Add project dependencies
Generate a Composite Resource Definition

Your project now contains the base-level information required to go forward. Now, let's create some infrastructure packages. 

Crossplane and Upbound use Composite Resource Definitions (XRDs) to define the parameters of your desired infrastructure. These yaml files look similar to Kubernetes manifests like our project definition with 

[Tabs]
[Tab] [YAML]

apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xrds.devex.com

The apiVersion field defines the API group and version of the resource you're creating. For example, in this scenario, add dbaas.upbound.io/v1alpha1 . This is the group and version of the API you are currently creating and how your other composition components will be referenced.

The kind specifies what you are creating in this file. In this case, it's CompositeResourceDefinition. Defining the kind makes sure your control plane knows how to process the information you give it in this file

The metadata field applies identifying information to the object you are creating. We'll give this XRD the name `rds.devex.com` so we can search for it easily.


The spec section is where you begin to define the schema for the resources you want to create. This creates the general shape of your desired infrastructure and everything required to build those objects in your cloud provider.


spec:
  defaultCompositionRef:
    name: aws-rds
  group: devex.com
  names:
    kind: SQL
    plural: sqls
  claimNames:
    kind: SQLClaim
    plural: sqlclaims
  connectionSecretKeys:
  - username
  - password
  - endpoint
  - port




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
              id:
                type: string
                description: Database ID
              parameters:
                type: object
                properties:
                  version:
                    type: string
                    description: The DB version depends on the DB type and versions available in AWS.
                  size:
                    type: string
                    description: 'Supported sizes: small, medium, large'
                    default: small
                  databases:
                    type: array
                    description: The list of databases to create inside the DB server.
                    items:
                      type: string
                  region:
                    type: string
                    description: The region where the DB server should run. The default value is `us-east-1`.
                  schemas:
                    type: array
                    description: Database schema. Atlas operator (https://atlasgo.io/integrations/kubernetes/operator) needs to be installed in the cluster. Leave empty if schema should NOT be applied.
                    items:
                      type: object
                      properties:
                        database:
                          type: string
                          description: The name of the database where to apply the schema.
                        sql:
                          type: string
                          description: The SQL to apply.
                  secrets:
                    type: object
                    description: Pushing and pulling secrets from a secret store. External Secrets Operator must be installed for this feature to work.
                    properties:
                      storeName:
                        type: string
                        description: The name of the secret store to use.
                      pullRootPasswordKey:
                        type: string
                        description: The key in the secrets store with the secret with the root password.
                      pushToStore:
                        type: boolean
                        description: Whether to push DB credentials to the secret store.
                        default: false
                      pullToCluster:
                        type: string
                        description: To which cluster to push the DB credentials.
                      pullToClusterNamespace:
                        type: string
                        description: To which Namespace to push the DB credentials.
                      daprComponents:
                        type: boolean
                        description: Whether to create a Dapr components for the DBs. `pullToCluster` needs to be set to `true` to use this feature. If enabled, Dapr needs to be installed in the destination cluster (directly or through OpenFunction).
                required:
                - size
                - version
            required:
            - id
            - parameters
          status:
            type: object
            properties:
              address:
                type: string
                description: Database instance address



[/Tab]
[Tab] [KCL]

apiVersion = "apiextensions.crossplane.io/v1"
kind = "CompositeResourceDefinition"

metadata = {
	name = "rds.devex.com"
}

spec = {
	defaultCompositionRef = {
    	name = "aws-rds"
	}
	group = "devex.com"
	names = {
    	kind = "SQL"
    	plural = "sqls"
	}
	claimNames = {
    	kind = "SQLClaim"
    	plural = "sqlclaims"
	}
	connectionSecretKeys = ["username", "password", "endpoint", "port"]
	versions = [{
    	name = "v1alpha1"
    	served = True
    	referenceable = True
    	schema = {
        	openAPIV3Schema = {
            	type = "object"
            	properties = {
                	spec = {
                    	type = "object"
                    	properties = {
                        	id = {
                            	type = "string"
                            	description = "Database ID"
                        	}
                        	parameters = {
                            	type = "object"
                            	properties = {
                                	version = {
                                    	type = "string"
                                    	description = "The DB version depends on the DB type and versions available in AWS."
                                	}
                                	size = {
                                    	type = "string"
                                    	description = "Supported sizes: small, medium, large"
                                    	default = "small"
                                	}
                                	databases = {
                                    	type = "array"
                                    	description = "The list of databases to create inside the DB server."
                                    	items = {
                                        	type = "string"
                                    	}
                                	}
                                	region = {
                                    	type = "string"
                                    	description = "The region where the DB server should run. The default value is `us-east-1`."
                                	}
                                	schemas = {
                                    	type = "array"
                                    	description = "Database schema. Atlas operator (https://atlasgo.io/integrations/kubernetes/operator) needs to be installed in the cluster. Leave empty if schema should NOT be applied."
                                    	items = {
                                        	type = "object"
                                        	properties = {
                                            	database = {
                                                	type = "string"
                                                	description = "The name of the database where to apply the schema."
                                            	}
                                            	sql = {
                                                	type = "string"
                                                	description = "The SQL to apply."
                                            	}
                                        	}
                                    	}
                                	}
                                	secrets = {
                                    	type = "object"
                                    	description = "Pushing and pulling secrets from a secret store. External Secrets Operator must be installed for this feature to work."
                                    	properties = {
                                        	storeName = {
                                            	type = "string"
                                            	description = "The name of the secret store to use."
                                        	}
                                        	pullRootPasswordKey = {
                                            	type = "string"
                                            	description = "The key in the secrets store with the secret with the root password."
                                        	}
                                        	pushToStore = {
                                            	type = "boolean"
                                            	description = "Whether to push DB credentials to the secret store."
                                            	default = False
                                        	}
                                        	pullToCluster = {
                                            	type = "string"
                                            	description = "To which cluster to push the DB credentials."
                                        	}
                                        	pullToClusterNamespace = {
                                            	type = "string"
                                            	description = "To which Namespace to push the DB credentials."
                                        	}
                                        	daprComponents = {
                                            	type = "boolean"
                                            	description = "Whether to create a Dapr components for the DBs. `pullToCluster` needs to be set to `true` to use this feature. If enabled, Dapr needs to be installed in the destination cluster (directly or through OpenFunction)."
                                        	}
                                    	}
                                	}
                            	}
                            	required = ["size", "version"]
                        	}
                    	}
                    	required = ["id", "parameters"]
                	}
                	status = {
                    	type = "object"
                    	properties = {
                        	address = {
                            	type = "string"
                            	description = "Database instance address"
                        	}
                    	}
                	}
            	}
        	}
    	}
	}]
}
[/Tab]

[/Tabs]



Let's apply this XRD to your Upbound cluster.


$


This XRD file is the template of the resources you want to create, but does not create any actual resources in your cloud provider. Instead, when you apply this XRD, you're essentially giving Upbound the ability to make decisions about resources based on your parameters here. 

This XRD creates a controller on your cluster. A controller is a set of services that reconcile your desired infrastructure state (your composition) with your actual infrastructure state (your cloud provider resources). The controller performs continuous checks against your real-world cloud resources and determines if they meet the specifications you set in your composition. For example, if you want to create an EC2 instance with a dev metadata tag, the controller will constantly check the instance after it's deployed to ensure that no out of sync changes take place, like another user changing the tag to qa. If the infrastructure is out of sync, the controller will use the composition specification as API endpoints and change or recreate your infrastructure.

In order to create actual resources with Upbound, we'll need to tell Upbound what to do based on the definitions above.
Composition

[Tabs]
[Tab] [YAML]


apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: aws-rds
  labels:
    provider: aws
spec:
  writeConnectionSecretsToNamespace: crossplane-system
  compositeTypeRef:
    apiVersion: devex.com/v1alpha1
    kind: SQL
  resources:
  - name: rdsinstance
    base:
      apiVersion: database.aws.crossplane.io/v1beta1
      kind: RDSInstance
      spec:
        forProvider:
          dbInstanceClass: db.t3.micro
          engine: mysql
          engineVersion: '8.0'
          masterUsername: masteruser
          allocatedStorage: 20
          region: us-east-1
          skipFinalSnapshotBeforeDeletion: true
          publiclyAccessible: false
          vpcSecurityGroupIDRefs:
          - name: my-vpc-sg
        writeConnectionSecretToRef:
          namespace: crossplane-system
          name: rds-conn
  - name: rdssecuritygroup
    base:
      apiVersion: ec2.aws.crossplane.io/v1beta1
      kind: SecurityGroup
      spec:
        forProvider:
          description: RDS security group
          groupName: rds-sg
          region: us-east-1
          ingress:
          - fromPort: 3306
            toPort: 3306
            protocol: tcp
            ipRanges:
            - cidrIp: '0.0.0.0/0'
          vpcIdRef:
            name: my-vpc

[/Tab]
[Tab] [KCL]
apiVersion = "apiextensions.crossplane.io/v1"
kind = "Composition"

metadata = {
	name = "aws-rds"
	labels = {
    	"provider" = "aws"
	}
}

spec = {
	writeConnectionSecretsToNamespace = "crossplane-system"
	compositeTypeRef = {
    	apiVersion = "devex.com/v1alpha1"
    	kind = "SQL"
	}
	resources = [
    	{
        	name = "rdsinstance"
        	base = {
            	apiVersion = "database.aws.crossplane.io/v1beta1"
            	kind = "RDSInstance"
            	spec = {
                	forProvider = {
                    	dbInstanceClass = "db.t3.micro"
                    	engine = "mysql"
                    	engineVersion = "8.0"
                    	masterUsername = "masteruser"
                    	allocatedStorage = 20
                    	region = "us-east-1"
                    	skipFinalSnapshotBeforeDeletion = True
                    	publiclyAccessible = False
                    	vpcSecurityGroupIDRefs = [
                        	{
                            	name = "my-vpc-sg"
                        	}
                    	]
                	}
                	writeConnectionSecretToRef = {
                    	namespace = "crossplane-system"
                    	name = "rds-conn"
                	}
            	}
        	}
    	}
    	{
        	name = "rdssecuritygroup"
        	base = {
            	apiVersion = "ec2.aws.crossplane.io/v1beta1"
            	kind = "SecurityGroup"
            	spec = {
                	forProvider = {
                    	description = "RDS security group"
                    	groupName = "rds-sg"
                    	region = "us-east-1"
                    	ingress = [
                        	{
                            	fromPort = 3306
                            	toPort = 3306
                            	protocol = "tcp"
                            	ipRanges = [
                                	{
                                    	cidrIp = "0.0.0.0/0"
                                	}
                            	]
                        	}
                    	]
                    	vpcIdRef = {
                        	name = "my-vpc"
                    	}
                	}
            	}
        	}
    	}
	]
}


[/Tab]
[/Tabs]

Provider Configuration



Build your configuration

Deploy to Upbound


