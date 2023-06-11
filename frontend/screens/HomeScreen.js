import { SafeAreaView, StyleSheet, View, Modal } from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import colors from "../config/colors";
import Navbar from "../components/Navbar";
import ScanModal from "../components/ScanModal";
import searchApi from "../api/searchApi";

const HomeScreen = () => {
	const [scanModalVisible, setScanModalVisible] = useState(false);
	const [product, setProduct] = useState(null);

	useEffect(() => {
		if (product) {
			setScanModalVisible(false);
			setTimeout();
		}
	}, [product]);

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={scanModalVisible}
				>
					<ScanModal
						scanModalVisible={scanModalVisible}
						setScanModalVisible={setScanModalVisible}
						product={product}
						setProduct={setProduct}
					/>
				</Modal>

				<Navbar
					setScanModalVisible={setScanModalVisible}
					setProduct={setProduct}
				/>
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

export default HomeScreen;
