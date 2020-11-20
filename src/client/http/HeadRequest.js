/**
 * Head HTTP Request
 */
export default class HeadRequest {
    /**
   * Constructor
   *
   * @param {String} url
   * @param {Array} headers
   * @param {Function} success
   * @param {Function} error
   * @param {Bool} withCredentials
   */
    constructor(url, headers, success, error, withCredentials = false) {
        this.url = url;
        this.headers = headers;
        this.success = success;
        this.error = error;
        this.request = new XMLHttpRequest();

        this.onReadyStateChange = this.onReadyStateChange.bind(this);
        this.onError = this.onError.bind(this);

        this.request.addEventListener('readystatechange', this.onReadyStateChange);
        this.request.addEventListener('error', this.onError);
        this.request.open('HEAD', this.url, true);
        this.request.withCredentials = withCredentials;
        this.request.send();
    }

    /**
   * On ready state change
   */
    onReadyStateChange() {
        if (this.request.readyState === 4) {
            if (this.request.status === 200) {
                this.onResponse();
            } else {
                this.onError();
            }
        }
    }

    /**
   * On response
   */
    onResponse() {
        const headers = this.headers.map(name => this.request.getResponseHeader(name));

        return this.onSuccess(headers);
    }

    /**
   * On success
   *
   * @param {Object} data
   */
    onSuccess(data) {
        this.clear();
        this.success(data);
    }

    /**
   * On Error
   */
    onError() {
        const message = `Request to "${this.url}" failed with status "${this.request.status}".`;
        this.clear();
        this.error(new Error(message));
    }

    /**
   * Clear the request
   */
    clear() {
        this.request.removeEventListener('readystatechange', this.onReadyStateChange);
        this.request.removeEventListener('error', this.onError);
        this.request = null;
    }
}
