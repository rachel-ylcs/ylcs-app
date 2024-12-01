import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stateStorage } from './index';
import { UserAPI, TopicPreview } from '../api/ylcs';

interface TopicState {
    offset: number;
    data: TopicPreview[] | null;
    refreshing: boolean;
    loading: boolean;
    error: boolean;
    refresh: () => Promise<void>;
    loadMore: () => Promise<void>;
}

const createTopicStore = (type: string) =>
    create<TopicState, [['zustand/persist', Partial<TopicState>]]>(
        persist(
            (set, get) => ({
                offset: 0,
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
                        if (type === 'latest') {
                            let topics = await UserAPI.getLatestTopic();
                            set({
                                offset: topics.data![topics.data!.length - 1].tid,
                                data: topics.data,
                            });
                        } else if (type === 'hot') {
                            let topics = await UserAPI.getHotTopic();
                            set({
                                offset: topics.data!.length,
                                data: topics.data,
                            });
                        } else {
                            return;
                        }
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
                        if (type === 'latest') {
                            let topics = await UserAPI.getLatestTopic(get().offset);
                            const data = get().data!.concat(topics.data!);
                            set({ offset: data[data.length - 1].tid, data });
                        } else if (type === 'hot') {
                            let topics = await UserAPI.getHotTopic(get().offset);
                            const data = get().data!.concat(topics.data!);
                            set({ offset: data.length, data });
                        } else {
                            return;
                        }
                    } catch (_) {
                        set({ error: true });
                    }
                    set({ loading: false });
                },
            }),
            {
                name: `topic_${type}`,
                storage: stateStorage,
                partialize: (state) => ({ data: state.data }),
            },
        ),
    );

export const useTopicStores = {
    latest: createTopicStore('latest'),
    hot: createTopicStore('hot'),
};
