---
title: "Provider AWS"
weight: 1
description: Release notes for the AWS official provider
---

The below release notes are for the Upbound AWS official provider. These notes
only contain noteworthy changes and you should refer to each release's GitHub
release notes for full details.

For more information on the release cadence and support protocol refer to the
provider [support and maintenance]({{<ref "support" >}}) page.

<!-- vale Google.Headings = NO -->

{{< hint "important" >}}
 Beginning with `v1.21.0` and later, you need at least a `Team` subscription to pull a given Official Provider version.  All prior versions are pullable without a subscription. 
 If you're not subscribed to Upbound or have an `Individual` tier subscription, you can still always pull **the most recent provider version** using the `v1` tag.
 {{< /hint >}}

## v1.17.0

_Released 2024-11-07_

* Support for new resources: `JobQueue.batch.aws.upbound.io/v1beta1`
and `ComputeEnvironment.batch.aws.upbound.io/v1beta1`
* Upgraded the underlying Terraform provider version from `v5.68.0` to `5.73.0`
* This release also introduces new resources, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.17.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.17.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.17.0)

## v1.16.0

_Released 2024-10-23_

* This release introduces important bug fixes and dependency updates.

_Refer to the [v1.16.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.16.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.16.0)

## v1.15.0

_Released 2024-10-11_

* Support for new resources: `Pipeline.osis.aws.upbound.io/v1beta1`
and `Agent.bedrockagent.aws.upbound.io/v1beta1`
* Upgraded the underlying Terraform provider version from `v5.58.0` to `v5.68.0`
* This release also introduces new family providers, new resources, bug fixes, and dependency updates.

_Refer to the [v1.15.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.15.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.15.0)

## v1.14.0

_Released 2024-09-20_

* Support for new resources: `Region.account.aws.upbound.io/v1beta1`
and `GlobalReplicationGroup.elasticache.aws.upbound.io/v1beta1`
* This release introduces new resources, enhancements, and dependency updates.

_Refer to the [v1.14.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.14.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.14.0)

## v1.13.1

_Released 2024-09-16_

* This release fixes the issue of hiding error messages.

_Refer to the [v1.13.1 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.13.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.13.1)

## v1.13.0

_Released 2024-08-29_

* Support for new resources: `DirectoryBucket.s3.aws.upbound.io/v1beta1`
and `LBTrustStore.elbv2.aws.upbound.io/v1beta1`
* This release includes new resources and a bug fix.

_Refer to the [v1.13.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.13.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.13.0)

## v1.12.0

_Released 2024-08-23_

* This release includes support for pod-identity, fixing pod crashes caused
by panic, some other bug fixes, enhancements, and dependency updates.

_Refer to the [v1.12.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.12.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.12.0)

## v1.11.0

_Released 2024-08-08_

* Support for new resources: `AccessEntry.eks.aws.upbound.io/v1beta1`,
`AccessPolicyAssociation.eks.aws.upbound.io/v1beta1`, `ServerlessCache.elasticache.aws.upbound.io/v1beta1`
and `Fleet.ec2.aws.upbound.io/v1beta1` 
* This release includes new resources, enhancements, and dependency updates.

_Refer to the [v1.11.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.11.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.11.0)

## v1.10.0

_Released 2024-07-29_

* Update the AWS Terraform provider version to `v5.58.0`
* Support for a new resource: `Pipe.pipes.aws.upbound.io/v1beta1`
* This release includes a new resource, enhancements, and dependency updates.

_Refer to the [v1.10.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.10.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.10.0)

## v1.9.1

_Released 2024-07-26_

* This release includes a bug fix.

_Refer to the [v1.9.1 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.9.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.9.1)


## v1.9.0

_Released 2024-07-11_

* Support for new resources: `Environment.mwaa.aws.upbound.io/v1beta1` and
`ResourcePolicy.dynamodb.aws.upbound.io/v1beta1`
* This release includes a new family provider `provider-aws-mwaa`, new resources,
enhancements, and dependency updates.


_Refer to the [v1.9.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.9.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.9.0)

## v1.8.0

_Released 2024-06-27_

* Support for new resources: `Domain.codeartifact.aws.upbound.io/v1beta1`,
`DomainPermissionsPolicy.codeartifact.aws.upbound.io/v1beta1`, `Repository.codeartifact.aws.upbound.io/v1beta1`
and `RepositoryPermissionsPolicy.codeartifact.aws.upbound.io/v1beta1`
* This release includes a new family provider `provider-aws-codeartifact`, new
resources, bug fixes, and dependency updates.

_Refer to the [v1.8.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.8.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.8.0)

## v1.7.0

_Released 2024-06-13_

* This release includes converting singleton lists in the MR APIs to embedded objects, bug fixes, and dependency updates.

_Refer to the [v1.7.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.7.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.7.0)

## v1.6.1

_Released 2024-06-13_

* This release includes an important bug fix, please select the release notes for more details.

_Refer to the [v1.6.1 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.6.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.6.1)


## v1.6.0

_Released 2024-06-07_

* Support for new resources: `Connector.v1beta1.transfer.aws.upbound.io`,
`ProfilingGroup.v1beta1.codeguruprofiler.aws.upbound.io` and `EndpointAccess.v1beta1.redshift.aws.upbound.io`
* This release includes a new family provider `provider-aws-codeguruprofiler`, new
resources, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.6.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.6.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.6.0)

## v1.5.0

_Released 2024-05-24_

* Update the AWS Terraform provider version to `v5.50.0`
* Support for new resource: `User.v1alpha1.mq.aws.upbound.io`
* This release includes a new resource, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.5.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.5.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.5.0)

## v1.4.0

_Released 2024-04-25_

* This release includes a new set of managed resource (MR) metrics, bug fixes, enhancements, and dependency updates.

_Refer to the [v1.4.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.4.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.4.0)

## v1.3.1

_Released 2024-04-04_

* This release includes an important bug fix, please select the release notes for more details.

_Refer to the [v1.3.1 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.3.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.3.1)

## v1.3.0

_Released 2024-03-28_

* The release introduces a new family provider `provider-aws-kafkaconnect`, new resources, bug fixes, and dependency updates.
* This release also introduces a credential cache for IRSA authentication, which reduces the number of AWS `STS` calls
the provider makes.
* Support for New Resources: `User.memorydb.aws.upbound.io/v1beta1`, `Connector.kafkaconnect.aws.upbound.io/v1beta1`,
`CustomPlugin.kafkaconnect.aws.upbound.io/v1beta1` and `WorkerConfiguration.kafkaconnect.aws.upbound.io/v1beta1`

_Refer to the [v1.3.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.3.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.3.0)

## v1.2.1

_Released 2024-03-18_

* This release includes an important bug fix, please select the release notes for more details.

_Refer to the [v1.2.1 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.2.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.2.1)

## v1.2.0

_Released 2024-03-14_

* Sets a default `io.Discard` logger for the controller-runtime if debug logging isn't enabled.
* Refactors AWS client configuration logic with a single path.
* This release includes some important bug fixes, and updates of dependencies, please select the release notes for more details.

_Refer to the [v1.2.0 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.2.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.2.0)

## v0.47.4

_Released 2024-03-14_

* This release sets a default `io.Discard` logger for the controller-runtime if debug logging isn't enabled.

_Refer to the [v0.47.4 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v0.47.4) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.47.4)

## v1.1.1

_Released 2024-03-07_

* This release includes two important bug fixes, please select the release notes for more details.

_Refer to the [v1.1.1 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v1.1.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.1.1)

## v0.47.3

_Released 2024-03-07_

* This release includes two important bug fixes, please select the release notes for more details.

_Refer to the [v0.47.3 release notes](https://github.com/crossplane-contrib/provider-upjet-aws/releases/tag/v0.47.3) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.47.3)

## v0.47.2

_Released 2024-02-16_

* This release includes some important bug fixes and dependency bumps, please select the release notes for more details.

_Refer to the [v0.47.2 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.47.2) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.47.2)

## v1.1.0

_Released 2024-02-15_

* Support for new family provider: `provider-aws-opensearchserverless`
* Support for new resources: `StackSetInstance.cloudformation.aws.upbound.io/v1beta1`, `AccessPolicy.opensearchserverless.aws.upbound.io/v1beta1`,
`Collection.opensearchserverless.aws.upbound.io/v1beta1`, `LifecyclePolicy.opensearchserverless.aws.upbound.io/v1beta1`,
`SecurityConfig.opensearchserverless.aws.upbound.io/v1beta1`, `SecurityPolicy.opensearchserverless.aws.upbound.io/v1beta1`,
`VPCEndpoint.opensearchserverless.aws.upbound.io/v1beta1`
* The release introduces a new family provider, new resources, important bug fixes, dependency updates, and a new ProviderConfig API
for WebIdentity authentication.

_Refer to the [v1.1.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v1.1.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.1.0)


## v1.0.0

_Released 2024-02-01_

* Update the AWS Terraform provider version to v5.31.0
* Support for new resource: `PodIdentityAssociation.eks.aws.upbound.io/v1beta1`
* This release brings support for generating multi-version Custom Resource Definitions (CRDs) and CRD conversion webhooks.
* The release contains some important bug fixes, support `v1beta2` for some resources, adding a new resource, and updates of dependencies.

_Refer to the [v1.0.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v1.0.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.0.0)

## v0.47.1

_Released 2024-01-03_

* This release changes `assume_role_with_web_identity` provider configuration value from a map to a list as expected by the
corresponding Terraform provider schema and fixes some issues related to the `UserPoolClient.cognitoidp` resource.

_Refer to the [v0.47.1 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.47.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.47.1)

## v0.46.2

_Released 2024-01-03_

* This release changes `assume_role_with_web_identity` provider configuration value from a map to a list as expected by the
corresponding Terraform provider schema and fixes some issues related to the `UserPoolClient.cognitoidp` resource.

_Refer to the [v0.46.2 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.46.2) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.46.2)

## v0.47.0

_Released 2023-12-28_

* Support for new resource: `TopicRuleDestination.iot` and `Endpoint.sagemaker`
* The release contains some important bug fixes, adding new resources, and updates of dependencies.

_Refer to the [v0.47.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.47.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.47.0)

## v0.46.1

_Released 2023-12-18_

* The release contains two important bug fixes, for more details please select the release notes.

_Refer to the [v0.46.1 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.46.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.46.1)

## v0.46.0

_Released 2023-12-08_

* Support for new family provider: `provider-aws-identitystore`
* Support for new resources: `Group.identitystore`, `GroupMembership.identitystore`, `User.identitystore`,
`CustomerManagedPolicyAttachment.ssoadmin`, `InstanceAccessControlAttributes.ssoadmin` and `PermissionsBoundaryAttachment.ssoadmin`
* The release contains some bug fixes adding a new family provider, adding new resources, and updates of dependencies.

_Refer to the [v0.46.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.46.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.46.0)

## v0.45.0

_Released 2023-11-30_

* Support for new resource: `LBListenerCertificate.elbv2`
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.45.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.45.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.45.0)

## v0.42.1

_Released 2023-12-30_

* This release backports the [PR](https://github.com/upbound/provider-aws/pull/933) addressing the [regression](https://github.com/upbound/provider-aws/issues/929)
related to IAM roles and role policy attachments introduced in version `0.40.0`

_Refer to the [v0.42.1 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.42.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.42.1)

## v0.41.1

_Released 2023-12-30_

* This release backports the [PR](https://github.com/upbound/provider-aws/pull/933) addressing the [regression](https://github.com/upbound/provider-aws/issues/929)
related to IAM roles and role policy attachments introduced in version `0.40.0`

_Refer to the [v0.41.1 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.41.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.41.1)

## v0.40.1

_Released 2023-12-30_

* This release backports the [PR](https://github.com/upbound/provider-aws/pull/933) addressing the [regression](https://github.com/upbound/provider-aws/issues/929)
related to IAM roles and role policy attachments introduced in version `0.40.0`

_Refer to the [v0.40.1 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.40.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.40.1)

## v0.44.0

_Released 2023-11-16_

* In v0.44.0, the Upjet version upgraded to v1.0.0. This upgrade, brings a change with how interact with the underlying Terraform AWS provider.
Instead of interfacing with TF CLI, the new implementation consumes the Terraform provider's Go provider schema and invokes the CRUD functions registered
in that schema.
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.44.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.44.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.44.0)

## v0.43.1

_Released 2023-11-02_

* This release updates Crossplane Runtime to v1.14.1 which includes a fix in the retry mechanism while persisting the critical annotations.

_Refer to the [v0.43.1 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.43.1) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.43.1)

## v0.43.0

_Released 2023-10-26_

* Support for new resource: `ServerlessCluster.kafka`
* The release contains some bug fixes and updates of dependencies.

_Refer to the [v0.43.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.43.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.43.0)

## v0.42.0

_Released 2023-10-12_

* Support for new resources: `SecurityGroupEgressRule.ec2`, `SecurityGroupIngressRule.ec2`
* The release contains some bug fixes, updates of dependencies, and promoting granular management policies to Beta.

_Refer to the [v0.42.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.42.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.42.0)

## v0.41.0

_Released 2023-09-29_

* Support for new family provider: `provider-aws-redshiftserverless`
* Support for new resources: `ScramSecretAssociation.kafka`, `JobDefinition.batch`, `EndpointAccess.redshiftserverless`
`RedshiftServerlessNamespace.redshiftserverless`, `ResourcePolicy.redshiftserverless`,
`Snapshot.redshiftserverless`, `UsageLimit.redshiftserverless` and `Workgroup.redshiftserverless`
* The release contains some bug fixes and configuring the default poll jitter for the controllers.

_Refer to the [v0.41.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.41.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.41.0)

## v0.40.0

_Released 2023-08-31_

* Support for new resource: `RolePolicy.iam`
* The release contains the ability to define roles with `inline policy` 
and `managed policy arn` in the Role.iam resource and some bug fixes.

_Refer to the [v0.40.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.40.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.40.0)

## v0.39.0

_Released 2023-08-23_

* Support for new resources: `PrincipalAssociation.ram` and `ResourceShareAccepter.ram`
* The release contains some important bug fixes to the granular
management policies and a fix in the reconciliation logic of the Upjet runtime.
* Updated Terraform CLI to 1.5.5 to address CVEs in previous Terraform versions.

_Refer to the [v0.39.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.39.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.39.0)

## v0.38.0

_Released 2023-08-01_

* This release adds support for the `spec.initProvider` API and for the granular management
policies alpha feature.
* Bug fixes and enhancements.

_Refer to the [v0.38.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.38.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.38.0)

## v0.37.0

_Released 2023-06-27_

* ⚠️ The family providers now require Crossplane version v1.12.1 or later.
* Support for new resources: `datasync` and `route53_zone_association`.
* Bug fixes and enhancements

_Refer to the [v0.37.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.37.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.37.0)

## v0.36.0

_Released 2023-06-13_

* This release introduces the new [provider families architecture]({{<ref "provider-families">}}) for
the Upbound official AWS provider.
* Bug fixes and enhancements.

_Refer to the [v0.36.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.36.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.36.0)

## v0.35.0

_Released 2023-05-15_

* Update the AWS Terraform provider version to v4.66.0
* Adds [LocalStack](https://localstack.cloud/) support for testing.
* Various bug fixes and enhancements.

_Refer to the [v0.35.0 release notes](https://github.com/upbound/provider-aws/releases/tag/v0.35.0) for full details._

Install the provider from the [Upbound Marketplace](https://marketplace.upbound.io/providers/upbound/provider-family-aws/v0.35.0)

<!-- vale Google.Headings = YES -->
