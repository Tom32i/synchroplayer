.SILENT:
.PHONY: build

## Install dependencies
install:
	npm install

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

# Publish package
publish: build
	npm publish . --access public
