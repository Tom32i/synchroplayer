import { loadVideo, loadSubtitle } from '@client/store/player';

const VIDEO_MATCHER = new RegExp('^video\/', 'ig');
const EXTENTION_MATCHER = new RegExp('\.(\w+)$', 'ig');

export default class DropHandler {

    constructor(store) {
        this.store = store;

        //document.addEventListener('drap', this.onDrage);

        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    start() {
        //document.addEventListener('drag', event => console.log('drag', event));
        //document.addEventListener('dragend', event => console.log('dragend', event));
        document.addEventListener('dragenter', this.onDragEnter);
        document.addEventListener('dragexit', event => console.log('dragexit', event));
        document.addEventListener('dragleave', event => console.log('dragleave', event));
        document.addEventListener('dragover', this.onDragOver);
        document.addEventListener('dragstart', event => console.log('dragstart', event));
        document.addEventListener('drop', this.onDrop);

        //this.store.dispatch(loadVideo('/demo/TheyLive.mp4'));
        //this.store.dispatch(loadSubtitle('/demo/TheyLive.vtt'));
    }

    onDragEnter(event) {
        const { items } = event.dataTransfer;

        //Array.from(items).forEach(item => console.log(item.kind, item.type));
    }

    onDragOver(event) {
        event.preventDefault();

        const { items } = event.dataTransfer;

        //Array.from(items).forEach(item => console.log(item.kind, item.type));
    }

    onDrop(event) {
        event.preventDefault();

        const { items } = event.dataTransfer;

        Array.from(items).forEach(this.handleDrop);
    }

    handleDrop(item) {
        const { kind, type } = item;

        if (kind !== 'file') {
            return;
        }

        const file = item.getAsFile();

        if (type.match(VIDEO_MATCHER)) {
            return this.store.dispatch(loadVideo(URL.createObjectURL(file)));
        }

        const matches = file.name.match(EXTENTION_MATCHER);

        if (matches) {
            switch (matches[1]) {
                case 'srt':
                    return this.store.dispatch(loadSubtitle(URL.createObjectURL(file)));

                case 'vtt':
                    return this.store.dispatch(loadSubtitle(URL.createObjectURL(file)));
            }
        }
    }
}
