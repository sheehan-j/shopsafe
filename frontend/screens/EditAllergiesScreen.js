import {
	StyleSheet,
	Text,
	View,
	Pressable,
	Image,
	TextInput,
	ScrollView,
	Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, {
	useSharedValue,
	Easing,
	withTiming,
	useAnimatedStyle,
	add,
} from "react-native-reanimated";

import useStatusBarHeight from "../util/useStatusBarHeight";
import colors from "../config/colors";
import useExtraPadding from "../util/useExtraPadding";

const EditAllergiesScreen = ({ navigation }) => {
	const statusBarHeight = useStatusBarHeight();
	const needsExtraPadding = useExtraPadding();
	const pageSize = 30;
	const [ingredients, setIngredients] = useState([]); // ALL ingredients
	const [activeIngredients, setActiveIngredients] = useState([]); // Ingredinents being displayed
	const [addedIngredients, setAddedIngredients] = useState([]); // Ingredients added by the user
	const [addedIngredientsIndices, setAddedIngredientsIndices] = useState([]);
	const [searchedIngredients, setSearchedIngredients] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [searching, setSearching] = useState(false); // Whether or not results are currently being filtered with a search term
	const [page, setPage] = useState(0); // Tracks which page of ingredients is currently displayed (30 per page)
	const [changed, setChanged] = useState(false);
	const [originalAddedCount, setOriginalAddedCount] = useState(0);
	const [firstProcess, setFirstProcess] = useState(true);

	// TODO: Change how added ingredients are counted during the process,
	// Check whether they were already added when retrieving from db

	// Load ingredients logic
	useEffect(() => {
		const loadIngredients = async () => {
			try {
				const response = require("../assets/test.json");
				// Map the ingredients from the response and add an "added" field
				response.tags.forEach((element) => {
					element.added = false;
				});

				setIngredients(response.tags);
				setActiveIngredients(
					processNewActiveIngredients(response.tags)
				);
			} catch (error) {
				console.error("Error fetching JSON data:", error);
			}
		};

		loadIngredients();
	}, []);

	// When an ingredient is added, calculate the difference between the current number
	// of added ingredients is different from the original number
	// This determines whether the submit button is enabled/disabled
	useEffect(() => {
		setChanged(addedIngredients.length !== originalAddedCount);
		if (addedIngredients.length !== originalAddedCount) {
			fadeIn();
		} else {
			fadeOut();
		}
	}, [addedIngredients]);

	// Process new set of ingredients when the page is updated by pagination controls
	useEffect(() => {
		if (!firstProcess) {
			setActiveIngredients(
				processNewActiveIngredients(
					searching ? searchedIngredients : Array.from(ingredients)
				)
			);
		}
	}, [page]);

	// Process the ingredients to be displayed on the screen
	const processNewActiveIngredients = (
		newIngredients,
		addedIndices = null
	) => {
		let skips = 0; // Tracks how many ingredients should be skipped when determing what should be displayed
		let ingredientIndex = pageSize * page; // Starting point in the list for the current page

		// Check through the indices of the ingredients that have been added
		// If the index is before the starting index for the current page, add a skip to account
		// for the shift of ingredients to fill the space missing from the added ingredient
		// The if statement here is if we are passing in an addedIndices array because the state
		// of addedIngredientIndiecs is being updated
		if (addedIndices) {
			addedIndices.forEach((element) => {
				if (element <= ingredientIndex) skips++;
			});
		} else {
			addedIngredientsIndices.forEach((element) => {
				if (element <= ingredientIndex) skips++;
			});
		}
		ingredientIndex += skips;

		// Run through the list of ingredients and add them, skipping if they are already added
		// and running until a page size worth of ingredients are aded
		const ingredientsToBeActive = [];
		let addedCount = 0; // Track how many ingredients
		while (
			ingredientsToBeActive.length < pageSize &&
			ingredientIndex < newIngredients.length
		) {
			// If this ingreident has already been added by the user, skip adding it to active ingreidnets
			if (newIngredients[ingredientIndex].added) {
				ingredientIndex++;
				addedCount++;
				continue;
			}

			ingredientsToBeActive.push(newIngredients[ingredientIndex]);
			ingredientIndex++;
		}

		// If this is the first time processing the ingredients, update the originalAddedCount
		if (firstProcess) {
			setOriginalAddedCount(addedCount);
			setFirstProcess(false);
		}
		return ingredientsToBeActive;
	};

	// When user presses "search" button on their keyboard
	const handleSearch = () => {
		// Filter out any "s" that the user possibly added to the end of their search
		// e.g. If the user searches "eggs", trim it into "egg"
		let keywords = searchText.split(" ");
		keywords = keywords.map((keyword) => {
			if (keyword[keyword.length - 1] === "s" && keyword.length > 3) {
				return keyword.slice(0, -1);
			} else {
				return keyword;
			}
		});

		// Find all ingredients that include at least one of the search keywords
		const searchResults = [];
		ingredients.forEach((ingredient) => {
			keywords.forEach((keyword) => {
				if (
					ingredient.name
						.toLowerCase()
						.includes(keyword.toLowerCase()) &&
					!searchResults.includes(ingredient)
				) {
					searchResults.push(ingredient);
				}
			});
		});

		setPage(0);
		setSearching(true);
		setSearchedIngredients(searchResults);
		setActiveIngredients(processNewActiveIngredients(searchResults));
	};

	// Occurs when user presses "plus" icon on an ingredient from the ingredient list
	const addIngredient = (id) => {
		// Find the target ingredient and set "added" to true
		let targetIngredient;
		const newIngredients = Array.from(ingredients);
		let i;
		for (i = 0; i < newIngredients.length; i++) {
			if (newIngredients[i].id === id) {
				newIngredients[i].added = true;
				targetIngredient = newIngredients[i];
				break;
			}
		}

		// Update states
		setIngredients(newIngredients);
		setAddedIngredientsIndices([...addedIngredientsIndices, i]);
		setAddedIngredients([...addedIngredients, targetIngredient]);
		// Pass the new version of added ingredients to processNewActiveIngredients
		// so it can skip over the newly added ingredient without waiting for
		// addedIngredients state ot update
		setActiveIngredients(
			processNewActiveIngredients(
				searching ? searchedIngredients : newIngredients,
				[...addedIngredientsIndices, i]
			)
		);
	};

	// Delete an added ingredient - occurs when user presses the "X" icon next to the added
	// icon in the top section
	const deleteIngredient = (id) => {
		// Locate the target ingredient and set "added" to false
		const newIngredients = Array.from(ingredients);
		let i;
		for (i = 0; i < newIngredients.length; i++) {
			if (newIngredients[i].id === id) {
				newIngredients[i].added = false;
				break;
			}
		}

		// Filter the added ingredient out from the list of added ingredients and
		// added ingredients indices
		const newAddedIngredients = addedIngredients.filter(
			(element) => element.id !== id
		);
		const newAddedIngredientsIndices = addedIngredientsIndices.filter(
			(index) => index !== i
		);

		// Update all states
		setAddedIngredients(newAddedIngredients);
		setAddedIngredientsIndices(newAddedIngredientsIndices);
		setActiveIngredients(
			processNewActiveIngredients(
				searching ? searchedIngredients : newIngredients,
				newAddedIngredientsIndices
			)
		);
	};

	// Occurs when the user clicks the "X" icon in the search bar
	// Reset everything related to search
	const clearSearch = () => {
		setActiveIngredients(
			processNewActiveIngredients(Array.from(ingredients))
		);
		setSearchedIngredients([]);
		setPage(0);
		setSearching(false);
		setSearchText("");
		Keyboard.dismiss();
	};

	// Determine whether there are enough remaining ingredients to
	// display a page past the current page
	const nextPageControlVisible =
		(searching &&
			page * pageSize + pageSize + addedIngredients.length <
				searchedIngredients.length) ||
		(!searching &&
			page * pageSize + pageSize + addedIngredients.length <
				ingredients.length);

	// Animation logic for "Submit Changes" button
	const fadeAnim = useSharedValue(0.2);
	const fadeIn = () => {
		fadeAnim.value = withTiming(1, {
			duration: 150,
		});
	};
	const fadeOut = () => {
		fadeAnim.value = withTiming(0.2, {
			duration: 150,
		});
	};
	const animatedOpacity = useAnimatedStyle(() => {
		return {
			opacity: fadeAnim.value,
		};
	});

	return (
		<>
			<StatusBar style={"dark"} />
			<View
				style={{
					width: "100%",
					flex: 1,
					paddingTop: statusBarHeight,
					backgroundColor: colors.appBackground,
				}}
			>
				{/* TOP BAR CONTAINER */}
				<View style={styles.topContainer}>
					<Pressable
						style={styles.backIcon}
						hitSlop={20}
						onPress={() => navigation.pop()}
					>
						<Image
							source={require("../assets/img/back_icon.png")}
							style={styles.backIconImg}
						/>
					</Pressable>
					<View style={styles.titleWrapper}>
						<Text style={styles.title}>Edit Allergies</Text>
					</View>
				</View>

				{/* SEARCH BAR */}
				<View style={styles.searchWrapper}>
					<View style={styles.searchContainer}>
						<TextInput
							style={styles.searchBar}
							value={searchText}
							onChangeText={setSearchText}
							returnKeyType="search"
							placeholder="Search by ingredient name"
							onSubmitEditing={handleSearch}
						/>

						{/* CLEAR SEARCH BUTTON */}
						{searchText && (
							<Pressable
								style={styles.clearSearchIcon}
								hitSlop={20}
								onPress={clearSearch}
							>
								<Image
									source={require("../assets/img/x_icon_gray.png")}
									style={{ width: "100%", height: "100%" }}
								/>
							</Pressable>
						)}
					</View>
				</View>

				<ScrollView
					style={styles.ingredientsContainer}
					showsVerticalScrollIndicator={false}
				>
					<View
						style={{ paddingBottom: needsExtraPadding ? 120 : 105 }}
					>
						{/* ADDED INGREDIENTS CONTAINER */}
						<View
							style={{
								...styles.addedIngredientsContainer,
								marginBottom:
									addedIngredients.length > 0 ? 15 : 20,
							}}
						>
							{addedIngredients.map((element) => {
								return (
									<View
										key={element.id}
										style={styles.addedIngredient}
									>
										<Text
											style={styles.addedIngredientText}
										>
											{element.name}
										</Text>
										<Pressable
											style={styles.deleteIngredientIcon}
											hitSlop={12}
											onPress={() =>
												deleteIngredient(element.id)
											}
										>
											<Image
												source={require("../assets/img/x_icon_navy.png")}
												style={{
													width: "100%",
													height: "100%",
												}}
											/>
										</Pressable>
									</View>
								);
							})}
						</View>

						{/* <Text
							style={{
								...styles.ingredientsSectionLabel,
								marginTop: addedIngredients.length > 0 ? 5 : 10,
							}}
						>
							Ingredients
						</Text> */}
						{activeIngredients.map((element) => {
							return (
								<View
									key={element.id}
									style={styles.ingredient}
								>
									<Text style={styles.ingredientText}>
										{element.name}
									</Text>
									<Pressable
										style={styles.plusIcon}
										hitSlop={5}
										onPress={() => {
											addIngredient(element.id);
										}}
									>
										<Image
											source={require("../assets/img/plus_icon.png")}
											style={{
												width: "100%",
												height: "100%",
											}}
										/>
									</Pressable>
								</View>
							);
						})}
						<View style={styles.paginationContainer}>
							<Pressable
								style={{
									...styles.paginationControl,
									opacity: page === 0 ? 0 : 1,
								}}
								onPress={
									page === 0
										? () => {}
										: () => setPage(page - 1)
								}
							>
								<Image
									source={require("../assets/img/back_icon.png")}
									style={{
										...styles.paginationArrow,
										marginRight: 6,
									}}
								/>
								<Text style={styles.paginationControlText}>
									Previous Page
								</Text>
							</Pressable>
							<Pressable
								style={{
									...styles.paginationControl,
									opacity: nextPageControlVisible ? 1 : 0,
								}}
								onPress={
									nextPageControlVisible
										? () => setPage(page + 1)
										: () => {}
								}
							>
								<Text style={styles.paginationControlText}>
									Next Page
								</Text>
								<Image
									source={require("../assets/img/back_icon.png")}
									style={{
										...styles.paginationArrow,
										marginLeft: 6,
										transform: [{ rotate: "180deg" }],
									}}
								/>
							</Pressable>
						</View>
					</View>
				</ScrollView>
				<View
					style={{
						...styles.submitWrapper,
						paddingBottom: needsExtraPadding ? 32 : 13,
					}}
				>
					<Animated.View style={animatedOpacity}>
						<Pressable
							style={({ pressed }) => [
								{
									backgroundColor: pressed
										? colors.greenPressed
										: colors.green,
								},
								styles.submitChangesButton,
							]}
							onPress={() => {}}
						>
							<Text style={styles.submitChangesButtonText}>
								Submit Changes
							</Text>
						</Pressable>
					</Animated.View>
				</View>
			</View>
		</>
	);
};

export default EditAllergiesScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.appBackground,
		zIndex: 0,
	},
	topContainer: {
		width: "100%",
		backgroundColor: colors.appBackground,
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingVertical: 15,
		borderBottomColor: colors.transGray,
		borderBottomWidth: 1,
		marginBottom: 15,
	},
	backIcon: {
		height: 20,
		width: 20,
		zIndex: 2,
		marginLeft: 12,
	},
	backIconImg: {
		height: "100%",
		width: "100%",
	},
	// Absolutely center the title in the top bar so the back icon can stay left-aligned
	titleWrapper: {
		position: "absolute",
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		margin: 0,
		fontFamily: "Inter-Semi",
		fontSize: 22,
		color: colors.navy,
	},
	searchWrapper: {
		width: "100%",
		paddingHorizontal: 25,
		marginBottom: 5,
	},
	searchContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 7,
	},
	searchBar: {
		flex: 1,
		fontFamily: "Inter-Medium",
		fontSize: 16,
		color: colors.navy,
		borderRadius: 5,
		paddingLeft: 15,
		paddingVertical: 10,
	},
	clearSearchIcon: {
		height: 16,
		aspectRatio: 1,
		marginRight: 12,
		marginLeft: 14,
	},
	addedIngredient: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		marginBottom: 5,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 7,
		marginRight: 5,
	},
	addedIngredientText: {
		textAlign: "left",
		fontSize: 16,
		color: colors.navy,
		fontFamily: "Inter-Medium",
	},
	deleteIngredientIcon: {
		height: 12,
		aspectRatio: 1,
		marginLeft: 6,
	},
	addedIngredientsContainer: {
		width: "100%",
		// paddingHorizontal: 25,
		flexWrap: "wrap",
		flexDirection: "row",
	},
	ingredientsSectionLabel: {
		width: "100%",
		fontFamily: "Inter-Bold",
		textAlign: "left",
		fontSize: 28,
		color: colors.navy,
		marginBottom: 10,
	},
	ingredientsContainer: {
		width: "100%",
		paddingHorizontal: 25,
	},
	ingredientsTitle: {
		width: "100%",
		fontFamily: "Inter-Bold",
		textAlign: "left",
		fontSize: 28,
		color: colors.navy,
		marginBottom: 10,
	},
	ingredient: {
		width: "100%",
		backgroundColor: "white",
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 10,
		shadowColor: "#888888",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.03,
		shadowRadius: 1.5,
		marginBottom: 7,
	},
	ingredientText: {
		flex: 1,
		textAlign: "left",
		fontSize: 14,
		color: colors.navy,
		fontFamily: "Inter-Medium",
	},
	plusIcon: {
		height: 16,
		aspectRatio: 1,
	},
	paginationContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 2,
		paddingTop: 10,
	},
	paginationControl: {
		flexDirection: "row",
		alignItems: "center",
	},
	paginationControlText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: colors.navy,
	},
	paginationArrow: {
		height: 12,
		width: 12,
	},
	iphoneChin: {
		backgroundColor: "red",
		position: "absolute",
		bottom: 0,
		left: 0,
		width: "100%",
		height: 20,
	},
	submitWrapper: {
		position: "absolute",
		width: "100%",
		bottom: 0,
		paddingHorizontal: 25,
		backgroundColor: "white",
		shadowColor: "#888888",
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.04,
		shadowRadius: 2.5,
		justifyContent: "center",
		alignContent: "center",
		paddingTop: 13,
		// borderTopLeftRadius: 20,
		// borderTopRightRadius: 20,
	},
	submitChangesButton: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		borderRadius: 6,
		paddingVertical: 13,
	},
	submitChangesButtonText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: "white",
	},
});
