export const SOCKET_OPEN = 'ROOM_SOCKET_OPEN';
export const SOCKET_CLOSE = 'ROOM_SOCKET_CLOSE';
export const ROOM_ME = 'ROOM_ME';
export const ROOM_USER_ADD = 'ROOM_USER_ADD';
export const ROOM_USER_REMOVE = 'ROOM_USER_REMOVE';
export const ROOM_USER_READY = 'ROOM_USER_READY';
export const ROOM_USER_STREAMING = 'ROOM_USER_STREAMING';
export const ROOM_LEAVE = 'ROOM_LEAVE';

// ACTIONS

export function socketOpen() {
    return { type: SOCKET_OPEN };
}

export function socketClose() {
    return { type: SOCKET_CLOSE };
}

export function me(id) {
    return { type: ROOM_ME, payload: { id } };
}

export function userAdd(id) {
    return { type: ROOM_USER_ADD, payload: { id } };
}

export function userRemove(id) {
    return { type: ROOM_USER_REMOVE, payload: { id } };
}

export function userReady(payload) {
    return { type: ROOM_USER_READY, payload };
}

export function userStreaming(id = null) {
    return { type: ROOM_USER_STREAMING, payload: { id } };
}

export function leave() {
    return { type: ROOM_LEAVE };
}

// INITIAL STATES

const initialState = {
    connected: false,
    me: null,
    streaming: null,
    users: [],
};

const initialUserState = {
    id: null,
    ready: false,
};

// REDUCERS

function user(state = initialUserState, action) {
    const { type, payload } = action;

    switch (type) {
        case ROOM_ME:
        case ROOM_USER_ADD:
            return { ...state, id: payload.id };

        case ROOM_USER_READY:
            if (payload.id !== state.id) { return state; }

            return { ...state, ready: payload.ready };

        default:
            return state;
    }
}

export default function room(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SOCKET_OPEN:
            return { ...state, connected: true };

        case SOCKET_CLOSE:
            return { ...state, connected: false };

        case ROOM_ME:
            return {
                ...state,
                me: payload.id,
                users: state.users.concat([ user(undefined, action) ]),
            };

        case ROOM_USER_ADD:
            return {
                ...state,
                users: state.users.concat([ user(undefined, action) ]),
            };

        case ROOM_USER_REMOVE:
            return {
                ...state,
                users: state.users.filter(user => user.id !== payload.id),
            };

        case ROOM_USER_READY:
            return {
                ...state,
                users: state.users.map(userState => user(userState, action)),
            };

        case ROOM_USER_STREAMING:
            return {
                ...state,
                streaming: payload.id,
            };

        case ROOM_LEAVE:
            return initialState;

        default:
            return state;
    }
}
