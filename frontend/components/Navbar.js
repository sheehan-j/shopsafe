import { View, Pressable, StyleSheet, Image } from "react-native";
import colors from "../config/colors";

const Navbar = ({ setScanModalVisible, setProduct }) => {
	return (
		<View style={styles.container}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed
							? colors.greenPressed
							: colors.green,
					},
					styles.scanIcon,
				]}
				onPressOut={() => {
					setScanModalVisible(true);
					setProduct(null); // Clear out any existing barcode
				}}
			>
				<Image
					source={require("../assets/scan_icon.png")}
					style={styles.scanIconImg}
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
		shadowOpacity: 0.06,
		shadowRadius: 1.5,
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center",
		paddingTop: 13,
	},
	scanIcon: {
		position: "relative",
		height: 60,
		width: 60,
		borderRadius: "50%",
		padding: 16,
	},
	scanIconImg: {
		height: "100%",
		width: "100%",
	},
});

export default Navbar;
