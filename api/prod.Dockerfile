FROM php:7.1-cli

RUN apt-get update && apt-get install -y unzip libpng-dev

RUN docker-php-ext-install pdo pdo_mysql && \
    php -r "readfile('https://getcomposer.org/installer');" > composer-setup.php && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');" && \
    mv composer.phar /usr/local/bin/composer
COPY . .
RUN apt clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/www/html/*

RUN pecl install xdebug && docker-php-ext-enable xdebug

RUN docker-php-ext-install gd zip

COPY xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

RUN composer install
RUN php artisan migrate --no-interaction --force

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "/public"]