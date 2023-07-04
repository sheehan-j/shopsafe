import {
	StyleSheet,
	Text,
	View,
	Pressable,
	Image,
	TextInput,
	ScrollView,
	Keyboard,
	ActivityIndicator,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
} from "react-native-reanimated";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE } from "../firebaseConfig";
import { useSignupStore } from "../util/signupStore";
import { useUserStore } from "../util/userStore";
import searchApi from "../api/searchApi";
import useStatusBarHeight from "../util/useStatusBarHeight";
import useExtraPadding from "../util/useExtraPadding";

import colors from "../config/colors";

const EditAllergiesScreen = ({ navigation, route }) => {
	const statusBarHeight = useStatusBarHeight();
	const needsExtraPadding = useExtraPadding();
	const pageSize = 30;
	const [ingredients, setIngredients] = useState([]); // ALL ingredients
	const [activeIngredients, setActiveIngredients] = useState([]); // Ingredinents being displayed
	const [originalAdded, setOriginalAdded] = useState([]);
	const [addedIngredients, setAddedIngredients] = useState([]); // Ingredients added by the user
	const [searchedIngredients, setSearchedIngredients] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [searching, setSearching] = useState(false); // Whether or not results are currently being filtered with a search term
	const [page, setPage] = useState(0); // Tracks which page of ingredients is currently displayed (30 per page)
	const [changed, setChanged] = useState(false);
	const [firstProcess, setFirstProcess] = useState(true);
	const [loading, setLoading] = useState(true); // Flag for when the page has just been navigated to and is loading ingredients
	const [submitting, setSubmitting] = useState(false); // Flag for when the user has pressed "submit" and the page is loading
	const { userInfo, setUserInfo } = useUserStore((state) => ({
		userInfo: state.userInfo,
		setUserInfo: state.setUserInfo,
	}));
	const [originalUserInfo, setOriginalUserInfo] = useState(null); // So the completion of updating userInfo to new value can be tracked
	const [readyToNavigate, setReadyToNavigate] = useState(false);
	const { setupIngredients, setSetupIngredients } = useSignupStore(
		(state) => ({
			setupIngredients: state.setupIngredients,
			setSetupIngredients: state.setSetupIngredients,
		})
	);

	// Load ingredients logic
	useEffect(() => {
		const loadIngredients = async () => {
			try {
				// Get added ingredients
				let existingAddedIngredients;

				// If this screen is being used for profile setup, store the current state of setupIngredients (any ingredients already during setup)
				// Also, if this is not first time setup, set the original ingredients so that we can determine
				// whether a change has been made and the "Submit Changes" button can be enabled
				if (route.params?.firstTimeSetup) {
					existingAddedIngredients =
						setupIngredients === null ? [] : setupIngredients;
					setSetupIngredients(null);
				} else {
					// If this not first time setup, grab the user's allergies from Firestore
					try {
						const docRef = doc(
							FIRESTORE,
							"users",
							FIREBASE_AUTH.currentUser.uid
						);
						const docSnap = await getDoc(docRef);
						let dbUserInfo;

						if (docSnap.exists()) {
							dbUserInfo = docSnap.data();
							setOriginalUserInfo(dbUserInfo); // For tracking when we can navigate away
						} else {
							throw new Error(
								"User record was not found in DB. This should never happen."
							);
						}

						existingAddedIngredients = dbUserInfo?.allergies;
						setOriginalAdded(existingAddedIngredients);
					} catch (err) {
						console.error(err);
						alert(
							"Sorry! We ran into an issue trying to load your allergies. Please check your network connection and try again."
						);
						navigation.pop();
					}
				}
				setAddedIngredients(existingAddedIngredients);

				// Add an "added" field to each ingredient
				const response = require("../assets/test.json");
				response.tags.forEach((element) => {
					if (
						existingAddedIngredients.some(
							(addedElement) => addedElement.id === element.id
						)
					) {
						element.added = true;
					} else {
						element.added = false;
					}
				});

				setIngredients(response.tags);
				setActiveIngredients(
					processNewActiveIngredients(response.tags)
				);
				setFirstProcess(false);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching JSON data:", error);
			}
		};

		loadIngredients();
	}, []);

	// When an ingredient is added, determine whether the current list of
	// added ingreidents is different from the original list
	// This determines whether the submit button is enabled/disabled
	useEffect(() => {
		const checkChanged = () => {
			const newArr = addedIngredients.map((obj) => obj.name).sort();
			const oldArr = originalAdded.map((obj) => obj.name).sort();

			if (newArr.length !== oldArr.length) return true;

			for (let i = 0; i < newArr.length; i++) {
				if (newArr[i] !== oldArr[i]) return true;
			}
			return false;
		};

		let changed = checkChanged();
		setChanged(changed);
		changed ? fadeIn() : fadeOut();
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

	// Catch update to readyToNavigate from handleSubmit function
	// setupIngredients is set to null on page load, so we can check for equality with null
	// to know if setupIngredinets has been updated and ready to navigate, even if
	// no allergies were added (setupIngredients would be [])
	// We also check readyToNavigate, which is only set to true when the submit button is pressed
	// This way, we prevent navigation when the screen loads and allergies that have already
	// been added during setup are loaded in setupIngredients
	useEffect(() => {
		if (
			readyToNavigate &&
			setupIngredients !== null &&
			route.params?.firstTimeSetup
		) {
			setReadyToNavigate(false);
			navigation.navigate("FinishSetup");
		}
	}, [setupIngredients, readyToNavigate]);

	useEffect(() => {
		// If userInfo has finished updating from its original state and the screen
		// is ready to navigate away
		if (readyToNavigate && userInfo !== originalUserInfo) {
			setReadyToNavigate(false);
			setSubmitting(false);
			fadeIn();
			navigation.pop();
		}
	}, [userInfo, readyToNavigate]);

	const handleSubmit = async () => {
		if (loading || submitting) return;
		setSubmitting(true);
		fadeOut();

		if (route.params?.firstTimeSetup) {
			setReadyToNavigate(true);
			setSetupIngredients(addedIngredients);
			setSubmitting(false);
			fadeIn();
			return;
		}

		// If page is currently in loading state or no changes have been made,
		// do not execute the rest of this function
		if (!changed) {
			setSubmitting(false);
			fadeIn();
			return;
		}

		// If this not first time setup, update the DB and pop the navigation stack
		try {
			const docRef = doc(
				FIRESTORE,
				"users",
				FIREBASE_AUTH.currentUser.uid
			);
			const docSnap = await getDoc(docRef);
			let dbUserInfo;

			if (docSnap.exists()) {
				// Filtered out the added field from each added ingredient, unwanted in DB
				dbUserInfo = docSnap.data();
				dbUserInfo.allergies = addedIngredients.map((obj) => {
					const { added, ...rest } = obj;
					return rest;
				});

				// Check for any changes to "avoid" status due to the change in allergies
				// Wrapping updates in Promise.all makes them wait for dbUserInfo.allergies to
				// to update
				let changed = false;
				const updateRecentScans = await Promise.all(
					dbUserInfo.recentScans.map(async (scan) => {
						const result = await searchApi.search(
							scan.barcode,
							dbUserInfo.allergies
						);
						if (scan.avoid !== result.avoid) {
							scan.avoid = result.avoid;
							changed = true;
						}
						return scan;
					})
				);
				const updateSavedProducts = await Promise.all(
					dbUserInfo.savedProducts.map(async (scan) => {
						const result = await searchApi.search(
							scan.barcode,
							dbUserInfo.allergies
						);
						if (scan.avoid !== result.avoid) {
							scan.avoid = result.avoid;
							changed = true;
						}
						return scan;
					})
				);

				if (changed) {
					dbUserInfo.recentScans = updateRecentScans;
					dbUserInfo.savedProducts = updateSavedProducts;
				}

				await setDoc(docRef, dbUserInfo);

				setReadyToNavigate(true);
				setUserInfo(dbUserInfo);
			} else {
				throw new Error(
					"User record not found in DB. This should never happen."
				);
			}
		} catch (err) {
			console.error(err);
			alert(
				"Sorry! We ran into an unexpected error trying save to your allergies. Please check your network connection and try again."
			);
		}
	};

	// Process the ingredients to be displayed on the screen
	const processNewActiveIngredients = (newIngredients) => {
		// Run through the list of ingredients and add them, skipping if they are already added
		// and running until a page size worth of ingredients are aded
		const ingredientsToBeActive = [];
		let ingredientIndex = pageSize * page;
		while (
			ingredientsToBeActive.length < pageSize &&
			ingredientIndex < newIngredients.length
		) {
			// If this ingreident has already been added by the user, skip adding it to active ingreidnets
			ingredientsToBeActive.push(newIngredients[ingredientIndex]);
			ingredientIndex++;
		}
		return ingredientsToBeActive;
	};

	// When user presses "search" button on their keyboard
	const handleSearch = () => {
		setLoading(true);
		// Filter out any "s" that the user possibly added to the end of their search
		// e.g. If the user searches "eggs", trim it into "egg"
		let keywords = searchText.split(" ");
		// keywords = keywords.map((keyword) => {
		// 	if (keyword[keyword.length - 1] === "s" && keyword.length > 3) {
		// 		return keyword.slice(0, -1);
		// 	} else {
		// 		return keyword;
		// 	}
		// });

		// Find all ingredients that include at least one of the search keywords
		const searchResults = [];
		ingredients.forEach((ingredient) => {
			if (
				keywords.every((keyword) =>
					ingredient.name
						.toLowerCase()
						.includes(keyword.toLowerCase())
				) &&
				!searchResults.includes(ingredient)
			) {
				searchResults.push(ingredient);
			}

			// Old method for searching
			// keywords.forEach((keyword) => {
			// 	if (
			// 		ingredient.name
			// 			.toLowerCase()
			// 			.includes(keyword.toLowerCase()) &&
			// 		!searchResults.includes(ingredient)
			// 	) {
			// 		searchResults.push(ingredient);
			// 	}
			// });
		});

		setPage(0);
		setSearching(true);
		setSearchedIngredients(searchResults);
		setActiveIngredients(processNewActiveIngredients(searchResults));
		setLoading(false);
	};

	// Occurs when user presses "plus" icon on an ingredient from the ingredient list
	const handleIngredientAdded = (id) => {
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
		setAddedIngredients([...addedIngredients, targetIngredient]);
		// Pass the new version of added ingredients to processNewActiveIngredients
		// so it can skip over the newly added ingredient without waiting for
		// addedIngredients state ot update
		setActiveIngredients(
			processNewActiveIngredients(
				searching ? searchedIngredients : newIngredients
			)
		);
	};

	// Delete an added ingredient - occurs when user presses the "X" icon next to the added
	// icon in the top section
	const handleIngredientDeleted = (id) => {
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

		// Update all states
		setAddedIngredients(newAddedIngredients);
		setActiveIngredients(
			processNewActiveIngredients(
				searching ? searchedIngredients : newIngredients
			)
		);
	};

	// Occurs when the user clicks the "X" icon in the search bar
	// Reset everything related to search
	const clearSearch = () => {
		setLoading(true);
		setActiveIngredients(
			processNewActiveIngredients(Array.from(ingredients))
		);
		setSearchedIngredients([]);
		setPage(0);
		setSearching(false);
		setSearchText("");
		setLoading(false);
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

	// Logic for scrolling to top of ScrolLView on page change
	const scrollViewRef = useRef();
	const scrollToTop = () => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollTo({ y: 0, animated: true });
		}
	};

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
						<Text style={styles.title}>
							{route.params?.firstTimeSetup
								? "Setup Allergies"
								: "Edit Allergies"}
						</Text>
					</View>
				</View>

				{/* SEARCH BAR */}
				<View style={styles.searchWrapper}>
					<View style={styles.searchContainer}>
						<TextInput
							style={{
								...styles.searchBar,
								opacity: loading ? 0.2 : 1,
							}}
							value={searchText}
							onChangeText={setSearchText}
							returnKeyType="search"
							placeholder="Search by ingredient name"
							onSubmitEditing={handleSearch}
							editable={!loading}
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
									style={{
										width: "100%",
										height: "100%",
									}}
								/>
							</Pressable>
						)}
					</View>
				</View>

				{loading && (
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							paddingBottom: needsExtraPadding ? 120 : 105,
						}}
					>
						<ActivityIndicator size="small" color={colors.navy} />
					</View>
				)}

				{!loading && (
					<ScrollView
						style={styles.ingredientsContainer}
						showsVerticalScrollIndicator={false}
						ref={scrollViewRef}
					>
						<View
							style={{
								paddingBottom: needsExtraPadding ? 120 : 105,
							}}
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
												style={
													styles.addedIngredientText
												}
											>
												{element.name}
											</Text>
											<Pressable
												style={
													styles.deleteIngredientIcon
												}
												hitSlop={12}
												onPress={() =>
													handleIngredientDeleted(
														element.id
													)
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
											hitSlop={10}
											onPress={
												element.added
													? () => {
															handleIngredientDeleted(
																element.id
															);
													  }
													: () => {
															handleIngredientAdded(
																element.id
															);
													  }
											}
										>
											<Image
												source={
													element.added
														? require("../assets/img/x_icon_gray_small.png")
														: require("../assets/img/plus_icon.png")
												}
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
											: () => {
													setPage(page - 1);
													scrollToTop();
											  }
									}
									hitSlop={15}
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
											? () => {
													setPage(page + 1);
													scrollToTop();
											  }
											: () => {}
									}
									hitSlop={15}
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
				)}
				<View
					style={{
						...styles.submitWrapper,
						paddingBottom: needsExtraPadding ? 32 : 13,
					}}
				>
					<Animated.View
						style={
							route.params?.firstTimeSetup
								? null
								: animatedOpacity
						}
					>
						<Pressable
							style={({ pressed }) => [
								{
									backgroundColor: pressed
										? colors.greenPressed
										: colors.green,
								},
								styles.submitChangesButton,
							]}
							onPress={handleSubmit}
						>
							<Text style={styles.submitChangesButtonText}>
								{submitting
									? "Submitting..."
									: route.params?.firstTimeSetup
									? "Submit"
									: "Submit Changes"}
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
		flex: 1,
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
