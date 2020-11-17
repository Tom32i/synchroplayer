import Server from '@server/core/Server';

const [ port ] = process.argv.slice(2);

new Server(port);
