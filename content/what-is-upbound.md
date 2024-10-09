---
title: "What is Upbound?"
weight: -1
description: "Learn how Upbound works and how it can work for you."
---

Upbound is a scalable and fully automated cloud service that simplifies infrastructure management across various environments. It's built on Crossplane, an open-source framework that helps you manage your infrastructure with a universal control plane. Upbound builds on this framework with a managed service that automates and scales your infrastructure within Upbound's Cloud. This approach allows you to focus on your core business objectives. The service includes essential features such as backup and restore capabilities, secrets management, access control, and more.

If you're not already familiar with Crossplane, Upbound makes it easy to get started with just a few concepts. This introduction and quickstart are designed to get you started with Upbound without being a Crossplane or Kubernetes expert.

How Upbound works

Upbound uses control planes to manage and create resources with custom APIs. What does that mean?

In Crossplane, the control plane is an orchestration layer based on the infrastructure you specify. With control planes, Crossplane handles building and managing your external infrastructure and gives you the benefit of continuous reconciliation, GitOps practices, and highly customizable resource abstractions. 

We'll get more into those benefits later, but for now, think of the control plane as the conductor for an orchestra. The conductor leads the musicians and makes sure they play their parts as written in the data - the musical score. She doesn't play each instrument or write the music, but she coordinates the sections, sets the tempo, and adapts to changes in real-time.

What does the Crossplane/Upbound workflow look like? The workflow below is a simplified version of the Crossplane/Upbound infrastructure deployment process. The lifecycle here depends on you creating resource abstraction files called Custom Resource Definitions (CRDs) to pass to your control plane. In this way, you are the musical composer for the orchestra. Your CRDs are representations of external resources in a format that Crossplane parses for you as your conductor.





Key concepts

Let's define some of the concepts you'll learn more about in this series:

Control plane: The surface area of your Crossplane deployment.
Managed control plane: Fully-managed isolated virtual Crossplane instances. Upbound manages all the underlying components for you.
Providers: The external service you want to provision on. Example: AWS, Azure, and GCP.
Managed resources: Infrastructure pieces inside the provider. Example: an S3 bucket on AWS. These resources are managed by Crossplane/Upbound to meet your definition and maintain your desired state.
Compositions: A template for a collection of managed resources.
Composite resources: A set of provisioned managed resources. If your compositions are the template, the composite resources are your defined settings.

Upbound and Crossplane 🤝

Most of the key concepts mentioned apply to both Crossplane and Upbound, but Upbound offers several additional benefits that can enhance your experience.

One of the core differences between Upbound and Crossplane is the concept of the Managed Control Plane (MCP). With Upbound, you can use the operational power of Crossplane without the need to manage your own control planes. Upbound manages the underlying components for you and allows you to focus on deploying and managing your infrastructure rather than maintaining the control plane itself. In a typical Crossplane deployment, managing these components requires a non-trivial amount of Kubernetes knowledge and careful attention to cluster management.

With Upbound, we simplify this process by providing a fully managed, isolated hosting environment. This hosting environment does not require you to have knowledge of underlying Kubernetes clusters or to build custom integrations for your CI/CD pipelines, or complex user management setups.

Upbound also delivers a unified console experience for your developers. You can create and enforce which users can have access to specific resources with another Crossplane concept called Claims. This feature helps protect your organization from security braces and unnecessary costs within a centralized platform.

Why Upbound?

As an example, let's look at a common situation Infrastructure teams find themselves in. In this example, we'll look at Elevectis, a fictional company going through the process of replatforming their infrastructure.

Elevectis, a growing company, initially started its journey into cloud infrastructure management with Terraform. Using Infrastructure as Code (IaC) practices allowed the infrastructure team to define their cloud resources in configuration files and then add them to their version control and CI/CD pipeline deployments.

However, as they grew a few challenges emerged:
Multi-cloud complexity: Writing and maintaining provider-specific code in Terraform require multiple modules and increasingly difficult to manage state files.
Scaling and maintenance: Drift and downtime become a concern because manual configuration editing can make some resources out of sync with their desired state or destroyed completely without careful consideration. 
Compliance and security: Custom RBAC policies, secrets management, and monitoring solutions bolt on additional responsibilities for the team and take up valuable time.
 
As these challenges grow, the team realizes that continuing to scale with Terraform could be a costly and time consuming endeavor due to the amount of human intervention and human error that could occur.

One solution that appealed to the team was Crossplane. With a migration process and drift-protection, the team found that the Crossplane philosophy fit well with their current Terraform platform. Taking this initiative one step further, they look into Upbound and found that on top of all the benefits of Crossplane, they could look forward to:

A unified interface that appealed to their developers just looking to deploy what they need
Simplified scaling without resource management concerns
Continuous reconciliation to keep infrastructure in sync
Pre-built platform services in the Upbound Marketplace

In the next guide, you will walk through the initial onboarding process as an infrastructure engineer and learn how Upbound could help your organization in the same way.

