# AWS API Application with Cognito User Pools and Authentication

## TL;DR

The Goal of this application is to create a base boilerplate for a fully integrated API backend interface. The API will be secured through cognito user pools and cognito authentication. This will allow easy stand up of applications with fully featured and scalable user managment.

In order for the appliction to build, provide your own AWS authentication method as well as a `variables.tfvars` in the `aws` folder in order to provide your aws account id as well as the name of your application.

### Software Dependencies
Software Requirements:
- NodeJS 12 or Higher
- NPM 6.14.0 or Higher
- Terraform 1.0.0 or Higher

## Setup

Within the `aws` folder, a `variables.tfvars` needs to be created with the values for those variables. For optional variables, an empty string can be assigned for their value. Information on weather or not a variable is optional can be found within the `aws/variables.tf` file.

Example `aws/variables.tfvars` File:
```
str_aws_account_id = "XXXXXXXXXXXX"
str_app_name = "ExampleAppName"

str_domain = ""
``` 

For authentication and connection to your aws account, an `auth.tf` file can be created within the `aws` folder. Further information on how you can authenticate for aws can be found this [Terraform Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs).

## Scripts
There are a series of scripts to help build and deploy the application.

- `npm run build`: Builds the lambda and lambda-layer code zip files and places them in their respective archive folders.
- `npm run deploy`: Runs the build command and deploys them to the aws infrastructure via Terraform commands.
- `npm test`: Runs Jest and all corresponding `*.test.js` files. Subsequently makes a code coverage report for all `*.js` files.


## Optional Configurations

### Domain Name Integration

One of the optional configuration variables is a domain name. This will allow you to connect the created api gateway resources to your own domain versus using the default given aws domain/url. The domain is verified by a DNS record. Information on how the verification process works and the steps you need to complete during the verification wait step can be found in this [AWS Documentation Page](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html).

> Note: DNS Record terraform construction waits until the domain is verified via the DNS method. This can slow the infrastructure application process or may require multiple attempts to apply the infrastructure. This wait process does not occur if you provide an empty string for your domain name as shown in the example `variables.tfvars` file.

