import User from '@server/room/User';
import Video from '@server/room/Video';

export default class Room {
    constructor(id) {
        this.id = id;
        this.users = new Map();
        this.video = null;

        this.addClient = this.addClient.bind(this);
        this.removeClient = this.removeClient.bind(this);
        this.onClientReady = this.onClientReady.bind(this);
        this.onClientPlay = this.onClientPlay.bind(this);
        this.onClientPause = this.onClientPause.bind(this);
        this.onClientVideoFile = this.onClientVideoFile.bind(this);
        this.onClientVideoUrl = this.onClientVideoUrl.bind(this);
        this.onUserReady = this.onUserReady.bind(this);
        this.onVideoPlaying = this.onVideoPlaying.bind(this);
    }

    addClient(client) {
        this.createUser(client);

        client.on('close', this.removeClient);
        client.on('user:ready', this.onClientReady);
        client.on('control:play', this.onClientPlay);
        client.on('control:pause', this.onClientPause);
        client.on('video:file', this.onClientVideoFile);
        client.on('video:url', this.onClientVideoUrl);
    }

    removeClient(client) {
        this.removeUser(client);

        client.off('close', this.removeClient);
        client.off('user:ready', this.onClientReady);
        client.off('control:play', this.onClientPlay);
        client.off('control:pause', this.onClientPause);
        client.off('video:file', this.onClientVideoFile);
        client.off('video:url', this.onClientVideoUrl);
    }

    createUser(client) {
        const user = new User(client.id);

        this.send('user:add', user.id);
        this.sumUp(client, user);

        this.users.set(client, user);

        user.on('ready', this.onUserReady);

        if (this.video) {
            this.video.pause();
        }
    }

    removeUser(client) {
        const user = this.users.get(client);

        this.users.delete(client);

        this.send('user:remove', user.id);

        user.off('ready', this.onUserReady);

        if (this.video) {
            this.video.pause();
        }
    }

    sumUp(client, user) {
        client.send('user:me', user.id);

        this.users.forEach(user => {
            client.send('user:add', user.id);
            client.send('user:ready', user);
        });

        if (this.video) {
            const { source, url, name, duration } = this.video;

            client.send(`video:${source}`, { url, name, duration });
        }
    }

    onClientReady(data, client) {
        this.users.get(client).setReady(data.ready);
    }

    onClientPlay() {
        if (!this.video) { return; }

        this.video.play();
    }

    onClientPause() {
        if (!this.video) { return; }

        this.video.pause();
    }

    onClientVideoFile(data, client) {
        this.setVideo(new Video('file', null, data.name, data.duration), client);
    }

    onClientVideoUrl(data, client) {
        this.setVideo(new Video('url', data.url, data.name, data.duration), client);
    }

    setVideo(video, client) {
        if (this.video) {
            console.warn('Video already set');
            this.video.off('playing', this.onVideoPlaying);
        }

        video.on('playing', this.onVideoPlaying);

        const { source, url, name, duration } = video;

        this.sendToOther(client, `video:${source}`, { url, name, duration });

        this.video = video;

        console.info('Loaded video:', source, url, name);
    }

    onUserReady(event) {
        const user = event.detail;

        this.send('user:ready', user);

        if (!user.ready) {
            this.video.pause();
        }
    }

    onVideoPlaying() {
        if (this.video.playing) {
            this.send('control:play');
            console.warn('Video playing.');
        } else {
            this.send('control:pause');
            console.warn('Video paused.');
        }
    }

    /**
     * Send data to all clients
     *
     * @param {String} name
     * @param {Object} data
     */
    send(name, data = undefined) {
        this.users.forEach((user, client) => client.send(name, data));
    }

    /**
     * Send data to all other clients
     *
     * @param {User|Client} target
     * @param {String} name
     * @param {Object} data
     */
    sendToOther(target, name, data = undefined) {
        this.users.forEach((user, client) => {
            if (user !== target && target !== client) {
                client.send(name, data);
            }
        });
    }
}
