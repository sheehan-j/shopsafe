import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

const ProductSavedMessage = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Product save status updated.</Text>
		</View>
	);
};

export default ProductSavedMessage;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		width: "90%",
		padding: 5,
		backgroundColor: "white",
		borderRadius: 20,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		fontFamily: "Inter",
		fontSize: 16,
		color: colors.navy,
	},
});
