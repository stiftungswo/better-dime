FROM ruby:2.7.5

ENV BUNDLER_VERSION=2.1.4
ENV RAILS_ENV=production
ENV RACK_ENV=production

RUN wget -O /tmp/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /tmp/wait-for-it.sh

RUN gem install bundler -v "2.1.4" --no-document
RUN apt-get update && apt-get install -y mariadb-client

WORKDIR /apir
COPY Gemfile* ./
COPY . /apir

RUN bundle install --jobs=8

EXPOSE 3000
CMD ["bin/rails", "server", "-p", "3000", "-b", "0.0.0.0"]
