import { Container } from '@elao/container.js';
import createStore from '@client/store';
import DropHandler from '@client/service/DropHandler';
import Router from '@client/navigation/Router';

const container = new Container();

export const get = container.get;

// Register parameters:
container.registerParameter('config:host', 'localhost:8001');
container.registerParameter('config:protocol', window.location.protocol.replace('http', 'ws'));
container.registerParameter('config:debug', process.env.NODE_ENV === 'development');

// Redux store:
container.registerCallback('store', createStore, ['config:debug']);

// Services:
container.registerService('drop-handler', DropHandler, ['store']);
container.registerService('router', Router, ['store']);
//container.registerService('socket', Socket, ['store', 'config:host', 'config:protocol']);

export default container;
