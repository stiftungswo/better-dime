#!/bin/bash -vu

status=0

# checks if formatters could have been run locally to fix the code style

# check backend (api)
composer global require "squizlabs/php_codesniffer=*"
# we run phpcbf twice to check if it was able to fix something
# since it reports more than it can fix we check the status code twice and check if it changed
# sadly there is no unique status code for "phpcbf fixed something and maybe there are unfixable errors"
$HOME/.composer/vendor/bin/phpcbf --standard=psr2 --ignore=vendor api/
code1=$?
$HOME/.composer/vendor/bin/phpcbf --standard=psr2 --ignore=vendor api/ > /dev/null 2>&1
code2=$?
if [ $code1 -ne $code2 ]; then
  echo "PHP Api is not properly formatted. Please reformat and commit again."
  status=1;
fi

echo "Checking for icon imports..."
egrep -R --exclude icons.tsx "import.*from '@material-ui/icons" frontend/src

if [ "$?" -eq 0 ]; then
  echo
  echo The files above contain direct imports of material icons.
  echo Re-export and import them from src/layouts/icons.tsx instead.
  status=1
else
  echo OK
fi

cd frontend
npx -q prettier --list-different --print-width 140 --single-quote --trailing-comma es5 "src/**/*.{ts,tsx}"
if [ $? -ne 0 ]; then
  echo "Web-client is not properly formatted. Please reformat and commit again. See https://github.com/stiftungswo/izivi/tree/master/web-client#formatting"
  status=1;
fi

exit $status
