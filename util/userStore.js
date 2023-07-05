import { create } from "zustand";

const store = (set) => ({
	user: null,
	setUser: (newUser) => set(() => ({ user: newUser })),
	userInfo: null,
	setUserInfo: (newUserInfo) => set(() => ({ userInfo: newUserInfo })),
	firstTimeLoad: true,
	setFirstTimeLoad: (new_value) => set(() => ({ firstTimeLoad: new_value })),
});

export const useUserStore = create(store);
