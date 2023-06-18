import { StyleSheet, Text, View, Image } from "react-native";
import useStatusBarHeight from "../util/useStatusBarHeight";
import colors from "../config/colors";

const HomeScreenHeader = ({ name }) => {
	const statusBarHeight = useStatusBarHeight();

	return (
		<View style={{ ...styles.container, paddingTop: 40 + statusBarHeight }}>
			<Text style={styles.greeting}>Hello,</Text>
			<Text style={styles.name}>{name}</Text>
		</View>
	);
};

export default HomeScreenHeader;

const styles = StyleSheet.create({
	container: {
		position: "relative",
		width: "100%",
		backgroundColor: colors.headerGreen,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		paddingHorizontal: 30,
		paddingBottom: 18,
		shadowColor: "#888888",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.06,
		shadowRadius: 2.5,
	},
	greeting: {
		width: "100%",
		// paddingHorizontal: 5,
		fontFamily: "Inter",
		textAlign: "left",
		fontSize: 30,
		color: "white",
		// color: colors.navy,
	},
	name: {
		width: "100%",
		// paddingHorizontal: 5,
		fontFamily: "Inter-ExtraBold",
		textAlign: "left",
		fontSize: 45,
		color: "white",
		// color: colors.navy,
	},
	headerDesign: {
		position: "absolute",
		width: "100%",
		height: "100%",
		right: 0,
		bottom: 0,
		zIndex: 1,
	},
});
