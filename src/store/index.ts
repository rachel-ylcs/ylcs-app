import { createJSONStorage, StateStorage } from 'zustand/middleware';
import { MMKVLoader } from 'react-native-mmkv-storage';
import { UserInfo, User } from '../api/ylcs';

export const storage = new MMKVLoader().initialize();
export const cacheStorage = new MMKVLoader().withInstanceID('cache').initialize();
export const encryptStorage = new MMKVLoader().withInstanceID('encrypt').withEncryption().initialize();

export const stateStorage = createJSONStorage<any>(() => cacheStorage as StateStorage, {
    reviver(key, value: any) {
        if (!value) {
            return value;
        }
        if (value.type === 'date') {
            return new Date(value.value);
        } else if (value.type === 'user') {
            return new User(value.value);
        }
        return value;
    },
    replacer(key, _) {
        // See https://github.com/pmndrs/zustand/discussions/2403#discussioncomment-9171346
        const value = (this as any)[key];
        if (value instanceof Date) {
            return { type: 'date', value: value.getTime() };
        } else if (value instanceof User) {
            let userInfo: UserInfo = {
                uid: value.uid,
                name: value.name,
                inviterName: value.inviterName,
                privilege: value.privilege,
                signature: value.signature,
                label: value.label,
                coin: value.coin,
                topics: value.topics,
            };
            return { type: 'user', value: userInfo };
        }
        return value;
    },
});
