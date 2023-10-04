---
title: Cert-manager
weight: 250
description: A guide to deploying your own cert-manager into an Upbound Space
---

A Spaces deployment uses the [Certificate Custom Resource) from cert-manager to
provision certificates within the Space. This establishes a nice API boundary 
between what your platform may need and the Certificate requirements of a 
Space. 

<!-- vale gitlab.SentenceLength = NO -->
In the event you would like more control over the issuing Certificate Authority 
for your deployment or the deployment of cert-manager itself, this guide is for
you.
<!-- vale gitlab.SentenceLength = Yes -->

## Deploying
An Upbound Space deployment doesn't have any special requirements for the
cert-manager deployment itself. The only expectation is that cert-manager and 
the corresponding Custom Resources exist in the cluster.

You should be free to install cert-manager in the cluster in any way that makes
sense for your organization. You can find some [installation ideas] in the 
cert-manager docs.

## Issuers
<!-- vale write-good.Passive = NO -->
A default Upbound Space install includes a [ClusterIssuer]. This ClusterIssuer is
`selfSigned` issuer that other certificates are minted from. You have a couple 
of options available to you for changing the default deployment of the Issuer:
1. Changing the issuer name.
2. Providing your own ClusterIssuer.
<!-- vale write-good.Passive = YES -->

### Changing the issuer name
<!-- vale write-good.Passive = NO -->
The ClusterIssuer name is controlled by the `certificates.space.clusterIssuer`
Helm property. You can adjust this during installation by providing the
following parameter (assuming your new name is 'SpaceClusterIssuer'):
```shell
--set ".Values.certificates.space.clusterIssuer=SpaceClusterIssuer"
```
<!-- vale write-good.Passive = YES -->

<!-- vale Google.Headings = NO -->
### Providing your own ClusterIsser
<!-- vale Google.Headings = YES -->
To provide your own ClusterIssuer, you need to first setup your own 
ClusterIssuer in the cluster. The cert-manager docs have a variety of options
for providing your own. See the [Issuer Configuration] docs for more details.

Once you have your own ClusterIssuer set up in the cluster, you need to turn 
off the deployment of the ClusterIssuer included in the Spaces deployment.
To do that, provide the following parameter during installation:
```shell
--set ".Values.certificates.provision=false"
```

Considerations:
If your ClusterIssuer has a name that's different from the default name that
the Spaces installation expects ('spaces-selfsigned'), you need to also specify 
your ClusterIssuer name during install using:
```shell
--set ".Values.certificates.space.clusterIssuer=<your ClusterIssuer name>"
```

[cert-manager]: https://cert-manager.io/
[Certificate Custom Resource]: https://cert-manager.io/docs/usage/certificate/
[ClusterIssuer]: https://cert-manager.io/docs/concepts/issuer/
[installation ideas]: https://cert-manager.io/docs/installation/
[Issuer Configuration]: https://cert-manager.io/docs/configuration/