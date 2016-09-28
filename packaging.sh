#!/usr/bin/env bash

echo "build project"
webpack

echo "remove config"
sed -i -e "s/headers: {'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q='}//g" ./scripts/utils/cal-url.js

echo "copy js and css"
cp ./build/* .

echo "packaging"
zip -r reporting-page.zip index.html bundle.js vendor.bundle.js bundle.css manifest.webapp icon.png

echo "remove temporary files"
rm ./scripts/utils/cal-url.js-e
rm ./bundle.js
rm ./vendor.bundle.js
rm ./bundle.css
