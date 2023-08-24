---
title: Git integration (alpha)
weight: 100
description: A guide to how managed control planes in a space connect to git
---

{{< hint "important" >}}
This feature is in alpha and currently only available when a managed control plane is running in an Upbound Space.
{{< /hint >}}

Managed Control Planes in a Space are configurable to automatically sync their source configuration directly from a Git repository. It allows you to declaratively describe your control plane's total configuration. Define Providers, Configurations, and runtime configurations such as ProviderConfigs or EnvironmentConfigs in Git and sync them automatically to your managed control plane.

## Example

Configure a control plane with the `spec.source` property to have Upbound automatically track and sync the state defined in Git. Below is an example manifest with the `spec.source` configured:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: ControlPlane
metadata:
  name: example-ctp
spec:
  source:
    git:
      auth:
        type:  None
      path: /
      pullInterval: 15s
      url: https://github.com/upbound/source-example
      ref:
        branch: main
```

In the preceding example:

- This manifest creates a control plane in a Space named `example-ctp`, indicated by `metadata.name`
- The Space checks a Git repository found at `https://github.com/upbound/source-example`, indicated by the `spec.source.git.url` field.
- The Space uses the specified branch `main`, indicated by `spec.source.git.ref.branch`.
- Since the manifest doesn't declare a root explicitly, it's assumed to be the root folder of the Git repository.

Once your control plane is in a `Ready` state, it pulls manifests from the repository configured in `spec.source`. The control plane object contains emitted sync events, which you can find by describing the control plane:

```bash
kubectl describe ctp example-ctp
```

## Authentication with Version Control Services

The built-in Git sync feature uses standard Git-based auth. You can authenticate towards a Git repository using:

- None
- Basic auth
- Bearer token auth
- SSH

Check your Version Control Service's documentation to see which auth method it supports. If you are looking to use OAuth tokens with popular servers (for example: Bitbucket, GitHub, GitLab) you should use BasicAuth instead of BearerToken. These servers use basic HTTP authentication, with the OAuth token as user or password. Check the documentation of your Version Control Service for details.

### Basic authentication

To authenticate with a Git repository using basic authentication--which is a username and password--create and reference a secret that contain the keys `username` and `password`.

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: git-basic-auth
type: Opaque
data:
  username: <user>
  password: <pass>
```

### Bearer token authentication

To authenticate with a Git repository using bearer token authentication, create and reference a secret that contains a key called `bearerToken`.

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: git-bearer-token-auth
type: Opaque
data:
  bearerToken: <bearerToken>
```

### SSH authentication

To authenticate with a Git repository using SSH auth, create and reference a secret that contains a key called `identity`. The secret must contain the SSH key and known hosts list. The `identity` key's content is a private SSH key. Optionally, the secret can contain the key `knownHosts` where the content is a known hosts file.

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: git-ssh-auth
type: Opaque
data:
  identity: <sshKey>
```

## Configure pull interval

You can configure the Git sync's regular pull interval of the target Git repository. The min pull interval is 15 seconds. The default pull interval is 90 seconds. To configure this, provide a value in the `spec.source.git.pullInterval` field in the format of `1h2m3s`. 

## Configure Git reference

You can configure the Git sync's target reference to checkout. You can configure it for branch, commit, or tag.

### Branch example

The following example checks out the `main` branch of the Git repository:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: ControlPlane
metadata:
  name: example-ctp
spec:
  source:
    git:
      url: https://github.com/upbound/source-example
      ref:
        branch: main
```

### Commit example

The following example checks out the Git commit SHA from the Git repository:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: ControlPlane
metadata:
  name: example-ctp
spec:
  source:
    git:
      url: https://github.com/upbound/source-example
      ref:
        commit: f0b36607a3a5d836063ca42be8b229d3c0bdc1dc
```

### Tag example

The following example checks out the Git tag from the Git repository:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: ControlPlane
metadata:
  name: example-ctp
spec:
  source:
    git:
      url: https://github.com/upbound/source-example
      ref:
        tag: v1.0
```

