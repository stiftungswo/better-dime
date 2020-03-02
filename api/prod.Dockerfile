FROM php:7.2-cli

RUN apt-get update && apt-get install -y unzip libpng-dev

RUN docker-php-ext-install pdo pdo_mysql && \
    php -r "readfile('https://getcomposer.org/installer');" > composer-setup.php && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');" && \
    mv composer.phar /usr/local/bin/composer
COPY . .
RUN apt clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/www/html/*

RUN docker-php-ext-install gd zip

RUN composer install

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "/public"]
