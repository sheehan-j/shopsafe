import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default App = () => {
	const [loaded] = useFonts({
		"Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
		"Inter-ExtraBold": require("./assets/fonts/Inter-ExtraBold.ttf"),
		"Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
		Inter: require("./assets/fonts/Inter-Regular.ttf"),
		"Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
		"Inter-Semi": require("./assets/fonts/Inter-SemiBold.ttf"),
	});

	if (!loaded) {
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
						name="Home"
						component={HomeScreen}
						options={{
							animation: "none",
						}}
					/>
					<Stack.Screen name="Product" component={ProductScreen} />
					<Stack.Screen
						name="Profile"
						component={ProfileScreen}
						options={{
							animation: "none",
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
};
