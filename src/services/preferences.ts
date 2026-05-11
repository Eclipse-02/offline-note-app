import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
    id: 'encrypted-storage',
    encryptionKey: 'note-secret-key',
});

export const PreferenceKeys = {
    FONT_SIZE: 'font_size',
    CARD_THEME: 'card_theme',
    APP_THEME: 'app_theme',
};

export const setTheme = (theme: 'light' | 'dark') => {
    storage.set('theme', theme);
};

export const getTheme = () => {
    return storage.getString('theme') || 'system';
};

export const setFontSize = (size: number) => {
    storage.set('fontSize', size);
};

export const getFontSize = () => {
    return storage.getNumber('fontSize') || 16;
};

export const setCardTheme = (theme: string) => {
    storage.set(
        PreferenceKeys.CARD_THEME,
        theme
    );
};

export const getCardTheme = () => {
    return (
        storage.getString(PreferenceKeys.CARD_THEME) || 'system'
    );
};
