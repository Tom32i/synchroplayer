import NetcodeServer from 'netcode/src/server/Server';
// import MapClientDirectory from 'netcode/src/server/MapClientDirectory';
import BinaryEncoder from 'netcode/src/encoder/BinaryEncoder';
import events from '@events';
import RoomManager from '@server/room/RoomManager';

export default class Server extends NetcodeServer {
    constructor(port) {
        super(port, 'localhost', new BinaryEncoder(events), undefined, undefined, undefined, false);

        this.joinMatcher = new RegExp('^/([^/]+)/?$');
        this.rooms = new RoomManager();

        this.onRequest = this.onRequest.bind(this);
        this.onJoin = this.onJoin.bind(this);
        this.onLeave = this.onLeave.bind(this);

        this.start();
    }

    /**
     * Start websocket server
     */
    start() {
        super.start();

        this.on('client:join', this.onJoin);
        this.on('client:leave', this.onLeave);

        console.info(`Listening at "${this.host}:${this.port}"`);
    }

    /**
     * @param {Socket} socket
     * @param {Request} request
     */
    onConnection(socket, request) {
        // Don't allow connection on any url
        if (!this.joinMatcher.test(request.url)) {
            console.warn(`Unauthorised connection attempt at ${request.url}`);
            socket.close();

            return;
        }

        super.onConnection(socket, request);
    }

    /**
     * On request
     *
     * @param {Request} request
     * @param {Response} response
     */
    onRequest(request, response) {
        try {
            this.handleRequest(request, response);
        } catch (error) {
            // Fatal
            response.writeHead(500);
            response.end();

            console.error('HTTP Error: %s on %s', error.message, request.url);
        }
    }

    /**
     * Handle request
     *
     * @param {Request} request
     * @param {Response} response
     */
    handleRequest(request, response) {
        // const { url } = request;

        // Home info
        /* if (url === '/') {
            response.writeHead(200, { 'Content-Type': 'application/json' });

            return response.end(JSON.stringify(this.getStatus()));
        }*/

        // Anything else
        response.writeHead(404);

        return response.end();
    }

    /**
     * @param {Client} client
     * @param {Request} request
     */
    onJoin(client, request) {
        const attributes = this.joinMatcher.exec(request.url);

        // Should not happen...
        if (!attributes) {
            console.warn(`Unauthorised connection at ${request.url}`);
            client.close();

            return;
        }

        const [ id ] = attributes.slice(1);

        this.rooms.findOrCreate(id).addClient(client);

        console.info(`Client ${client.id} joined.`);
    }

    /**
     * @param {Client} client
     */
    onLeave(client) {
        console.info(`Client ${client.id} left.`);
    }

    /**
     * On error
     *
     * @param {Error} error
     */
    onError(error) {
        throw error;
    }
}
