import { create } from "zustand";

const defaultRecentScans = [
	{
		image_url:
			"https://images.openfoodfacts.org/images/products/007/084/702/9427/front_en.3.400.jpg",
		name: "Monster Energy Peachy Keen",
		barcode: "0070847029427",
		avoid: false,
		saved: false,
	},
	{
		image_url:
			"https://images.openfoodfacts.org/images/products/04963406/front_en.21.400.jpg",
		name: "Coca-Cola",
		barcode: "04963406",
		avoid: true,
		saved: true,
	},
	{
		image_url:
			"https://images.openfoodfacts.org/images/products/007/084/702/9427/front_en.3.400.jpg",
		name: "Monster Energy Peachy Keen",
		barcode: "0070847029427",
		avoid: false,
		saved: false,
	},
	{
		image_url:
			"https://images.openfoodfacts.org/images/products/04963406/front_en.21.400.jpg",
		name: "Coca-Cola",
		barcode: "04963406",
		avoid: true,
		saved: true,
	},
	{
		image_url:
			"https://images.openfoodfacts.org/images/products/007/084/702/9427/front_en.3.400.jpg",
		name: "Monster Energy Peachy Keen",
		barcode: "0070847029427",
		avoid: false,
		saved: false,
	},
	{
		image_url:
			"https://images.openfoodfacts.org/images/products/04963406/front_en.21.400.jpg",
		name: "Coca-Cola",
		barcode: "04963406",
		avoid: true,
		saved: true,
	},
];

const store = (set) => ({
	user: null,
	setUser: (newUser) => set(() => ({ user: newUser })),
	userInfo: null,
	setUserInfo: (newUserInfo) => set(() => ({ userInfo: newUserInfo })),
});

export const useUserStore = create(store);
