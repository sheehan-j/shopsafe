import {
	StyleSheet,
	Text,
	TextInput,
	Pressable,
	Keyboard,
	View,
	Platform,
	KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { useSignupStore } from "../util/signupStore";
import { config } from "../config/constants";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import colors from "../config/colors";

const SignupScreen = ({ navigation }) => {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [focused, setFocused] = useState("");
	const [error, setError] = useState("");
	const state = useSignupStore();

	const validateInput = async () => {
		// Ensure  all fields are filled
		if (
			!firstname ||
			!lastname ||
			!email ||
			!password ||
			!confirmPassword
		) {
			setError("Error: All fields are required.");
			return false;
		}

		// Ensure email is not registered
		let emailSignInMethods;
		try {
			emailSignInMethods = await fetchSignInMethodsForEmail(
				FIREBASE_AUTH,
				email
			);
		} catch (err) {
			// This method should only throw the error "auth/invalid-email"
			if (err.code == "auth/invalid-email") {
				setError("Error: Invalid email.");
			} else {
				setError(`Unexpected error: ${err.code}`);
			}
			return false;
		}

		if (emailSignInMethods.length !== 0) {
			setError("Error: Email already registered to an account.");
			return false;
		}

		if (password !== confirmPassword) {
			setError("Error: Passwords do not match.");
			return false;
		}

		if (password.length < 6) {
			setError("Error: Password must at least 6 characters in length.");
			return false;
		}

		return true;
	};

	const handleSignup = async () => {
		const valid = await validateInput();
		if (!valid) return;

		state.setSignupFirstname(firstname);
		state.setSignupLastname(lastname);
		state.setSignupEmail(email);
		state.setSignupPassword(password);
		setFirstname("");
		setLastname("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		navigation.navigate("AllergiesSetupMessage");
	};

	// Whenever the page loads (first time, or when cancelling setup and navigating back here), clear the store
	useEffect(() => {
		state.setSignupFirstname("");
		state.setSignupLastname("");
		state.setSignupEmail("");
		state.setSignupPassword("");
		state.setSetupIngredients([]);
	}, []);

	const clearFocus = () => {
		setFocused("");
		Keyboard.dismiss();
	};

	return (
		<>
			<StatusBar content="dark" />
			<Pressable style={styles.container} onPress={clearFocus}>
				<KeyboardAvoidingView
					style={{ width: "100%" }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<View style={{ width: "100%", flexDirection: "row" }}>
						<View style={{ flex: 1, marginRight: 5 }}>
							<Text
								style={{
									...styles.label,
									color:
										focused === "firstname"
											? colors.navy
											: colors.gray,
								}}
							>
								Firstname
							</Text>
							<TextInput
								style={{
									...styles.input,
									borderColor:
										focused === "firstname"
											? colors.navy
											: colors.transGrayPressed,
									marginBottom: 15,
								}}
								label={"firstname"}
								value={firstname}
								onChangeText={setFirstname}
								placeholder={"Enter your firstname"}
								textContentType="givenName"
								autoCompleteType="off"
								onFocus={() => setFocused("firstname")}
								onBlur={() => setFocused("")}
							/>
						</View>
						<View style={{ flex: 1, marginLeft: 5 }}>
							<Text
								style={{
									...styles.label,
									color:
										focused === "lastname"
											? colors.navy
											: colors.gray,
								}}
							>
								Lastname
							</Text>
							<TextInput
								style={{
									...styles.input,
									borderColor:
										focused === "lastname"
											? colors.navy
											: colors.transGrayPressed,
									marginBottom: 15,
								}}
								label={"Lastname"}
								value={lastname}
								onChangeText={setLastname}
								placeholder={"Enter your lastname"}
								textContentType="familyName"
								autoCompleteType="off"
								onFocus={() => setFocused("lastname")}
								onBlur={() => setFocused("")}
							/>
						</View>
					</View>
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
							marginBottom: 15,
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

					<View>
						<Text
							style={{
								...styles.label,
								color:
									focused === "confirmPassword"
										? colors.navy
										: colors.gray,
							}}
						>
							Confirm Password
						</Text>
					</View>
					<TextInput
						style={{
							...styles.input,
							borderColor:
								focused === "confirmPassword"
									? colors.navy
									: colors.transGrayPressed,
							marginBottom: error ? 5 : 15,
						}}
						label={"Confirm Password"}
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						placeholder={"Confirm your password"}
						textContentType="password"
						autoCompleteType="off"
						secureTextEntry
						onFocus={() => setFocused("confirmPassword")}
						onBlur={() => setFocused("")}
					/>

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

					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed
									? colors.greenPressed
									: colors.green,
							},
							styles.loginButton,
						]}
						onPress={handleSignup}
					>
						<Text style={styles.loginButtonText}>Signup</Text>
					</Pressable>
					<Pressable
						style={styles.signUpLink}
						onPress={() => navigation.pop()}
					>
						<Text style={styles.signUpLinkText}>
							Already have an account?{" "}
							<Text
								style={{
									fontFamily: "Inter-Medium",
									textDecorationLine: "underline",
								}}
							>
								Login here!
							</Text>
						</Text>
					</Pressable>
				</KeyboardAvoidingView>
			</Pressable>
		</>
	);
};

export default SignupScreen;

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
