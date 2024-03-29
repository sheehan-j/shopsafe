import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE } from "./firebaseConfig";
import { useUserStore } from "./util/userStore";
import * as SplashScreen from "expo-splash-screen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditAllergiesScreen from "./screens/EditAllergiesScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AllergiesSetupMessageScreen from "./screens/AllergiesSetupMessageScreen";
import FinishSetupScreen from "./screens/FinishSetupScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { doc, getDoc } from "firebase/firestore";

// Stop splash screen from being hidden while the app is loading
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function cacheImages(images) {
	return images.map((image) => {
		if (typeof image === "string") {
			return Image.prefetch(image);
		} else {
			return Asset.fromModule(image).downloadAsync();
		}
	});
}

const App = () => {
	const [appIsReady, setAppIsReady] = useState(false);
	const [noUserLoggedIn, setNoUserLoggedIn] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);
	const { user, userInfo, setUser, setUserInfo } = useUserStore((state) => ({
		user: state.user,
		userInfo: state.userInfo,
		setUser: state.setUser,
		setUserInfo: state.setUserInfo,
	}));

	// Load any resources or data that you need p rior to rendering the app
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				await Font.loadAsync({
					"Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
					"Inter-ExtraBold": require("./assets/fonts/Inter-ExtraBold.ttf"),
					"Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
					Inter: require("./assets/fonts/Inter-Regular.ttf"),
					"Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
					"Inter-Semi": require("./assets/fonts/Inter-SemiBold.ttf"),
				});

				// Cache image icons for faster load in-app
				const imageAssets = cacheImages([
					require("./assets/img/check_icon.png"),
					require("./assets/img/x_icon.png"),
					require("./assets/img/save_icon.png"),
					require("./assets/img/save_icon_pressed.png"),
					require("./assets/img/home_icon.png"),
					require("./assets/img/home_icon_pressed.png"),
					require("./assets/img/profile_icon.png"),
					require("./assets/img/profile_icon_pressed.png"),
					require("./assets/img/scan_icon.png"),
					require("./assets/img/back_icon.png"),
					require("./assets/img/default_profile_pic.png"),
					require("./assets/img/settings_icon.png"),
					require("./assets/img/x_icon_gray.png"),
					require("./assets/img/x_icon_navy.png"),
					require("./assets/img/plus_icon.png"),
				]);

				await Promise.all([...imageAssets]);
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}

		loadResourcesAndDataAsync();
	}, []);

	// Hide the splash screen once appIsReady is true
	useEffect(() => {
		const userInfoReady = userInfo !== null || noUserLoggedIn;
		if (appIsReady && userInfoReady && initialLoad) {
			setInitialLoad(false);
			SplashScreen.hideAsync();
		}
	}, [appIsReady, userInfo, noUserLoggedIn]);

	useEffect(() => {
		onAuthStateChanged(FIREBASE_AUTH, async (new_user) => {
			setUser(new_user);

			if (new_user) {
				try {
					const docRef = doc(FIRESTORE, "users", new_user.uid);
					const docSnap = await getDoc(docRef);

					if (!docSnap.exists())
						throw new Error("User record not found.");

					setUserInfo(docSnap.data());
				} catch (err) {
					// If for some reason the user was not found in the DB
					console.error(err);
					setUser(null);
					setNoUserLoggedIn(true);
				}
			} else {
				setNoUserLoggedIn(true);
			}
		});
	}, []);

	const userInfoReady = userInfo !== null || noUserLoggedIn;
	if (!appIsReady || !userInfoReady) {
		return null;
	}

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				{(!user || !userInfo) && (
					<>
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							options={{
								orientation: "portrait_up",
							}}
						/>
						<Stack.Screen
							name="Signup"
							component={SignupScreen}
							options={{
								animation: "slide_from_right",
								orientation: "portrait_up",
							}}
						/>
						<Stack.Screen
							name="AllergiesSetupMessage"
							component={AllergiesSetupMessageScreen}
							options={{
								animation: "slide_from_right",
								orientation: "portrait_up",
							}}
						/>
						<Stack.Screen
							name="SetupAllergies"
							component={EditAllergiesScreen}
							options={{
								animation: "slide_from_right",
								orientation: "portrait_up",
							}}
						/>
						<Stack.Screen
							name="FinishSetup"
							component={FinishSetupScreen}
							options={{
								animation: "slide_from_right",
								orientation: "portrait_up",
							}}
						/>
					</>
				)}
				{user && userInfo && (
					<>
						<Stack.Screen
							name="Home"
							component={HomeScreen}
							options={{
								animation: "slide_from_right",
								orientation: "portrait_up",
							}}
						/>
						<Stack.Screen
							name="Profile"
							component={ProfileScreen}
							options={{
								gestureEnabled: "false",
								animation: "none",
							}}
						/>
						<Stack.Screen
							name="Settings"
							component={SettingsScreen}
							options={{
								animation: "slide_from_right",
								orientation: "portrait_up",
							}}
						/>
						<Stack.Screen
							name="Product"
							component={ProductScreen}
							options={{
								animation: "slide_from_right",
								orientation: "portrait_up",
							}}
						/>
						<Stack.Screen
							name="EditAllergies"
							component={EditAllergiesScreen}
							options={{
								animation: "slide_from_right",
								orientation: "portrait_up",
							}}
						/>
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
