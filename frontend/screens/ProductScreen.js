import {
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	Pressable,
	Image,
	Platform,
	ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import useStatusBarHeight from "../util/useStatusBarHeight";

import CustomStatusBar from "../components/CustomStatusBar";
import colors from "../config/colors";
import ProductIngredientsOkay from "../components/ProductIngredientsOkay";
import ProductIngredientsBad from "../components/ProductIngredientsBad";

const ProductScreen = ({ navigation, route }) => {
	const statusBarHeight = useStatusBarHeight();

	const processIngredientsIntoComponents = () => {
		const ingredients = [];

		route.params.product.ingredients.map((ingredient, index) => {
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
				<ScrollView
					style={{
						width: "100%",
						// paddingTop:
						// 	Platform.OS === "android"
						// 		? StatusBar.currentHeight + 10
						// 		: statusBarHeight + 10,
						paddingTop: statusBarHeight + 10,
					}}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
				>
					{/* Wrapper View to Padding to Compensate for Status Bar Padding */}
					<View
						style={{
							flex: 1,
							// paddingBottom:
							// 	Platform.OS === "android"
							// 		? StatusBar.currentHeight * 2
							// 		: statusBarHeight * 2,
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

						{/* PRODUCT IMAGE */}
						<View style={styles.productImageContainer}>
							<Image
								source={{ uri: route.params.product.image_url }}
								style={styles.productImage}
							/>
						</View>

						{/* PRODUCT BRAND */}
						{route.params.product.brands && (
							<Text style={styles.brand}>
								{route.params.product.brands.toUpperCase()}
							</Text>
						)}
						{/* PRODUCT TITLE */}
						<Text style={styles.title}>
							{route.params.product.name}
						</Text>

						{route.params.product.avoid && (
							<ProductIngredientsBad />
						)}
						{!route.params.product.avoid && (
							<ProductIngredientsOkay />
						)}

						{/* INGREDIENTS */}
						<View style={styles.ingredientsContainer}>
							<Text style={styles.ingredientsTitle}>
								Ingredients
							</Text>
							{processIngredientsIntoComponents()}
						</View>
					</View>
				</ScrollView>
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
});

export default ProductScreen;
