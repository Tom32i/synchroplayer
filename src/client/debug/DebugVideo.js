export default class DebugVideo {
    constructor() {
        this.element = document.createElement('video');
        this.element.width = 160;
        this.element.height = 90;
        this.element.autoplay = true;
        this.element.style.position = 'absolute';
        this.element.style.top = 0;
        this.element.style.right = 0;

        this.element.addEventListener('loadStart', e => console.info(e.type, e));
        this.element.addEventListener('progress', e => console.info(e.type));
        this.element.addEventListener('timeupdate', e => console.info(e.type, this.element.playing, this.element.currentTime));
        this.element.addEventListener('canplay', e => console.info(e.type, e, this.element.play()));
        this.element.addEventListener('canplaythrough', e => console.info(e.type, e));
        this.element.addEventListener('durationchange', e => console.info(e.type, this.element.duration));
        this.element.addEventListener('loadeddata', e => console.info(e.type, e));
        this.element.addEventListener('loadedmetadata', e => console.info(e.type, e));
        this.element.addEventListener('timeUpdate', e => console.info(e.type, e));
        this.element.addEventListener('play', e => console.info(e.type, e));
        this.element.addEventListener('playing', e => console.info(e.type, e));
        this.element.addEventListener('ratechange', e => console.info(e.type, e));
        this.element.addEventListener('pause', e => console.info(e.type, e));
        this.element.addEventListener('ended', e => console.info(e.type, e));
        this.element.addEventListener('emptied', e => console.info(e.type, e));
        this.element.addEventListener('complete', e => console.info(e.type, e));
        this.element.addEventListener('waiting', e => console.info(e.type, e));
        this.element.addEventListener('suspend', e => console.info(e.type, e));
        this.element.addEventListener('stalled', e => console.info(e.type, e));
        this.element.addEventListener('resize', (e) => console.info(e.type, this.element.videoWidth, this.element.videoHeight));

        this.attach();
    }

    attach(parent = document.body) {
        parent.appendChild(this.element);
    }

    display(stream) {
        // this.element.autoplay = true;
        this.element.srcObject = stream;
    }

    getStream() {
        if (typeof this.element.captureStream === 'function') {
            return this.element.captureStream();
        }

        if (typeof this.element.mozCaptureStream === 'function') {
            return this.element.mozCaptureStream();
        }
    }
}
