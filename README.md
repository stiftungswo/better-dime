# Dime
[![Build Status](https://semaphoreci.com/api/v1/stiftungswo/better-dime/branches/dev/badge.svg)](https://semaphoreci.com/stiftungswo/better-dime)
[![codecov](https://codecov.io/gh/stiftungswo/betterDime/branch/master/graph/badge.svg)](https://codecov.io/gh/stiftungswo/betterDime)

A complete rewrite of [Dime](https://github.com/stiftungswo/dime) using Laravel & React.

## General Purpose

The project's purpose is tracking working expenses, writing offers and sending invoices

An API and open architecture will serve additional purposes:

  * accounting and invoicing (generate invoices, add non-time related items)
  * manage customers (CRM)
  * project management
  
## Language

Dime is developed in and used by a foundation in the German speaking part of Switzerland. Development is done in German and the UI is in German as well. It is possible due to the diversity of languages in Switzerland that other languages will eventually be added to the UI. However, the database is not designed to accommodate multiple languages in one installation.


## Entwicklung

### Docker
Wir nutzen Docker. Das einzige, was installiert werden muss, ist Docker.

### Vorbereitung (veraltet)
#### Ruby
Damit am Dime entwickelt werden kann, muss Ruby installiert werden. Am besten wird ein Ruby version manager (e.g rbenv) installiert damit eine einfache Umstellung auf neuere Versionen ermöglicht wird. Momentan wird ruby 2.6.5 verwendet.
#### MySQL
Dime verwendet MySQL als Datenbankverwaltungssystem. Installiert MySQL gemäss dem Installationsanleitung für euer relevantes Betriebssystem. Da bei der Installation vom Dime auf Linux einige Probleme mit Version 8.0 entstehen, sollte MySQL 5.7 verwendet werden falls auf Linux entwickelt wird. Auf Mac kann MySQL 8.0 mit Homebrew problemlos verwendet werden.

#### Yarn
Fürs frontend wird Yarn verwendet. Installiert Yarn gemäss der Installationsanleitung für euer relevantes Betriebssystem.

### Dime Installation

#### Backend
1. Clone repository
2. ``cd dime-clone-directory && cd apir``
3. ``cp .env.example .env``
4. In der .env Datei im apir folder folgende Anpassungen ausführen:
 - DATABASE_USERNAME=MeinDatenbankUsername
 - DATABASE_PASSWORD=MeinDatenbankPasswort
 - DEVISE_JWT_SECRET_KEY=ZufälligeZeichenkette
 - DEVISE_SECRET_KEY=ZufälligeZeichenkette
 - DEVISE_PEPPER=         (Leer lassen)
5. ``gem install bundler``
6. ``bundle install``
7. ``bundle exec rails db:create``
8. ``bundle exec rails db:migrate``

Info: Falls auf Mac beim Installieren des Backends ein Problem mit dem mysql2 gem verursacht wird sollte das mysql2 gem wie folt installiert werden: ``gem install mysql2 -v '0.5.2' -- --with-ldflags=-L/usr/local/opt/openssl/lib --with-cppflags=-I/usr/local/opt/openssl/include``. Zuerst ist sicherzustellen dass OpenSSL am speizifizierten Pfad (/usr/local/opt/openssl) installiert ist.

#### Frontend
1. ``cd dime-clone-directory && cd frontend``
2. ``yarn install``

### Dime Starten

1. ``cd dime-clone-directory && cd apir``
2. ``rails s -p 38001``
3. Neues Terminal aufmachen
4. ``cd dime-clone-directory && cd frontend``
5. ``yarn start``

26.05.2020 14:50

#Readme-Update 
Test um Semaphore Build zu starten.
