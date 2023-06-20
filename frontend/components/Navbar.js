import { View, Pressable, StyleSheet, Image } from "react-native";
import colors from "../config/colors";

const Navbar = ({
	navigation,
	currScreen,
	setScanModalVisible,
	setProduct,
}) => {
	const openScanModal = () => {
		setProduct(null); // Clear out any existing product data
		setScanModalVisible(true);
	};

	return (
		<View style={styles.container}>
			{currScreen === "Home" && (
				<View style={styles.iconContainer}>
					<Image
						source={require("../assets/home_icon_dark.png")}
						style={styles.icon}
					/>
				</View>
			)}
			{currScreen !== "Home" && (
				<Pressable style={styles.iconContainer}>
					<Image
						source={require("../assets/home_icon_dark.png")}
						style={styles.icon}
					/>
				</Pressable>
			)}
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed
							? colors.greenPressed
							: colors.green,
					},
					styles.scanIcon,
				]}
				onPress={openScanModal}
			>
				<Image
					source={require("../assets/scan_icon.png")}
					style={styles.scanIconImg}
				/>
			</Pressable>
			{currScreen === "Profile" && (
				<View style={styles.iconContainer}>
					<Image
						source={require("../assets/profile_icon_pressed.png")}
						style={styles.icon}
					/>
				</View>
			)}
			{currScreen !== "Profile" && (
				<Pressable style={styles.iconContainer}>
					<Image
						source={require("../assets/profile_icon.png")}
						style={styles.icon}
					/>
				</Pressable>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		height: 100,
		width: "100%",
		bottom: 0,
		backgroundColor: "white",
		shadowColor: "#888888",
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.04,
		shadowRadius: 2.5,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignContent: "center",
		paddingTop: 13,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	iconContainer: {
		position: "relative",
		height: 58,
		width: 58,
		padding: 14,
	},
	icon: {
		height: "100%",
		width: "100%",
	},
	scanIcon: {
		position: "relative",
		height: 55,
		width: 55,
		borderRadius: 30,
		padding: 14,
	},
	scanIconImg: {
		height: "100%",
		width: "100%",
	},
});

export default Navbar;
