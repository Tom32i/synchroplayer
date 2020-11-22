import JsonRequest from '@client/http/JsonRequest';

export default class Youtube {
    static MATCHER = /^https?:\/\/(youtu\.be\/|www\.youtube\.com\/embed\/)(\w+)$/i;

    constructor(host) {
        this.host = host;
    }

    getVideoId(url) {
        const match = url.match(this.constructor.MATCHER);

        if (match) {
            return match[2];
        }

        return null;
    }

    getVideoInfo(url) {
        new JsonRequest(
            `//${this.host}/youtube?url=${encodeURIComponent(url)}`,
            data => {
                console.log(data);
            },
            error => console.error(error)
        );
    }
}
