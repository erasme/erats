#!/bin/bash

for i in `find -iname tsconfig.json -exec dirname {}  \;`; do bash -c "echo $i; cd $i; tsc"; done
