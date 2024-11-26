import { createJSONStorage, StateStorage } from 'zustand/middleware';
import { MMKVLoader } from 'react-native-mmkv-storage';

export const storage = new MMKVLoader().initialize();
export const cacheStorage = new MMKVLoader().withInstanceID('cache').initialize();
export const encryptStorage = new MMKVLoader().withInstanceID('encrypt').withEncryption().initialize();

export const stateStorage = createJSONStorage<any>(() => cacheStorage as StateStorage, {
    reviver(key, value: any) {
        if (value && value.type === 'date') {
            return new Date(value.value);
        }
        return value;
    },
    replacer(key, _) {
        // See https://github.com/pmndrs/zustand/discussions/2403#discussioncomment-9171346
        const value = (this as any)[key];
        if (value instanceof Date) {
            return { type: 'date', value: value.getTime() };
        }
        return value;
    },
});
