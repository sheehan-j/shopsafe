import { config } from "../config/constants";
import processIngredients from "../util/processIngredients";

exports.search = async (barcode, allergies) => {
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

	if (result.status == 1 && result?.product?.ingredients) {
		// Compare product ingredients against user allergies
		const processedIngredients = processIngredients(
			allergies,
			result.product.ingredients
		);

		// Since some product names are poorly capitalized from the API, correct that there
		// Split the name string by its spaces, capitalzie the first letter of each
		// subsequent string, and recombine them into one properly capitalized string
		const splitName = result.product.product_name.split(" ");
		let formattedName = "";
		for (let i = 0; i < splitName.length; i++) {
			if (splitName[i].length > 1) {
				formattedName +=
					splitName[i]?.charAt(0)?.toUpperCase() +
					splitName[i]?.slice(1);
			} else {
				formattedName += splitName[i];
			}

			if (i < splitName.length - 1) {
				formattedName += " ";
			}
		}

		return {
			status: 1,
			code: result.code,
			name: formattedName,
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
