import { create } from 'zustand';
import { createContext } from 'zustand-di';
import { UserAPI, Mail } from '../api/ylcs';

interface MailboxState {
    data: Mail[] | null;
    refreshing: boolean;
    error: boolean;
    refresh: () => Promise<void>;
}

export const createMailboxStore = () => create<MailboxState>(
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
                let mails = await UserAPI.getMail();
                set({ data: mails.data });
            } catch (_) {
                set({ error: true });
            }
            set({ refreshing: false });
        },
    }),
);

export const [MailboxProvider, useMailboxStore] = createContext<MailboxState>();
