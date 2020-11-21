.SILENT:
.PHONY: build

## Install dependencies
install:
	npm install

## Start watcher
watch:
	npx webpack --watch  --mode=development

## Build
build:
	npx webpack --mode=production

## Start server
start-client:
	php -S 0.0.0.0:8000 -t build

start-server:
	node build/server.js 8001

start-demo:
	php -S 0.0.0.0:8002 -t demo

## Lint
lint:
	npx eslint src/* --ext .js,.json --fix
