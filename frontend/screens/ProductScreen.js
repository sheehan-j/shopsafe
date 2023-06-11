import { SafeAreaView, StyleSheet, View, Text } from "react-native";

const ProductScreen = () => {
	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<Text>yer</Text>
			</SafeAreaView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
		backgroundColor: colors.appBackground,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default ProductScreen;
