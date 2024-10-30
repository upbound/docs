---
title: "Overview"
rank: 1
---

Upbound supports defining your control plane in the Python language.

Install [Python](https://www.python.org/downloads/). To reduce potential issues with setting up your Python environment on Windows or macOS, you should install Python through the official Python installer.

## Control Plane Project Model

The Upbound programming model defines the core concepts you will use when creating your control plane using Upbound. [Concepts]() describes these concepts with examples available in Python.

The Python experience is made available thanks to the python-interpreter function.

The Pulumi SDK is available to Python developers as a package distributed on PyPI. To learn more, refer to the Pulumi SDK Reference Guide.

## Inputs and Outputs

The Upbound programming model includes a core concept of Input and Output values, which are used to track how outputs of one resource flow in as inputs to another resource. This concept is important to understand when getting started with Python and Upbound, and the Inputs and Outputs documentation is recommended to get a feel for how to work with this core part of Upbound in common cases.
