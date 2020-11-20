const PLAYER_LOAD_FROM_FILE = 'PLAYER_LOAD_FROM_FILE';
const PLAYER_LOAD_FROM_URL = 'PLAYER_LOAD_FROM_URL';
const PLAYER_LOAD_SUBTITLE = 'PLAYER_LOAD_SUBTITLE';
const PLAYER_SET_DURATION = 'PLAYER_SET_DURATION';
const PLAYER_READY = 'PLAYER_READY';
const PLAYER_PLAY = 'PLAYER_PLAY';
const PLAYER_PAUSE = 'PLAYER_PAUSE';

export function loadVideoFromFile(url, name, size, type) {
    return { type: PLAYER_LOAD_FROM_FILE, payload: { url, name, size, type, source: 'file' } };
}

export function loadVideoFromUrl(url, name, size, type) {
    return { type: PLAYER_LOAD_FROM_FILE, payload: { url, name, size, type, source: 'url' } };
}

export function loadSubtitle(url) {
    return { type: PLAYER_LOAD_SUBTITLE, payload: { url } };
}

export function setDuration(duration) {
    return { type: PLAYER_SET_DURATION, payload: { duration } };
}

export function setReady() {
    return { type: PLAYER_READY };
}

export function play() {
    return { type: PLAYER_PLAY };
}

export function pause() {
    return { type: PLAYER_PAUSE };
}

const initialState = {
    url: null,
    source: null,
    type: null,
    name: null,
    duration: null,
    subtitle: null,
    ready: false,
    playing: false,
};

export default function player(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case PLAYER_LOAD_FROM_FILE:
            return {
                ...state,
                url: payload.url,
                name: payload.name,
                type: payload.type,
                size: payload.size,
                source: payload.source,
                ready: false
            };

        case PLAYER_LOAD_FROM_URL:
            return {
                ...state,
                url: payload.url,
                name: payload.name,
                type: payload.type,
                size: payload.size,
                source: payload.source,
                ready: false
            };

        case PLAYER_SET_DURATION:
            return { ...state, duration: payload.duration };

        case PLAYER_LOAD_SUBTITLE:
            return { ...state, subtitle: payload.url };

        case PLAYER_READY:
            return { ...state, ready: true };

        case PLAYER_PLAY:
            return { ...state, playing: true };

        case PLAYER_PAUSE:
            return { ...state, playing: false };

        default:
            return state;
    }
}
