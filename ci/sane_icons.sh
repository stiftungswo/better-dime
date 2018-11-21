#!/bin/sh

echo "Checking for icon imports..."

egrep -R --exclude icons.ts "import.*from '@material-ui/icons" frontend/src

if [ "$?" -eq 0 ]; then
  echo
  echo The files above contain direct imports of material icons.
  echo Re-export and import them from src/layouts/icons.ts instead.
  exit 1
else
  echo OK
fi
