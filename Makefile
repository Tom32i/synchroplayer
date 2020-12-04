.SILENT:
.PHONY: build

-include .manala/Makefile

define setup
	make install build
endef

## Install dependencies
install:
	npm install

install@production:
	npm install --no-progress --color=always

## Start watcher
watch:
	npx webpack --watch --mode=development

## Build
build:
	npx webpack --mode=production

## Lint
lint:
	npx eslint src/* --ext .js,.json --fix

start-client:
	php -S 0.0.0.0:8000 -t build

start-server:
	node bin/server.js 8001
