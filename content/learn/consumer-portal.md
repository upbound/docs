---
title: "Deploy with the Consumer Portal"
weight: 2
description: "Define a control plane for resource abstractions in a real cloud provider environment"
aliases:
    - "/getstarted-devex/consumer-portal"
    - "/getstarted/consumer-portal"
---


With your control plane project set up, you're ready to create resources in your
cloud service provider with the Consumer Portal.

<!-- vale gitlab.SentenceLength = NO -->
The Consumer Portal is a self-service tool that you and users in your organization can use to
deploy infrastructure based on claims and configurations you create. This portal
is what your developers interact with when they want to deploy infrastructure on your control plane
platform. For more information on adding users to Upbound, review the [Identity
Management guide]({{<ref "operate/accounts/identity-management/users" >}})
<!-- vale gitlab.SentenceLength = YES -->

Follow the flow below to create a resource based on your claim.

<!-- vale write-good.Passive = NO -->
<!-- vale gitlab.FutureTense = NO -->
<!-- vale Google.Will = NO -->
Login to the [Upbound Console](https://console.upbound.io) and navigate to the Consumer
Portal. Your browser will redirect you to the Consumer Experience portal, which only
displays information necessary for consumers to deploy infrastructure.
<!-- vale write-good.Passive = YES -->
<!-- vale gitlab.FutureTense = YES -->
<!-- vale Google.Will = YES -->

First, navigate to the Control Plane you created in the previous guides and
select the claim resource. Add a name and create your resource. Follow the
interactive guide below:

<div style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.764294049008168; padding: 40px 0 40px 0;"><iframe src="https://app.supademo.com/embed/cm33dyzpz126i2617f7l062iy?embed_v=2" loading="lazy" title="Upbound Consumer Portal" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

<!-- vale write-good.TooWordy = NO -->

## Modify a claim

You can modify your resource directly from the Consumer Portal. Navigate to the
resource and go to **Details**. From here, you can edit the fields or select
**Edit YAML** and create additional YAML specifications.
<!-- vale write-good.TooWordy = YES -->

<div style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.764294049008168; padding: 40px 0 40px 0;"><iframe src="https://app.supademo.com/embed/cm33flbir015fnf6c7d9sgt5k?embed_v=2" loading="lazy" title="New Demo" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Verify your resources

After creating and configuring your resources, you can verify your bucket
configuration using AWS CLI commands. Below are examples of how to confirm the
existence of an S3 bucket and verify its encryption settings.

### List buckets

<!-- vale write-good.Passive = NO -->
To verify your S3 bucket has been created, use the following command:
<!-- vale write-good.Passive = YES -->

```bash
aws s3api list-buckets
````

Expected output:

```json
{
    "Buckets": [
        {
            "Name": "devex-aws-bucket",
            "CreationDate": "2024-11-04T10:30:45+00:00"
        }
    ],
    "Owner": {
        "DisplayName": "<Your-AWS-Account>",
        "ID": "<Your-AWS-Account-ID>"
    }
}
```

In this output, verify your bucket is under `"Buckets"`, along with its creation date.

### Check bucket encryption

To verify encryption policy, use the following command, replacing `<your-bucket-name>` with your bucket's name:

```bash
aws s3api get-bucket-encryption --bucket <your-bucket-name>
```

Expected output:

```json
{
    "ServerSideEncryptionConfiguration": {
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                },
                "BucketKeyEnabled": true
            }
        ]
    }
}
```

<!-- vale write-good.Passive = NO -->
<!-- vale write-good.TooWordy = NO -->
This output confirms that server-side encryption is configured with `AES256` as
the encryption algorithm with `BucketKeyEnabled` set to `true`. This means
your bucket is encrypted based on the composition configuration. The
Consumer Portal user doesn't have to specify any additional information to get this.
<!-- vale write-good.TooWordy = YES -->
<!-- vale write-good.Passive = YES -->

## Destroy your resources

You can delete resources directly from the Consumer Portal. Select the resource
you want to delete and go to **Settings** then select **Delete Resource**.

Follow the interactive guide below:

<div style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.764294049008168; padding: 40px 0 40px 0;"><iframe src="https://app.supademo.com/embed/cm33errz80001ci8b2b2xi0jc?embed_v=2" loading="lazy" title="Upbound Consumer Portal" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

To verify bucket deletion, run the AWS S3 CLI again.

```bash
aws s3api get-bucket-encryption --bucket <your-bucket-name>
```

This command should return with an error:

```yaml {copy-lines="none"}
{
    "Error": {
        "Code": "NoSuchBucket",
        "Message": "The specified bucket does not exist",
        "BucketName": "devex-aws-bucket"
    }
}
```

## Next steps

<!-- vale Google.Exclamation = NO -->

You just drove an entire deployment lifecycle with an Upbound control plane!
Now you're ready for more Upbound concepts.
<!-- vale Google.Exclamation = YES -->

Check out the [Core Concepts](https://docs.upbound.io/core-concepts/) section for more information about
authoring compositions or configuration with Python and KCL.


<!-- vale gitlab.FutureTense = YES -->
<!-- vale Microsoft.HeadingAcronyms = YES -->
<!-- vale gitlab.SentenceLength = YES -->
