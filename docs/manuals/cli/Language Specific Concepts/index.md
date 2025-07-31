---
title: Language Specific Concepts
description: "Language Specific Concepts"
sidebar_position: 8
---

Upbound offers multi-language support for authoring embedded functions.

Currently, Upbound supports authoring functions in the following languages:
- KCL – A constraint-based configuration language designed for writing secure, maintainable, and policy-aware logic. Ideal for simple, declarative mutations and validations.
- Go – Offers full flexibility and performance for advanced use cases. Functions written in Go can access the full Crossplane Function SDK and are suitable for teams comfortable with writing and maintaining compiled logic.
- Go-Templating – Enables dynamic configuration using familiar templating syntax. Useful for simple use cases such as injecting values, defaulting fields, or composing outputs.
- Python – A flexible, high-level language that supports rich logic and readability. Great for teams looking to leverage existing Python skills to build infrastructure automation.

Each language targets a different set of use cases and developer preferences, ranging from lightweight scripting to fully structured application logic. Regardless of the language you choose, all functions can be embedded directly into your control plane project and executed as part of a Crossplane function pipeline.