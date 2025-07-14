---
Title: Spaces Deployment Modes
sidebar_position: 1
description: Learn about the deployment options for Upbound Spaces
---

# Overview

Upbound Spaces are hosting environments for Upbound's managed Crossplane control
planes. Upbound offers several deployment modes to help you meet your organizations
operational requirements.

## Cloud Spaces

Cloud Spaces are multi-tenant deployments of Upbound, operated by Upbound inside
our ready-made cloud environments. With Cloud Spaces, you get a fully managed SaaS
experience, control planes, hosting infrastructure management, persistent storage
management, and backup and restore management. Upbound hosts Cloud Spaces in multiple Cloud
Service Providers and regions. 

## Connected Spaces

Connected Spaces are single-tenant deployments in your infrastructure with
Upbound's operational support. Upbound handles maintenance, upgrades, and
monitoring. Organizations with data residency or compliance requirements can
still take advantage of Upbound's operational management with Connected Spaces.

## Dedicated Spaces

Dedicated Spaces are single-tenant deployments in your cloud account with
infrastructure managed by Upbound. Upbound handles the operational tasks of your
control plane in a cloud environment you control. Dedicated Spaces work well for
organizations adhering to strict data residency requirements.

## Disconnected Spaces

Disconnected Spaces are single-tenant deployments in your infrastructure where
you control all operations and managment. Disconnected Spaces work well for
organizations with strict data control or air-gapped environments.


## Choosing your deployment mode

| Requirement | Cloud | Connected | Dedicated | Disconnected |
|--|--|--|--|--|
| Zero operational overhead | Yes | Yes | Yes | No |
| Data in your infrastructure | No | Yes | Yes | Yes |
| Air-gapped environments | No | No | No | Yes |
| Upbound operational support | Yes | Yes |Yes | No |
| Single-tenant | No | Yes | Yes | Yes |

## Self-hosted deployment requirements

:::important
All self-hosted deployment models require a **Business Critical** tier Upbound
account.
:::


The minimum host Kubernetes cluster configuration Upbound recommends is a 2 worker node setup. By default, Upbound recommends one node for operating the Spaces management pods, leaving the remaining worker nodes to host your control planes.

The minimum recommended node pool VM configuration for each cloud provider is:


| Cloud Provider | VM configuration | Cores | Memory |
| -------------- | ---------------- | ----- | ------ |
| AWS            | m5.large         | 2     | 8      |
| Azure          | Standard_D2_v3   | 2     | 8      |
| GCP            | e2-standard-2    | 2     | 8      |

For detailed sizing guidance, review the [self-hosted deployment planning
guide][guide].


[guide]: /upbound/guides/backup-and-restore
<!--- TODO(tr0njavolta): links --->
## Next Steps

- For Cloud Spaces - free trial
- For Dedicated Spaces - contact upbound
- For Connected Spaces - self-hosted qs
- For Disconnected Spaces - self-hosted qs
