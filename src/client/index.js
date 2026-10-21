import { createRoot } from 'react-dom/client';
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
    .subscribeAll([
        'listener:storage',
        'listener:peer',
    ].map(get))
    .start();

// Load options from storage
get('listener:storage').load();

// Youtube API
window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {};

createRoot(document.getElementById('root')).render(
    <Provider store={get('store')}>
        <Router />
    </Provider>
);
