FROM ruby:3.4-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /site

COPY Gemfile ./
RUN bundle install

EXPOSE 4000 35729
