---
title: Interacting with Cloud & Connected Spaces
weight: 2
description: Common operations in Spaces
---

The end-user experience between Cloud Spaces and Connected Spaces is the same. The only difference is whether Upbound is hosting and administering it (Cloud Spaces) or you the customer are hosting and administering it (Connected Spaces).

## Spaces management

### Create a Space

You don't have to make Cloud Spaces, Upbound already has them available for you to use. If you want to make a Connected Space, first deploy a [Disconnected Space]({{<ref "all-spaces/self-hosted-spaces">}}), then [Connect to the Global Console]({{<ref "all-spaces/self-hosted-spaces/attach-detach">}}).

### Upgrade a Space

Version management of the Space isn't something you need to worry about in Cloud Spaces--Upbound handles that for you. If you want to upgrade a Connected Space, the Space administrator must follow the same instructions as upgrading a [Disconnected Space]({{<ref "/all-spaces/self-hosted-spaces/spaces-management#upgrade-a-space">}}).

### Downgrade a Space

Version management of the Space isn't something you need to worry about in Cloud Spaces--Upbound handles that for you. If you want to rollback a Connected Space, the Space administrator must follow the same instructions as downgrading a [Disconnected Space]({{<ref "/all-spaces/self-hosted-spaces/spaces-management#downgrade-a-space">}}).

### Uninstall a Space

You can't uninstall a Cloud Space from your org account. If you want to uninstall a Connected Space, the Space administrator should first [disconnect the Space]({{<ref "all-spaces/self-hosted-spaces/attach-detach">}}). Then, follow the same instructions as uninstalling a [Disconnected Space]({{<ref "all-spaces/self-hosted-spaces/spaces-management#uninstall-a-space">}}).

## Spaces APIs
