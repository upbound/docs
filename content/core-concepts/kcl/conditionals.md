---
title: "Conditionals (if)"
weight: 60
---

To optionally compose a resource in your function, use the `if` expression. An `if` expression includes a condition that resolves to true or false. When the `if` condition is true, the resource is composed. When the value is false, the resource isn't created.

## Define condition for composing

In your function, you can conditionally compose a resource by passing in a parameter that specifies whether the resource is deployed. You test the condition with an `if` expression in the resource declaration. The following example shows the syntax for an `if` expression in a Bicep file. It conditionally deploys a VPC. When `deployVPC` is true, it composes the VPC. When `deployVPC` is false, it skips composing the VPC.

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