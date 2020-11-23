import youtube from 'ytdl-core';

export default class YoutubeRequest {
    constructor(url, success, failure) {
        this.url = url;
        this.success = success;
        this.failure = failure;

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
        this.filterFormat = this.filterFormat.bind(this);
        this.sortFormat = this.sortFormat.bind(this);
        this.serializeFormat = this.serializeFormat.bind(this);

        this.send();
    }

    send() {
        youtube.getInfo(this.url)
            .then(this.onSuccess)
            .catch(this.onError);
    }

    onSuccess(data) {
        this.success({
            title: data.videoDetails.title,
            formats: data.formats
                .filter(this.filterFormat)
                .sort(this.sortFormat)
                .map(this.serializeFormat),
        });
    }

    onError(error) {
        console.error(error);
        this.error(error);
    }

    filterFormat(format) {
        return format.hasVideo && format.hasAudio;
    }

    sortFormat(a, b) {
        if (a.height === b.height) {
            return 0;
        }

        return a.height > b.height ? -1 : 1;
    }

    serializeFormat(format) {
        const { url, container, mimeType, qualityLabel } = format;

        return {
            url,
            container,
            type: mimeType,
            quality: qualityLabel,
        };
    }
}

