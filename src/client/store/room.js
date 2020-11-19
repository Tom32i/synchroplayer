const SOCKET_OPEN = 'ROOM_SOCKET_OPEN';
const SOCKET_CLOSE = 'ROOM_SOCKET_CLOSE';
const ROOM_ME = 'ROOM_ME';
const ROOM_USER_ADD = 'ROOM_USER_ADD';
const ROOM_USER_READY = 'ROOM_USER_READY';

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

export function userReady(id) {
    return { type: ROOM_USER_READY, payload: { id } };
}

// INITIAL STATES

const initialState = {
    connected: false,
    me: null,
    users: [],
};

const initialUserState = {
    id: null,
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

            return { ...state, ready: true };

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
                users: state.users.map(userState => user(userState, action)),
            };

        case ROOM_USER_ADD:
            return {
                ...state,
                users: state.users.map(userState => user(userState, action)),
            };

        case ROOM_USER_READY:
            return {
                ...state,
                users: state.users.map(userState => user(userState, action)),
            };

        default:
            return state;
    }
}
