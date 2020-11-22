#!/usr/bin/env bash

set -e

# Cache (Composer and Yarn both follows XDG Base Directory Specification. For
# the others, related environment variables must be expanded at runtime)
if [ -n "${XDG_CACHE_HOME}" ]; then
    mkdir -p ${XDG_CACHE_HOME}
    # Bash
    export HISTFILE="${XDG_CACHE_HOME}/.bash_history"
    # Ansible
    export ANSIBLE_CACHE_PLUGIN_CONNECTION="${XDG_CACHE_HOME}/ansible"
fi

# Ssh authorization socket
if [ -n "${SSH_AUTH_SOCK}" ]; then
    sudo chmod 777 ${SSH_AUTH_SOCK}
fi

# Ssh key
if [ -n "${SSH_KEY}" ]; then
    eval `ssh-agent` 1>/dev/null
    ssh-add ${SSH_KEY} 2>/dev/null
fi

exec "$@"
