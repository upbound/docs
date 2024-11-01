---
title: "Conditionals (if)"
weight: 60
---

The `if` expression allows you to optionally compose resources based on
conditions you set. An `if` expression includes a condition that resolves to
`True` or `False`. When the `if` condition resolves to true, the function
composes the resource. When false, the resource isn't created.

## Define condition for composing

In your function, you can conditionally compose a resource based on a true or
false parameter you set. The example below conditionally deploys a VPC. When
`deployVPC` is true, your control plane continues the function to create the
VPC. When false, the function skips the VPC creation.
```yaml
oxr = option("params").oxr

awsVpc = v1beta1.VPC {
    spec.forProvider = {
        cidrBlock: var.cidr if oxr.spec.parameters.useIpamPool else ""
        ipv6CidrBlock: var.ipv6Cidr
        ipv6IpamPoolId: var.ipv6IpamPoolId
        ipv6NetmaskLength: var.ipv6NetmaskLength
        ipv6CidrBlockNetworkBorderGroup: var.ipv6CidrBlockNetworkBorderGroup
        assignGeneratedIpv6CidrBlock: True if var.enableIpv6 and not var.useIpamPool else False
        instanceTenancy: var.instanceTenancy
        enableDnsHostnames: var.enableDnsHostnames
        enableDnsSupport: var.enableDnsSupport
        enableNetworkAddressUsageMetrics: var.enableNetworkAddressUsageMetrics
    }
} if oxr.spec.parameters.deployVPC else {}

items = [awsVpc]
```