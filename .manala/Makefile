# Relative root dir ("."|".."|"../.."|…)
_ROOT_DIR := $(patsubst ./%,%,$(patsubst %/.manala/Makefile,%,./$(filter %.manala/Makefile,$(MAKEFILE_LIST))))
# Is current dir root ? (""|"1")
_ROOT := $(if $(filter .,$(_ROOT_DIR)),1)
# Relative current dir ("."|"foo"|"foo/bar"|…)
_DIR := $(patsubst ./%,%,.$(patsubst $(realpath $(CURDIR)/$(_ROOT_DIR))%,%,$(CURDIR)))

include $(_ROOT_DIR)/.manala/make/text.mk
include $(_ROOT_DIR)/.manala/make/help.mk
include $(_ROOT_DIR)/.manala/make/os.mk
include $(_ROOT_DIR)/.manala/make/try.mk
include $(_ROOT_DIR)/.manala/make/git.mk
include $(_ROOT_DIR)/.manala/make/semver.mk

###############
# Environment #
###############

HELP += $(call help_section, Environment)

# Vagrant commands only available *outside* vagrant
ifneq ($(container),vagrant)

export VAGRANT_CWD = $(_ROOT_DIR)/.manala

include $(_ROOT_DIR)/.manala/vagrant/make.mk

# Setup only available in root directory
ifdef _ROOT
HELP += $(call help,setup,          Setup environment)
setup:
	vagrant up --provision
	$(setup)
endif

HELP += $(call help,up,             Start the environment)
up:
	vagrant up

HELP += $(call help,halt,           Stop the environment)
halt:
	vagrant halt

HELP += $(call help,reload,         Restart the environment)
reload:
	vagrant reload

HELP += $(call help,ssh,            Connect to the environment via SSH)
ssh: export WORKDIR = /srv/app/$(_DIR)
ssh:
	vagrant ssh

HELP += $(call help,destroy,        Stop and delete environment)
destroy:
	vagrant destroy

HELP += $(call help,provision,      Provision the environment (TAGS|DIFF|VERBOSE))
provision:
	vagrant provision --provision-with system

else

HELP += $(call help,provision,      Provision the environment (TAGS|DIFF|VERBOSE))
provision:
	$(call log, Install ansible galaxy collection)
	ansible-galaxy collection install \
	  --requirements-file /vagrant/ansible/roles/system/requirements.yaml \
	  --force
	$(call log, Run ansible playbook)
	cd /vagrant/ansible \
	  && ansible-playbook system.yaml \
	    --limit development \
	    --inventory-file inventories \
	    --become \
			$(if $(TAGS),--tags $(TAGS)) \
			$(if $(VERBOSE),-vvv) \
			$(if $(DIFF),--check --diff) \

endif

HELP += $(call help,provision.apt,  Provision the environment - Apt (DIFF|VERBOSE))
provision.apt: export TAGS = apt
provision.apt: provision

HELP += $(call help,provision.files,Provision the environment - Files (DIFF|VERBOSE))
provision.files: export TAGS = files
provision.files: provision

HELP += $(call help,provision.nginx,Provision the environment - Nginx (DIFF|VERBOSE))
provision.nginx: export TAGS = nginx
provision.nginx: provision

HELP += $(call help,provision.supervisor,Provision the environment - Supervisor (DIFF|VERBOSE))
provision.supervisor: export TAGS = supervisor
provision.supervisor: provision

HELP += $(call help,provision.php,  Provision the environment - Php (DIFF|VERBOSE))
provision.php: export TAGS = php
provision.php: provision

##########
# Docker #
##########

include $(_ROOT_DIR)/.manala/docker/make.mk

# Docker commands only available *outside* docker
ifneq ($(container),docker)
HELP += $(call help_section, Docker)

HELP += $(call help,docker,Run docker container)
docker:
	$(call docker_run)

endif

############
# Releases #
############

HELP += $(call help_section, Releases)

HELP += $(call help,release@production,Release in production)
release@production: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
release@production:
		ansible-playbook $(_ROOT_DIR)/.manala/ansible/release.yaml \
			--inventory $(_ROOT_DIR)/.manala/ansible/inventories/release.yaml \
			--limit production

HELP += $(call help,deploy@production,Deploy in production (REF))
deploy@production: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
deploy@production:
	ansible-playbook $(_ROOT_DIR)/.manala/ansible/deploy.yaml \
		--inventory $(_ROOT_DIR)/.manala/ansible/inventories/deploy.yaml \
		--limit production \
		$(if $(REF),--extra-vars '{"deploy_strategy_git_ref": "$(REF)"}')

HELP += $(call help,release@staging,Release in staging)
release@staging: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
release@staging:
		ansible-playbook $(_ROOT_DIR)/.manala/ansible/release.yaml \
			--inventory $(_ROOT_DIR)/.manala/ansible/inventories/release.yaml \
			--limit staging

HELP += $(call help,deploy@staging,Deploy in staging (REF))
deploy@staging: SHELL := $(or $(DOCKER_SHELL),$(SHELL))
deploy@staging:
	ansible-playbook $(_ROOT_DIR)/.manala/ansible/deploy.yaml \
		--inventory $(_ROOT_DIR)/.manala/ansible/inventories/deploy.yaml \
		--limit staging \
		$(if $(REF),--extra-vars '{"deploy_strategy_git_ref": "$(REF)"}')

#######
# App #
#######

HELP += $(call help_section, App)
