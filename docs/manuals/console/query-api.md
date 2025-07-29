---
title: Query API
sidebar_position: 2
description: The Query API
tier: "standard"
---

The Query API used to previously operate within a multi-tenant Spaces architecture.

To make it compatible with UXP 2.0, it has been refactored to a “single-tenant” mode, and comes installed in the same cluster when you install UXP 2.0.

It is enabled by default, but can be disabled. All of the queries you make in the Crossplane WebUI are now using the Query API in the background.
