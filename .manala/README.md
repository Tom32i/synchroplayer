# Elao - App

* [Requirements](#requirements)
* [Overview](#overview)
* [Quick start](#quick-start)
* [System](#system)
* [Integration](#integration)
    * [Jenkins](#jenkins)
    * [Github Actions](#github-actions)
    * [Common Integration Tasks](#common-integration-tasks)
* [Releases](#releases)
* [Makefile](#makefile)
* [Secrets](#secrets)
* [Tips, Tricks, and Tweaks](#tips-tricks-and-tweaks)

## Requirements

* Make
* Vagrant 2.2.10+
* Landrush 1.3.2+
* VirtualBox 6.1.12+
* Docker Desktop 2.2.0+

## Overview

This recipe contains some helpful scripts in the context of a php/nodejs app, such as Makefile tasks in order to release and deploy your app.

## Quick start

In a shell terminal, change directory to your app, and run the following commands:

```shell
    $ cd /path/to/my/app
    $ manala init
    # Select the "elao.app" recipe
```

Edit the `Makefile` at the root directory of your project and add the following lines at the beginning of the file:

```
.SILENT:

-include .manala/Makefile
```

Then update the `.manala.yaml` file (see [the releases example](#releases) below) and then run the `manala up` command:

```
    $ manala up
```

> :warning: don't forget to run the `manala up` command each time you update the `.manala.yaml` file to actually apply your changes !!!

From now on, if you execute the `make help` command in your console, you should obtain the following output:

```shell
Usage: make [target]

Help:
  help This help

Docker:
  docker Run docker container

App:
```

## VM interaction

In your app directory.

Initialise your app:
```bash
make setup
```

Start VM:
```bash
make up
```

Stop VM:
```bash
make halt
```

VM shell:
```bash
make ssh
```


## System

Here is an example of a system configuration in `.manala.yaml`:

```yaml
##########
# System #
##########

system:
    version: 10
    hostname: app.vm
    #memory: 2048 # Optionnal
    #cpus: 1 # Optionnal
    #motd: # Optionnal
    #    template: template/elao.j2
    #    message: App
    #timezone: Etc/UTC # Optionnal
    #locales: # Optionnal
    #    default: C.UTF-8
    #    codes: []
    #env: # Optionnal
    #    FOO: bar
    apt:
        #repositories: [] # Optionnal
        #preferences: [] # Optionnal
        packages:
          - pdftk
          - https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.stretch_amd64.deb
    files:
      - path: /srv/app/var/log
        src: /srv/log
        state: link_directory
      - path: /srv/app/var/cache
        src: /srv/cache
        state: link_directory
      #- path: /srv/app/api/var/log
      #  src: /srv/log/api
      #  state: link_directory
      #- path: /srv/app/api/var/cache
      #  src: /srv/cache/api
      #  state: link_directory
    nginx:
        configs: []
        # configs:
        #     # Php fpm
        #     - file: app_php_fpm
        #       template: nginx/app_php_fpm.j2
        #     # Gzip
        #     - file: app_gzip
        #       template: nginx/app_gzip.j2
        #     # Ssl
        #     - file: app_ssl.conf
        #       template: nginx/app_ssl_offloading.conf.j2
        #     # Cors
        #     - file: app_cors
        #       template: nginx/app_cors.j2
        #     # No index
        #     - file: app_no_index
        #       template: nginx/app_no_index.j2
    php:
        version: 7.4
        extensions:
          # Symfony
          - intl
          - curl
          - mbstring
          - xml
          # App
          - mysql
    nodejs:
        version: 12
        # packages:
        #   - package: mjml
        #     version: 4.6.3
    # cron:
    #     files:
    #       - file: app
    #         env:
    #           SHELL: /usr/bin/zsh
    #           HOME: /srv/app
    #         jobs:
    #           - name: foo-bar
    #             job: bin/console app:foo:bar --no-interaction -vv >> /srv/log/cron.foo-bar.log 2>&1
    #             minute: 0
    # supervisor:
    #     configs:
    #         - file: app.conf
    #           groups:
    #               acme:
    #                   programs:
    #                       - foo
    #                       - bar
    #           programs:
    #               foo:
    #                   command: zsh -c "bin/console app:acme:foo --no-interaction -vv"
    #                   directory: /srv/app
    #                   stdout_logfile: /srv/log/supervisor.acme-foo.log
    #               bar:
    #                   command: zsh -c "bin/console app:acme:bar --no-interaction -vv"
    #                   directory: /srv/app
    #                   stdout_logfile: /srv/log/supervisor.acme-bar.log
    #               foo-bar:
    #                   command: zsh -c "bin/console app:foo:bar --no-interaction -vv"
    #                   directory: /srv/app
    #                   stdout_logfile: /srv/log/supervisor.foo-bar.log
    #         - file: app_foo.conf
    #           config: |
    #               [program:foo]
    #               command=/bin/foo
    # MariaDB
    mariadb:
        version: 10.5
    # ...*OR* MySQL...
    mysql:
        version: 5.7
    # redis:
    #     version: "*"
    #     config:
    #       - save: '""' # Disable persistence
    elasticsearch:
        version: 7
        plugins:
          - analysis-icu
    # influxdb:
    #     version: "*"
    #     databases:
    #       - app
    #     users:
    #       - database: app
    #         name: app
    #         password: app
    #     privileges:
    #       - database: app
    #         user: app
    #         grant: ALL
    #     config:
    #       - reporting-disabled: true
    # mongodb:
    #     version: 4.4
    ssh:
        client:
            config:
                - Host *.elao.run:
                    - User: app
                    - ForwardAgent: yes
                - Host *.elao.local:
                    - User: app
                    - ForwardAgent: yes
                    - ProxyCommand: ssh gateway@bastion.elao.com -W %h:%p
```


## Integration

### Jenkins

Here are some examples of integration configurations in `.manala.yaml` for Jenkins:

```yaml
###############
# Integration #
###############

integration:
    tasks:
      - shell: make install@integration
      - label: Integration
        junit: report/junit/*.xml
        parallel: true
        warn: true
        tasks:
          - label: Lint
            tasks:
              - shell: make lint.php-cs-fixer@integration
              - shell: make lint.twig@integration
              - shell: make lint.yaml@integration
              - shell: make lint.eslint@integration
          - label: Security
            tasks:
              - shell: make security.symfony@integration
              - shell: make security.yarn@integration
          - label: Test
            tasks:
              - shell: make test.phpunit@integration
                artifacts: var/log/*.log
                # artifacts:
                #   - var/log/foo.log
                #   - var/log/bar.log
                # env:
                #     DATABASE_URL: mysql://root@127.0.0.1:3306/app
```

In this example we have two parallel stages: `api` and `mobile`, corresponding to two different sub-apps.

```yaml
###############
# Integration #
###############

integration:
    tasks:
      - label: Integration # Optionnal
        parallel: true # ! Careful ! Could *NOT* be nested !
        junit: report/junit/*.xml
        artifacts: var/log/*.log
        warn: true # Turn errors into warnings (recursively applied)
        tasks:
          - app: api # Optionnal
            tasks:
              - shell: make install@integration
              - shell: make build@integration
              - shell: make lint.php-cs-fixer@integration
              - shell: make security.symfony@integration
              - shell: make test.phpunit@integration
                artifacts: var/log/*.log
                # env:
                #     DATABASE_URL: mysql://root@127.0.0.1:3306/app
          - app: mobile
            tasks:
              - shell: make install@integration
              - shell: make build@integration
              - shell: make lint.eslint@integration
              - shell: make test.jest@integration
```

### Github Actions

The recipes generates a `Dockerfile` and a `docker-compose.yaml` file that can 
be used to provide a fully-fledged environnement according to your project needs.

The [Elao/manala-ci-action](https://github.com/Elao/manala-ci-action) rely on 
this to allow you running any CLI command in this environnement, 
using Github Action workflows.

### Common integration tasks

Add in your `Makefile`:

```makefile
###########
# Install #
###########

...

install@integration: export APP_ENV = test
install@integration:
	# Composer
	composer install --ansi --verbose --no-interaction --no-progress --prefer-dist --optimize-autoloader --no-scripts --ignore-platform-reqs
	#composer run-script symfony-scripts --ansi --verbose --no-interaction
	# Npm
	npm install --color=always --no-progress --no-audit
	# Yarn
	yarn install --color=always --no-progress

###########
# Build #
###########

...

build@integration:
	# Webpack Encore
	npx encore production --color=always --no-progress

########
# Lint #
########

...

lint.php-cs-fixer@integration:
	mkdir -p report/junit
	vendor/bin/php-cs-fixer fix --dry-run --diff --format=junit > report/junit/php-cs-fixer.xml

lint.phpstan@integration:
	mkdir -p report/junit
	vendor/bin/phpstan --error-format=junit --no-progress --no-interaction analyse > report/junit/phpstan.xml

lint.twig@integration:
	bin/console lint:twig templates --ansi --no-interaction

lint.yaml@integration:
	bin/console lint:yaml config translations --ansi --no-interaction

lint.eslint@integration:
	npx eslint src --format junit --output-file report/junit/eslint.xml

lint.stylelint@integration:
	mkdir -p report/junit
	npx stylelint "assets/styles/**/*.scss" \
		--syntax scss \
		--custom-formatter "node_modules/stylelint-junit-formatter" \
		> report/junit/stylelint.xml

lint.flow@integration:
	mkdir -p report/junit
	npx flow check --json | npx flow-junit-transformer > report/junit/flow.xml

############
# Security #
############

...

security.symfony@integration:
	symfony check:security

security.yarn@integration:
	yarn audit ; RC=$${?} ; [ $${RC} -gt 2 ] && exit $${RC} || exit 0

security.npm@integration:
	npm audit --audit-level moderate

########
# Test #
########

...

test.phpunit@integration: export APP_ENV = test
test.phpunit@integration:
	# Db
	bin/console doctrine:database:create --ansi
	bin/console doctrine:schema:create --ansi
	# PHPUnit
	bin/phpunit --colors=always --log-junit report/junit/phpunit.xml

test.jest@integration: export JEST_JUNIT_OUTPUT_DIR = report/junit
test.jest@integration: export JEST_JUNIT_OUTPUT_NAME = jest.xml
test.jest@integration:
	npx jest --ci --color --reporters=default --reporters=jest-junit

```

## Releases

Here is an example of a production/staging release configuration in `.manala.yaml`:

```yaml
############
# Releases #
############

releases:

  - &release
    #app: api # Optionnal
    mode: production
    repo: git@git.elao.com:<vendor>/<app>-release.git
    # Release
    release_tasks:
      - shell: make install@production
      - shell: make build@production
    # You can either explicitly list all the paths you want to include
    release_add:
      - bin
      - config
      - public
      - src
      - templates
      - translations
      - vendor
      - composer.* # Composer.json required by src/Kernel.php to determine project root dir
                   # Composer.lock required by composer on post-install (warmup)
      - Makefile

    # Or you can include all by default and only list the paths you want to exclude
    # release_removed:
    #   - ansible
    #   - build
    #   - doc
    #   - node_modules
    #   - tests
    #   - .env.test
    #   - .php_cs.dist
    #   - .manala*
    #   - package.json
    #   - phpunit.xml.dist
    #   - README.md
    #   - Vagrantfile
    #   - webpack.config.js
    #   - yarn.lock

    # Deploy
    deploy_hosts:
      - ssh_host: foo-01.bar.elao.local
        #master: true # Any custom variable are welcomed
      - ssh_host: foo-02.bar.elao.local
    deploy_dir: /srv/app
    deploy_shared_files:
      - config/parameters.yml
    deploy_shared_dirs:
      - var/log
    deploy_tasks:
      - shell: make warmup@production
      #- shell: make migration@production
      #  when: master | default # Conditions on custom host variables (jinja2 format)
    deploy_post_tasks:
      - shell: sudo /bin/systemctl reload php7.4-fpm
      #- shell: sudo /bin/systemctl restart supervisor

  - << : *release
    mode: staging
    release_tasks:
      - shell: make install@staging
      - shell: make build@staging
    # Deploy
    deploy_hosts:
      - ssh_host: foo.bar.elao.ninja.local
    deploy_tasks:
      - shell: make warmup@staging
```

## Makefile

Makefile targets that are supposed to be runned via docker must be prefixed.

```
foo: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
foo:
	# Do something really foo...
```

Ssh
```
#######
# Ssh #
#######

## Ssh to staging server
ssh@staging: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
ssh@staging:
	ssh app@foo.staging.elao.run

# Single host...

ssh@production: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
ssh@production:
	...

# Multi host...

ssh@production-01: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
ssh@production-01:
	...
```

Sync
```
sync@staging: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
sync@staging:
	mkdir -p var
	rsync --archive --compress --verbose --delete-after \
		app@foo.staging.elao.run:/srv/app/current/var/files/ \
		var/files/

# Multi targets...
sync-uploads@staging: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
sync-uploads@staging:
  ...

# Multi apps...
sync.api-uploads@staging: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
sync.api-uploads@staging:
  ...
```

### Git tools

This recipe contains some git helpers such as the [`git_diff`](./make/make.git.mk) function.

This function is useful for example to apply `php-cs`, `php-cs-fix` or `PHPStan` checks only on the subset of updated PHP files and not on any PHP file of your project.

Usage (in your `Makefile`):

```shell
lint.php-cs-fixer: DIFF = $(call git_diff, php, src tests)
lint.php-cs-fixer:
	$(if $(DIFF), \
		vendor/bin/php-cs-fixer fix --config=.php_cs.dist --path-mode=intersection --diff --dry-run $(DIFF), \
		printf "You have made no change in PHP files\n" \
	)
```

### Try tools

This recipe contains some try helpers such as the [`try_finally`](./make/make.try.mk) function.

This function is useful for example to run `phpunit` tests needing a started symfony server, and to stop this server regardless of the tests retur code.

Usage (in your `Makefile`):

```shell
test.phpunit@integration:
	symfony server:start --ansi --no-humanize --daemon --no-tls --port=8000
	$(call try_finally, \
		bin/phpunit --colors=always --log-junit report/junit/phpunit.xml, \
		symfony server:stop --ansi \
	)
```

## Secrets

In order to generate secrets, use [Gomplate](https://docs.gomplate.ca), called by a make task.
Gomplate takes a template, queries its values from a Vault server and renders a file.

Add the following tasks in the `Makefile`:

```
###########
# Secrets #
###########

secrets@production:
	gomplate --input-dir=secrets/production --output-map='{{ .in | replaceAll ".gohtml" "" }}'

secrets@staging:
	gomplate --input-dir=secrets/staging --output-map='{{ .in | replaceAll ".gohtml" "" }}'
```

Put your templates in `.gohtml` files inside a `secrets/[production|staging]` directory at the root of the project.  
Respect destination file names, extensions, and paths:

```
secrets
├── production
│   ├── .env.gohtml
│   └── config
│       └── parameters.yaml.gohtml
└── staging
    ├── .env.gohtml
    └── config
        └── parameters.yaml.gohtml
```

Here are some template examples:

`.env.gohtml`:

```
# This file was generated by Gomplate from Vault secrets for production
{{- range $key, $value := (datasource "vault:///foo_bar/data/env").data }}
{{ $key }}={{ $value | quote }}
{{- end }}
```

`config/parameters.yaml.gohtml`:

```
# This file was generated by Gomplate from Vault secrets for production
parameters:
{{ (datasource "vault:///foo_bar/data/parameters").data | toYAML | indent 4 -}}
```

/!\ Note that the path to the secret will slightly differ from what the Vault server will display \
/!\ If the path is `foo_bar/env` on the Vault server, it will become `foo_bar/data/env` in the template

!!! Warning
    Make sure to include the `secrets` directory into your release, using the `release_add` entry.

## Tips, Tricks, and Tweaks

* Vagrant root privilege requirement
  https://www.vagrantup.com/docs/synced-folders/nfs.html#root-privilege-requirement
* Debug ansible provisionning
  ```
  ansible-galaxy collection install manala.roles --collections-path /vagrant/ansible/collections
  ```
