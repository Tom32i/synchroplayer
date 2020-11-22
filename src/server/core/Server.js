import NetcodeServer from 'netcode/src/server/Server';
// import MapClientDirectory from 'netcode/src/server/MapClientDirectory';
import BinaryEncoder from 'netcode/src/encoder/BinaryEncoder';
import events from '@events';
import RoomManager from '@server/room/RoomManager';
import Youtube from '@server/core/Youtube';

export default class Server extends NetcodeServer {
    static YOUTUBE = /^\/youtube\?url=(.+)$/i;

    constructor(port = 8001, hostname = '0.0.0.0') {
        super(port, hostname, new BinaryEncoder(events), undefined, undefined, undefined, false);

        this.joinMatcher = new RegExp('^/([^/]+)/?$');
        this.rooms = new RoomManager();
        this.youtube = new Youtube();

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
        const { url } = request;

        const youtubeMatch = url.match(this.constructor.YOUTUBE);

        // Youtube url
        if (youtubeMatch) {
            return this.handleYoutubeRequest(request, response, decodeURIComponent(youtubeMatch[1]));
        }

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

    handleYoutubeRequest(request, response, url) {
        this.youtube.getUrl(url, (data, error) => {
            const { videoDetails, formats } = data;

            if (error) {
                response.writeHead(500);
                response.end();

                return;
            }

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
                title: videoDetails.title,
                formats: formats
                    .filter(format => {
                        return format.hasAudio
                            && format.hasVideo
                            && format.container = 'mp4';
                    })
                    .map(format => ({
                    container: 'mp4'
                    hasAudio: true
                    hasVideo: true
                    height: 360
                    itag: 18
                    mimeType: 'video/mp4; codecs="avc1.42001E, mp4a.40.2"'
                    qualityLabel: "360p"
                    url: "https://r5---sn-4gxx-hgns.googlevideo.com/videoplayback?expire=1606178378&ei=6gG8X7HfEcqlxN8Pnoe7mAQ&ip=78.193.171.130&id=o-AHaqUeEu_49rnhQ_sHS8_n8IerhtuBc8uI2Oavd_k04S&itag=18&source=youtube&requiressl=yes&mh=5x&mm=31%2C29&mn=sn-4gxx-hgns%2Csn-4gxx-25gel&ms=au%2Crdu&mv=m&mvi=5&pl=23&nh=%2CEAE&initcwndbps=885000&vprv=1&mime=video%2Fmp4&ns=6jeyhSycrohtQXCk70n2ppcF&gir=yes&clen=164985065&ratebypass=yes&dur=3253.440&lmt=1605694630357824&mt=1606156603&fvip=5&c=WEB&txp=5530434&n=AFAFFyWHQmbwYtx&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIgYxEHKxRpbHmXhMsjR8Z0HJAp0NIaIL9dG0p6j-ozxvMCIQDBrmmXzyDrhF8gprWM_upsiohxv839U239kYrWYcuOHg%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cnh%2Cinitcwndbps&lsig=AG3C_xAwRgIhAL5TyovUDcxUKW514i9wei6G4fOgvbZhLQM01xXMdO74AiEAvtBsKEEhMj98RsMjTGxba96aKvvXDCPoegcSWpoAxCA%3D"
                }),
            }));
        });
    }
}
