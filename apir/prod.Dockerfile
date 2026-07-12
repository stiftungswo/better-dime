FROM ruby:3.4@sha256:29925d7cc6a147012d1104bb39baf652aae56bfa27647f401366616654a5e7cd

ENV BUNDLER_VERSION=2.6.2
ENV RAILS_ENV=production
ENV RACK_ENV=production

RUN wget -O /tmp/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /tmp/wait-for-it.sh

RUN gem install bundler -v "2.6.2" --no-document
RUN apt-get update && apt-get install -y mariadb-client

WORKDIR /apir
COPY Gemfile* ./
COPY . /apir

RUN bundle install --jobs=8

RUN useradd --create-home appuser && chown -R appuser:appuser /apir
USER appuser

EXPOSE 3000
CMD ["bin/rails", "server", "-p", "3000", "-b", "0.0.0.0"]
