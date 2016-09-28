#!/usr/bin/env bash

echo "build project"
webpack

echo "remove config"
sed -i -e "s/headers: {'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q='}//g" ./scripts/utils/cal-url.js
rm ./scripts/utils/cal-url.js-e

echo "packaging"
zip -r reporting-page.zip build index.html manifest.webapp icon.png
