import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useEffect } from "react";
import colors from "../config/colors";
import useExtraPadding from "../util/useExtraPadding";
import useStatusBarHeight from "../util/useStatusBarHeight";
import { useSignupStore } from "../util/signupStore";

const AllergiesSetupMessageScreen = ({ navigation }) => {
	const extraPadding = useExtraPadding();
	const statusBarHeight = useStatusBarHeight();
	const {
		setSignupFirstname,
		setSignupLastname,
		setSignupEmail,
		setSignupPassword,
		setSetupIngredients,
	} = useSignupStore((state) => ({
		setSignupFirstname: state.setSignupFirstname,
		setSignupLastname: state.setSignupLastname,
		setSignupEmail: state.setSignupEmail,
		setSignupPassword: state.setSignupPassword,
		setSetupIngredients: state.setSetupIngredients,
	}));

	useEffect(() => {
		const unsubscribe = navigation.addListener("beforeRemove", (e) => {
			handleCancel();
		});
		return unsubscribe;
	}, []);

	const handleCancel = () => {
		setSignupFirstname("");
		setSignupLastname("");
		setSignupEmail("");
		setSignupPassword("");
		setSetupIngredients([]);
	};

	return (
		<View style={styles.container}>
			<View
				style={{ ...styles.topContainer, marginTop: statusBarHeight }}
			>
				<Pressable
					style={styles.backIcon}
					hitSlop={20}
					onPress={() => navigation.pop()}
				>
					<Image
						source={require("../assets/img/back_icon.png")}
						style={styles.backIconImg}
					/>
				</Pressable>
			</View>
			<View style={styles.primaryContentWrapper}>
				<Text style={styles.title}>Allergies Setup</Text>
				<Text style={styles.body}>
					The core purpose of Shopsafe is based around the allergies
					associated with your profile. On the following screen, add
					any angredient that you're allergic to, doesn't fit your
					diet, or is something you generally want to avoid.
				</Text>
				<Text style={styles.body}>
					When you scan a product, Shopsafe will let you know if one
					of these ingredients is detected.
				</Text>
			</View>
			<View
				style={{
					...styles.buttonWrapper,
					marginBottom: extraPadding ? 46 : 33,
				}}
			>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? colors.greenPressed
								: colors.green,
						},
						styles.button,
					]}
					onPress={() =>
						navigation.navigate("SetupAllergies", {
							firstTimeSetup: true,
						})
					}
				>
					<Text style={styles.buttonText}>Go to Setup</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default AllergiesSetupMessageScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
	},
	topContainer: {
		width: "100%",
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingVertical: 15,
		zIndex: 1,
	},
	backIcon: {
		height: 20,
		width: 20,
		zIndex: 2,
		marginLeft: 12,
	},
	backIconImg: {
		height: "100%",
		width: "100%",
	},
	primaryContentWrapper: {
		position: "absolute",
		width: "100%",
		height: "100%",
		top: 0,
		left: 0,
		top: 0,
		right: 0,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	title: {
		width: "100%",
		fontFamily: "Inter-Bold",
		textAlign: "center",
		fontSize: 30,
		color: colors.navy,
		marginBottom: 10,
	},
	body: {
		width: "100%",
		fontFamily: "Inter",
		textAlign: "center",
		fontSize: 17,
		lineHeight: 22,
		color: colors.gray,
		marginBottom: 10,
	},
	buttonWrapper: {
		width: "100%",
		paddingHorizontal: 20,
	},
	button: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		borderRadius: 6,
		paddingVertical: 12,
		marginTop: 10,
	},
	buttonText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: "white",
	},
});
