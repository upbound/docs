---
title: "Secrets Management"
weight: 3
description: "A guide for how to integrate control planes with a variety of interfaces"
---

Kubernetes [secrets](https://kubernetes.io/docs/concepts/configuration/secret/) are objects that contain some sensitive data. In the case of Crossplane, that could be credentials for a provider, connection details to a resource, or inputs that need to be passed to managed resources at creation time. Our baseline recommendation is to just use Kubernetes secrets. If you have business requirements that preclude this because you need to integrate Crossplane with a centralized secret management solution, we will document below how to do that.

### Reading secrets

To read secrets from an external source into your Crossplane cluster, we recommend installing the [External Secrets Operator](https://external-secrets.io) into your cluster. The External Secrets Operator is an open-source tool that implements a custom resource called `ExternalSecret` that defines where secrets live. You can configure this object to point to a centralized secret store (such as Vault, AWS Key Secrets Manager, etc).

### Writing secrets

By default, Crossplane writes secrets to a Kubernetes secret in its cluster. Most commmonly, when you create a resource that generates connection details, this will get written to a local Kubernetes secret in the cluster. If you need to write secrets to a centralized secret management solution, you can rely on the fact that a secret is "just another Crossplane resource" in this case.