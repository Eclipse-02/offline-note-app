import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useNetwork() {
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const isOffline =
                state.isConnected === false ||
                state.isInternetReachable === false;

            setOffline(isOffline);
        });

        return unsubscribe;
    }, []);

    return offline;
}