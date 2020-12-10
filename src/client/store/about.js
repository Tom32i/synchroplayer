export const ABOUT_OPEN = 'ABOUT_OPEN';
export const ABOUT_CLOSE = 'ABOUT_CLOSE';

export function open() {
    return { type: ABOUT_OPEN };
}

export function close() {
    return { type: ABOUT_CLOSE };
}

const initialState = {
    open: false,
};

export default function about(state = initialState, action) {
    const { type } = action;

    switch (type) {
        case ABOUT_OPEN:
            return { ...state, open: true };

        case ABOUT_CLOSE:
            return { ...state, open: false };

        default:
            return state;
    }
}
