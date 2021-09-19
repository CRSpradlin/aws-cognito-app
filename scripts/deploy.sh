zsh ./scripts/build.sh

cd ./aws
terraform apply -var-file=variables.tfvars