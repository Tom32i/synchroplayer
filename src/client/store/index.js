import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import navigation from '@client/navigation/store';
import room from '@client/store/room';
import player from '@client/store/player';
import options from '@client/store/options';
import about from '@client/store/about';

export default function create(logState = false) {
    const reducers = {
        room,
        player,
        options,
        navigation,
        about,
    };

    const middlewares = [];

    if (logState) {
        middlewares.push(createLogger({ collapsed: true }));
    }

    return createStore(combineReducers(reducers), applyMiddleware(...middlewares));
}
