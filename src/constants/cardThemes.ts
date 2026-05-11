export const CARD_THEMES = {
    system: null,
    blue: {
        border: '#3B82F6',
        background: 'rgba(59,130,246,0.12)',
    },

    green: {
        border: '#22C55E',
        background: 'rgba(34,197,94,0.12)',
    },

    purple: {
        border: '#A855F7',
        background: 'rgba(168,85,247,0.12)',
    },

    orange: {
        border: '#F97316',
        background: 'rgba(249,115,22,0.12)',
    },
};

export type CardTheme = keyof typeof CARD_THEMES;