import { createStore, combineReducers, applyMiddleware } from 'redux';
//import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import player from '@client/store/player';
import room from '@client/store/room';
import navigation from '@client/navigation/store';

export default function create(logState = false) {
    const reducers = {
        player,
        room,
        navigation,
    };

    const middlewares = [
        //thunkMiddleware
    ];

    if (logState) {
        middlewares.push(createLogger({ collapsed: true }));
    }

    return createStore(combineReducers(reducers), applyMiddleware(...middlewares));
}
