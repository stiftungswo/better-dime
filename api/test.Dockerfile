FROM php:7.2-cli

ENV APP_HOME /var/api
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN apt update && apt install unzip libpng-dev -y && apt clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/www/html/*
RUN docker-php-ext-install pdo pdo_mysql gd zip

RUN php -r "readfile('https://getcomposer.org/installer');" > composer-setup.php && \
        php composer-setup.php && \
        php -r "unlink('composer-setup.php');" && \
        mv composer.phar /usr/local/bin/composer
        
RUN wget -O /tmp/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /tmp/wait-for-it.sh

COPY composer* $APP_HOME/
RUN composer install --no-autoloader
COPY . $APP_HOME
RUN composer dump-autoload
