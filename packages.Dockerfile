FROM php:8.2.5-fpm AS build

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /app 

RUN apt-get update && apt-get install -y bash libzip-dev zip unzip  \
    && docker-php-ext-install zip bcmath

COPY . .

ARG COMPOSER_ALLOW_SUPERUSER=1

RUN composer install --no-interaction --no-scripts --no-autoloader --ignore-platform-reqs 

RUN composer dump-autoload

RUN php artisan backpack:publish-assets

FROM nginx:1.25.0-alpine-slim

COPY --from=build /app/public/packages /app/packages
COPY ./infra/packages.nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

CMD ["nginx", "-g", "daemon off;"]
