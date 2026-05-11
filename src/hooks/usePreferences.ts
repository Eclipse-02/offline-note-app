import { useMMKVString, useMMKVNumber } from 'react-native-mmkv';
import { storage } from '@/services/preferences';

export default function usePreferences() {
    const [cardTheme, setCardTheme] = useMMKVString('card_theme', storage);

    const [fontSize, setFontSize] = useMMKVNumber('font_size', storage);

    const[appTheme, setAppTheme] = useMMKVString('app_theme', storage);

    return {
        cardTheme: cardTheme || 'system',
        fontSize: fontSize || 16,
        appTheme: appTheme || 'system',
        setCardTheme,
        setFontSize,
        setAppTheme
    };
}