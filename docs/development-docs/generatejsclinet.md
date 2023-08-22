// Security component was missing in yaml 
// So to achieve bearer token base security in low level code we created a- patch file for provided yaml.
// That patch have to apply in yaml file before generating low level code
// Apply patch
cd lib
git apply apiauthyaml.patch

// Generate low level code
cd src
npm run generate:openapi

// Remove patch
cd lib
git apply -R apiauthyaml.patch

//Now lib/js-client will contains low level code for ready to impplement.
