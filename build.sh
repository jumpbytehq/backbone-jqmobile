#!/bin/sh
#install uglify.js before running
#sudo npm -g install uglify-js

cat src/util.js src/core.js src/template.js src/fragment.js src/block.js src/page.js src/widget.js > dist/backbone-jqmobile.js
echo 'created dist/backbone-jqmobile.js'
cat src/util.js src/core.js src/template.js src/fragment.js src/block.js src/page.js src/widget.js | uglifyjs -o dist/backbone-jqmobile.min.js
echo 'created dist/backbone-jqmobile.min.js'
echo 'Done...'