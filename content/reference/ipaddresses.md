---
title: IP Addresses
weight: 199
---

<!-- vale off -->
## IP Addresses

Upbound Infrastructure uses the following egress addresses for hosted control
planes:
- 35.238.181.48
- 35.185.250.95
- 34.72.41.44 
- 35.238.114.228 

{{< hint "note" >}}
Upbound reserves the right to change this
list of IP addresses.
{{< /hint >}}

## Allow List

If you or your organization wish to restrict IP addresses that can acccess APIs, you will
need to add the above list to your cloud provider(s) and Github. 

Please consult the official documentation of your Cloud Provider:
- [AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_deny-ip.html)
- [Azure](https://learn.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions?tabs=azurecli)
- [GCP](https://cloud.google.com/vpc-service-controls/docs/set-up-private-connectivity)
- [Github](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization)
