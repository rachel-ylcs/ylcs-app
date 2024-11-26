import { create } from 'zustand';
import { CommonAPI, PhotoFolder } from '../api/ylcs';

interface GalleryState {
    data: PhotoFolder | null;
    refreshing: boolean;
    error: boolean;
    refresh: () => Promise<void>;
}

export const useGalleryStore = create<GalleryState>(
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
                let photos = await CommonAPI.getPhotos();
                set({ data: photos.data });
            } catch (_) {
                set({ error: true });
            }
            set({ refreshing: false });
        },
    }),
);
