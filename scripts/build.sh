#!/usr/bin/env zsh

mkdir ./temp

# Clean Current temp Folder
rm -r ./temp/*

# Copy Over Current Lambda Code
for file in ./modules/lambda/*.js
do
filename=$file:t
echo $filename
newfile="./temp/${filename}"
echo $newfile
cp $file $newfile
done

# Remove Lambda Test Files
rm -r ./temp/*.test.js

# Zip-Up Remaining JS Files
cd ./temp
for file in ./*.js
do
sed -i '' -- 's/\.\/opt/\/opt/g' $file
done
cd ..

# Run Init to Update Opt Folder
mkdir ./modules/lambda/opt; rm -rf ./modules/lambda/opt/*.js; cp ./modules/services/code/*.js ./modules/lambda/opt; rm ./modules/lambda/opt/*.test.js

# Prepare Service Lambda Layer Folder
mkdir ./temp/opt/
for file in ./modules/services/code/*.js
do
newfile="./temp/opt/${file:t}"
cp $file $newfile
done

# Remove All Test Files
rm -r ./temp/opt/*.test.js

# # Zip Service Lambda Layer
# cd ./temp/opt
# zip ../opt.zip ./*.js
# cd ../..

# # Delete Temp Folder
# rm -rf ./temp/opt

# Plan Terraform
# cd ./aws
# terraform plan -var-file=variables.tfvars
# cd ..

