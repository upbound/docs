---
title: Build and push your first Configuration
sidebar_position: 2
---

Now that you've create a new resource type, you’re ready to create an OCI image from the control plane project and share it on the Upbound Marketplace. To do so, you will need to do the following:

1. Sign in with your Upbound account
2. Create a repository on Upbound
3. Build the project into an image
4. Push the image to a repository in your Upbound account
5. Before you dive into the hands-on guide, the following are a few core concepts that you should be aware of.

## Explanation

### Configurations

If you're new to [Configurations][configurations], think of it as a standardized packaging format that contains everything needed to run a control plane. It's based on the OCI image format, the same format used by Kubernetes and Docker containers. A Configuration includes:

* the APIs a control plane will offer
* the configuration of the control plane
* any dependencies it has

These packages can be distributed and shared with others.

### Repositories

Like container images, you need a place to store Configurations. Upbound is the default [repository][repositories] source. Upbound provides:

* An easy place to store these images
* Automatic API documentation generated for packages.
* A convenient publishing experience to share with the community via the Upbound Marketplace, if desired.

## Sign in with your Upbound account

To push the Configuration package, you need to sign in with your Upbound account. Run the following to login with the `up` CLI:

```sh
up login
```

## Create a repository

To create a repository in Upbound with the `up` CLI, run the following:

```sh
up repository create getting-started
```

## Build and push the Configuration

Now that you have a repository, you are ready to build and push your Configuration.  Run the following to build and push with `up`:

```sh
up project push
```

## What just happened

Before you move on, take a moment and reflect on what happened here. Within a few moments, you were able to build a container image that packages your application and push it to Docker Hub.

Going forward, you’ll want to remember that:

Docker Hub is the go-to registry for finding trusted content. Docker provides a collection of trusted content, composed of Docker Official Images, Docker Verified Publishers, and Docker Sponsored Open Source Software, to use directly or as bases for your own images.

Docker Hub provides a marketplace to distribute your own applications. Anyone can create an account and distribute images. While you are publicly distributing the image you created, private repositories can ensure your images are accessible to only authorized users.

## Next Steps

Now that you’ve built a Configuration, it's time to learn how to deploy it into a production control plane.

Read about [what's next][whatsNext]

[configurations]: configurations
[repositories]: repositories
[whatsNext]: whats-next