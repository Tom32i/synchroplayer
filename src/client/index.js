import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { get } from '@client/container';
import Router from '@client/scenes';
import '@client/translations';
import '@css/style.scss';

// Setup router
get('router')
    .set('home', '/')
    .set('room', '/{id}', { id: '[^/]+' })
    .loadUrl();

// Listen for drop file
get('drop-handler').start();

// Register listeners
get('watcher')
    .subscribeAll(['listener:storage'].map(get))
    .start();

// Load options from storage
get('listener:storage').load();

// Youtube API
window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {};

render(
    <Provider store={get('store')}>
        <Router />
    </Provider>,
    document.getElementById('root')
);
