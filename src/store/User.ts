import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptStorage, stateStorage } from './index';
import { UserAPI, User } from '../api/ylcs';

interface UserState {
    data: User | null;
    refreshing: boolean;
    error: boolean;
    refresh: () => Promise<void>;
}

export const useUserStore = create<UserState, [['zustand/persist', Partial<UserState>]]>(
    persist(
        (set, get) => ({
            data: null,
            refreshing: false,
            error: false,
            refresh: async () => {
                if (get().refreshing) {
                    return;
                }
                if (!await encryptStorage.getStringAsync('token')) {
                    set({ data: null });
                    return;
                }
                set({ refreshing: true, error: false });
                try {
                    let user = await UserAPI.getInfo();
                    set({ data: user.data });
                } catch (_) {
                    set({ error: true });
                }
                set({ refreshing: false });
            },
        }),
        {
            name: 'user',
            storage: stateStorage,
            partialize: (state) => ({ data: state.data }),
        },
    ),
);
