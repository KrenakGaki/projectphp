FROM  php:8.2-apache

# Instala extensões necessárias para Laravel e PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    zip \
    git \
    7zip \
    && docker-php-ext-install pdo pdo_pgsql pgsql


# Instalar o Composer globalmente
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html
# Habilita o mod_rewrite do Apache
RUN a2enmod rewrite

# Define o diretório de trabalho
WORKDIR /var/www/html


# Define permissões adequadas
RUN chown -R www-data:www-data /var/www/html

# Expõe a porta 80
EXPOSE 80

# Comando padrão
CMD ["apache2-foreground"]