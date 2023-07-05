import { StyleSheet, Text } from "react-native";
import colors from "../config/colors";

const NoDataFound = () => {
	return <Text style={styles.text}>Nothing found here!</Text>;
};

export default NoDataFound;

const styles = StyleSheet.create({
	text: {
		fontFamily: "Inter",
		fontSize: 14,
		color: colors.navy,
		marginTop: 10,
		textAlign: "center",
	},
});
