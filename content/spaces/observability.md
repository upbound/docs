---
title: Observability
weight: 200
description: A guide to Observability in an Upbound Space
---

## Environment metrics

<!-- vale off -->
Upbound recognizes that individual operators have preferences about
how to monitor their infrastructure. Metrics for Crossplane, Environments,
and Spaces are exposed using standard Prometheus practices
<!-- vale on -->

The following components expose Prometheus metrics within the environment
scope:
- kube-state-metrics: information about managed resources
- mxp-gateway: metrics about the ingress into a control plane
- otel-collector: single endpoint for observing inside the Space

## Per Space metrics

The `otel-collector` exposes metrics from within a specific vCluster, 
which runs with the Space itself. Several of the `otel-collector`'s receivers
and processors assume it's running within vCluster as a Kubernetes pod.
The `otel-collector` gathers:
- Kubernetes metrics
- Crossplane, Provider, and DNS metrics
- Scrape _any_ pods with auto scrape metrics managed by vCluster

The default configuration has an Open Telemetry trace collector enabled. vCluster
sends traces for 10% of the total traces to prevent over-collection
of traces and reduce noise.

## Configuration

Out of the box, Prometheus and Prometheus-compatable scrappers like
[DataDog](https://docs.datadoghq.com/containers/kubernetes/prometheus/?tab=kubernetesadv2#metric-collection-with-prometheus-annotations) are compatible.

### Example Prometheus installation

Most operators probably have a monitoring solution in place, and if not,
Amazon, Azure, and Google all offer managed monitoring solutions.

The standard for monitoring Kubernetes and Kubernetes workloads is
Prometheus. For operators who to explore the Environment and Spaces
metrics, Upbound recommends using Prometheus as a starting point.
Prometheus may not meet an Operators business or technology requirements.
Upbound advises operators to consider what metrics and observability stack meet
meet their needs before running in production.

The recommended way to install Prometheus is through
[the official helm charts](https://github.com/prometheus-community/helm-charts).

Add the Prometheus chart repository:
```shell
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

Install Prometheus, Alertmanager, Prometheus node exporter, kube-state-metrics,
and Grafana:
```shell
helm install \
    -n monitoring --create-namespace \
    prometheus prometheus-community/kube-prometheus-stack
```

See the [official
docs](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack#kube-prometheus-stack).

### Add monitors

While you can use static configuration for your Prometheus installation,
it's recommended to use either Service or Pod monitors. All observable services use the standard Prometheus annotations of:
- prometheus.io/port: Name of the pod/service port to scrape
- prometheus.io/scrape: When "true" scrape this port

For those wanting to just scrape OpenTelemetry metrics:
- internal.spaces.upbound.io/metrics-path: Name of the path to scrape
- internal.spaces.upbound.io/metrics-port: Port number to scrape

Assuming your Prometheus helm release name is `prometheus`,
the following configures monitoring:
```shell
kubectl apply -f - <<EOM
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    # this is the default label used by the prometheus operator to determine which services
    # to scrape. You may need to adjust labels depending on your installation.
    release: prometheus
  name: space-metrics
  namespace: monitoring
spec:
  endpoints:
  - honorLabels: true
    path: /metrics
    port: metrics
    scheme: http
    scrapeTimeout: 10s
    relabelings:
    - action: labeldrop
      regex: pod
    - action: labeldrop
      regex: service
    - action: labeldrop
      regex: instance
  namespaceSelector:
    any: true
  selector:
    matchLabels:
      app.kubernetes.io/name: otlp-collector
      vcluster.loft.sh/managed-by: vcluster
      vcluster.loft.sh/namespace: upbound-system
EOM
```

### Connect to metrics

If you deployed the example Prometheus and Pod Monitors, metrics are available
through three views:

- Grafana Dashboard. To access these metrics, run
 `kubectl port-forward -n monitoring svc/prometheus-grafana 8080:80` and then in
 your browser navigating to http://localhost:8080, with a default user/password
 of `admin`/`prom-operator`.
  * After logging in, select the "+" in the upper right corner, on the top panel
  * Select "Import Dashboard"
  * Enter `19358`, select your Prometheus instance. You can now see an example Dashboard for
    monitoring Control Plane health.
  * Several other metrics show the health of the Kubernetes Cluster,
    and are useful to show problems outside of Spaces such as resource use, and
    health of the host cluster.
- Prometheus, which is accessible by running
  `kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 8081:9090`
  and then using your browser go to http://localhost:8081. Prometheus is useful for ad-hoc
  by advanced users.
- Individual OpenTelemetry Collectors, which can show per-control plane metrics by running
  ```bash
  NAME=ctp1
  kubectl port-forward \
       -n mxp-$(kubectl get controlplanes/${NAME} -o jsonpath='{.status.controlPlaneID}{"\n"}')-system \
       svc/otlp-collector-x-upbound-system-x-vcluster 9090:9090
  ```
  and then navigate using your browser to http://localhost:9090/metrics

The dashboard shows metrics that Upbound has determined to be useful for an overview
of the control planes:

- Service Availability: gaps can reveal a problem with a service.
  Causes of gaps can be pods restarting or failing their service checks.
- Pods Running: Shows the runtime of the pods
- Container Restarts: restarting pods are evidence of a problem, such as OutOfMemory,
  or errors. Check the pod logs for more information.
- Gateway Errors: Reveal a problem with clients connecting to the gateway.
  Check the containers logs for potential causes.
- Provider CRDs show the number of CRDs install. Having a lot of CRDs degrades
  performance of the control plane.

## Metrics of import

Both the Environment and each Space and their components produces
thousands of metrics. The following metrics, and PromQL queries,
can help Operators focus on the most important metrics.

Since each space runs in a namespace, use the variable `$namespace` as a filter to scope metrics to a single space. Space namespaces use
the naming convention of `mxp-<UUID>-system`.

### MXP-Gateway

The MXP-Gateway is a reverse proxy from the Environment to an individual
Space. The MXP-Gateway handles a Spaces Authentication and restricts
the Group/Version/Kind API calls to Crossplane components.

#### Success duration

Get the duration of successful queries to the MXP Gateway.

`sum without(pod, service, instance)(http_request_duration_milliseconds_sum{kubernetes_pod_name=~"mxp-gateway-.*", http_status_code="200", namespace="$namespace"})`

The label `http_method` of `GET`, `PUT`, `DELETE` are useful for filtering by type. In general, `GET` or `PUT` are the most useful.

#### Failure duration

The duration of failed requests (non-200). High durations could be
indicative of problems with the vCluster API.

`sum without(instance, job, pod, kubernetes_pod_name)(http_request_duration_milliseconds_sum{kubernetes_pod_name=~"mxp-gateway-.*", http_method="GET", http_status_code!="200", namespace="$namespace"})`

The label `http_method` of `GET`, `PUT`, `DELETE` can are useful for filtering by type. In general, `GET` or `PUT` are the most useful.

### Resources

Operators can use both CRDs and Managed Resources to understand how
utilized a space is.

#### CRDs

`count(apiextensions_openapi_v3_regeneration_count{namespace="$namespace", crd=~".*.(upbound.io|crossplane.io)"})`

If you are using custom provider types (for example, `org.example.com`), you can
add it to the regular expression. As the number of CRDs increases, the load
on the API server increases by about 4 megabytes per CRD. Upbound has observed instability when a Space exceeds having 500 CRDs. 

Having no CRDs installed indicates that a control plane doesn't have
a provider installed.

#### Managed Resources

Show the number of Managed Resources by group, kind and version.

`sum(kube_managedresource_uid{namespace="$namespace"}) by (customresource_group, customresource_kind, customresource_version)`

The number of managed resources can be a proxy for potential. The
CPU and memory requirements for Crossplane increase as the
number of managed resources increases. That's why it's
useful to observe the number of managed resources

Having no managed resource indicates that the control plane is
inactive.

### Health

#### Pod health

`sum without(service, uid)(kube_pod_container_status_running{namespace="$namespace"}) >= 1`

When viewed as a heat map, this metric gives you a view of the total
health and indicates potential pod crashes.

To see the number of pod restarts, use the following query:
`increase(kube_pod_container_status_restarts_total{namespace="$namespace"}[1m]) > 0`

#### Service availability

Get the service/pod availability. An unavailable pod/service indicates that the workload isn't ready.

`sum without (pod) (label_replace(up{namespace="$namespace", job="pods"}, "pod", "$1", "job", "(.*)"))`

### Crossplane

#### Controller reconciliation times

Show the increase in reconciliations times which should
ever-increasing. Missing or flat metrics are indicative that Crossplane
itself or a provider is in a stuck state (networking, cluster issue, etc).

`sum without(pod, instance, endpoint, job, exported_instance)(increase(controller_runtime_reconcile_time_seconds_sum{namespace="$namespace"}[2m]))`

#### Work queue

The depth of the work queue indicates how much work is "waiting" by
CRD Group/Version/Kind. A deep work queue is indicative that the system is under load.

`workqueue_depth{namespace="$namespace", name=~".*.(crossplane.io|upbound.io)"}`

Update the regular expression for `name` to include custom CRD/provider types.

#### Rate for time to reconcile

Show the two-minute. rate for the average reconciliation time. This number
is subjective for Cloud resources as it's
affected by API throttling. You should investigate High reconciliation times (5m or more).

`sum without (pod, kubernetes_pod_name, service)(increase(controller_runtime_reconcile_total{namespace="$namespace", result="success"}[2m]))`

Adjust `[2m]` to change the increase over the range of time. Upbound recommends a lower
time value of one or two minutes to show spikes in
behavior. Using times longer than five minutes reduces fidelity.

#### Rate for errors
Show the two minute rate for the average time to error. This metric
should be blank. Errors at the start-up of a control plane,
 or at configuration-time of a provider, are normal and should go away. You should investigate
Consistent errors as they may reveal:
- Credential issues
- Connectivity problems
- Improper configurations of a Claim, XRD or Composition

`sum without (pod, kubernetes_pod_name, service)(increase(controller_runtime_reconcile_total{namespace="$namespace", result="error", controller=~"(claim.*|offered.*|composite.*|defined.*|packages.*|revisions.*)"}[2m])) > 0`

Adjust `[2m]` to change the increase over a range of time. Upbound recommends using a lower
time value of one or two minutes to show spikes in
behavior. Using times longer than five minutes reduces fidelity.

#### API histogram

Where `$operation` is `CREATE`, `UPDATE`, `DELETE` or `PUT`, show the 5 min quintile,
for how long the API Service admission took for the Kubernetes API Server.
Low values mean an idle server, while high values could be a symptom the
API Server is under pressure. High values could be due to CPU or memory
pressure, load or potential Environment issues.

`histogram_quantile(0.95, sum(rate(apiserver_admission_controller_admission_duration_seconds_bucket{operation="$operation", namespace="$namespace", rejected="false"}[5m])) by (le))`

You can edit this query by:
* Change `0.95` to another top percentile such as 0.99 for the TP99
* Set `rejected` to `true` to show rejected requests which show the creation of improperly configured
Claims.

#### API aggregation unavailable

Get the number of APIs not available. If an XRDs is unavailable, such as
during an upgrade or if it wasn't configured right, then the value is non-zero.

`aggregator_unavailable_apiservice{name=~"(.*crossplane.io|.*upbound.io)", namespace="$namespace"} > 0`

Update the name regular expression to include custom provider types.

### Resource usage

The metrics below come from the Kubelet. If your monitoring stack does
collect Kubelet metrics (such as through Prometheus Node Exporter via
Prometheus Kube Stack Metrics) these metrics may not be available.

#### Memory

Show the memory usage by pod, with the requests and limits.
Memory usage should be below the limits. The pod may be `OOM killed` when it exceeds the limit, resulting in component brownouts.

`sum(container_memory_working_set_bytes{job="kubelet", metrics_path="/metrics/cadvisor", cluster="$cluster", namespace="$namespace", pod="$pod", container!="", image!=""}) by (container)`

#### CPU throttling

CPU throttling points to an active pod starved for CPU. CPU
starvation results in unacceptable performance.

Set `$pod` to the name of the pod and `$__rate_interval` to
your desired timestamp.

Note: this metric assumes that `Prometheus Node Exporter` is running.

`sum(increase(container_cpu_cfs_throttled_periods_total{job="kubelet", metrics_path="/metrics/cadvisor", namespace="$namespace", pod="$pod", container!=""}[$__rate_interval])) by (container) /
sum(increase(container_cpu_cfs_periods_total{job="kubelet", metrics_path="/metrics/cadvisor", namespace="$namespace", pod="$pod", container!=""}[$__rate_interval])) by (container)`