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

mkdir ./release/opt/
for file in ./modules/services/code/*.js
do
newfile="./release/opt/${file:t}"
cp $file $newfile
done

rm -r ./release/opt/*.test.js

cd ./release/opt
zip ../opt.zip ./*.js
cd ../..

rm -rf ./release/opt

cd ./aws
terraform plan -var-file=variables.tfvars
cd ..

