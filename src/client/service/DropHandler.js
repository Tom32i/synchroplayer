import { loadVideoFromFile, loadVideoFromUrl, loadSubtitle } from '@client/store/player';
import HeadRequest from '@client/http/HeadRequest';

const TYPE_VIDEO_MATCHER = /^video/i;
const EXTENTION_MATCHER = /\.(\w+)$/i;
const URL_MATCHER = /^https?:\/\/.+\/([^\/]+\.\w+)$/i;

export default class DropHandler {
    constructor(store) {
        this.store = store;

        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleText = this.handleText.bind(this);
    }

    start() {
        document.addEventListener('dragover', this.onDragOver);
        document.addEventListener('drop', this.onDrop);
        document.addEventListener('paste', this.onPaste);

        // this.store.dispatch(loadVideo('/demo/TheyLive.mp4'));
        // this.store.dispatch(loadSubtitle('/demo/TheyLive.vtt'));
    }
    onDragOver(event) {
        event.preventDefault();

        // const { items } = event.dataTransfer;

        // Array.from(items).forEach(item => console.log(item.kind, item.type));
    }

    onDrop(event) {
        event.preventDefault();

        const { items } = event.dataTransfer;

        Array.from(items).forEach(this.handleDrop);
    }

    onPaste(event) {
        this.handleText(
            (event.clipboardData || window.clipboardData).getData('text')
        );
    }

    handleDrop(item) {
        const { kind, type } = item;

        console.log(kind, type);

        if (kind === 'file') {
            return this.handleFile(item.getAsFile());
        }

        if (kind === 'string') {
            return item.getAsString(this.handleText);
        }

        console.info(`Could not handle rop ${kind} ${type}`);
    }

    handleFile(file) {
        const { name, type, size } = file;
        console.log('handleFile', { name, type, size });
        if (type.match(TYPE_VIDEO_MATCHER)) {
            new HeadRequest(URL.createObjectURL(file), data => console.log(data), error => console.error(error));
            return this.store.dispatch(
                loadVideoFromFile(URL.createObjectURL(file), name, size, type)
            );
        }

        const matches = name.match(EXTENTION_MATCHER);
        console.log(matches);
        if (matches) {
            switch (matches[1]) {
                case 'srt':
                    return this.store.dispatch(loadSubtitle(URL.createObjectURL(file)));

                case 'vtt':
                    return this.store.dispatch(loadSubtitle(URL.createObjectURL(file)));
            }
        }
    }

    handleText(value) {
        console.log('handleText', value);

        const matches = value.trim().match(URL_MATCHER);

        if (matches) {
            const [url, name] = matches;

            return new HeadRequest(url, ['Content-Type', 'Content-Length'], ([type, size]) => {
                return this.store.dispatch(
                    loadVideoFromUrl(url, name, parseInt(size, 10), type)
                );
            }, error => console.error(error));
        }
    }
}
