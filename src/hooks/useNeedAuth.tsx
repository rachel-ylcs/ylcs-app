import Toast from 'react-native-simple-toast';
import { encryptStorage } from '../store';

export function useNeedAuth<T extends Function>(callback: T): T {
    return ((...args: any[]) => {
        if (!encryptStorage.getString('token')) {
            Toast.show('请先登录', Toast.SHORT);
            return;
        }
        return callback(...args);
    }) as unknown as T;
}
