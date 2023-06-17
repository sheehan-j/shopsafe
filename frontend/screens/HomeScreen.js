import { SafeAreaView, StyleSheet, View, ScrollView, Text } from "react-native";
import Modal from "react-native-modal";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import colors from "../config/colors";
import Navbar from "../components/Navbar";
import ScanModal from "../components/ScanModal";
import CustomStatusBar from "../components/CustomStatusBar";
import HomeScreenHeader from "../components/HomeScreenHeader";
import ProductListing from "../components/ProductListing";

import useStatusBarHeight from "../util/useStatusBarHeight";
import searchApi from "../api/searchApi";

const HomeScreen = ({ navigation }) => {
	const statusBarHeight = useStatusBarHeight();
	const [scanModalVisible, setScanModalVisible] = useState(false);
	const [product, setProduct] = useState(null);
	const [productNotFound, setProductNotFound] = useState(false);
	const [scanned, setScanned] = useState(false);
	const [recentScans, setRecentScans] = useState([
		{
			image: "https://images.openfoodfacts.org/images/products/007/084/702/9427/front_en.3.400.jpg",
			title: "Monster Energy Peachy Keen",
			barcode: "0070847029427",
		},
		{
			image: "https://images.openfoodfacts.org/images/products/04963406/front_en.21.400.jpg",
			title: "Coca-Cola",
			barcode: "04963406",
		},
		{
			image: "https://images.openfoodfacts.org/images/products/007/084/702/9427/front_en.3.400.jpg",
			title: "Monster Energy Peachy Keen",
			barcode: "0070847029427",
		},
		// {
		// 	image: "https://images.openfoodfacts.org/images/products/007/084/702/9427/front_en.3.400.jpg",
		// 	title: "Monster Energy Peachy Keen",
		// 	barcode: "0070847029427",
		// },
	]);

	const scanModalDismissed = () => {
		if (product) {
			navigation.navigate("Product", { product: product });
		}

		// Reset these now that the modal has been dismissed
		setScanned(false);
		setProductNotFound(false);
	};

	const renderRecentScans = () => {
		const rows = [];
		for (let i = 0; i < recentScans.length; i += 2) {
			const item1 = recentScans[i];

			let item2;
			if (i + 1 < recentScans.length) item2 = recentScans[i + 1];
			else item2 = null;

			rows.push(
				<View style={styles.recentScansRow}>
					<ProductListing
						key={i}
						image={item1.image}
						title={item1.title}
						barcode={item1.barcode}
						setProduct={setProduct}
						navigation={navigation}
					/>
					{item2 && (
						<ProductListing
							key={i + 1}
							image={item2.image}
							title={item2.title}
							barcode={item2.barcode}
							setProduct={setProduct}
							navigation={navigation}
						/>
					)}
				</View>
			);
		}

		return rows;
	};

	return (
		<>
			{/* Set status bar content to dark */}
			<StatusBar style={"dark"} />
			<View style={{ flex: 1 }}>
				<CustomStatusBar color={colors.headerGreen} border={false} />

				<ScrollView
					style={{
						width: "100%",
						paddingTop:
							Platform.OS === "android"
								? StatusBar.currentHeight
								: statusBarHeight,
					}}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
				>
					<View
						style={{
							flex: 1,
							paddingBottom:
								Platform.OS === "android"
									? StatusBar.currentHeight * 2 + 100
									: statusBarHeight * 2 + 100,
						}}
					>
						<HomeScreenHeader name={"Jordan"} />
						<Text style={styles.sectionHeader}>Recent Scans</Text>
						<View style={styles.recentScansContainer}>
							{renderRecentScans()}
						</View>
					</View>
				</ScrollView>

				{/* NAVBAR */}
				<Navbar
					setScanModalVisible={setScanModalVisible}
					setProduct={setProduct}
				/>

				{/* SCANNER MODAL */}
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
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	sectionHeader: {
		width: "100%",
		fontFamily: "Inter-Bold",
		textAlign: "left",
		fontSize: 28,
		color: colors.navy,
		marginBottom: 10,
		paddingHorizontal: 25,
	},
	recentScansContainer: {
		width: "100%",
		paddingHorizontal: 25,
	},
	recentScansRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginBottom: 10,
	},
});

export default HomeScreen;
