import { loadVideoFromFile, loadVideoFromUrl, loadSubtitle } from '@client/store/player';
import HeadRequest from '@client/http/HeadRequest';

const TYPE_VIDEO_MATCHER = /^video/i;
const EXTENTION_MATCHER = /\.(\w+)$/i;
const URL_MATCHER = /^https?:\/\/.+\/([^/]+\.\w+)$/i;

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
            (event.clipboardData || window.clipboardData).getData('text')
        );
    }

    handleDrop(item) {
        const { kind, type } = item;

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

        if (type.match(TYPE_VIDEO_MATCHER)) {
            return this.store.dispatch(
                loadVideoFromFile(URL.createObjectURL(file), name, size, type)
            );
        }

        const matches = name.match(EXTENTION_MATCHER);

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
