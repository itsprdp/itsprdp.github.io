-include .env
export

COMPOSE := $(if $(shell command -v podman-compose 2>/dev/null),podman-compose,docker compose)

.PHONY: help serve build clean docker-serve docker-build docker-clean

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "  serve          Start local dev server with live reload and drafts"
	@echo "  build          Build the site to _site/"
	@echo "  clean          Remove _site/"
	@echo ""
	@echo "  docker-serve   Start dev server in Docker"
	@echo "  docker-build   Build the Docker image"
	@echo "  docker-clean   Stop and remove Docker containers"

serve:
	bundle exec jekyll serve --livereload --drafts --open-url

build:
	bundle exec jekyll build

clean:
	rm -rf _site

docker-serve:
	$(COMPOSE) up

docker-build:
	$(COMPOSE) build

docker-clean:
	$(COMPOSE) down
