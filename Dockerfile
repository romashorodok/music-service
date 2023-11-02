FROM php:8.2.5-fpm
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www

RUN apt-get update && apt-get install -y git libzip-dev zip unzip  \
    && docker-php-ext-install zip pdo_mysql bcmath

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && apt-get install -y nodejs

RUN apt-get install -y \
    librdkafka-dev \
    && pecl install rdkafka \
    && docker-php-ext-enable rdkafka

COPY . .

ARG COMPOSER_ALLOW_SUPERUSER=1

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache
RUN chmod +r /var/www

RUN composer install --no-interaction --no-scripts --no-autoloader
RUN composer dump-autoload --optimize

EXPOSE 80

CMD ["php-fpm"]
