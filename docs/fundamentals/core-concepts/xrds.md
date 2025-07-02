---
title: Composite Resource Definitions (XRDs)
sidebar_position: 1
description: Composite resource definitions (XRDs) define the schema for a custom
  API.
---

Composite resource definitions (XRDs) define the structure and rules for the
custom API your control plane managed. You write XRDs as declarative files that
specify the schema, behavior, and constraints for Composite Resources (XRs).

XRDs define:

* Required fields
* Validation rules
* Configuration options

## How XRDs, compositions, and claims work together

XRDs are the foundational blueprints for your resource management. They don't
create or manage resources directly, but they provide the structure and expected
inputs for your Compositions.

Compositions are the implementation layer that takes an XRD-defined schema and
provisions actual resources based on that definition.

For example, if you create a Composition to provision an S3 bucket, the
corresponding XRD ensures that:

<!-- vale Microsoft.Adverbs = NO -->
<!-- vale write-good.Passive = NO -->
* Your required parameters are properly structured
* Validation rules are enforced
* The composition receives necessary inputs from the XRD
<!-- vale Microsoft.Adverbs = YES -->
<!-- vale write-good.Passive = YES -->

Claims are higher-level abstractions that your users can use for self-service
resource deployment. Claims have a simplified structure with fewer required
fields and less configuration.

Claims allow you to:

* give your users a self-service method for resource management while adhering
  to your organizational policies
* automatically provision resources with the control plane workflow
* maintain governance and consistency across your managed resources


For more information, review the documentation on Authoring XRDs.
<!--- TODO(tr0njavolta): link --->
