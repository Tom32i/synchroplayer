import User from '@server/room/User';

export default class Room {
    constructor(id) {
        this.id = id;
        this.users = new Map();

        this.addClient = this.addClient.bind(this);
        this.removeClient = this.removeClient.bind(this);
        this.onReady = this.onReady.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
    }

    addClient(client) {
        const user = new User(client.id);

        client.on('close', this.removeClient);
        client.on('me:ready', this.onReady);
        client.on('me:control:play', this.onPlay);
        client.on('me:control:pause', this.onPause);

        this.send('user:add', user.id);

        this.sumUp(user, client);

        this.users.set(client, user);
    }

    removeClient(client) {
        const user = this.users.get(client);

        this.users.delete(client);

        this.send('user:remove', user.id);

        client.off('close', this.removeClient);
        client.off('me:ready', this.onReady);
        client.off('me:control:play', this.onPlay);
        client.off('me:control:pause', this.onPause);
    }

    sumUp(user, client) {
        client.send('user:me', user.id);

        this.users.forEach(user => client.send('user:add', user.id));
    }

    onReady(data, client) {
        const user = this.users.get(client);

        user.setReady();

        this.send('user:ready', user.id);
    }

    onPlay() {
        this.send('control:play');
    }

    onPause() {
        this.send('control:pause');
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
     * @param {User} target
     * @param {String} name
     * @param {Object} data
     */
    sendToOther(target, name, data = undefined) {
        this.users.forEach((user, client) => {
            if (user !== target) {
                client.send(name, data);
            }
        });
    }
}
