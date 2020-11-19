const PLAYER_LOAD_VIDEO = 'PLAYER_LOAD_VIDEO';
const PLAYER_LOAD_SUBTITLE = 'PLAYER_LOAD_SUBTITLE';
const PLAYER_READY = 'PLAYER_READY';

export function loadVideo(url) {
    return { type: PLAYER_LOAD_VIDEO, payload: { url } };
}

export function loadSubtitle(url) {
    return { type: PLAYER_LOAD_SUBTITLE, payload: { url } };
}

export function setReady() {
    return { type: PLAYER_READY };
}

const initialState = {
    video: null,
    subtitle: null,
    ready: false,
};

export default function player(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case PLAYER_LOAD_VIDEO:
            return { ...state, video: payload.url, ready: false };

        case PLAYER_LOAD_SUBTITLE:
            return { ...state, subtitle: payload.url };

        case PLAYER_READY:
            return { ...state, ready: true };

        default:
            return state;
    }
}
