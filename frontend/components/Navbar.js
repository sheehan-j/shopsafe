import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const Navbar = ({
	navigation,
	currScreen,
	setScanModalVisible,
	setProduct,
}) => {
	return (
		<View style={styles.container}>
			{/* HOME ICON */}
			<Pressable
				style={styles.iconContainer}
				onPress={
					currScreen === "Home"
						? () => {}
						: () => {
								navigation.navigate("Home");
						  }
				}
			>
				<Ionicons
					name={currScreen === "Home" ? "home" : "home-outline"}
					size={31}
					color={colors.navy}
				/>
			</Pressable>

			{/* SCAN ICON */}
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed
							? colors.greenPressed
							: colors.green,
					},
					styles.scanIcon,
				]}
				onPress={
					currScreen === "Home"
						? () => {
								setProduct(null);
								setScanModalVisible(true);
						  }
						: () => {
								navigation.navigate("Home", {
									openScanModal: true,
								});
						  }
				}
			>
				<MaterialCommunityIcons
					name="line-scan"
					size={27}
					color="white"
				/>
			</Pressable>

			{/* PROFILE ICON */}
			<Pressable
				style={styles.iconContainer}
				onPress={
					currScreen === "Profile"
						? () => {}
						: () => {
								navigation.navigate("Profile");
						  }
				}
			>
				<Ionicons
					name={
						currScreen === "Profile" ? "person" : "person-outline"
					}
					size={31}
					color={colors.navy}
				/>
			</Pressable>
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
		padding: 13,
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
