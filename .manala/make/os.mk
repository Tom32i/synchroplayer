######
# Os #
######

# Os detection helpers.
#
# Examples:
#
# Example #1: conditions on linux
#
#   echo $(if $(OS_LINUX),Running on Linux,*NOT* running on Linux)

ifeq ($(OS),Windows_NT)
    OS = windows
else
    OS = $(shell uname | tr '[:upper:]' '[:lower:]')
endif

OS_LINUX = $(if $(findstring $(OS),linux),1,)
OS_DARWIN = $(if $(findstring $(OS),darwin),1,)
OS_WINDOWS = $(if $(findstring $(OS),windows),1,)
