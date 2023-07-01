import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useState } from "react";
import colors from "../config/colors";
import useExtraPadding from "../util/useExtraPadding";
import useStatusBarHeight from "../util/useStatusBarHeight";
import { useSignupStore } from "../util/signupStore";
import { useUserStore } from "../util/userStore";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { FIRESTORE } from "../firebaseConfig";
import {
	createUserWithEmailAndPassword,
	deleteUser,
	updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const FinishSetupScreen = ({ navigation }) => {
	const auth = FIREBASE_AUTH;
	const extraPadding = useExtraPadding();
	const statusBarHeight = useStatusBarHeight();
	const state = useSignupStore();
	const { setUserInfo } = useUserStore((state) => ({
		setUserInfo: state.setUserInfo,
	}));
	const [loading, setLoading] = useState(false);

	const handleFinish = async () => {
		setLoading(true);
		let user;

		try {
			// Create the new user
			const email = state.signupEmail;
			const password = state.signupPassword;
			user = await createUserWithEmailAndPassword(auth, email, password);
		} catch (err) {
			alert(
				`Sorry! We ran into an unexpected error while trying to create your an account. Please check your network connection and try again. If not, try again later.\nError code: ${err}`
			);
			console.log(err);

			setLoading(false);
			return;
		}

		// Once user is created, add record for userInfo
		try {
			const newUserInfo = {
				firstname: state.signupFirstname,
				lastname: state.signupLastname,
				picture_url: "",
			};
			await setDoc(
				doc(FIRESTORE, "users", auth.currentUser.uid),
				newUserInfo
			);
			setUserInfo(newUserInfo);

			// Reset state and navigate if signup is successful
			state.setSignupFirstname("");
			state.setSignupLastname("");
			state.setSignupEmail("");
			state.setSignupPassword("");
			state.setSetupIngredients([]);
		} catch (err) {
			await deleteUser(auth.currentUser);

			console.log(err);
			alert(
				`Sorry! We ran into an unexpected error while trying to create your an account. Please check your network connection and try again. If not, try again later.\nError code: ${err}`
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View
				style={{ ...styles.topContainer, marginTop: statusBarHeight }}
			>
				<Pressable
					style={styles.backIcon}
					hitSlop={20}
					onPress={!loading && (() => navigation.pop())}
				>
					<Image
						source={require("../assets/img/back_icon.png")}
						style={styles.backIconImg}
					/>
				</Pressable>
			</View>
			<View style={styles.primaryContentWrapper}>
				<Text style={styles.title}>
					Welcome, {state.signupFirstname}!
				</Text>
				<Text style={styles.body}>
					Happy with the allergies you've set? Press the button below
					to finish setting up your account and start using Shopsafe!
				</Text>
				{/* <Text style={styles.body}>
					When you scan a product, Shopsafe will let you know if one
					of these ingredients is detected.
				</Text> */}
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
							opacity: loading ? 0.2 : 1,
						},
						styles.button,
					]}
					onPress={!loading && handleFinish}
				>
					<Text style={styles.buttonText}>
						{loading ? "Signing Up..." : "Finish Setup"}
					</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default FinishSetupScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
	},
	overlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
		backgroundColor: "black",
		zIndex: 100,
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
