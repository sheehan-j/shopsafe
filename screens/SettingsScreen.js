import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Pressable,
	Image,
	TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import colors from "../config/colors";
import useStatusBarHeight from "../util/useStatusBarHeight";
import { useUserStore } from "../util/userStore";
import { FIREBASE_AUTH, FIRESTORE } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const SettingsScreen = ({ navigation }) => {
	const statusBarHeight = useStatusBarHeight();
	const [focused, setFocused] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [changing, setChanging] = useState("");
	const { userInfo, setUserInfo } = useUserStore((state) => ({
		userInfo: state.userInfo,
		setUserInfo: state.setUserInfo,
	}));

	useEffect(() => {
		setFirstname(userInfo.firstname);
		setLastname(userInfo.lastname);
	}, [userInfo]);

	const handleChangeName = async (type) => {
		if (changing !== "") return;

		// Check that changes have been made
		if (type === "firstname" && firstname === userInfo.firstname) return;
		if (type === "lastname" && lastname === userInfo.lastname) return;

		try {
			setChanging(type);
			const docRef = doc(
				FIRESTORE,
				"users",
				FIREBASE_AUTH.currentUser.uid
			);
			const docSnap = await getDoc(docRef);
			let dbUserInfo;

			if (!docSnap.exists())
				throw new Error("User record not found in DB.");

			dbUserInfo = docSnap.data();
			if (type == "firstname") {
				dbUserInfo.firstname = firstname;
			} else if (type == "lastname") {
				dbUserInfo.lastname = lastname;
			} else {
				throw new Error(
					"Invalid type passed into handleChangeName function."
				);
			}

			await setDoc(docRef, dbUserInfo);
			setUserInfo(dbUserInfo);
		} catch (err) {
		} finally {
			setChanging("");
		}
	};

	const handleSignout = async () => {
		if (changing !== "") return;

		try {
			await FIREBASE_AUTH.signOut();
		} catch (err) {
			alert(
				"Sorry! There was an error signing you out. Please try again."
			);
		}
	};

	return (
		<>
			<StatusBar style={"dark"} />
			<View
				style={{
					width: "100%",
					flex: 1,
					paddingTop: statusBarHeight,
					backgroundColor: colors.appBackground,
				}}
			>
				{/* TOP BAR CONTAINER */}
				<View style={styles.topContainer}>
					<Pressable
						style={styles.backIcon}
						hitSlop={20}
						onPress={changing === "" && (() => navigation.pop())}
					>
						<Image
							source={require("../assets/img/back_icon.png")}
							style={styles.backIconImg}
						/>
					</Pressable>
					<View style={styles.titleWrapper}>
						<Text style={styles.title}>Settings</Text>
					</View>
				</View>

				<ScrollView
					style={styles.scrollContainer}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.settingContainer}>
						<Text style={styles.settingTitle}>Firstname</Text>
						<TextInput
							style={{
								...styles.input,
								borderColor:
									focused === "firstname"
										? colors.navy
										: colors.transGrayPressed,
							}}
							label={"Firstname"}
							value={firstname}
							onChangeText={setFirstname}
							editable={changing === ""}
							placeholder={"Loading..."}
							textContentType="givenName"
							autoCompleteType="off"
							onFocus={() => setFocused("firstname")}
							onBlur={() => setFocused("")}
						/>
						<Pressable
							style={({ pressed }) => [
								{
									backgroundColor:
										pressed &&
										firstname !== userInfo.firstname
											? colors.greenPressed
											: colors.green,
									opacity:
										firstname === userInfo.firstname ||
										changing !== ""
											? 0.5
											: 1,
								},
								styles.changeButton,
							]}
							onPress={() => handleChangeName("firstname")}
						>
							<Text style={styles.changeButtonText}>
								{changing === "firstname"
									? "Changing..."
									: "Change"}
							</Text>
						</Pressable>
					</View>

					<View style={styles.settingContainer}>
						<Text style={styles.settingTitle}>Lastname</Text>
						<TextInput
							style={{
								...styles.input,
								borderColor:
									focused === "lastname"
										? colors.navy
										: colors.transGrayPressed,
							}}
							label={"Lastname"}
							value={lastname}
							onChangeText={setLastname}
							editable={changing === ""}
							placeholder={"Loading..."}
							onFocus={() => setFocused("lastname")}
							onBlur={() => setFocused("")}
						/>
						<Pressable
							style={({ pressed }) => [
								{
									backgroundColor:
										pressed &&
										lastname !== userInfo.lastname
											? colors.greenPressed
											: colors.green,
									opacity:
										lastname === userInfo.lastname ||
										changing !== ""
											? 0.5
											: 1,
								},
								styles.changeButton,
							]}
							onPress={() => handleChangeName("lastname")}
						>
							<Text style={styles.changeButtonText}>
								{changing === "lastname"
									? "Changing..."
									: "Change"}
							</Text>
						</Pressable>
					</View>
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed
									? colors.transGrayPressed
									: colors.transGray,
								borderWidth: 0.5,
								borderColor: colors.transGrayPressed,
								opacity: changing !== "" ? 0.5 : 1,
							},
							styles.changeButton,
						]}
						onPress={handleSignout}
					>
						<Text style={styles.signoutButtonText}>Signout</Text>
					</Pressable>
				</ScrollView>
			</View>
		</>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.appBackground,
		zIndex: 0,
	},
	topContainer: {
		width: "100%",
		backgroundColor: colors.appBackground,
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingVertical: 15,
		borderBottomColor: colors.transGray,
		borderBottomWidth: 1,
		marginBottom: 15,
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
	// Absolutely center the title in the top bar so the back icon can stay left-aligned
	titleWrapper: {
		position: "absolute",
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		margin: 0,
		fontFamily: "Inter-Semi",
		fontSize: 22,
		color: colors.navy,
	},
	scrollContainer: {
		width: "100%",
		paddingHorizontal: 30,
	},
	settingContainer: {
		// backgroundColor: colors.transGray,
		backgroundColor: "white",
		paddingHorizontal: 15,
		paddingVertical: 20,
		borderRadius: 8,
		marginBottom: 20,
		// borderColor: colors.navy,
		// borderWidth: 0.4,
	},
	settingTitle: {
		fontFamily: "Inter-Medium",
		fontSize: 18,
		color: colors.navy,
		marginBottom: 8,
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
	changeButton: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		borderRadius: 6,
		paddingVertical: 10,
		marginTop: 10,
	},
	changeButtonText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: "white",
	},
	signoutButtonText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: colors.gray,
	},
});
