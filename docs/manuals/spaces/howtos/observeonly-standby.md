---
title: Warm Standby Control Planes with ObserveOnly Management Policies
sidebar_position: 14
description: Maintain a warm standby control plane that mirrors your primary and can be promoted to active in minutes using Crossplane's ObserveOnly management policy.
---

A warm standby control plane is a secondary control plane that continuously observes the same cloud resources as the primary but makes no changes to them. When the primary fails, you promote the standby by switching it from `ObserveOnly` to full management mode. Because the standby already has a current view of cloud state, reconciliation begins immediately — no rediscovery required.

This pattern delivers significantly lower RTO than backup/restore DR. See [Designing for RTO and RPO in Upbound][rto-rpo] for a comparison.

## Prerequisites

- Spaces `v1.9.0` or later
- Crossplane `v1.14.0` or later (Composition Functions GA)
- Composition Functions enabled and in use (the management policy must be set dynamically inside the pipeline; static patches are not sufficient at scale)
- Network connectivity from the standby control plane to the same cloud APIs as the primary
- The standby control plane must have the same providers and ProviderConfigs as the primary

## How ObserveOnly works for warm standby

When a managed resource is set to `managementPolicies: [ObserveOnly]`, the provider continuously reads the external resource's current state and reflects it in `.status` — but makes no mutations. The resource remains fully live in the control plane's etcd, with up-to-date status conditions, connection details, and observed field values.

This matters for failover: when you promote the standby by changing the policy to `["*"]`, Crossplane doesn't start from scratch. It has a current picture of external state and immediately begins reconciling any delta rather than rediscovering thousands of resources.

## Setting the role signal with EnvironmentConfig

Managing `managementPolicies` at the individual managed resource level doesn't scale. A production platform may have thousands of managed resources across hundreds of Compositions. You need a single control signal that propagates automatically across all of them.

The recommended approach is an `EnvironmentConfig` that carries a `role` field:

```yaml
apiVersion: apiextensions.crossplane.io/v1alpha1
kind: EnvironmentConfig
metadata:
  name: cluster-role
data:
  role: standby  # or: primary
```

Apply this to the standby control plane with `role: standby` and to the primary with `role: primary`. Your Compositions read this field and set `managementPolicies` accordingly.

## Writing a standby-aware Composition

In each Composition, add a pipeline stage that reads the `cluster-role` EnvironmentConfig and sets `managementPolicies` dynamically.

A minimal pipeline using KCL:

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-composition
spec:
  compositeTypeRef:
    apiVersion: example.upbound.io/v1alpha1
    kind: XMyResource
  mode: Pipeline
  pipeline:
    - step: read-environment
      functionRef:
        name: function-environment-configs
      input:
        apiVersion: environmentconfigs.fn.crossplane.io/v1beta1
        kind: Input
        spec:
          environmentConfigs:
            - type: Reference
              ref:
                name: cluster-role
    - step: set-management-policy
      functionRef:
        name: function-kcl
      input:
        apiVersion: krm.kcl.dev/v1alpha1
        kind: KCLInput
        spec:
          target: Resources
          source: |
            role = option("params").ctx["apiextensions.crossplane.io/environment"].role
            mgmt_policy = ["ObserveOnly"] if role == "standby" else ["*"]

            items = [{
              **item,
              "spec": {
                **item.spec,
                "managementPolicies": mgmt_policy
              }
            } for item in option("params").items]
    - step: render-resources
      functionRef:
        name: function-crossplane-upjet
```

When you change the `cluster-role` EnvironmentConfig, every Composition picks up the change on the next reconcile and propagates it to all its managed resources. One write updates thousands of resources within one reconciliation cycle.

## Minimal quickstart

To set up a warm standby for an existing control plane:

1. **Create the standby control plane** — provision a new control plane with the same providers, provider configurations, and compositions as the primary.

2. **Apply the role EnvironmentConfigs** — on the primary control plane:
   ```bash
   kubectl apply -f - <<EOF
   apiVersion: apiextensions.crossplane.io/v1alpha1
   kind: EnvironmentConfig
   metadata:
     name: cluster-role
   data:
     role: primary
   EOF
   ```
   On the standby control plane:
   ```bash
   kubectl apply -f - <<EOF
   apiVersion: apiextensions.crossplane.io/v1alpha1
   kind: EnvironmentConfig
   metadata:
     name: cluster-role
   data:
     role: standby
   EOF
   ```

3. **Update your Compositions** — add the pipeline stages shown above to each Composition. On the next reconcile, managed resources on the standby will transition to `ObserveOnly`.

4. **Verify the standby** — after one reconciliation cycle, check that managed resources on the standby show `ObserveOnly` in their `managementPolicies` and that `.status` fields are populated:
   ```bash
   kubectl get managed -o custom-columns=\
   'NAME:.metadata.name,POLICY:.spec.managementPolicies,SYNCED:.status.conditions[?(@.type=="Synced")].status'
   ```

## Manual failover procedure

If the primary control plane becomes unavailable:

1. **Verify the primary is down** — confirm the failure before promoting the standby. Accidental dual-active promotion can cause resource conflicts.

2. **Promote the standby** — patch the role signal on the standby:
   ```bash
   kubectl patch environmentconfig cluster-role \
     --type=merge -p '{"data":{"role":"primary"}}'
   ```

3. **Monitor policy transitions** — watch managed resources transition from `ObserveOnly` to full management:
   ```bash
   kubectl get managed -w
   ```
   Resources should begin reconciling within one reconciliation cycle (typically 30–60 seconds).

4. **Redirect traffic** — update DNS or ingress to point at the standby control plane's endpoint.

5. **Demote the primary before recovery** — when the primary comes back online, ensure it is set to `role: standby` **before** it begins reconciling. If the primary recovers and finds itself still set to `role: primary`, two controllers will compete to manage the same cloud resources.

## Advanced: Automated failover

:::info
Automated failover requires additional operational complexity. Evaluate whether your RTO target justifies this complexity before implementing it.
:::

You can remove the manual step from failover by adding a "heartbeat composition" to the standby control plane — a dedicated XR whose sole purpose is to check primary health. Its pipeline includes a function that calls the primary's health endpoint or a cloud-native health probe (Route53 health check, Azure Traffic Manager endpoint).

A simplified heartbeat pipeline:

```
HeartbeatComposition pipeline:
  1. function-http  → GET https://primary-endpoint/healthz
  2. function-kcl   → if status != 200 for N cycles: patch EnvironmentConfig role=primary
  3. function-auto-ready → set XR to ready based on computed state
```

If the primary has been unreachable for N consecutive reconcile cycles, the function patches the standby's `cluster-role` EnvironmentConfig, promoting it automatically. No external HA controller is required — the reconciliation loop itself is the HA mechanism.

## Advanced: Split-brain fencing

Automated promotion creates split-brain risk: if the primary is slow rather than dead, you may briefly have two active controllers both attempting to manage the same cloud resources. Mitigate this with one of the following approaches:

### Fencing via cross-cluster write

Before the standby promotes itself, its Operations Function attempts to demote the primary by writing `role: standby` to the primary's `cluster-role` EnvironmentConfig. This requires cross-cluster API access, which you model as a `ProviderConfig` pointing at the primary cluster.

- If the primary is reachable, it demotes gracefully before the standby promotes.
- If the primary is unreachable, proceed with promotion.

### External lease (recommended for production)

Use a cloud-native distributed lock as the promotion authority. Only the holder of the lease may set `role: primary`. An Operations Function on each control plane competes for the lease on a heartbeat interval.

| Cloud provider | Lease mechanism |
|---|---|
| AWS | DynamoDB conditional write (`ConditionExpression: attribute_not_exists`) |
| Azure | Azure Blob Storage lease (blob lease acquisition) |
| GCP | GCS object with generation-match condition |

If the primary stops renewing the lease, the standby wins the next write and promotes itself. This is the most robust design.

### Accept the overlap window

For many use cases, a brief overlap is acceptable. Crossplane uses `external-name` to identify resources, so two controllers reconciling the same managed resource against the same cloud resource ARN converge on the same state rather than creating duplicates. The risk is an update conflict during the overlap window. Whether this is acceptable depends on the resource types in use.

## Pattern summary

| Layer | Mechanism | Purpose |
|---|---|---|
| Role signal | `EnvironmentConfig` | Single source of truth for primary/standby |
| Policy propagation | Composition Function (KCL) | Translates role into `managementPolicies` on all managed resources |
| Health detection | Operations Function with HTTP check | Detects primary failure |
| Auto-promotion | Operations Function writing to EnvironmentConfig | Removes manual failover step |
| Split-brain fencing | External lease or cross-cluster write | Ensures only one active controller |
| Failover confirmation | `kubectl get managed` watching policy transitions | Observable, auditable cutover |

## Limitations

- **Cross-cluster network connectivity required for fencing** — automated fencing requires the standby's Operations Function to reach the primary's API server. Firewall rules must permit this.
- **Same ProviderConfigs on both control planes** — the standby must have credentials that can access the same cloud accounts as the primary.
- **ObserveOnly does not prevent creation of new resources** — if a new managed resource is created on the primary after the standby is set to standby mode, it will appear on the standby on the next sync. The standby will observe it but not attempt to create it.

## See also

- [Designing for RTO and RPO in Upbound][rto-rpo] — understand how this pattern compares to backup/restore
- [Backup and Restore][backup-and-restore] — configure scheduled backups as a complementary safety net
- [Disaster Recovery][dr] — Space-level backup and restore for total Space loss scenarios
- [Disaster Recovery Runbook][dr-runbook] — step-by-step recovery procedures including standby promotion

[rto-rpo]: /manuals/spaces/concepts/rto-rpo
[backup-and-restore]: /manuals/spaces/howtos/backup-and-restore
[dr]: /manuals/spaces/howtos/self-hosted/dr
[dr-runbook]: /manuals/spaces/howtos/dr-runbook
