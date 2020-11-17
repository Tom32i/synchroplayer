import MapClientDirectory from 'netcode/src/server/MapClientDirectory';

export default class Room {
    constructor(id) {
        this.id = id;
        this.clients = new MapClientDirectory();

        this.removeClient = this.removeClient.bind(this);
    }

    addClient(client) {
        //client.room = this;
        this.clients.add(client);

        client.on('close', this.removeClient);

        this.sendToOther(client, 'client:add', client.id);

        client.send('client:me', client.id);
    }

    removeClient(client) {
        client.off('close', this.removeClient);

        this.sendToOther(client, 'client:remove', client.id);
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
