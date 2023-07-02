import {
	StyleSheet,
	Text,
	TextInput,
	Pressable,
	Keyboard,
	KeyboardAvoidingView,
	View,
	Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import colors from "../config/colors";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE } from "../firebaseConfig";
import { useUserStore } from "../util/userStore";

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [focused, setFocused] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const { setUser, setUserInfo } = useUserStore((state) => ({
		setUser: state.setUser,
		setUserInfo: state.setUserInfo,
	}));

	const clearFocus = () => {
		setFocused("");
		Keyboard.dismiss();
	};

	const handleLogin = async () => {
		// Clear any existing errors
		setError(null);

		// Validate input
		if (email == "" || password == "") {
			setError("Error: All fields are required.");
			return;
		}

		// If input is valid, attempt login with firebase
		try {
			// User object in userStore is updated by useEffect in App.js
			setLoading(true);
			await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
		} catch (e) {
			if (
				e.code === "auth/invalid-email" ||
				e.code === "auth/wrong-password"
			) {
				setError("Error: Invalid email or password.");
			} else {
				setError(`Unexpected error: ${e.code}`);
			}
			setLoading(false);
			return;
		}

		// Retrieve user info
		try {
			const docRef = doc(
				FIRESTORE,
				"users",
				FIREBASE_AUTH.currentUser.uid
			);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log("User info loaded.");
				setUserInfo(docSnap.data());
			} else {
				// Reset user
				console.log("User info not found.");
				setUser(null);
				setUserInfo(null);
				alert(
					"Sorry! We ran into an unexpected error while trying to retrieve your user info. Please check your network connection and try again. If not, try again later.\n"
				);
			}
		} catch (err) {
			alert(
				"Sorry! We ran into an unexpected error while trying to retrieve your user info. Please check your network connection and try again. If not, try again later.\n"
			);
			console.log(err);
			setUser(null);
			setUserInfo(null);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<StatusBar content="dark" />
			<Pressable style={styles.container} onPress={clearFocus}>
				<KeyboardAvoidingView
					style={{ width: "100%" }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					{/* EMAIL INPUT */}
					<View>
						<Text
							style={{
								...styles.label,
								color:
									focused === "email"
										? colors.navy
										: colors.gray,
							}}
						>
							Email
						</Text>
					</View>
					<TextInput
						style={{
							...styles.input,
							borderColor:
								focused === "email"
									? colors.navy
									: colors.transGrayPressed,
							marginBottom: 15,
						}}
						label={"Email"}
						value={email}
						onChangeText={setEmail}
						placeholder={"Enter your email"}
						textContentType="emailAddress"
						autoCompleteType="off"
						onFocus={() => setFocused("email")}
						onBlur={() => setFocused("")}
					/>

					{/* PASSWORD INPUT */}
					<View>
						<Text
							style={{
								...styles.label,
								color:
									focused === "password"
										? colors.navy
										: colors.gray,
							}}
						>
							Password
						</Text>
					</View>
					<TextInput
						style={{
							...styles.input,
							borderColor:
								focused === "password"
									? colors.navy
									: colors.transGrayPressed,
							marginBottom: error ? 5 : 15,
						}}
						label={"Password"}
						value={password}
						onChangeText={setPassword}
						placeholder={"Enter your password"}
						textContentType="password"
						autoCompleteType="off"
						secureTextEntry
						onFocus={() => setFocused("password")}
						onBlur={() => setFocused("")}
					/>

					{/* ERROR MESSAGE */}
					<View>
						<Text
							style={{
								...styles.errorMessage,
								display: error ? "flex" : "none",
							}}
						>
							{error}
						</Text>
					</View>

					{/* LOGIN BUTTON */}
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed
									? colors.greenPressed
									: colors.green,
								opacity: loading ? 0.5 : 1,
							},
							styles.loginButton,
						]}
						onPress={!loading && handleLogin}
					>
						<Text style={styles.loginButtonText}>Login</Text>
					</Pressable>
					<Pressable
						style={styles.signUpLink}
						onPress={
							!loading &&
							(() => {
								setEmail("");
								setPassword("");
								setFocused("");
								setError(null);
								navigation.navigate("Signup");
							})
						}
					>
						<Text style={styles.signUpLinkText}>
							Don't have an account?{" "}
							<Text
								style={{
									fontFamily: "Inter-Medium",
									textDecorationLine: "underline",
								}}
							>
								Sign up here!
							</Text>
						</Text>
					</Pressable>
				</KeyboardAvoidingView>
			</Pressable>
		</>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
		paddingHorizontal: 40,
		backgroundColor: "white",
	},
	label: {
		fontFamily: "Inter",
		fontSize: 16,
		marginBottom: 5,
	},
	input: {
		width: "100%",
		fontFamily: "Inter",
		fontSize: 16,
		color: colors.navy,
		padding: 8,
		borderWidth: 1,
		borderRadius: 6,
		backgroundColor: "white",
	},
	errorMessage: {
		fontFamily: "Inter",
		fontSize: 13,
		color: "red",
		marginBottom: 5,
	},
	loginButton: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		borderRadius: 6,
		paddingVertical: 12,
		marginTop: 10,
	},
	loginButtonText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: "white",
	},
	signUpLink: {
		width: "100%",
		marginTop: 12,
	},
	signUpLinkText: {
		fontFamily: "Inter",
		color: colors.navy,
		textAlign: "center",
		width: "100%",
	},
});
