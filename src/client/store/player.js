import { ROOM_LEAVE } from '@client/store/room';

export const PLAYER_LOAD_FROM_FILE = 'PLAYER_LOAD_FROM_FILE';
export const PLAYER_LOAD_FROM_URL = 'PLAYER_LOAD_FROM_URL';
export const PLAYER_LOAD_FROM_YOUTUBE = 'PLAYER_LOAD_FROM_YOUTUBE';
export const PLAYER_LOAD_FROM_SERVER = 'PLAYER_LOAD_FROM_SERVER';
export const PLAYER_LOAD_SUBTITLE = 'PLAYER_LOAD_SUBTITLE';
export const PLAYER_COMPLETE_FROM_FILE = 'PLAYER_COMPLETE_FROM_FILE';
export const PLAYER_SET_DURATION = 'PLAYER_SET_DURATION';
export const PLAYER_LOADED = 'PLAYER_LOADED';
export const PLAYER_AUTHORIZED = 'PLAYER_AUTHORIZED';
export const PLAYER_PLAY = 'PLAYER_PLAY';
export const PLAYER_PAUSE = 'PLAYER_PAUSE';
export const PLAYER_SEEK = 'PLAYER_SEEK';
export const PLAYER_END = 'PLAYER_END';
export const PLAYER_STOP = 'PLAYER_STOP';
export const PLAYER_SHOWTIME = 'PLAYER_SHOWTIME';

export function loadVideoFromFile(url, name, type) {
    return { type: PLAYER_LOAD_FROM_FILE, payload: { url, name, type, source: 'file' } };
}

export function loadVideoFromUrl(url, name, type) {
    return { type: PLAYER_LOAD_FROM_FILE, payload: { url, name, type, source: 'url' } };
}

export function loadVideoFromYoutube(url, name, type) {
    return { type: PLAYER_LOAD_FROM_YOUTUBE, payload: { url, name, type, source: 'youtube' } };
}

export function loadVideoFromServer(source, name, url = null) {
    return { type: PLAYER_LOAD_FROM_SERVER, payload: { source, name, url } };
}

export function completeVideoFromFile(url, name, type = null) {
    return { type: PLAYER_COMPLETE_FROM_FILE, payload: { url, name, type } };
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

export function end() {
    return { type: PLAYER_END };
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
                source: payload.source,
                fromServer: false,
                playing: false,
                time: 0,
                subtitles: state.url ? [] : state.subtitles,
            };

        case PLAYER_LOAD_FROM_YOUTUBE:
            return {
                ...state,
                url: payload.url,
                name: payload.name,
                type: payload.type,
                source: payload.source,
                fromServer: false,
                playing: false,
                time: 0,
                subtitles: state.url ? [] : state.subtitles,
            };

        case PLAYER_LOAD_FROM_URL:
            return {
                ...state,
                url: payload.url,
                name: payload.name,
                type: payload.type,
                source: payload.source,
                fromServer: false,
                playing: false,
                time: 0,
                subtitles: state.url ? [] : state.subtitles,
            };

        case PLAYER_LOAD_FROM_SERVER:
            return {
                ...state,
                url: payload.url,
                name: payload.name,
                source: payload.source,
                fromServer: true,
            };

        case PLAYER_COMPLETE_FROM_FILE:
            return {
                ...state,
                url: payload.url,
                name: payload.name,
                type: payload.type,
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

        case PLAYER_END:
            return { ...state, playing: false, time: state.duration };

        case PLAYER_STOP:
            return { ...state, playing: false, time: 0 };

        case PLAYER_SHOWTIME:
            return { ...state, showtime: payload.active };

        case ROOM_LEAVE:
            return initialState;

        default:
            return state;
    }
}
