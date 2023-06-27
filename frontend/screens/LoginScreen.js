import { StyleSheet, Text, TextInput, Pressable, Keyboard } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import colors from "../config/colors";

const LoginScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [focused, setFocused] = useState("");
	const [error, setError] = useState(false);

	const clearFocus = () => {
		setFocused("");
		Keyboard.dismiss();
	};

	return (
		<>
			<StatusBar content="dark" />
			<Pressable style={styles.container} onPress={clearFocus}>
				<Text
					style={{
						...styles.label,
						color: focused === "email" ? colors.navy : colors.gray,
					}}
				>
					Email
				</Text>
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
				<Text
					style={{
						...styles.label,
						color:
							focused === "password" ? colors.navy : colors.gray,
					}}
				>
					Password
				</Text>
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
				<Text
					style={{
						...styles.errorMessage,
						display: error ? "flex" : "none",
					}}
				>
					Email or password is invalid.
				</Text>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? colors.greenPressed
								: colors.green,
						},
						styles.loginButton,
					]}
					onPress={() => {}}
				>
					<Text style={styles.loginButtonText}>Login</Text>
				</Pressable>
				<Pressable style={styles.signUpLink}>
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
