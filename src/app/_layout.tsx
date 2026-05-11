import { View } from 'react-native';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initializeDatabase } from '@/database/schema';
import "../global.css";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <SQLiteProvider
                databaseName="notes.db"
                onInit={initializeDatabase}
                useSuspense
            >
                <View className="flex-1">
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="detail" />
                    </Stack>
                </View>
            </SQLiteProvider>
        </SafeAreaProvider>
    );
}