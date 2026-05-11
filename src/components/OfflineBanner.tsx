import { View, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Props { offline: boolean }

export default function OfflineBanner({ offline }: Props) {
    if (!offline) return null;

    return (
        <View className="flex-row justify-center items-center bg-red-500 p-2">
            <MaterialCommunityIcons name="wifi-cancel" size={14} color="white" />
            <Text className="text-white text-center ms-2">
                No Connection
            </Text>
        </View>
    );
}