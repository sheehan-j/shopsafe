import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default App = () => {
	return (
		<>
			<StatusBar barStyle={"dark-content"} />
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="Home" component={HomeScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
};
