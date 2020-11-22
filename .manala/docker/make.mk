##########
# Docker #
##########

# Run docker container.
#
# Examples:
#
# Example #1:
#
#   $(call docker_run)
#
# Example #2:
#
#   $(call docker_run, whoami)

define docker_run
	$(call message, Building docker image...) \
	&& ID=$$( \
		docker build \
			--quiet \
			$(_ROOT_DIR)/.manala \
	) \
	&& docker run \
		--rm \
		--tty \
		--interactive \
		--hostname synchroplayer.vm \
		--mount 'type=bind,consistency=delegated,source=$(realpath $(_ROOT_DIR)),target=/srv/app' \
		--workdir /srv/app/$(_DIR) \
		--env XDG_CACHE_HOME=/docker/.cache/docker \
		--mount 'type=bind,consistency=delegated,source=$(realpath $(_ROOT_DIR)/.manala),target=/docker' \
		$(if $(OS_DARWIN),\
			--env SSH_AUTH_SOCK=/run/host-services/ssh-auth.sock \
			--volume /run/host-services/ssh-auth.sock:/run/host-services/ssh-auth.sock, \
			--env SSH_KEY=/home/docker/.ssh/id_rsa \
			--mount 'type=bind$(,)consistency=cached$(,)source=$(HOME)/.ssh/id_rsa$(,)target=/home/docker/.ssh/id_rsa' \
		) \
		--mount 'type=bind,consistency=cached,source=$(HOME)/.gitconfig,target=/home/docker/.gitconfig' \
		$${ID} \
		$(if $(1),$(strip $(1)),bash)
endef

ifneq ($(container),docker)
DOCKER_SHELL = $(call docker_run,$(SHELL))
endif
