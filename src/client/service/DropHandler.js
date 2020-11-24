import { loadVideoFromFile, loadVideoFromUrl, loadVideoFromYoutube, loadSubtitle, completeVideoFromFile } from '@client/store/player';
import HeadRequest from '@client/http/HeadRequest';

const EXTENTION_MATCHER = /\.(\w+)$/i;
const URL_MATCHER = /^https?:\/\/.+\/([^/]+\.\w+)$/i;

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
        this.handleText(
            (event.clipboardData || window.clipboardData).getData('text').trim()
        );
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
                this.handleVideo(file);
                break;

            case 'text/vtt':
                this.handleSubtitle(file);
                break;

            case 'text/srt':
                this.handleSrtSubtitle(file);
                break;
        }

        const matches = name.match(EXTENTION_MATCHER);

        if (matches) {
            switch (matches[1]) {
                case 'srt':
                    this.handleSrtSubtitle(file);
                    break;

                case 'vtt':
                    this.handleSubtitle(file);
                    break;
            }
        }
    }

    handleVideo(file) {
        const { player } = this.store.getState();
        const isFileFromServer = player.source === 'file' && player.fromServer;
        const action = isFileFromServer ? completeVideoFromFile : loadVideoFromFile;

        this.store.dispatch(
            action(URL.createObjectURL(file), file.name, file.size,file.type)
        );
    }

    handleSubtitle(file) {
        this.store.dispatch(loadSubtitle(URL.createObjectURL(file), file.name));
    }

    handleSrtSubtitle(file) {
        this.converter.srtToVtt(file, this.handleSubtitle);
    }

    handleText(value) {
        const id = this.youtube.getVideoId(value);

        if (id) {
            return this.youtube.getVideoInfo(value, data => {
                const { title, formats } = data;

                this.store.dispatch(loadVideoFromYoutube(formats[0].url, title, formats[0].type));
            }, error => console.error(error));
        }

        const matches = value.match(URL_MATCHER);

        if (matches) {
            const [url, name] = matches;

            return new HeadRequest(url, ['Content-Type', 'Content-Length'], ([type, size]) => {
                return this.store.dispatch(
                    loadVideoFromUrl(url, name, type)
                );
            }, error => console.error(error));
        }
    }
}
