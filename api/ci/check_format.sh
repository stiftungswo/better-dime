#!/bin/bash -vu
# check backend (api)
# we run phpcbf twice to check if it was able to fix something
# since it reports more than it can fix we check the status code twice and check if it changed
# sadly there is no unique status code for "phpcbf fixed something and maybe there are unfixable errors"
composer format
code1=$?
composer format > /dev/null 2>&1
code2=$?
if [ $code1 -eq $code2 ]; then
  echo "PHP API is properly formatted."
  exit 0
else
  echo "PHP Api is not properly formatted. Please reformat and commit again."
  exit 1;
fi
