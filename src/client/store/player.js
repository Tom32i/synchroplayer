const PLAYER_LOAD_FROM_FILE = 'PLAYER_LOAD_FROM_FILE';
const PLAYER_LOAD_FROM_URL = 'PLAYER_LOAD_FROM_URL';
const PLAYER_LOAD_FROM_SERVER = 'PLAYER_LOAD_FROM_SERVER';
const PLAYER_LOAD_SUBTITLE = 'PLAYER_LOAD_SUBTITLE';
const PLAYER_COMPLETE_FROM_FILE = 'PLAYER_COMPLETE_FROM_FILE';
const PLAYER_SET_DURATION = 'PLAYER_SET_DURATION';
const PLAYER_LOADED = 'PLAYER_LOADED';
const PLAYER_AUTHORIZED = 'PLAYER_AUTHORIZED';
const PLAYER_PLAY = 'PLAYER_PLAY';
const PLAYER_PAUSE = 'PLAYER_PAUSE';
const PLAYER_SEEK = 'PLAYER_SEEK';
const PLAYER_STOP = 'PLAYER_STOP';
const PLAYER_SHOWTIME = 'PLAYER_SHOWTIME';

export function loadVideoFromFile(url, name, size, type) {
    return { type: PLAYER_LOAD_FROM_FILE, payload: { url, name, size, type, source: 'file' } };
}

export function loadVideoFromUrl(url, name, size, type) {
    return { type: PLAYER_LOAD_FROM_FILE, payload: { url, name, size, type, source: 'url' } };
}

export function loadVideoFromServer(source, name, duration, url = null) {
    return { type: PLAYER_LOAD_FROM_SERVER, payload: { source, name, duration, url } };
}

export function completeVideoFromFile(url, name, size, type = null) {
    return { type: PLAYER_COMPLETE_FROM_FILE, payload: { url, name, size, type } };
}

export function loadSubtitle(url, label) {
    return { type: PLAYER_LOAD_SUBTITLE, payload: { url, label } };
}

export function setDuration(duration) {
    return { type: PLAYER_SET_DURATION, payload: { duration } };
}

export function setLoaded(loaded) {
    return { type: PLAYER_LOADED, payload: { loaded } };
}

export function setAuthorized(authorized) {
    return { type: PLAYER_AUTHORIZED, payload: { authorized } };
}

export function play(time) {
    return { type: PLAYER_PLAY, payload: { time } };
}

export function pause(time) {
    return { type: PLAYER_PAUSE, payload: { time } };
}

export function seek(time) {
    return { type: PLAYER_SEEK, payload: { time } };
}

export function stop() {
    return { type: PLAYER_STOP };
}

export function setShowtime(active) {
    return { type: PLAYER_SHOWTIME, payload: { active } };
}

const initialState = {
    url: null,
    source: null,
    type: null,
    name: null,
    duration: null,
    subtitle: null,
    subtitles: [],
    loaded: false,
    authorized: true,
    playing: false,
    fromServer: false,
    time: 0,
    showtime: false,
};

const inititalSubtitleState = {
    url: null,
    label: null,
};

// REDUCERS

function subtitle(state = inititalSubtitleState, action) {
    const { type, payload } = action;

    switch (type) {
        case PLAYER_LOAD_SUBTITLE:
            return {
                ...state,
                url: payload.url,
                label: payload.label,
            };

        default:
            return state;
    }
}

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
                // loaded: false,
                fromServer: false,
            };

        case PLAYER_LOAD_FROM_URL:
            return {
                ...state,
                url: payload.url,
                name: payload.name,
                type: payload.type,
                size: payload.size,
                source: payload.source,
                // loaded: false,
                fromServer: false,
            };

        case PLAYER_LOAD_FROM_SERVER:
            return {
                ...state,
                url: payload.url,
                name: payload.name,
                source: payload.source,
                // ready: false,
                fromServer: true,
            };

        case PLAYER_COMPLETE_FROM_FILE:
            return {
                ...state,
                url: payload.url,
                name: payload.name,
                type: payload.type,
                size: payload.size,
                // ready: false,
            };

        case PLAYER_SET_DURATION:
            return { ...state, duration: payload.duration };

        case PLAYER_LOAD_SUBTITLE:
            return { ...state, subtitles: state.subtitles.concat([ subtitle(undefined, action) ]) };

        case PLAYER_LOADED:
            return { ...state, loaded: payload.loaded };

        case PLAYER_AUTHORIZED:
            return { ...state, authorized: payload.authorized };

        case PLAYER_PLAY:
            return { ...state, playing: true, time: payload.time };

        case PLAYER_PAUSE:
            return { ...state, playing: false, time: payload.time };

        case PLAYER_SEEK:
            return { ...state, time: payload.time };

        case PLAYER_STOP:
            return { ...state, playing: false, time: 0 };

        case PLAYER_SHOWTIME:
            return { ...state, showtime: payload.active };

        default:
            return state;
    }
}
