FROM ruby:2.7.5

ARG UID=1000
ARG GID=1000

ENV BUNDLER_VERSION=2.1.4
#ENV RAILS_ENV=development test
#ENV RACK_ENV=development test

RUN useradd -ms /bin/bash rails

RUN wget -O /tmp/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /tmp/wait-for-it.sh

RUN gem install bundler -v "2.1.4" --no-document
RUN apt-get update && apt-get install -y mariadb-client

WORKDIR /apir
COPY Gemfile* ./
COPY . /apir
RUN chown -R $UID:$GID /apir /usr/local/bundle
USER $UID:$GID

RUN bundle install --jobs=8

EXPOSE 3000
CMD ["bin/rails", "server", "-p", "3000", "-b", "0.0.0.0"]
