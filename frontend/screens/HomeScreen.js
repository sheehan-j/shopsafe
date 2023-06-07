import { SafeAreaView, TextInput, Pressable, Text, View } from "react-native";
import { useState } from "react";
import searchApi from "../api/searchApi";

const HomeScreen = () => {
	const [barcode, setBarcode] = useState("");

	const handleSubmit = async () => {
		const test = await searchApi.search(barcode);
		alert(test);
	};

	return (
		<SafeAreaView>
			<View style={{ padding: 30 }}>
				<TextInput
					onChangeText={setBarcode}
					value={barcode}
					style={{ backgroundColor: "red", height: 30 }}
				/>
				<Pressable
					onPress={() => {
						handleSubmit();
					}}
				>
					<Text>Submit</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
