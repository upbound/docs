---
title: Install Hub
weight: 1
description: Install a self-hosted Hub deployment on a Kubernetes cluster using Helm.
validation:
  type: procedural
  owner: docs@upbound.io
  tags:
    - procedural
    - hub
    - installation
---

This guide installs Hub on a Kubernetes cluster in self-hosted mode. If you use Upbound Cloud, Hub is pre-installed — see [Connect a control plane][connectCP] to register your first cluster.

## Prerequisites

- A Kubernetes cluster version 1.24 or later, with cluster-admin access
- [up CLI][upCLI] v1.x or later
- Helm 3.x
- An OIDC provider: AWS IAM, Google Cloud Identity, Azure Entra ID, or a compatible custom provider
- At least one UXP instance, Space, OSS Crossplane cluster, or Kubernetes cluster to connect after installation

## Install Hub

1. Add the Upbound Helm repository.

   ```shell
   helm repo add upbound https://charts.upbound.io
   helm repo update
   ```

2. Create a namespace for Hub.

   ```shell
   kubectl create namespace upbound-hub
   ```

3. Configure your OIDC provider.

   ```shell
   up hub configure
   ```

   Enter your OIDC issuer URL, client ID, and client secret when prompted. You can also set these values directly in a `values.yaml` file for the Helm install step.

4. Install Hub.

   ```shell
   helm install hub upbound/hub \
     --namespace upbound-hub \
     --values values.yaml
   ```

5. Verify the installation.

   ```shell
   kubectl rollout status deployment/hub -n upbound-hub
   ```

   Hub is ready when the output shows `successfully rolled out`.

The Hub Console is available at the endpoint defined in your `values.yaml`.

## Connect a control plane

1. Create a Realm to group your control planes.

   ```shell
   up hub realm create myteam
   ```

2. Generate a registration token for the Realm.

   ```shell
   up hub connect --realm myteam
   ```

   The command outputs a registration token. Copy it for the next step.

3. Apply the token on the target control plane.

   ```shell
   kubectl apply -f <token>
   ```

4. Verify the connection.

   ```shell
   up hub connect list
   ```

   The control plane appears in the list with a `Connected` status.

5. Open the Hub Console and go to **Control Plane APIs**. Your newly connected cluster is visible there.

## Next steps

- [Use the Hub Console][console] — Explore dashboards and resource views
- [Manage Realms][realms] — Configure access control and add control planes to Realms
- [Run global queries][queries] — Use `up query` to search resources across your fleet

[connectCP]: ./connect-control-plane.md
[console]: ./console.md
[realms]: ./manage-realms.md
[queries]: ./run-queries.md
[upCLI]: /manuals/cli/overview
