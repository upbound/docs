---
title: AWS Deployment Guide
weight: 2
description: A guide to Upbound Dedicated Spaces on AWS
aliases:
    - /all-spaces/dedicated-spaces/aws
    - /spaces
    - /all-spaces/disconnected-spaces
---

<!-- vale gitlab.SentenceLength = NO -->
{{< hint "important" >}}
This feature is only available for select Business Critical customers. You can't set up your own Dedicated Space without the assistance of Upbound. If you're interested in this deployment mode, please [contact us](https://www.upbound.io/support/contact).
{{< /hint >}}

A Dedicated Space deployed on AWS is a single-tenant deployment of a control plane space in your AWS organization in an isolated sub-account. With Dedicated Spaces, you can use the same API, CLI, and Console that Upbound offers, with the benefit of running entirely in a cloud account that you own and Upbound manages for you.

The following guide walks you through setting up a Dedicated Space in your AWS organization. If you have any questions while working through this guide, contact your Upbound Account Representative for help.

<!-- vale Google.Headings = NO -->
## Dedicated Space on AWS architecture

A Dedicated Space is a deployment of the Upbound Spaces software inside an Upbound-controlled sub-account in your AWS cloud environment. The Spaces software runs in this sub-account, orchestrated by Kubernetes. Backups and billing data get stored inside bucket or blob storage in the same sub-account. The managed control planes deployed and controlled by the Spaces software runs on the Kubernetes cluster which gets deployed into the sub-account.

The diagram below illustrates the high-level architecture of Upbound Dedicated Spaces:

{{<img src="deploy/dedicated-spaces/images/managed-arch-aws.png" alt="Upbound Dedicated Spaces arch" unBlur="true">}}

The Spaces software gets deployed on an EKS Cluster in the region of your choice. This EKS cluster is where your managed control planes are ultimately run. Upbound also deploys buckets, 1 for the collection of the billing data and 1 for control plane backups.

Upbound doesn't have access to other sub-accounts nor your organization-level settings in your cloud environment. Outside of your cloud organization, Upbound runs the Upbound Console, which includes the Upbound API and web application, including the dashboard you see at `console.upbound.io`. By default, all connections are encrypted, but public. Optionally, you also have the option to use private network connectivity through [AWS PrivateLink](#configure-privatelink).

## Prerequisites

- An organization created on Upbound
- You should have a preexisting AWS organization to complete this guide. 
- You must create a new AWS sub-account. Read the [AWS documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html#orgs_manage_accounts_create-new) to learn how to create a new sub-account in an existing organization on AWS.

After the sub-account information gets provided to Upbound, **don't change it any further.** Any changes made to the sub-account or the resources created by Upbound for the purposes of the Dedicated Space deployments voids the SLA you have with Upbound. If you want to make configuration changes, contact your Upbound Solutions Architect.

## Set up cross-account management

Upbound supports using AWS Key Management Service with cross-account IAM permissions. This enables the isolation of keys so the infrastructure operated by Upbound has limited access to symmetric keys.

In the KMS key's account, apply the baseline key policy:

```json
{
  "Sid": "Allow Upbound to use this key",
  "Effect": "Allow",
  "Principal": {
    "AWS": ["[Dedicated Space sub-account ID]"]
  },
  "Action": ["kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey"],
  "Resource": "*"
}
```

You need another key policy to let the sub-account create persistent resources with the KMS key:

```json
{
  "Sid": "Allow attachment of persistent resources for an Upbound Dedicated Space",
  "Effect": "Allow",
  "Principal": {
    "AWS": "[Dedicated Space sub-account ID]"
  },
  "Action": ["kms:CreateGrant", "kms:ListGrants", "kms:RevokeGrant"],
  "Resource": "*",
  "Condition": {
    "Bool": {
      "kms:GrantIsForAWSResource": "true"
    }
  }
}
```

### Configure PrivateLink

By default, all connections to the Upbound Console are encrypted, but public. AWS PrivateLink is a feature that allows VPC peering whereby your traffic doesn't traverse the public internet. To have this configured, contact your Upbound Account Representative.

## Provide information to Upbound

Once these policies get attached to the key, tell your Upbound Account Representative, providing them the following:

- the full ARN of the KMS key. 
- the name of the organization that you created in Upbound. Use the up CLI command, `up org list`, so see this information.
- Confirmation of which region in AWS you want the deployment to target.

Once Upbound has this information, the request gets processed in a business day. 

## Use your Dedicated Space

Once the Dedicated Space gets deployed, you can see it in the Space selector when browsing your environment on [`console.upbound.io`](https://console.upbound.io/).
<!-- vale gitlab.SentenceLength = YES -->
<!-- vale Google.Headings = YES -->
