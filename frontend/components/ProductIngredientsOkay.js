import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../config/colors";

const ProductIngredientsOkay = () => {
	return (
		<View style={styles.container}>
			<View style={styles.messageContainer}>
				<Image
					source={require("../assets/check_icon.png")}
					style={styles.checkIcon}
				></Image>
				<Text style={styles.messageText}>
					This product{" "}
					<Text style={{ fontFamily: "Inter-Bold" }}>likely</Text>{" "}
					does not contain any ingredients you are allergic to.
				</Text>
			</View>
		</View>
	);
};

export default ProductIngredientsOkay;

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
		backgroundColor: colors.transGreen,
		marginBottom: 15,
		padding: 15,
	},
	messageText: {
		flex: 1,
		fontFamily: "Inter-Medium",
		fontSize: 17,
		textAlign: "left",
		textAlignVertical: "center",
		color: colors.green,
		lineHeight: 24,
	},
	checkIcon: {
		height: 30,
		width: 30,
		marginRight: 15,
	},
});
