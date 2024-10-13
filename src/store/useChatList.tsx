
//@ts-nocheck

import { create } from 'zustand';
interface TabsState {
    chats: [key: string, value: string | string[]][];
    handleStoreAllChats: (value: string) => void;
    handleStoreSingleChats: (value: string) => void;
}
export const useChatLists = create<TabsState>()((set) => ({
    chats: [],
    handleStoreAllChats: (value: string) => set(() => {
        return { chats: value };
    }),
    handleStoreSingleChats: (value: string) => set((state) => {
        return { chats: [value, ...state.chats], };
    }),

}))