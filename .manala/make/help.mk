########
# Help #
########

HELP = \
	\nUsage: make [$(COLOR_INFO)target$(COLOR_RESET)] \
	$(call help_section, Help) \
	$(call help,help,This help)

define help_section
	\n\n$(COLOR_COMMENT)$(strip $(1)):$(COLOR_RESET)
endef

define help
  \n  $(COLOR_INFO)$(1)$(COLOR_RESET) $(2)
endef

help:
	@printf "$(HELP)$(HELP_SUFFIX)"
	awk ' \
		/^[-a-zA-Z0-9_.@%\/]+:/ { \
			hasMessage = match(lastLine, /^## (.*)/); \
			if (hasMessage) { \
				lines++; \
				helpCommands[lines] = substr($$1, 0, index($$1, ":")); \
				helpLenght = length(helpCommands[lines]); \
				if (helpLenght > helpLenghtMax) { \
					helpLenghtMax = helpLenght; \
				} \
				helpMessages[lines] = substr(lastLine, RSTART + 3, RLENGTH); \
			} \
		} \
		{ lastLine = $$0 } \
		END { \
			for (i = 1; i <= lines; i++) { \
       			printf "\n  $(COLOR_INFO)%-" helpLenghtMax "s$(COLOR_RESET) %s", helpCommands[i], helpMessages[i]; \
       		} \
		} \
	' $(MAKEFILE_LIST)
	@printf "\n\n"

.PHONY: help
