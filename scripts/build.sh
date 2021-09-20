mkdir ./release

# Clean Current Release Folder
rm -r ./release/*

# Copy Over Current Lambda Code
for file in ./modules/lambda/*.js
do
filename=$file:t
echo $filename
newfile="./release/${filename}"
echo $newfile
cp $file $newfile
done

# Remove Lambda Test Files
rm -r ./release/*.test.js

# Zip-Up Remaining JS Files
cd ./release
for file in ./*.js
do
sed -i '' -- 's/\.\/opt/\/opt/g' $file
zip $file:t:r.zip $file:t
rm $file
done
cd ..

# Prepare Service Lambda Layer Folder
mkdir ./release/opt/
for file in ./modules/services/code/*.js
do
newfile="./release/opt/${file:t}"
cp $file $newfile
done

# Remove All Test Files
rm -r ./release/opt/*.test.js

# Zip Service Lambda Layer
cd ./release/opt
zip ../opt.zip ./*.js
cd ../..

# Delete Temp Folder
rm -rf ./release/opt

# Plan Terraform
# cd ./aws
# terraform plan -var-file=variables.tfvars
# cd ..

