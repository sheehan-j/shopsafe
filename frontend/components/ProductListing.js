import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useEffect } from "react";
import colors from "../config/colors";
import searchApi from "../api/searchApi";

const ProductListing = ({ image, title, barcode, setProduct, navigation }) => {
	const onPress = async () => {
		const result = await searchApi.search(barcode);
		setProduct(result);
		navigation.navigate("Product", { product: result });
	};

	return (
		<Pressable style={styles.container} onPressOut={onPress}>
			<View style={styles.imageContainer}>
				<Image source={{ uri: image }} style={styles.image} />
			</View>
			<Text style={styles.title}>{title}</Text>
		</Pressable>
	);
};

export default ProductListing;

const styles = StyleSheet.create({
	container: {
		width: "48%",
		backgroundColor: "white",
		padding: 12,
		boxSizing: "content-box",
		borderRadius: 7,
	},
	imageContainer: {
		shadowColor: "#888888",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		marginBottom: 10,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
		resizeMode: "contain",
	},
	title: {
		fontFamily: "Inter-Semi",
		fontSize: 18,
		color: colors.navy,
	},
});
