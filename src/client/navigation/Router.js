import { navigate, setAnchor } from './store';
import Route from './Route';

export default class Router {
    /**
     * @param {Object} store Redux store
     */
    constructor(store, routes = []) {
        this.store = store;
        this.routes = routes;

        this.onStoreChange = this.onStoreChange.bind(this);
        this.onBack = this.onBack.bind(this);
        this.loadUrl = this.loadUrl.bind(this);

        this.unsubscribe = this.store.subscribe(this.onStoreChange);

        window.addEventListener('popstate', this.onBack);
    }

    /**
     * Set route
     * @param {String} name
     * @param {String} format
     * @param {Object} parameters
     */
    set(name, format, parameters = {}) {
        return this.add(new Route(name, format, parameters));
    }

    /**
     * Add route
     *
     * @param {Route} route
     */
    add(route) {
        this.routes.push(route);

        return this;
    }

    /**
     * Load url from window location
     *
     * @param {String} url
     * @param {String} hash
     */
    loadUrl(url = window.location.pathname, hash = window.location.hash, failOnNotFound = false) {
        const { route, parameters } = this.resolve(url, failOnNotFound);
        const anchor = hash ? hash.slice(1) : null;
        const { navigation } = this.store.getState();

        if (route !== navigation.route) {
            this.store.dispatch(navigate(route, parameters, anchor));
        } else if (anchor !== navigation.anchor) {
            this.store.dispatch(setAnchor(anchor));
        }
    }

    /**
     * On browser history back
     */
    onBack() {
        this.loadUrl(window.location.pathname, window.location.hash);
    }

    /**
     * Feed browser history on redux store change
     */
    onStoreChange() {
        const { navigation } = this.store.getState();
        const { state } = window.history;
        const url = this.getUrl(navigation.route, navigation.parameters, navigation.anchor);

        if (!state || url !== this.getUrl(state.route, state.parameters, state.anchor)) {
            // Add a new item in browser history.
            history.pushState(navigation, null, url);
        }
    }

    /**
     * Get url for the given route and parameters
     *
     * @param {String} route
     * @param {Object|null} parameters
     * @param {Object|null} anchor
     *
     * @return {String|null}
     */
    getUrl(name, parameters = null, anchor = null) {
        const route = this.routes.find(r => r.name === name);

        if (!route) {
            if (typeof parameters === 'object' && typeof parameters.url !== 'undefined') {
                return parameters.url;
            }

            return null;
        }

        return route.getUrl(parameters).concat(anchor ? `#${anchor}` : '');
    }

    /**
     * Get route from the given url
     *
     * @param {String} url
     * @param {Bool} failOnNotFound
     *
     * @return {Object}
     */
    resolve(url, failOnNotFound = false) {
        const route = this.routes.find(r => r.match(url));

        if (!route) {
            if (failOnNotFound) {
                throw new Error(`No route found matching url "${url}".`);
            }

            return { route: 'not-found', parameters: { url } };
        }

        return {
            route: route.name,
            parameters: route.getParameters(url),
        };
    }
}
