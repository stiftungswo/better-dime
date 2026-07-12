FROM ruby:3.4

ARG UID=1000
ARG GID=1000

ENV BUNDLER_VERSION=2.6.2

RUN useradd -ms /bin/bash rails

RUN wget -O /tmp/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /tmp/wait-for-it.sh

RUN gem install bundler -v "2.6.2" --no-document
RUN apt-get update && apt-get install -y mariadb-client

WORKDIR /apir
COPY Gemfile* ./
COPY . /apir
RUN mkdir /.cache && chown -R $UID:$GID /apir /usr/local/bundle /.cache
USER $UID:$GID

RUN bundle install --jobs=8

EXPOSE 3000
CMD bin/rails server -p 8000 -b 0.0.0.0
