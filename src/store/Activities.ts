import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createContext } from 'zustand-di';
import { stateStorage } from './index';
import { UserAPI, ShowActivityPreview, ShowActivity } from '../api/ylcs';

interface ActivitiesState {
    data: ShowActivityPreview[] | null;
    refreshing: boolean;
    error: boolean;
    refresh: () => Promise<void>;
}

export const useActivitiesStore = create<ActivitiesState, [['zustand/persist', Partial<ActivitiesState>]]>(
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
                    let activities = await UserAPI.getActivities();
                    set({ data: activities.data });
                } catch (_) {
                    set({ error: true });
                }
                set({ refreshing: false });
            },
        }),
        {
            name: 'activities',
            storage: stateStorage,
            partialize: (state) => ({ data: state.data }),
        },
    ),
);

interface ActivityState {
    data: ShowActivity | null;
    error: boolean;
    refresh: (ts: string) => Promise<void>;
}

export const createActivityStore = () => create<ActivityState>(
    (set, get) => ({
        data: null,
        error: false,
        refresh: async (ts: string) => {
            set({ error: false });
            try {
                let activity = await UserAPI.getActivityInfo(ts);
                set({ data: activity.data });
            } catch (_) {
                set({ error: true });
            }
        },
    }),
);

export const [ActivityProvider, useActivityStore] = createContext<ActivityState>();
