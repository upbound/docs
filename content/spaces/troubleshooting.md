---
title: Troubleshooting
weight: 1000
description: A guide for troubleshooting an issue that occurs in a Space
---

Find guidance below on how to find solutions for issues you encounter when deploying and using an Upbound Space. Use the tips below as a supplement to the observability metrics discussed in the [Observability]({{<ref "spaces/observability.md">}}) page.

## General tips

Most issues fall into two general categories:

1. issues with the Spaces management plane
2. issues on a managed control plane

If your control plane doesn't reach a `Ready` state, it's indicative of the former. If your control plane is in a created and running state, but resources aren't reconciling, it's indicative of the latter.

### Spaces component layout

Run `kubectl get pods -A` against the cluster hosting a Space. You should see a variety of pods across several namespaces. It should look something like this:

```bash
NAMESPACE                                         NAME                                                              READY   STATUS    RESTARTS      AGE
cert-manager                                      cert-manager-6d6769565c-mc5df                                     1/1     Running   0             25m
cert-manager                                      cert-manager-cainjector-744bb89575-nw4fg                          1/1     Running   0             25m
cert-manager                                      cert-manager-webhook-759d6dcbf7-ps4mq                             1/1     Running   0             25m
ingress-nginx                                     ingress-nginx-controller-7f8ccfccc6-6szlp                         1/1     Running   0             25m
kube-system                                       coredns-5d78c9869d-4p477                                          1/1     Running   0             26m
kube-system                                       coredns-5d78c9869d-pdxt6                                          1/1     Running   0             26m
kube-system                                       etcd-kind-control-plane                                           1/1     Running   0             26m
kube-system                                       kindnet-8s7pq                                                     1/1     Running   0             26m
kube-system                                       kube-apiserver-kind-control-plane                                 1/1     Running   0             26m
kube-system                                       kube-controller-manager-kind-control-plane                        1/1     Running   0             26m
kube-system                                       kube-proxy-l68r8                                                  1/1     Running   0             26m
kube-system                                       kube-scheduler-kind-control-plane                                 1/1     Running   0             26m
local-path-storage                                local-path-provisioner-6bc4bddd6b-qsdjt                           1/1     Running   0             26m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   coredns-5dc69d6447-f56rh-x-kube-system-x-vcluster                 1/1     Running   0             21m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   crossplane-6b6d67bc66-6b8nx-x-upbound-system-x-vcluster           1/1     Running   0             20m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   crossplane-rbac-manager-78f6fc7cb4-pjkhc-x-upbound-s-12253c3c4e   1/1     Running   0             20m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   kube-state-metrics-7f8f4dcc5b-8p8c4                               1/1     Running   0             22m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   mxp-gateway-68f546b9c8-xnz5j-x-upbound-system-x-vcluster          1/1     Running   0             20m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   mxp-ksm-config-54655667bb-hv9br                                   1/1     Running   0             22m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   mxp-readyz-5f7f97d967-b98bw                                       1/1     Running   0             22m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   otlp-collector-56d7d46c8d-g5sh5-x-upbound-system-x-vcluster       1/1     Running   0             20m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   vcluster-67c9fb8959-ppb2m                                         1/1     Running   0             22m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   vcluster-api-6bfbccc49d-ffgpj                                     1/1     Running   0             22m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   vcluster-controller-7cc6855656-8c46b                              1/1     Running   0             22m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   vcluster-etcd-0                                                   1/1     Running   0             22m
mxp-706c49fa-5bb8-4a7e-9f41-2fc38ef4b065-system   vector-754b494b84-wljw4                                           1/1     Running   0             22m
mxp-system                                        mxp-charts-chartmuseum-7587f77558-8tltb                           1/1     Running   0             23m
upbound-system                                    crossplane-b4dc7b4c9-6hjh5                                        1/1     Running   0             25m
upbound-system                                    crossplane-contrib-provider-helm-ce18dd03e6e4-7945d8985-4gcwr     1/1     Running   0             24m
upbound-system                                    crossplane-contrib-provider-kubernetes-1f1e32c1957d-577756gs2x4   1/1     Running   0             24m
upbound-system                                    crossplane-rbac-manager-d8cb49cbc-gbvvf                           1/1     Running   0             25m
upbound-system                                    spaces-controller-6647677cf9-5zl5q                                1/1     Running   0             24m
upbound-system                                    spaces-router-bc78c96d7-kzts2                                     2/2     Running   0             24m
```

What you are seeing is:

- Pods in the `upbound-system` namespace are components required to run the management plane of the Space. This includes the `spaces-controller`, `spaces-router`, and install of UXP.
- Pods in the `mxp-{GUID}-system` namespace are components that collectively power a managed control plane. Notable callouts include pod names that look like `vcluster-api-{GUID}` and `vcluster-controller-{GUID}`, which are integral components of a managed control plane.
- Pods in other notable namespaces, including `cert-manager` and `ingress-nginx`, are prerequisite components that support a Space's successful operation.



### Troubleshooting tips for the Spaces management plane

Start by getting the status of all the pods in a Space:

1. Make sure the current context of your kubeconfig points at the Kubernetes cluster hosting your Space
2. Get the status of all the pods in the Space:
```bash
kubectl get pods -A
```
3. Scan the `Status` column to see if any of the pods report a status besides `Running`.
4. Scan the `Restarts` column to see if any of the pods have restarted.
5. If you notice a Status other than `Running` or see pods that restarted, you should investigate their events by running 
```bash
kubectl describe pod -n <namespace> <pod-name>
```

Next, inspect the status of objects and releases:

1. Make sure the current context of your kubeconfig points at the Kubernetes cluster hosting your Space
2. Inspect the objects in your Space. If any are unhealthy, describe those objects to get the events:
```bash
kubectl get objects
```
3. Inspect the releases in your Space. If any are unhealthy, describe those releases to get the events:
```bash
kubectl get releases
```

### Troubleshooting tips for managed control planes in a Space

General troubleshooting in a managed control plane starts by fetching the events of the control plane:

1. Make sure the current context of your kubeconfig points at the Kubernetes cluster hosting your Space
2. Run the following to fetch your control planes.
```bash
kubectl get ctp
```
3. Describe the control plane by providing its name, found in the preceding instruction.
```bash
kubectl describe ctp <control-plane-name>
```

## Issues

<!-- vale off -->
### Your managed control plane is stuck in a 'creating' state

#### Error: unknown field "ports" in io.k8s.api.networking.v1.NetworkPolicySpec

This error is emitted by a Helm release named `control-plane-host-policies` attempting to be installed by the Spaces software. The full error is:

_CannotCreateExternalResource failed to install release: unable to build kubernetes objects from release manifest: error validating "": error validating data: ValidationError(NetworkPolicy.spec): unknown field "ports" in io.k8s.api.networking.v1.NetworkPolicySpec_

This error may be caused by running a Space on an earlier version of Kubernetes than is supported (`v1.26 or later`). To resolve this issue, upgrade the host Kubernetes cluster version to 1.25 or later.

### Your Spaces install fails

#### Error: You tried to install a Space on a previous Crossplane installation

If you try to install a Space on an existing cluster that previously had Crossplane or UXP on it, you may encounter errors. Due to how the Spaces installer tests for the presence of UXP, it may detect orphaned CRDs that weren't cleaned up by the previous uninstall of Crossplane. You may need to manually [remove old Crossplane CRDs](https://docs.crossplane.io/latest/software/uninstall/) for the installer to properly detect the UXP prerequisite.

### Your managed control plane is not syncing from git

#### Error: You configured a spec.source but nothing is installing on your control plane

IF you are using the native [git integration]({{<ref "spaces/git-integration.md">}}) but do not see any evidence of the definition syncing, do the following:

1. Describe the git-synced control plane
```bash
kubectl describe ctp <your-ctp-name>
```
2. In the control plane's manifest, look under `status.source`. If git syncing is working, it shows a status like:
```yaml
Status:
  Source:
    Reference:  ref: refs/heads/main HEAD
    Revision:   f0b36607a3a5d836063ca42be8b229d3c0bdc1dc
```
3. In the events for your control plane, look for events emitted from `controlplane/source`.
4. Confirm the `PullInterval` is set within a valid range (at least 15 seconds or more).
5. Confirm the URL of the git Repository is correct.
6. Confirm the auth method in use is referencing a secret on the cluster that's configured correctly. You can find more details for configuring secrets for the git integration in the [documentation]({{<ref "spaces/git-integration.md#authentication-with-version-control-services">}}).

<!-- vale on -->