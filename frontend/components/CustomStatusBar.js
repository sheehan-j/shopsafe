import { StyleSheet, View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import useStatusBarHeight from "../util/useStatusBarHeight";
import colors from "../config/colors";

const CustomStatusBar = ({ color, border }) => {
	const statusBarHeight = useStatusBarHeight();

	return (
		<View
			style={{
				...styles.container,
				// height:
				// 	Platform.OS === "android"
				// 		? StatusBar.currentHeight
				// 		: statusBarHeight,
				height: statusBarHeight,
				backgroundColor: color,
				borderBottomWidth: border ? 0.25 : 0,
			}}
		></View>
	);
};

export default CustomStatusBar;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 99,
		borderBottomColor: colors.transGray,
	},
});
