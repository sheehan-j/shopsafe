import { ENV } from "@env";

export const config = {
	FOOD_API_BASE: "https://world.openfoodfacts.org/api/v2/product/",
	API_URL: ENV === "dev" ? "http://10.1.154.176:6202/" : "",
	MAX_RECENT_SCANS: 20,
	MAX_SAVED_PRODUCTS: 75,
};
