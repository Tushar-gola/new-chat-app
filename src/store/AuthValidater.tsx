import { create } from 'zustand';
import { persist } from 'zustand/middleware'
interface StoreState {
    isAuthenticate: boolean;
    handleAuthenticate: (value: boolean) => void;
    handleUserDetails: (value: { [key: string]: string }) => void;
}
export const useAuthValidator = create<StoreState>()(persist((set) => ({
    isAuthenticate: false,
    user: {},
    handleAuthenticate: (value: boolean) => set(() => {
        return { isAuthenticate: value };
    }),
    handleUserDetails: (value: { [key: string]: string }) => set(() => {
        return { user: value };
    }),
}), {
    name: "auth-storage",
    getStorage: () => localStorage,
}))