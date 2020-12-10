import GetRequest from '@client/http/GetRequest';

export default class SubtitleConverter {
    static CONTENT_REPLACER = [
        /(\d{2}:\d{2}:\d{2}),(\d{3} --> \d{2}:\d{2}:\d{2}),(\d{3})/gi,
        '$1.$2.$3',
    ];

    static FILENAME_REPLACER = [
        /^(.+)\.srt$/ig,
        '$1.vtt',
    ];

    srtFileToVttFile(file, callback) {
        this.readFromFile(
            file,
            content => callback(this.convertToVtt(content, file.name)),
            error => callback(error)
        );
    }

    srtUrlToVttFile(url, callback) {
        new GetRequest(
            url,
            content => callback(this.convertToVtt(content, url)),
            error => callback(error)
        );
    }

    convertToVtt(content, filename) {
        const { CONTENT_REPLACER, FILENAME_REPLACER } = this.constructor;
        const lines = ['WEBVTT\n\n', content.replace(...CONTENT_REPLACER)];
        const name = filename.replace(...FILENAME_REPLACER);

        return new File(lines, name, { type: 'text/vtt' });
    }

    readFromFile(file, success, failure) {
        const reader = new FileReader();

        reader.addEventListener('error', () => failure(reader.error));
        reader.addEventListener('load', () => success(reader.result));

        reader.readAsText(file);
    }
}
