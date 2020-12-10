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
        this.onClientEnd = this.onClientEnd.bind(this);
        this.onClientStop = this.onClientStop.bind(this);
        this.onClientSeek = this.onClientSeek.bind(this);
        this.onClientVideoFile = this.onClientVideoFile.bind(this);
        this.onClientVideoUrl = this.onClientVideoUrl.bind(this);
        this.onClientVideoYoutube = this.onClientVideoYoutube.bind(this);
        this.onUserReady = this.onUserReady.bind(this);
        this.onVideoPlay = this.onVideoPlay.bind(this);
        this.onVideoPause = this.onVideoPause.bind(this);
        this.onVideoSeek = this.onVideoSeek.bind(this);
        this.onVideoStop = this.onVideoStop.bind(this);
    }

    addClient(client) {
        this.createUser(client);

        client.on('close', this.removeClient);
        client.on('user:ready', this.onClientReady);
        client.on('control:play', this.onClientPlay);
        client.on('control:pause', this.onClientPause);
        client.on('control:end', this.onClientEnd);
        client.on('control:stop', this.onClientStop);
        client.on('control:seek', this.onClientSeek);
        client.on('video:file', this.onClientVideoFile);
        client.on('video:url', this.onClientVideoUrl);
        client.on('video:youtube', this.onClientVideoYoutube);
    }

    removeClient(client) {
        this.removeUser(client);

        client.off('close', this.removeClient);
        client.off('user:ready', this.onClientReady);
        client.off('control:play', this.onClientPlay);
        client.off('control:pause', this.onClientPause);
        client.off('control:end', this.onClientEnd);
        client.off('control:stop', this.onClientStop);
        client.off('control:seek', this.onClientSeek);
        client.off('video:file', this.onClientVideoFile);
        client.off('video:url', this.onClientVideoUrl);
        client.off('video:youtube', this.onClientVideoYoutube);
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
            const { source, url, name } = this.video;

            client.send(`video:${source}`, { url, name });
            client.send('control:seek', this.video.currentTime);
        }
    }

    onClientReady(data, client) {
        this.users.get(client).setReady(data.ready);
    }

    onClientPlay(time) {
        if (!this.video) { return; }

        this.video.play(time);
    }

    onClientPause(time) {
        if (!this.video) { return; }

        this.video.pause(time);
    }

    onClientEnd() {
        if (!this.video) { return; }

        this.video.end();
    }

    onClientStop() {
        if (!this.video) { return; }

        this.video.stop();
    }

    onClientSeek(time) {
        if (!this.video) { return; }

        this.video.seek(time);
    }

    onClientVideoFile(data, client) {
        this.setVideo(new Video('file', null, data.name), client);
    }

    onClientVideoUrl(data, client) {
        this.setVideo(new Video('url', data.url, data.name), client);
    }

    onClientVideoYoutube(data, client) {
        this.setVideo(new Video('youtube', data.url, data.name), client);
    }

    setVideo(video, client) {
        if (this.video) {
            console.warn('Video already set');
            this.video.off('play', this.onVideoPlay);
            this.video.off('pause', this.onVideoPause);
            this.video.off('seek', this.onVideoSeek);
            this.video.off('stop', this.onVideoStop);
        }

        video.on('play', this.onVideoPlay);
        video.on('pause', this.onVideoPause);
        video.on('seek', this.onVideoSeek);
        video.on('stop', this.onVideoStop);

        const { source, url, name } = video;

        this.sendToOther(client, `video:${source}`, { url, name });

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

    onVideoPlay() {
        this.send('control:play', this.video.time);
    }

    onVideoPause() {
        this.send('control:pause', this.video.time);
    }

    onVideoSeek() {
        this.send('control:seek', this.video.time);
    }

    onVideoStop() {
        this.send('control:stop');
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
