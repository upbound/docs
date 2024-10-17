vpc = {
    "apiVersion": "ec2.aws.upbound.io/v1beta1",
    "kind": "VPC",
    "spec": {
        "forProvider": {
            "cidrBlock": "10.0.0.0/16",  
            "enableDnsHostnames": True,
        }
    }
}