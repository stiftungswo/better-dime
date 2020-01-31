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
### Vorbereitung
#### Commit Hooks
Damit der Code einheitlich formatiert bleibt, wird ein pre-commit Hook verwendet. Der Travis-Build failt, wenn der Code nicht richtig formatiert ist. 

``ln -s $(pwd)/hooks/pre-commit $(pwd)/.git/hooks``

#### Homebrew für Mac
Fast jede Linux-Distribution wird mit einem Paketmanager ausgeliefert. Diese ermöglichen dir, bequem neue Programme zu installieren, ohne dazu eine aufwendige Installation durchführen zu müssen. Unter Mac hat die Community homebrew entwickelt, um einen solchen Paketmanager auf Mac bereitzustellen.

Die Installation kann im Terminal mit einem Einzeiler angestossen werden, welcher sich auf der [offiziellen Website](https://brew.sh/index_de) befindet.

#### Docker
Installation gemäss der Installationsanleitung auf der [Website](https://docs.docker.com/install/) durchführen. Wichtig: Für manche Betriebssysteme muss docker-compose noch separat installiert werden.

### Backend
1. Ins Verzeichnis des Dime wechseln (z.B. cd ``~/src/swo/betterDime``)
2. Docker-Image der API bauen: ``docker build -t dime_api api``
3. composer-Abhängigkeiten mit dem neuen Image installieren lassen: ``docker run --rm -v $PWD/api:/app -w /app dime_api composer install``
4. Docker-Stack starten: ``docker-compose up -d``
5. .env Datei kopieren: ``cp api/.env.example api/.env``
6. Neuen Applikationskey erstellen und in die .env-Datei abfüllen als APP_KEY: ``openssl rand -base64 24``
7. Neuen Key für die JWT-Tokens erstellen und in die .env-Datei als JWT_SECRET abfüllen: ``openssl rand -base64 24``
8. Datenbank mit phpmyadmin (localhost:38080) namens "dime" erstellen.
   * Testdaten Seeden `docker exec -it dime_api php artisan migrate:fresh --seed`
9. Die API ist nun unter `localhost:38000` erreichbar.

### Frontend
Damit insbesondere auf Macs die Kompilierzeiten beim Hot Reload nicht beeinträchtig werden, wird empfohlen, direkt auf dem Entwicklungssystem und nicht in einem Container zu entwickeln.

#### Lokal
1. `cd betterDime/frontend`
2. `yarn install`
3. `yarn start`

#### Docker
1. `docker-compose up web-client`
