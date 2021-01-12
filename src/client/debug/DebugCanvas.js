import Loop from '@client/common/Loop';

export default class DebugCanvas {
    constructor() {
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.loop = new Loop(this.update.bind(this));
        this.speed = 5000;

        this.element.width = 160;
        this.element.height = 90;
        this.element.style.position = 'absolute';
        this.element.style.top = 0;
        this.element.style.left = 0;

        this.loop.start();

        this.attach();
    }

    attach(parent = document.body) {
        parent.appendChild(this.element);
    }

    setColor(color) {
        this.context.fillStyle = color;
    }

    fill() {
        this.context.fillRect(0, 0, this.element.width, this.element.height);
    }

    update() {
        this.setColor(`hsl(${Math.floor(((1 + Date.now() / this.speed) / 2) * 360)}, 100%, 50%)`);
        this.fill();
    }

    getStream(fps = 10) {
        return this.element.captureStream(fps);
    }
}

