import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

const ProductSavedMessage = ({ bgColor, fontColor }) => {
	return (
		<View style={{ ...styles.container, backgroundColor: bgColor }}>
			<Text style={{ ...styles.text, color: fontColor }}>
				Product save status updating.
			</Text>
		</View>
	);
};

export default ProductSavedMessage;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		width: "90%",
		padding: 5,
		borderRadius: 20,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 100,
	},
	text: {
		fontFamily: "Inter",
		fontSize: 16,
	},
});
