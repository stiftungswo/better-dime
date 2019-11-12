#!/bin/bash -vue
php artisan db:create
php artisan migrate:fresh -q
vendor/phpunit/phpunit/phpunit --order-by=random --coverage-clover=coverage.xml
if [ $? == 0 ]; then
    bash <(curl -s https://codecov.io/bash)
fi
