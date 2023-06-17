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

	if (result.status == 1) {
		// Capture ingredients' text form for easier display on client
		var ingredients_text = result.product.ingredients.map((element) => {
			return element?.text;
		});

		return {
			status: 1,
			code: result.code,
			name: result.product.product_name,
			keywords: result.product._keywords,
			brands: result.product.brands,
			categories: result.product.categories,
			image_url: result.product.image_url,
			thumbnail_url: result.product.image_thumb_url,
			ingredients: result.product.ingredients,
			ingredients_text: ingredients_text,
		};
	} else {
		return {
			status: 0,
		};
	}
};
