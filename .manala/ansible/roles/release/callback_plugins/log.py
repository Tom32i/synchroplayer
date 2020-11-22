from ansible import constants as C
from ansible.plugins.callback import CallbackBase

class CallbackModule(CallbackBase):
    CALLBACK_VERSION = 2.0
    CALLBACK_TYPE = 'notification'
    CALLBACK_NAME = 'log'
    CALLBACK_NEEDS_WHITELIST = False

    def _std(self, result):
        stderr = result._result.get('stderr')
        if stderr:
            self._display.display('<<< stderr', color=C.COLOR_WARN)
            self._display.display(stderr)
            self._display.display('>>> stderr' + "\r\n", color=C.COLOR_WARN)

        stdout = result._result.get('stdout')
        if stdout:
            self._display.display('<<< stdout', color=C.COLOR_DEBUG)
            self._display.display(stdout)
            self._display.display('>>> stdout' + "\r\n", color=C.COLOR_DEBUG)

    def v2_runner_on_ok(self, result):
        # No loop
        if result._task_fields.get('loop'):
            return

        # Command module
        if not result._task_fields.get('action') == 'command':
            return

        # Tags
        if not any(tag in result._task_fields.get('tags') for tag in ('log', 'log_ok')):
            return

        self._std(result)

    def v2_runner_item_on_ok(self, result):
        # Command module
        if not result._task_fields.get('action') == 'command':
            return

        # Tags
        if not any(tag in result._task_fields.get('tags') for tag in ('log', 'log_ok')):
            return

        self._std(result)

    def v2_runner_on_failed(self, result, ignore_errors=False):
        # No loop
        if result._task_fields.get('loop'):
            return

        # Command module
        if not result._task_fields.get('action') == 'command':
            return

        # Tags
        if not any(tag in result._task_fields.get('tags') for tag in ('log', 'log_failed')):
            return

        self._std(result)

    def v2_runner_item_on_failed(self, result):
        # Command module
        if not result._task_fields.get('action') == 'command':
            return

        # Tags
        if not any(tag in result._task_fields.get('tags') for tag in ('log', 'log_failed')):
            return

        self._std(result)
