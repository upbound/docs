---
title: "SharedExternalSecret"
weight: 20
---

`SharedExternalSecret` specifies a shared `ExternalSecret` projected into the specified control planes of the same namespace as `ClusterExternalSecret` and with that propagated into the specified namespaces.

An example of a `sharedsecret.yaml` file:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: shared-vault-secret
  namespace: default
spec:

  # The name to used on external-secrets.io/v1beta1 ExternalSecret created in ControlPlane.
  # optional, if not set, ControlPlaneExternalSecret name will be used
  externalSecretName: "my-secret"

  # The metadata of the secret store to be created
  externalSecretMetadata:
    labels:
        acmeco/label: my-label

  # The store is projected only to control planes matching the provided label selector.
  controlPlaneSelector:
    labelSelectors:
    - controlplane: dev

    # or by providing the list of controlplane names
    names:
      - ctp1
      - ctp2

  # Project secrets into namespaces matching the declared criteria. f omitted, the secret is
  # projected to all namespaces within a control plane
  namespaceSelector:

    # matching any of the provided label sets
    matchLabels:
    - controlplane: dev

    # or by providing the list of namespace names
    names:
      - ns1
      - ns2


  # The rest of the fields is identical to .spec of ESO ClusterExternalSecret
  # https://external-secrets.io/latest/api/clusterexternalsecret/

  # How often the ClusterExternalSecret should reconcile itself
  # This will decide how often to check and make sure that the ExternalSecrets exist in the matching namespaces
  refreshTime: "1m"

  # This is the spec of the ExternalSecrets to be created
  # The content of this was taken from an ExternalSecret example
  externalSecretSpec:
  secretStoreRef:
    name: secret-store-name
    kind: SecretStore

    refreshInterval: "1h"
  	target:
    	name: my-secret
    	creationPolicy: 'Merge'
    	template:
      	type: kubernetes.io/dockerconfigjson

      	metadata:
        	annotations: { }
        	labels: { }
      	data:
        	config.yml: |
          	endpoints:
          	- https://{{ .data.user }}:{{ .data.password }}@api.exmaple.com
      	templateFrom:
        	- configMap:
            	name: alertmanager
            	items:
              	- key: alertmanager.yaml
  	data:
    	- secretKey: secret-key-to-be-managed
      	remoteRef:
        	key: provider-key
        	version: provider-key-version
        	property: provider-key-property
  	dataFrom:
    	- key: provider-key
      	version: provider-key-version
      	property: provider-key-property

```