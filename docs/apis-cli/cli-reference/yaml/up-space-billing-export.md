Export a billing report for submission to Upbound.

#### Usage

```bash
up space billing export [flags]
```

#### Flags

##### `--out` / `-o`

**Default:** `upbound_billing_report.tgz`

Name of the output file.

##### `--provider`

Storage provider. Must be one of: aws, gcp, azure.

##### `--bucket`

Storage bucket.

##### `--endpoint`

Custom storage endpoint.

##### `--account`

Name of the Upbound account whose billing report is being collected.

##### `--azure-storage-account`

Name of the Azure storage account. Required for --provider=azure.

##### `--billing-month`

Export a report for a billing period of one calendar month. Format: 2006-01.

##### `--billing-custom`

Export a report for a custom billing period. Date range is inclusive. Format: 2006-01-02/2006-01-02.

##### `--force-incomplete`

Export a report for an incomplete billing period.

#### Examples

```bash
# Show help
up space billing export --help
```
