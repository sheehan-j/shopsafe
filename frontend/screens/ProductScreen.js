import {
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	Pressable,
	Image,
	Platform,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import useStatusBarHeight from "../util/useStatusBarHeight";

import CustomStatusBar from "../components/CustomStatusBar";
import colors from "../config/colors";
import ProductIngredientsOkay from "../components/ProductIngredientsOkay";
import ProductIngredientsBad from "../components/ProductIngredientsBad";
import searchApi from "../api/searchApi";

const ProductScreen = ({ navigation, route }) => {
	const statusBarHeight = useStatusBarHeight();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadProduct = async () => {
			if (route.params.productLoaded) {
				setProduct(route.params.product);
				setLoading(false); // TODO: uncomment;
			} else {
				const result = await searchApi.search(route.params.barcode);
				setProduct(result);
				setTimeout(() => {
					setLoading(false); // TODO: uncomment;
				}, 1000);
			}
		};

		loadProduct();
	}, []);

	const processIngredientsIntoComponents = () => {
		const ingredients = [];

		product.ingredients.map((ingredient, index) => {
			if (!ingredient.avoid) {
				ingredients.push(
					<View key={index} style={styles.ingredient}>
						<Text style={styles.ingredientText}>
							{ingredient.name}
						</Text>
					</View>
				);
			} else {
				ingredients.push(
					<View key={index} style={styles.ingredientBad}>
						<Text style={styles.ingredientBadText}>
							{ingredient.name}
						</Text>
						<Image
							source={require("../assets/img/x_icon.png")}
							style={{ width: 20, height: 20 }}
						/>
					</View>
				);
			}
		});

		return ingredients;
	};

	return (
		<>
			<StatusBar style={"dark"} />
			<View style={styles.container}>
				<CustomStatusBar color={colors.appBackground} border={true} />
				{!loading && (
					<ScrollView
						style={{
							width: "100%",
							flex: 1,
							paddingTop: statusBarHeight + 10,
						}}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
					>
						{/* Wrapper View to Padding to Compensate for Status Bar Padding */}
						<View
							style={{
								flex: 1,
								paddingBottom: statusBarHeight * 2,
							}}
						>
							{/* BACK NAVIGATION ICON */}
							<View style={styles.backIconContainer}>
								<Pressable
									style={styles.backIcon}
									onPress={() => navigation.pop()}
								>
									<Image
										source={require("../assets/img/back_icon.png")}
										style={styles.backIconImg}
									></Image>
								</Pressable>
							</View>

							<View style={styles.productImageContainer}>
								<Image
									source={{ uri: product.image_url }}
									style={styles.productImage}
								/>
							</View>
							{product.brands && (
								<Text style={styles.brand}>
									{product.brands.toUpperCase()}
								</Text>
							)}
							<Text style={styles.title}>{product.name}</Text>
							{product.avoid && <ProductIngredientsBad />}
							{!product.avoid && <ProductIngredientsOkay />}
							<View style={styles.ingredientsContainer}>
								<Text style={styles.ingredientsTitle}>
									Ingredients
								</Text>
								{processIngredientsIntoComponents()}
							</View>
						</View>
					</ScrollView>
				)}

				{loading && (
					<>
						<View
							style={{
								position: "absolute",
								width: "100%",
								height: "100%",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<ActivityIndicator
								size="small"
								color={colors.navy}
							/>
						</View>
						<View
							style={{
								flex: 1,
								justifyContent: "flex-start",
								alignItems: "center",
								paddingTop: statusBarHeight + 10,
								paddingBottom: statusBarHeight * 2,
							}}
						>
							<View style={styles.backIconContainer}>
								<Pressable
									style={styles.backIcon}
									onPress={() => navigation.pop()}
								>
									<Image
										source={require("../assets/img/back_icon.png")}
										style={styles.backIconImg}
									></Image>
								</Pressable>
							</View>

							<View style={styles.skeletonImageContainer}>
								<View style={styles.skeletonImage} />
							</View>
							<View style={styles.skeletonTitleContainer}>
								<View style={styles.skeletonBrand} />
								<View style={styles.skeletonTitle} />
							</View>
							<View
								style={styles.skeletonIngredientResultContainer}
							>
								<View style={styles.skeletonIngredientResult} />
							</View>
							<View style={styles.ingredientsContainer}>
								<View style={styles.skeletonIngredientsTitle} />
								<View style={styles.skeletonIngredient} />
								<View style={styles.skeletonIngredient} />
								<View style={styles.skeletonIngredient} />
							</View>
						</View>
					</>
				)}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.appBackground,
	},
	backIconContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	backIcon: {
		height: 60,
		width: 60,
		padding: 14,
		marginLeft: 5,
	},
	backIconImg: {
		height: "100%",
		width: "100%",
	},
	productImageContainer: {
		width: "100%",
		marginTop: 10,
		paddingHorizontal: 30,
	},
	productImage: {
		resizeMode: "contain",
		aspectRatio: 1,
		borderColor: colors.navy,
		borderWidth: 4,
		borderRadius: 10,
		marginBottom: 15,
		backgroundColor: colors.navy,
	},
	brand: {
		width: "100%",
		paddingHorizontal: 30,
		fontFamily: "Inter-Medium",
		textAlign: "left",
		fontSize: 18,
		color: colors.navy,
	},
	title: {
		width: "100%",
		paddingHorizontal: 30,
		fontFamily: "Inter-Bold",
		textAlign: "left",
		fontSize: 34,
		color: colors.navy,
	},
	ingredientsContainer: {
		width: "100%",
		paddingHorizontal: 30,
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
		width: "100%",
		textAlign: "left",
		fontSize: 18,
		color: colors.navy,
		fontFamily: "Inter-Medium",
	},
	ingredientBad: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		backgroundColor: colors.transRed,
		borderRadius: 8,
		shadowColor: "#888888",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.03,
		shadowRadius: 1.5,
		marginBottom: 7,
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	ingredientBadText: {
		textAlign: "left",
		fontSize: 18,
		color: colors.red,
		fontFamily: "Inter-Medium",
	},
	skeletonImageContainer: {
		width: "100%",
		marginTop: 10,
		paddingHorizontal: 35,
	},
	skeletonImage: {
		width: "100%",
		aspectRatio: 1,
		backgroundColor: colors.transGray,
		borderRadius: 10,
		marginBottom: 15,
	},
	skeletonTitleContainer: {
		width: "100%",
		paddingHorizontal: 30,
	},
	skeletonBrand: {
		width: "50%",
		height: 18,
		backgroundColor: colors.transGray,
		borderRadius: 6,
		marginBottom: 10,
	},
	skeletonTitle: {
		width: "60%",
		height: 34,
		backgroundColor: colors.transGray,
		borderRadius: 6,
	},
	skeletonIngredientResultContainer: {
		paddingLeft: 30,
		paddingRight: 30,
		marginTop: 20,
		marginBottom: 20,
		width: "100%",
	},
	skeletonIngredientResult: {
		width: "100%",
		borderRadius: 10,
		backgroundColor: colors.transGray,
		marginBottom: 15,
		height: 60,
	},
	skeletonIngredientsTitle: {
		width: "50%",
		backgroundColor: colors.transGray,
		height: 28,
		marginBottom: 10,
		borderRadius: 6,
	},
	skeletonIngredient: {
		width: "100%",
		backgroundColor: colors.transGray,
		height: 28,
		marginBottom: 7,
		borderRadius: 8,
	},
});

export default ProductScreen;
