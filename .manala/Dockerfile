FROM debian:10-slim

LABEL maintainer="Elao <contact@elao.com>"

ARG UID=1000
ARG GID=1000

#########
# Setup #
#########

# The 'container' environment variable tells systemd that it's running inside a
# Docker container environment.
# It's also internally used for checking we're running inside a container too.
ENV \
  container="docker"

RUN \
    # Disable irrelevants apt-key warnings
    export APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE="1" \
    # Disable all debian user interaction
    && export DEBIAN_FRONTEND="noninteractive" \
    && apt-get update \
    && apt-get install --yes --no-install-recommends \
        bash-completion \
        gnupg dirmngr \
        ca-certificates \
        sudo \
    # Srv
    && mkdir -p /srv \
    && chmod 777 /srv \
    # User
    && addgroup --gid ${GID} docker \
    && adduser --disabled-password --gecos "" docker --uid ${UID} --ingroup docker \
    # Bash
    && sed -i 's/^#force_color_prompt=yes/force_color_prompt=yes/' \
        /home/docker/.bashrc \
    # Sudo
    && echo "docker ALL=(ALL) NOPASSWD:ALL" \
        > /etc/sudoers.d/docker \
    # Ansible
    && echo "deb http://ppa.launchpad.net/ansible/ansible/ubuntu bionic main" \
        > /etc/apt/sources.list.d/ppa_launchpad_net_ansible_ansible_ubuntu.list \
    && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 93C4A3FD7BB9C367 \
    && apt-get update \
    && apt-get install --yes --no-install-recommends \
        ansible python3 python3-apt

COPY docker/bin/entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

##########
# System #
##########

COPY ansible/inventories/system.yaml         /tmp/ansible/inventories/
COPY ansible/roles/system                    /tmp/ansible/roles/system/
COPY ansible/templates                       /tmp/ansible/templates/
COPY ansible/ansible.cfg ansible/system.yaml /tmp/ansible/

RUN \
    cd /tmp/ansible \
    && ansible-galaxy collection install \
      --requirements-file roles/system/requirements.yaml \
      --force \
    && ansible-playbook system.yaml \
      --inventory-file inventories \
      --limit integration \
    && rm -Rf /tmp/ansible

RUN \
    # NodeJs
    mkdir -p /usr/etc \
    && echo "cache=\${XDG_CACHE_HOME}/npm" > /usr/etc/npmrc

WORKDIR /srv/app

USER docker
