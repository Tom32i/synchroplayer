###########
# Vagrant #
###########

define vagrant_ssh
	vagrant ssh -- cd /srv/app/$(_DIR) \&\& $(strip $(1))
endef

ifneq ($(container),vagrant)
VAGRANT_MAKE = $(call vagrant_ssh, make)
else
VAGRANT_MAKE = $(MAKE)
endif
