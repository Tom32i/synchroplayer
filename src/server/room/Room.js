import User from '@server/room/User';
import Video from '@server/room/Video';
import TimedEvent from '@server/core/TimedEvent';

export default class Room {
    constructor(id, onEmpty) {
        this.id = id;
        this.onEmpty = onEmpty;
        this.users = new Map();
        this.emptyResolver = new TimedEvent(this.checkEmpty.bind(this), 5000);
        this.video = null;
        this.distributor = null;

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
        this.onPeerOffer = this.onPeerOffer.bind(this);
        this.onPeerAnswer = this.onPeerAnswer.bind(this);
        this.onPeerCandidate = this.onPeerCandidate.bind(this);
        this.onPeerTimeline = this.onPeerTimeline.bind(this);
        this.onPeerStop = this.onPeerStop.bind(this);
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
        client.on('peer:offer', this.onPeerOffer);
        client.on('peer:answer', this.onPeerAnswer);
        client.on('peer:candidate', this.onPeerCandidate);
        client.on('peer:timeline', this.onPeerTimeline);
        client.on('peer:stop', this.onPeerStop);
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
        client.off('peer:offer', this.onPeerOffer);
        client.off('peer:answer', this.onPeerAnswer);
        client.off('peer:candidate', this.onPeerCandidate);
        client.off('peer:timeline', this.onPeerTimeline);
        client.off('peer:stop', this.onPeerStop);
    }

    createUser(client) {
        if (this.video) {
            this.video.pause();
        }

        const user = new User(client.id);

        this.users.set(client, user);

        user.on('ready', this.onUserReady);

        // Send me my id.
        client.send('user:me', user.id);

        if (this.video) {
            const { source, url, name } = this.video;

            client.send(`video:${source}`, { url, name });
            client.send('control:seek', this.video.currentTime);
        }

        this.users.forEach((otherUser, otherClient) => {
            if (user !== otherUser) {

                // Send me other user state.
                client.send('user:add', otherUser.id);
                client.send('user:ready', otherUser);

                if (otherClient === this.distributor) {
                    // Send me current distributor
                    client.send('user:streaming', otherUser.id);
                    client.send('peer:timeline', this.video.getTimeLine());
                }

                // Tell other user that I'm here.
                otherClient.send('user:add', user.id);
            }
        });
    }

    removeUser(client) {
        const user = this.users.get(client);

        this.users.delete(client);

        this.sendToAll('user:remove', user.id);

        user.off('ready', this.onUserReady);

        if (this.video) {
            this.video.pause();
        }

        if (this.distributor === client) {
            this.onPeerStop(null, client);
        }

        this.emptyResolver.schedule();
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

    onPeerOffer(data, client) {
        const user = this.users.get(client);

        if (!this.distributor) {
            this.distributor = client;

            this.sendToAll('user:streaming', user.id);

            console.info('Client %d is distributor.', this.distributor.id);
        }

        if (this.distributor === client) {
            const target = this.getClientFromUserId(data.target);

            if (!target) {
                console.error('Invalid target');
                return;
            }

            const { description } = data;

            target.send('peer:offer', { description, sender: user.id });
        }
    }

    onPeerAnswer(data, client) {
        if (this.distributor && client !== this.distributor) {
            const user = this.users.get(client);
            const { description } = data;

            this.distributor.send('peer:answer', { description, sender: user.id });

            client.send('peer:timeline', this.video.getTimeLine());
        }
    }

    onPeerCandidate(data, client) {
        if (!this.distributor) {
            return;
        }

        const target = this.getClientFromUserId(data.target);

        if (!target) {
            console.error('Invalid target');
            return;
        }

        const user = this.users.get(client);
        const { description } = data;

        target.send('peer:candidate', { description, sender: user.id });
    }

    onPeerTimeline(data, client) {
        if (!this.video || !this.distributor || client !== this.distributor) {
            return;
        }

        const { currentTime, duration } = data;

        this.video.setTimeline(currentTime, duration);

        this.sendToOthers(this.distributor, 'peer:timeline', data);
    }

    onPeerStop(data, client) {
        if (this.distributor === client) {
            this.distributor = null;
            this.video.setTimeline(0, 0);

            this.sendToAll('user:streaming', 0);
            this.sendToAll('peer:timeline', this.video.getTimeLine());
            this.sendToOthers(client, 'peer:stop');

            console.info('Streaming stoped.');
        }
    }

    unloadVideo() {
        if (this.video) {
            this.video.off('play', this.onVideoPlay);
            this.video.off('pause', this.onVideoPause);
            this.video.off('seek', this.onVideoSeek);
            this.video.off('stop', this.onVideoStop);
        }
    }

    setVideo(video, client) {
        this.unloadVideo();

        video.on('play', this.onVideoPlay);
        video.on('pause', this.onVideoPause);
        video.on('seek', this.onVideoSeek);
        video.on('stop', this.onVideoStop);

        this.video = video;

        const { source, url, name } = video;

        this.sendToOthers(client, `video:${source}`, { url, name });

        console.info('Loaded video:', source, url, name);
    }

    onUserReady(event) {
        const user = event.detail;

        this.sendToAll('user:ready', user);

        if (!user.ready) {
            this.video.pause();
        }
    }

    onVideoPlay() {
        this.sendToAll('control:play', this.video.currentTime);
    }

    onVideoPause() {
        this.sendToAll('control:pause', this.video.currentTime);
    }

    onVideoSeek() {
        this.sendToAll('control:seek', this.video.currentTime);
    }

    onVideoStop() {
        this.sendToAll('control:stop');
    }

    getClientFromUserId(id) {
        for (let [client, user] of this.users.entries()) {
            if (user.id === id) {
                return client;
            }
        }
    }

    /**
     * Send data to all clients
     *
     * @param {String} name
     * @param {Object} data
     */
    sendToAll(name, data = undefined) {
        this.users.forEach((user, client) => client.send(name, data));
    }

    /**
     * Send data to all other clients
     *
     * @param {User|Client} target
     * @param {String} name
     * @param {Object} data
     */
    sendToOthers(target, name, data = undefined) {
        this.users.forEach((user, client) => {
            if (user !== target && client !== target) {
                client.send(name, data);
            }
        });
    }

    /**
     * Check if room is empty
     */
    checkEmpty() {
        if (this.users.size === 0) {
            this.onEmpty(this);
        }
    }

    /**
     * Destroy room
     */
    destroy() {
        this.unloadVideo();
        this.emptyResolver.clear();
        this.users.clear();
        this.onEmpty = null;
        this.video = null;
    }
}
