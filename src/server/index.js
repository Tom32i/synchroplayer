import Server from '@server/core/Server';

const [ port, hostname ] = process.argv.slice(2);

new Server(port, hostname);
