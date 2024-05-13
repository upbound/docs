---
title: Control Plane Groups
weight: 2
description: An introduction to the Control Plane Groups in Upbound
---

Control Plane Groups (or just, 'groups') are a logical grouping of one or more control planes with shared objects (such as secrets or backup configuration). Every group resides in a [Space]({{<ref "all-spaces" >}}) in Upbound.

## Management

### The 'default' group

Every Cloud Space in Upbound has a group named _default_ available. Think of a group as being analogous to a Kubernetes _namespace_.

### Create a group

To create a group, login to Upbound and set your context to your desired Space:

```shell
up web-login
up ctx '<your-org>/<your-space>'
# Example: up ctx acmeco/upbound-gcp-us-west-1
```

Create a group:

```shell
up group create my-new-group
```

### Delete a group

To delete a group, login to Upbound and set your context to your desired Space:

```shell
up web-login
up ctx '<your-org>/<your-space>'
# Example: up ctx acmeco/upbound-gcp-us-west-1
```

Delete a group:

```shell
up group delete my-new-group
```


