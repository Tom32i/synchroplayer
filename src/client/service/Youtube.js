import JsonRequest from '@client/http/JsonRequest';

export default class Youtube {
    static MATCHER = /^https?:\/\/(youtu\.be|www\.youtube\.com)\/(watch\?v=)?([^&]+).*$/i;


    constructor(host) {
        this.host = host;
    }

    getVideoId(url) {
        const matches = url.match(this.constructor.MATCHER);

        if (!matches) {
            return null;
        }

        return matches.pop();
    }

    getVideoInfo(url, success, failure) {
        new JsonRequest(
            `//${this.host}/youtube?url=${encodeURIComponent(url)}`,
            success,
            failure
        );
    }
}
