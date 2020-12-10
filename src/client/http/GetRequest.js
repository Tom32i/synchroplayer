/**
 * HTTP GET Request
 */
export default class GetRequest {
    /**
   * Constructor
   *
   * @param {String} url
   * @param {Function} success
   * @param {Function} error
   * @param {Bool} withCredentials
   */
    constructor(url, success, error, withCredentials = false) {
        this.url = url;
        this.success = success;
        this.error = error;
        this.request = new XMLHttpRequest();

        this.onReadyStateChange = this.onReadyStateChange.bind(this);
        this.onError = this.onError.bind(this);

        this.request.addEventListener('readystatechange', this.onReadyStateChange);
        this.request.addEventListener('error', this.onError);
        this.request.open('GET', this.url, true);
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

    onResponse() {
        let content;

        try {
            content = this.getContent();
        } catch (error) {
            return this.onError(error);
        }

        this.onSuccess(content);
    }

    onSuccess(content) {
        this.clear();
        this.success(content);
    }

    onError(error) {
        const message = `Request to "${this.url}" failed with status "${this.request.status}": ${error}`;
        this.clear();
        this.error(new Error(message));
    }

    getContent() {
        return this.request.responseText;
    }

    clear() {
        this.request.removeEventListener('readystatechange', this.onReadyStateChange);
        this.request.removeEventListener('error', this.onError);
        this.request = null;
    }
}
