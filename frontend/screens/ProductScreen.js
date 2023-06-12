import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import colors from "../config/colors";
import testProduct from "../testProduct";

const ProductScreen = ({ navigation, route }) => {
	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<Text>{JSON.stringify(route.params.product)}</Text>
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
