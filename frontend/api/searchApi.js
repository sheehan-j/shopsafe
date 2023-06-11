import { config } from "../config/constants";

exports.search = async (barcode) => {
	const SEARCH_URL = config.FOOD_API_BASE + barcode;
	console.log("Requesting OpenFood API at " + SEARCH_URL);

	const response = await fetch(SEARCH_URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const result = await response.json();

	return result;
};
