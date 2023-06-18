import { processColor } from "react-native-reanimated";
import { config } from "../config/constants";
import processIngredients from "../util/processIngredients";

const testAllergies = [
	{
		user: "jordansheehan26@gmail.com",
		id: "en:e338",
	},
	{
		user: "jordansheehan26@gmail.com",
		id: "en:e221",
	},
];

exports.search = async (barcode) => {
	const SEARCH_URL = config.FOOD_API_BASE + barcode;
	console.log("Requesting OpenFood API at " + SEARCH_URL);

	const response = await fetch(SEARCH_URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		return {
			status: 0,
		};
	}

	const result = await response.json();
	console.log("Result received from OpenFood.");

	if (result.status == 1) {
		// Compare product ingredients against user allergies
		const processedIngredients = processIngredients(
			testAllergies,
			result.product.ingredients
		);

		return {
			status: 1,
			code: result.code,
			name: result.product.product_name,
			keywords: result.product._keywords,
			brands: result.product.brands,
			categories: result.product.categories,
			image_url: result.product.image_url,
			thumbnail_url: result.product.image_thumb_url,
			avoid: processedIngredients.avoid,
			ingredients: processedIngredients.ingredients,
		};
	} else {
		return {
			status: 0,
		};
	}
};
