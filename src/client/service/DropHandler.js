import { loadVideoFromFile, loadVideoFromUrl, loadVideoFromYoutube, loadSubtitle, completeVideoFromFile } from '@client/store/player';
import HeadRequest from '@client/http/HeadRequest';

const FILENAME_MATCHER = /^\/?(.+)\.(\w+)$/i;

export default class DropHandler {
    constructor(store, converter, youtube) {
        this.store = store;
        this.converter = converter;
        this.youtube = youtube;

        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleVideo = this.handleVideo.bind(this);
        this.handleSubtitle = this.handleSubtitle.bind(this);
    }

    start() {
        document.addEventListener('dragover', this.onDragOver);
        document.addEventListener('drop', this.onDrop);
        document.addEventListener('paste', this.onPaste);
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDrop(event) {
        event.preventDefault();

        const { items } = event.dataTransfer;

        Array.from(items).forEach(this.handleDrop);
    }

    onPaste(event) {
        const content = (event.clipboardData || window.clipboardData).getData('text');

        content.split('\n').forEach(line => this.handleText(line.trim()));
    }

    handleDrop(item) {
        const { kind, type } = item;

        switch (kind) {
            case 'file':
                this.handleFile(item.getAsFile());
                break;

            case 'string':
                item.getAsString(this.handleText);
                break;

            default:
                console.info(`Could not handle drop ${kind} ${type}`);
                break;
        }

    }

    handleFile(file) {
        const { name, type } = file;

        switch (type) {
            case 'video/webm':
            case 'video/mp4':
            case 'video/quicktime':
            case 'video/x-matroska':
                this.handleVideo(file);
                return;

            case 'text/vtt':
                this.handleSubtitle(file);
                return;

            case 'text/srt':
                this.handleSrtSubtitle(file);
                return;
        }

        const extension = this.getExtention(name);

        switch (extension) {
            case 'srt':
                this.handleSrtSubtitle(file);
                return;

            case 'vtt':
                this.handleSubtitle(file);
                return;

            case 'mkv':
            case 'mp4':
            case 'avi':
                this.handleVideo(file);
                return;
        }

        console.info(`File type "${type}" with extension "${extension}" not supported.`);
    }

    handleVideo(file) {
        const { player } = this.store.getState();
        const isFileFromServer = player.source === 'file' && player.fromServer;
        const action = isFileFromServer && file.name === player.name ? completeVideoFromFile : loadVideoFromFile;

        this.store.dispatch(
            action(URL.createObjectURL(file), file.name, file.size, file.type)
        );
    }

    handleSubtitle(file) {
        this.store.dispatch(loadSubtitle(URL.createObjectURL(file), file.name));
    }

    handleSrtSubtitle(file) {
        this.converter.srtFileToVttFile(file, this.handleSubtitle);
    }

    handleVideoUrl(url, name, type) {
        this.store.dispatch(loadVideoFromUrl(url, name, type));
    }

    handleSubtitleUrl(url, name, type) {
        this.store.dispatch(loadSubtitle(url, name, type));
    }

    handleSrtSubtitleUrl(url) {
        this.converter.srtUrlToVttFile(url, this.handleSubtitle);
    }

    handleText(value) {
        const id = this.youtube.getVideoId(value);

        if (id) {
            return this.store.dispatch(loadVideoFromYoutube(id));
        }

        const { href, pathname } = this.getUrl(value);

        if (href) {
            return new HeadRequest(href, ['Content-Type', 'Content-Length'], ([type]) => {
                switch (type) {
                    case 'video/webm':
                    case 'video/mp4':
                    case 'application/octet-stream':
                        this.handleVideoUrl(href, pathname, type);
                        break;

                    case 'text/vtt':
                        this.handleSubtitleUrl(href, pathname, type);
                        break;

                    case 'text/srt':
                        this.handleSrtSubtitleUrl(href, pathname, type);
                        break;
                }

                switch (this.getExtention(pathname)) {
                    case 'vtt':
                        this.handleSubtitleUrl(href, pathname, type);
                        break;

                    case 'srt':
                        this.handleSrtSubtitleUrl(href, pathname, type);
                        break;
                }

                console.info(`Url "${value}" of type "${type}" not supported.`);
            }, error => console.error(error));
        }
    }

    getExtention(filename) {
        const matches = filename.match(FILENAME_MATCHER);

        if (!matches) {
            return null;
        }

        return matches[2];
    }

    getUrl(value) {
        try {
            return new URL(value);
        } catch (error) {
            return {};
        }
    }
}
