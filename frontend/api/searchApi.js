import { config } from "../config/constants";

exports.search = async (barcode) => {
	const SEARCH_URL = config.FOOD_API_BASE + barcode;

	const response = await fetch(SEARCH_URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const result = await response.json();

	return result?.product?.product_name;
};
