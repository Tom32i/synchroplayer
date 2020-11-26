export const OPTIONS_VOLUME = 'OPTIONS_VOLUME';

export function setVolume(volume) {
    return { type: OPTIONS_VOLUME, payload: { volume } };
}

const initialState = {
    volume: 0.5,
};

export default function options(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case OPTIONS_VOLUME:
            return { ...state, volume: payload.volume };

        default:
            return state;
    }
}
