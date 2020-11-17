const SOCKET_OPEN = 'ROOM_SOCKET_OPEN';
const SOCKET_CLOSE = 'ROOM_SOCKET_CLOSE';
const ROOM_LEAVE = 'ROOM_LEAVE';
const ROOM_ME = 'ROOM_ME';
const ROOM_CLIENT_ADD = 'ROOM_CLIENT_ADD';

export function socketOpen() {
    return { type: SOCKET_OPEN };
}

export function socketClose() {
    return { type: SOCKET_CLOSE };
}

export function leave(id) {
    return { type: ROOM_LEAVE };
}

export function me(id) {
    return { type: ROOM_ME, payload: { id } };
}

export function clientAdd(id) {
    return { type: ROOM_CLIENT_ADD, payload: { id } };
}

const initialState = {
    connected: false,
    me: null,
    clients: [],
};

const initialClientState = {
    id: null,
};

function client(state = initialClientState, action) {
    const { type, payload } = action;

    switch (type) {
        case ROOM_ME:
        case ROOM_CLIENT_ADD:
            return { ...state, id: action.id };

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
                me: action.payload.id,
                clients: state.clients.map(clientState => client(clientState, action)),
            };

        case ROOM_CLIENT_ADD:
            return {
                ...state,
                clients: state.clients.map(clientState => client(clientState, action)),
            };

        default:
            return state
      }
}
