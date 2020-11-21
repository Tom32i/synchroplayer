import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { get } from '@client/container';
import Router from '@client/scenes';
import '@client/translations';
import '@css/style.scss';

get('router')
    .set('home', '/')
    .set('room', '/{id}', { id: '[^/]+' })
    .loadUrl();

get('drop-handler').start();

render(
    <Provider store={get('store')}>
        <Router />
    </Provider>,
    document.getElementById('root')
);
