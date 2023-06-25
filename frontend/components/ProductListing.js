import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import colors from "../config/colors";
import searchApi from "../api/searchApi";

const ProductListing = ({
	image_url,
	name,
	barcode,
	avoid,
	saved,
	setProduct,
	navigation,
	onSaveButtonPressed,
}) => {
	const onPress = async () => {
		// const result = await searchApi.search(barcode);
		// setProduct(result);
		navigation.navigate("Product", {
			barcode: barcode,
			productLoaded: false,
		});
	};

	return (
		<View style={styles.container}>
			<View style={styles.iconsContainer}>
				{avoid && (
					<Image
						source={require("../assets/img/x_icon.png")}
						style={styles.icon}
					/>
				)}
				{!avoid && (
					<Image
						source={require("../assets/img/check_icon.png")}
						style={styles.icon}
					/>
				)}
				<Pressable onPress={onSaveButtonPressed} hitSlop={10}>
					{saved && (
						<Image
							source={require("../assets/img/save_icon_pressed.png")}
							style={styles.icon}
						/>
					)}
					{!saved && (
						<Image
							source={require("../assets/img/save_icon.png")}
							style={styles.icon}
						/>
					)}
				</Pressable>
			</View>
			<Pressable onPress={onPress}>
				<View style={styles.imageContainer}>
					<Image source={{ uri: image_url }} style={styles.image} />
				</View>
				<Text style={styles.title}>{name}</Text>
			</Pressable>
		</View>
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
	iconsContainer: {
		width: "100%",
		height: 22,
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	icon: {
		height: 22,
		width: 22,
	},
	imageContainer: {
		backgroundColor: "transparent",
		marginBottom: 10,
		// shadowColor: "#888888",
		// },
		// shadowOffset: {
		// 	width: 0,
		// 	height: 4,
		// shadowOpacity: 0.2,
	},
	image: {
		aspectRatio: 1,
		resizeMode: "contain",
	},
	title: {
		fontFamily: "Inter-Semi",
		fontSize: 17,
		textAlign: "left",
		color: colors.navy,
	},
});
