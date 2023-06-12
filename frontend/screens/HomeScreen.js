import { SafeAreaView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import colors from "../config/colors";
import Navbar from "../components/Navbar";
import ScanModal from "../components/ScanModal";
import searchApi from "../api/searchApi";

const HomeScreen = ({ navigation }) => {
	const [scanModalVisible, setScanModalVisible] = useState(false);
	const [product, setProduct] = useState(null);
	const [productNotFound, setProductNotFound] = useState(false);
	const [scanned, setScanned] = useState(false);

	const scanModalDismissed = () => {
		if (product) {
			navigation.navigate("Product", { product: product });
		}

		// Reset these now that the modal has been dismissed
		setScanned(false);
		setProductNotFound(false);
	};

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<Modal
					animationIn={"slideInUp"}
					animationOut={"slideOutDown"}
					isVisible={scanModalVisible}
					hasBackdrop={true}
					backdropColor={"black"}
					backdropOpacity={0.7}
					backdropTransitionOutTiming={0} // *** FIXES ANIMATION FLICKER
					style={{ margin: 0 }}
					onModalHide={scanModalDismissed}
					onSwipeComplete={() => setScanModalVisible(false)}
					swipeDirection={"down"}
				>
					<ScanModal
						scanModalVisible={scanModalVisible}
						setScanModalVisible={setScanModalVisible}
						product={product}
						setProduct={setProduct}
						scanned={scanned}
						setScanned={setScanned}
						productNotFound={productNotFound}
						setProductNotFound={setProductNotFound}
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
