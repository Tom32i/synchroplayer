const LOAD_VIDEO = 'PLAYER_LOAD_VIDEO';
const LOAD_SUBTITLE = 'PLAYER_LOAD_SUBTITLE';

export function loadVideo(url) {
    return { type: LOAD_VIDEO, payload: { url } };
}

export function loadSubtitle(url) {
    return { type: LOAD_SUBTITLE, payload: { url } };
}

const initialState = {
    video: null,
    subtitle: null,
};

export default function player(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOAD_VIDEO:
          return { ...state, video: action.payload.url };

        case LOAD_SUBTITLE:
          return { ...state, subtitle: action.payload.url };

        default:
          return state
      }
}
