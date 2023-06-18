const processIngredients = (allergies, ingredients) => {
	let avoidProduct = false;
	allergies = allergies.map((element) => {
		return element.id;
	});

	const processedIngredients = ingredients.map((element) => {
		const avoidIngredient = allergies.indexOf(element.id) !== -1;
		avoidProduct = avoidProduct || avoidIngredient;
		return {
			name: element.text,
			avoid: avoidIngredient,
		};
	});

	return {
		avoid: avoidProduct,
		ingredients: processedIngredients,
	};
};

export default processIngredients;
