import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../config/colors";

const ProductIngredientsBad = () => {
	return (
		<View style={styles.container}>
			<View style={styles.messageContainer}>
				<Image
					source={require("../assets/x_icon.png")}
					style={styles.checkIcon}
				></Image>
				<Text style={styles.messageText}>
					<Text style={{ fontFamily: "Inter-Bold" }}>
						{"At least one "}
					</Text>
					ingredient in this product was found in your list of
					allergies.
				</Text>
			</View>
		</View>
	);
};

export default ProductIngredientsBad;

const styles = StyleSheet.create({
	container: {
		paddingLeft: 30,
		paddingRight: 30,
		marginTop: 20,
		marginBottom: 20,
		width: "100%",
	},
	messageContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		borderRadius: 10,
		backgroundColor: colors.transRed,
		marginBottom: 15,
		padding: 15,
	},
	messageText: {
		flex: 1,
		fontFamily: "Inter-Medium",
		fontSize: 17,
		textAlign: "left",
		textAlignVertical: "center",
		color: colors.red,
		lineHeight: 24,
	},
	checkIcon: {
		height: 30,
		width: 30,
		marginRight: 15,
	},
});
