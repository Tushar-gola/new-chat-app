//@ts-nocheck

import { create } from 'zustand';
interface TabsState {
    tab: string;
    handleTabs: (value: string) => void;
}
export const useTabs = create<TabsState>()((set) => ({
    tab: 'chat',
    handleTabs: (value: string) => set(() => {
        return { tab: value };
    }),
 
}))