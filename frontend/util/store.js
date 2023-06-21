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
];

const store = (set) => ({
	recentScans: defaultRecentScans,
	addRecentScan: (newScan) =>
		set((state) => ({ recentScans: [...state.recentScans, newScan] })),
});

export const useAppStore = create(store);
