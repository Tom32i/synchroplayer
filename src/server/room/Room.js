import MapClientDirectory from 'netcode/src/server/MapClientDirectory';
import User from '@server/room/User';

export default class Room {
    constructor(id) {
        this.id = id;
        this.clients = new MapClientDirectory();
        this.owner = null;

        this.removeClient = this.removeClient.bind(this);
        this.onReady = this.onReady.bind(this);
    }

    getReady() {

    }

    addClient(client) {
        this.clients.add(client);

        client.user = new User();

        client.on('close', this.removeClient);
        client.on('me:ready', this.onReady);

        this.sendToOther(client, 'user:add', client.id);

        client.send('user:me', client.id);
    }

    removeClient(client) {
        client.off('close', this.removeClient);

        this.sendToOther(client, 'user:remove', client.id);
    }

    onReady(client) {
        client.user.setReady();
        this.send('user:ready', client.id);
    }

    /**
     * Send data to all clients
     *
     * @param {String} name
     * @param {Object} data
     */
    send(name, data = undefined) {
        this.clients.forEach(client => client.send(name, data));
    }

    /**
     * Send data to all other clients
     *
     * @param {Client} target
     * @param {String} name
     * @param {Object} data
     */
    sendToOther(target, name, data = undefined) {
        this.clients.forOther(target, client => client.send(name, data));
    }
}
