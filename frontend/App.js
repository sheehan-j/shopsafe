import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditAllergiesScreen from "./screens/EditAllergiesScreen";
import LoginScreen from "./screens/LoginScreen";

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

export default App = () => {
	const [appIsReady, setAppIsReady] = useState(false);
	const [loaded] = useFonts({
		"Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
		"Inter-ExtraBold": require("./assets/fonts/Inter-ExtraBold.ttf"),
		"Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
		Inter: require("./assets/fonts/Inter-Regular.ttf"),
		"Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
		"Inter-Semi": require("./assets/fonts/Inter-SemiBold.ttf"),
	});

	// Load any resources or data that you need prior to rendering the app
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync();

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
					require("./assets/img/profile_picture.jpg"),
					require("./assets/img/x_icon_gray.png"),
					require("./assets/img/x_icon_navy.png"),
					require("./assets/img/plus_icon.png"),
				]);

				await Promise.all([...imageAssets]);
			} catch (e) {
				// You might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setAppIsReady(true);
				SplashScreen.hideAsync();
			}
		}

		loadResourcesAndDataAsync();
	}, []);

	if (!loaded || !appIsReady) {
		return null;
	}

	return (
		<>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						// options={{
						// 	animation: "none",
						// }}
					/>
					<Stack.Screen
						name="Home"
						component={HomeScreen}
						options={{
							animation: "none",
						}}
					/>
					<Stack.Screen
						name="Profile"
						component={ProfileScreen}
						options={{
							animation: "none",
						}}
					/>
					<Stack.Screen name="Product" component={ProductScreen} />
					<Stack.Screen
						name="EditAllergies"
						component={EditAllergiesScreen}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
};
