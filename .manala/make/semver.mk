##########
# Semver #
##########

define semver_bump
	VERSION=$(2) ; \
	if [ -z "$${VERSION}" ]; then \
		printf "$(COLOR_INFO)What's the version number? (current: $(COLOR_COMMENT)`cat $(firstword $(1))`$(COLOR_INFO))$(COLOR_RESET)\n" ; \
		read VERSION ; \
		if [ -z $${VERSION} ]; then \
        printf "$(COLOR_ERROR) ❌ Version cannot be empty. Aborting$(COLOR_RESET)\n" ; \
        exit 128 ; \
    fi ; \
	fi ; \
	printf "$(COLOR_INFO)Bumping version $(COLOR_COMMENT)$${VERSION}$(COLOR_INFO)…$(COLOR_RESET)\n" ; \
	for file in $(1) ; \
	do \
		echo $${VERSION} > $${file} ; \
	done ; \
	git add $(1) ; \
	git commit -m "Bump version $${VERSION}" ; \
	git diff HEAD^ HEAD --color | cat
endef
