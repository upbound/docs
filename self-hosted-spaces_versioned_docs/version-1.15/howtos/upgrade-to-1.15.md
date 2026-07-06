---
title: Upgrade to Spaces 1.15
sidebar_position: 5
description: A guide for upgrading a self-hosted Space from 1.14 to 1.15
---

Spaces 1.15 has two breaking changes. Apollo moves into its own Helm subchart,
and the Apollo database schema is no longer compatible with 1.14.

:::important
Read this guide fully and complete the steps in order before you run
`helm upgrade`.
:::

:::warning
You must drop the Apollo schema tables before upgrading. If you don't, the new
Apollo can fall back to the old schema and serve requests against inconsistent
data, returning partial or empty results with no error.
:::

:::note
The Apollo database is a read only cache of control plane resources. Dropping
its tables loses no permanent data, but the cache repopulates after the upgrade.
Queries return partial data until that finishes.
:::

## Summary

| Change | 1.14 | 1.15 | What to do |
|--------|------|------|------------|
| Apollo Helm values | Under `features.alpha.apollo` | Apollo is a subchart; values live under `apollo.apollo` | Move your Apollo values to `apollo.apollo`. Keep `features.alpha.apollo.enabled: true`. |
| Apollo schema | Old schema | Incompatible schema | Drop all tables in the Apollo schema before you upgrade. |

## Prerequisites

You can only reach 1.15 from 1.14. If you're on an earlier version, upgrade to
1.14 first.

You also need:

- Database credentials and a client such as `psql` that can reach the Apollo
  database.
- A copy of your current `values.yaml`.

## Step 1: Back up your values

```bash
helm get values spaces -n upbound-system -o yaml > values-1.14-backup.yaml
```

A database backup isn't required. Apollo is a cache and rebuilds itself.

## Step 2: Move your Apollo values

In 1.14, Apollo values lived under `features.alpha.apollo`. In 1.15, Apollo is a
subchart, so those values move to `apollo.apollo`. The values don't change, only
their location.

1. Copy everything under `features.alpha.apollo` to `apollo.apollo`.
2. Keep `features.alpha.apollo.enabled` set to `true`. This key stays where it
   is and gates the subchart. It defaults to `false`, so the subchart won't
   deploy if you drop it.

1.14:

```yaml
features:
  alpha:
    apollo:
      enabled: true          # gates the feature
      # ...all other Apollo values...
```

1.15:

```yaml
features:
  alpha:
    apollo:
      enabled: true          # stays here; must be true to deploy the subchart

apollo:
  apollo:
    # ...all other Apollo values, copied from features.alpha.apollo...
```

Save the result as `values-1.15.yaml`.

## Step 3: Drop the Apollo schema tables

Spaces runs the schema migration automatically on startup, so there's no
manual migration command. But it must start from an empty schema. Tables left
over from 1.14 hold the old data model, and the new version can fall back to
them and serve inconsistent data.

The Apollo schema is `public`. Connect to the Apollo database and drop its
tables:

```sql
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;
```

This drops every table and its dependent objects while leaving the `public`
schema and its grants in place. Drop the tables, not the schema, so you don't
reset the default schema privileges.

:::important
Drop the tables before you upgrade, so the new spaces pod is the first thing to
touch the empty schema. On startup it sees the empty `public` schema and runs
the new migration. No other action is needed.
:::

## Step 4: Upgrade

```bash
helm upgrade spaces oci://xpkg.upbound.io/spaces-artifacts/spaces \
  -n upbound-system \
  --version 1.15.x \
  -f values-1.15.yaml
```

## Step 5: Verify

```bash
helm ls -n upbound-system          # release shows chart version 1.15.x
kubectl get pods -n upbound-system # Apollo pods are Running and Ready
```

Then confirm:

- The new tables exist in the `public` schema.
- A request to the Query API succeeds.

## Rollback

1. Roll the release back to 1.14:

   ```bash
   helm rollback spaces <previous-revision> -n upbound-system
   ```

   You can also run `helm upgrade` with `values-1.14-backup.yaml` and
   `--version 1.14.x`.

2. The 1.14 Apollo rebuilds its schema in the empty database and repopulates the
   cache.

No application data is lost in either direction, but each transition triggers
another repopulation.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Requests succeed but return stale or missing data, no errors in the logs | Old tables weren't dropped and the new version fell back to them | Stop Apollo, drop the schema (Step 3), let the new version rebuild it |
| Apollo doesn't deploy after the upgrade | `features.alpha.apollo.enabled` is unset or `false` | Set `features.alpha.apollo.enabled: true` |
| Helm upgrade fails to render or reports missing values | Apollo values are still under `features.alpha.apollo` | Move them to `apollo.apollo` (Step 2) and keep only `enabled` under the old path |
| Spaces pod crashloops during the migration | Old tables blocked a clean migration, or the database user can't create tables in `public` | Confirm `public` is empty (Step 3) and that the Apollo user can create tables; check the spaces pod logs |
| `apollo-syncer` pods crashloop on startup | The controller upgraded before the tables were dropped, so the syncer errors when writing | Restart the spaces-controller pod, then restart the `apollo-syncer` pods |
