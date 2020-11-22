import { Container } from '@elao/container.js';
import createStore from '@client/store';
import DropHandler from '@client/service/DropHandler';
import SubtitleConverter from '@client/service/SubtitleConverter';
import Router from '@client/navigation/Router';
import Api from '@client/service/Api';

const container = new Container();

export const get = container.get;

const { hostname, port, protocol } = window.location;

// Register parameters:
container.registerParameter('config:host', port ? `${hostname}:${parseInt(port, 10) + 1}` : `server.${hostname}`);
container.registerParameter('config:protocol', protocol.replace('http', 'ws'));
container.registerParameter('config:debug', process.env.NODE_ENV === 'development');

// Redux store:
container.registerCallback('store', createStore, ['config:debug']);

// Services:
container.registerService('drop-handler', DropHandler, ['store', 'converter']);
container.registerService('converter', SubtitleConverter);
container.registerService('router', Router, ['store']);
container.registerService('api', Api, ['config:host', 'config:protocol']);

export default container;
