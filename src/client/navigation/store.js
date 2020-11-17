/** Actions names */
export const NAVIGATE = 'NAVIGATION_NAVIGATE';
export const SET_ANCHOR = 'NAVIGATION_SET_ANCHOR';

/**
 * Navigate to the given route
 *
 * @param  {String} route
 * @param  {Object} parameters
 * @param  {String|null} anchor
 *
 * @return {Object}
 */
export function navigate(route, parameters = {}, anchor = null) {
    return { type: NAVIGATE, payload: { route, parameters, anchor } };
}

/**
 * Set current anchor
 *
 * @param {string|null} anchor
 */
export function setAnchor(anchor = null) {
    return { type: SET_ANCHOR, payload: { anchor } };
}


const initialState = {
    route: null,
    parameters: {},
    anchor: null,
};

/**
 * Navigation
 *
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export default function navigation(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case NAVIGATE:
            return {
                ...state,
                route: payload.route,
                parameters: payload.parameters,
                anchor: payload.anchor,
            };

        case SET_ANCHOR:
            return {
                ...state,
                anchor: payload.anchor,
            };

        default:
            return state;
    }
}
