---
title: Query API setup
weight: 130
description: Query API setup for self-hosted Spaces
aliases:
    - /self-hosted-spaces/query-api
---

<!-- vale write-good.TooWordy = NO -->
<!-- ignore "aggregate" -->

{{< hint "important" >}}

This feature is in preview. The query API is available in the Cloud Space offering in `v1.6` and enabled by default.

This is a requirement to be able to connect a Space since `v1.8.0`, and is off by default, see below to enable it.

{{< /hint >}}

Upbound's Query API allows users to inspect objects and resources within their control planes. The read-only `up alpha query` and `up alpha get` CLI commands allow you to gather information on your control planes in a fast and efficient package. These commands follow the [`kubectl` conventions](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/) for filtering, sorting, and retrieving information from your Space.

Query API requires a PostgreSQL database to store the data. You can use the default PostgreSQL instance provided by Upbound or bring your own PostgreSQL instance.
<!-- vale Google.Headings = NO -->
## Using the Query API
<!-- vale Google.Headings = YES -->
See the [Query API documentation]({{<ref "all-spaces/query-api/_index.md">}}) for more information on how to use the Query API.

## Managed setup

{{< hint "tip" >}}

If you don't have strong opinions on your setup, this is the suggested way to proceed.

{{< /hint >}}

To enable this feature, set `features.alpha.apollo.enabled=true` and `features.alpha.apollo.storage.postgres.create=true` when installing Spaces.

However, you need to install CloudNativePG (`CNPG`) to provide the PostgreSQL instance. You can let the `up` CLI do this for you, or install it manually.

For more customization, see the [Helm chart reference]({{<ref
"all-spaces/self-hosted-spaces/helm-reference.md">}}). You can modify the number
of PostgreSQL instances, pooling instances, storage size, and more.

If that's not enough, see below for more information on how to bring your own PostgreSQL setup.

### Using the up CLI

Before you begin, make sure you have the most recent version of the [`up` CLI installed]({{<ref "reference/cli#install-the-up-command-line">}}).

To enable this feature, set `features.alpha.apollo.enabled=true` and `features.alpha.apollo.storage.postgres.create=true` when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.apollo.enabled=true" \
  --set "features.alpha.apollo.storage.postgres.create=true"
```

`up space init` and `up space upgrade` install CloudNativePG automatically, if needed.

If that's not enough, see below for more information on how to bring your own PostgreSQL instance.

### Helm chart

If you are installing the Helm chart in some other way, you can manually install CloudNativePG in one of the [supported ways](https://cloudnative-pg.io/documentation/current/installation_upgrade/), for example:

```shell
kubectl apply --server-side -f \
             https://github.com/cloudnative-pg/cloudnative-pg/releases/download/v1.24.1/cnpg-1.24.1.yaml
kubectl rollout status -n cnpg-system deployment cnpg-controller-manager -w --timeout 120s
```

You can then proceed to install the Spaces Helm chart however you like passing the necessary values, for example:

```shell
helm -n upbound-system upgrade --install spaces \
  oci://xpkg.upbound.io/spaces-artifacts/spaces \
  --version "${SPACES_VERSION}" \
  ...
  --set "features.alpha.apollo.enabled=true" \
  --set "features.alpha.apollo.storage.postgres.create=true" \
  --wait
```
<!-- vale Google.Headings = NO -->
## Self-hosted PostgreSQL configuration
<!-- vale Google.Headings = YES -->

If your workflow requires more customization, you can provide your own
PostgreSQL instance and configure credentials manually.

Using your own PostgreSQL instance requires careful architecture consideration.
Review the architecture and requirements guidelines.

### Architecture

The Query API architecture uses three components, other than a PostgreSQL database:
* **Apollo Syncers**: Watching `ETCD` for changes and syncing them to PostgreSQL. One, or more, per control plane.
* **Apollo Server**: Serving the Query API out of the data in PostgreSQL. One, or more, per Space.
* **Spaces Controller**: Reconciling the PostgreSQL schema as needed for the other two components. One, or more, per space.

The default setup also uses a connection pooler, PgBouncer, to manage connections from the syncers.

{{<img src="all-spaces/self-hosted-spaces/images/query-api-arch.png" alt="Query API architecture diagram" lightbox="true">}}

Each of these components need to connect to the PostgreSQL database, and can use dedicated credentials in various formats.

In the event of database issues, you can provide a new database and the syncers
automatically repopulate the data.

### Requirements

* A PostgreSQL 16 instance or cluster.
* A database, for example named `upbound`.
* A dedicated user for the Spaces Controller, with all privileges on the database, for example named `spaces-controller`.
* **Optional**: A dedicated user for the Apollo Syncers, otherwise the Spaces Controller generates a dedicated set of credentials per syncer with the necessary permissions, for example named `syncer`.
* **Optional**: A dedicated read-only user for the Apollo Server, otherwise the Spaces Controller generates a dedicated set of credentials with the necessary permissions, for example named `apollo`.
* **Optional**: A connection pooler, like PgBouncer, to manage connections from the Apollo Syncers. If you didn't provide the optional users, you might have to configure the pooler to allow users to connect using the same credentials as PostgreSQL.
* **Optional**: A read replica for the Apollo Syncers to connect to, to reduce load on the primary database, this might cause a slight delay in the data being available through the Query API.

Below you can find examples of setups to get you started, you can mix and match the examples to suit your needs.

### In-cluster setup

{{< hint "tip" >}}

If you don't have strong opinions on your setup, but still want full control on the resources created for some unsupported customizations, this is the suggested way to proceed.

{{< /hint >}}

If the managed setup isn't enough, but you are fine deploying PostgreSQL in the same cluster, you can still use CloudNativePG.

To do so, you have to manually deploy the operator in one of the [supported ways](https://cloudnative-pg.io/documentation/current/installation_upgrade/), for example:

```shell
kubectl apply --server-side -f \
             https://github.com/cloudnative-pg/cloudnative-pg/releases/download/v1.24.1/cnpg-1.24.1.yaml
kubectl rollout status -n cnpg-system deployment cnpg-controller-manager -w --timeout 120s
```

Then create a `Cluster` and `Pooler` in the `upbound-system` namespace, for example:

```shell
kubectl create ns upbound-system

kubectl apply -f - <<EOF
---
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: spaces-apollo-pg
  namespace: upbound-system
spec:
  instances: 2
  imageName: ghcr.io/cloudnative-pg/postgresql:16
  bootstrap:
    initdb:
      database: upbound
      owner: spaces-controller
      postInitApplicationSQL:
      - ALTER ROLE "spaces-controller" CREATEROLE;
  certificates:
    serverAltDNSNames:
      - spaces-apollo-pg-pooler
      - spaces-apollo-pg-pooler.upbound-system
      - spaces-apollo-pg-pooler.upbound-system.svc
      - spaces-apollo-pg-pooler.upbound-system.svc.cluster.local
  storage:
    size: 10Gi
---
apiVersion: postgresql.cnpg.io/v1
kind: Pooler
metadata:
  name: spaces-apollo-pg-pooler
  namespace: upbound-system
spec:
  cluster:
    name: spaces-apollo-pg
  pgbouncer:
    poolMode: transaction
    parameters:
      max_client_conn: "1000"
      default_pool_size: "10"
      max_prepared_statements: "1000"
  instances: 2
  type: rw
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-syncer-ingress-to-apollo-pg
  namespace: upbound-system
spec:
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: mxp-apollo-syncer
      ports:
        - port: 5432
          protocol: TCP
  podSelector:
    matchLabels:
      cluster: spaces-apollo-pg
  policyTypes:
    - Ingress
EOF
```

Adjust the `Cluster` and `Pooler` resources to your needs, for example by changing the `spec.storage.size` or `spec.imageName`.

CloudNativePG takes care of setting up the necessary Secrets, you just need to configure Spaces to use them.

You can now install Spaces however you want making sure to pass the settings below:

```shell
helm upgrade --install ... \
  --set "features.alpha.apollo.enabled=true" \
  --set "features.alpha.apollo.storage.postgres.create=false" \
  --set "features.alpha.apollo.storage.postgres.connection.credentials.user=spaces-controller" \
  --set "features.alpha.apollo.storage.postgres.connection.url=spaces-apollo-pg-rw:5432" \
  --set "features.alpha.apollo.storage.postgres.connection.credentials.secret.name=spaces-apollo-pg-app" \
  --set "features.alpha.apollo.storage.postgres.connection.credentials.format=basicauth" \
  --set "features.alpha.apollo.storage.postgres.connection.ca.name=spaces-apollo-pg-ca" \
  --set "features.alpha.apollo.storage.postgres.connection.syncer.url=spaces-apollo-pg-pooler.upbound-system.svc:5432"
```

#### Common customisations

Below you can find references to how to customize this setup:

* **Storage**: See the [CloudNativePG documentation](https://cloudnative-pg.io/documentation/1.24/storage/#configuration-via-a-pvc-template) for more information on how to configure the storage.
* **Resources**: See the CloudNativePG documentation for more information on how to configure the resources used by the [PostgreSQL instances](https://cloudnative-pg.io/documentation/1.24/resource_management/) and the [pooler](https://cloudnative-pg.io/documentation/1.24/connection_pooling/#pod-templates).
* **High Availability**: See the CloudNativePG documentation for more information on how to configure high availability for the [PostgreSQL instances]() and the [pooler](https://cloudnative-pg.io/documentation/1.24/connection_pooling/#high-availability-ha).
* **Images used**: See the CloudNativePG documentation for more information on how to configure the images used by the [PostgreSQL instances](https://cloudnative-pg.io/documentation/1.24/operator_capability_levels/#override-of-operand-images-through-the-crd) and the [pooler](https://cloudnative-pg.io/documentation/1.24/connection_pooling/#pod-templates).
* **PostgreSQL configuration**: See the [CloudNativePG documentation](https://cloudnative-pg.io/documentation/1.24/postgresql_conf/) for more information on how to configure the PostgreSQL instances, for example `max_connections`, `shared_buffers`, etc.
<!-- vale Google.Headings = NO -->

### External setup with Spaces Controller credentials

<!-- vale Google.Headings = YES -->
{{< hint "tip" >}}

If you want to run your PostgreSQL instance outside the cluster, but are fine with credentials being managed by the Spaces Controller, this is the suggested way to proceed.

{{< /hint >}}

For this setup, you must manually create the necessary Secrets in the `upbound-system` namespace. For example, this minimal setup leaves Apollo Syncers and Apollo Server credentials for the Spaces Controller to generate.

```shell
export SPACES_CONTROLLER_USER=spaces-controller

kubectl create ns upbound-system

# A Secret containing the necessary credentials to connect to the PostgreSQL instance
kubectl create secret generic spaces-apollo-pg-app -n upbound-system \
  --from-literal=username=$SPACES_CONTROLLER_USER \
  --from-literal=password=supersecret

# A Secret containing the necessary CA certificate to verify the connection to the PostgreSQL instance
kubectl create secret generic spaces-apollo-pg-ca -n upbound-system \
  --from-file=ca.crt=/path/to/ca.crt
```

Then proceed to install Spaces with the necessary settings:

```shell
export PG_URL=your-postgres-host:5432
export PG_POOLED_URL=your-pgbouncer-host:5432 # this could be the same as above

helm upgrade --install ... \
  --set "features.alpha.apollo.enabled=true" \
  --set "features.alpha.apollo.storage.postgres.create=false" \
  --set "features.alpha.apollo.storage.postgres.connection.credentials.user=$SPACES_CONTROLLER_USER" \
  --set "features.alpha.apollo.storage.postgres.connection.url=$PG_URL" \
  --set "features.alpha.apollo.storage.postgres.connection.credentials.secret.name=spaces-apollo-pg-app" \
  --set "features.alpha.apollo.storage.postgres.connection.credentials.format=basicauth" \
  --set "features.alpha.apollo.storage.postgres.connection.ca.name=spaces-apollo-pg-ca" \
  --set "features.alpha.apollo.storage.postgres.connection.syncer.url=$PG_POOLED_URL"
```

### External setup with all custom credentials

For custom credentials with Apollo Syncers or Server, create a new secret in the
`upbound-system` namespace:

```shell
export SPACES_CONTROLLER_USER=spaces-controller
export APOLLO_SYNCER_USER=syncer
export APOLLO_SERVER_USER=apollo

kubectl create ns upbound-system

# A Secret containing the necessary credentials to connect to the PostgreSQL instance
kubectl create secret generic spaces-apollo-pg-app -n upbound-system \
  --from-literal=username=$SPACES_CONTROLLER_USER \
  --from-literal=password=supersecret

# A Secret containing the necessary CA certificate to verify the connection to the PostgreSQL instance
kubectl create secret generic spaces-apollo-pg-ca -n upbound-system \
  --from-file=ca.crt=/path/to/ca.crt

# A Secret containing the necessary credentials for the Apollo Syncers to connect to the PostgreSQL instance.
# These will be used by all Syncers in the Space.
kubectl create secret generic spaces-apollo-pg-syncer -n upbound-system \
  --from-literal=username=$APOLLO_SYNCER_USER \
  --from-literal=password=supersecret

# A Secret containing the necessary credentials for the Apollo Server to connect to the PostgreSQL instance.
kubectl create secret generic spaces-apollo-pg-apollo -n upbound-system \
  --from-literal=username=$APOLLO_SERVER_USER \
  --from-literal=password=supersecret
```

Then proceed to install Spaces with the necessary settings:

```shell
export PG_URL=your-postgres-host:5432
export PG_POOLED_URL=your-pgbouncer-host:5432 # this could be the same as above

helm ... \
  --set "features.alpha.apollo.enabled=true" \
  --set "features.alpha.apollo.storage.postgres.create=false" \
  --set "features.alpha.apollo.storage.postgres.connection.credentials.user=$SPACES_CONTROLLER_USER" \
  --set "features.alpha.apollo.storage.postgres.connection.url=$PG_URL" \
  --set "features.alpha.apollo.storage.postgres.connection.credentials.secret.name=spaces-apollo-pg-app" \
  --set "features.alpha.apollo.storage.postgres.connection.credentials.format=basicauth" \
  --set "features.alpha.apollo.storage.postgres.connection.ca.name=spaces-apollo-pg-ca" \
  --set "features.alpha.apollo.storage.postgres.connection.syncer.url=$PG_POOLED_URL" \

  # For the syncers
  --set "features.alpha.apollo.storage.postgres.connection.syncer.credentials.format=basicauth" \
  --set "features.alpha.apollo.storage.postgres.connection.syncer.credentials.user=$APOLLO_SYNCER_USER" \
  --set "features.alpha.apollo.storage.postgres.connection.syncer.credentials.secret.name=spaces-apollo-pg-syncer" \

  # For the server
  --set "features.alpha.apollo.storage.postgres.connection.apollo.credentials.format=basicauth" \
  --set "features.alpha.apollo.storage.postgres.connection.apollo.credentials.user=$APOLLO_SERVER_USER" \
  --set "features.alpha.apollo.storage.postgres.connection.apollo.credentials.secret.name=spaces-apollo-pg-apollo" \
  --set "features.alpha.apollo.storage.postgres.connection.apollo.url=$PG_POOLED_URL"
```
<!-- vale Google.Headings = NO -->

## Using the Query API

<!-- vale Google.Headings = YES -->
See the [Query API documentation]({{<ref "all-spaces/query-api/_index.md">}}) for more information on how to use the Query API.

<!-- ignore "aggregate" -->
<!-- vale write-good.TooWordy = YES -->
