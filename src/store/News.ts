import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stateStorage } from './index';
import WeiboAPI, { WeiboCard } from '../api/weibo';

interface WeiboState {
    data: WeiboCard[] | null;
    refreshing: boolean;
    error: boolean;
    refresh: () => Promise<void>;
}

interface ChaohuaState {
    sinceId: number;
    data: WeiboCard[] | null;
    refreshing: boolean;
    loading: boolean;
    error: boolean;
    refresh: () => Promise<void>;
    loadMore: () => Promise<void>;
}

const defaultWeiboUsers = {
    '2266537042': { name: '银临Rachel', containerId: '1076032266537042' },
    '7802114712': { name: '银临-欢银光临', containerId: '1076037802114712' },
    '3965226022': { name: '银临的小银库', containerId: '1076033965226022' },
};

export const useWeiboStore = create<WeiboState, [['zustand/persist', Partial<WeiboState>]]>(
    persist(
        (set, get) => ({
            data: null,
            refreshing: false,
            error: false,
            refresh: async () => {
                if (get().refreshing) {
                    return;
                }
                set({ refreshing: true, error: false });
                try {
                    let cards = await WeiboAPI.getAllWeibo(defaultWeiboUsers);
                    set({ data: cards });
                } catch (_) {
                    set({ error: true });
                }
                set({ refreshing: false });
            },
        }),
        {
            name: 'weibo',
            storage: stateStorage,
            partialize: (state) => ({ data: state.data }),
        },
    ),
);

export const useChaohuaStore = create<ChaohuaState, [['zustand/persist', Partial<ChaohuaState>]]>(
    persist(
        (set, get) => ({
            sinceId: 0,
            data: null,
            refreshing: false,
            loading: false,
            error: false,
            refresh: async () => {
                if (get().refreshing) {
                    return;
                }
                set({ refreshing: true, error: false });
                try {
                    const { newSinceId, cards } = await WeiboAPI.getChaohua(0);
                    set({ sinceId: newSinceId, data: cards });
                } catch (_) {
                    set({ error: true });
                }
                set({ refreshing: false });
            },
            loadMore: async () => {
                if (get().loading) {
                    return;
                }
                set({ loading: true, error: false });
                try {
                    const { newSinceId, cards } = await WeiboAPI.getChaohua(get().sinceId);
                    set({ sinceId: newSinceId, data: get().data!.concat(cards) });
                } catch (_) {
                    set({ error: true });
                }
                set({ loading: false });
            },
        }),
        {
            name: 'chaohua',
            storage: stateStorage,
            partialize: (state) => ({ data: state.data }),
        },
    ),
);
