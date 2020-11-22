from __future__ import (absolute_import, division, print_function)
__metaclass__ = type

from ansible.plugins.lookup import LookupBase
from ansible.module_utils.six import string_types
from ansible.errors import AnsibleError

class LookupModule(LookupBase):

    def run(self, terms, variables=None, **kwargs):

        results = []

        itemDefault = {
            'options': None,
            'when': True
        }

        for term in self._flatten(terms):

            items = []

            # Task as a single line
            if isinstance(term, string_types):
                item = itemDefault.copy()
                item.update({
                    'task': term
                })
                items.append(item)
            else:
                # Guess task (first one not in blacklist)
                item = None
                for termKey, termValue in term.items():
                    if termKey not in ['when']:
                        item = itemDefault.copy()
                        item.update({
                            'task':    termKey,
                            'options': termValue
                        })
                        break
                if item:
                    item.update({
                        'when': term.get('when') if 'when' in term else True
                    })
                    items.append(item)

            # Merge
            for item in items:
                results.append(item)

        return results
