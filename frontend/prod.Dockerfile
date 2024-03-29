FROM node:12.13.0-alpine as building-stage

WORKDIR 'frontend'

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn install
COPY . .
RUN yarn run build

ARG ENVIRONMENT
ARG API_URL
ARG APIR_URL
ARG SENTRY_DSN_PUBLIC

RUN sed -i'' "s/ENVIRONMENT/${ENVIRONMENT}/g" build/static/js/main.*.js
RUN sed -i'' "s,BASE_API_URL,${API_URL},g" build/static/js/main.*.js
RUN sed -i'' "s,BASE_APIR_URL,${APIR_URL},g" build/static/js/main.*.js
RUN sed -i'' "s,SENTRY_DSN,${SENTRY_DSN_PUBLIC},g" build/static/js/main.*.js

# Serving
FROM httpd:2.4-alpine as production-stage
LABEL maintainer="Philipp Fehr, Lukas Bischof"
LABEL version="1.0"
LABEL description="betterDime frontend web docker container"

COPY --from=building-stage /frontend/build /usr/local/apache2/htdocs/
COPY htaccess.dist /usr/local/apache2/htdocs/.htaccess

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#AllowOverride [Nn]one#AllowOverride All#' /usr/local/apache2/conf/httpd.conf

EXPOSE 80
