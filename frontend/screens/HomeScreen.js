import { StyleSheet, View, ScrollView, Text } from "react-native";
import Modal from "react-native-modal";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
	interpolate,
} from "react-native-reanimated";
import { FIREBASE_AUTH } from "../firebaseConfig";

import colors from "../config/colors";
import Navbar from "../components/Navbar";
import ScanModal from "../components/ScanModal";
import HomeScreenHeader from "../components/HomeScreenHeader";
import ProductListing from "../components/ProductListing";

import useStatusBarHeight from "../util/useStatusBarHeight";
import ProductSavedMessage from "../components/ProductSavedMessage";
import { useUserStore } from "../util/userStore";
import { shallow } from "zustand/shallow";

const HomeScreen = ({ navigation, route }) => {
	const statusBarHeight = useStatusBarHeight();
	const saveMessageAnimation = useSharedValue(0);

	const { userInfo } = useUserStore((state) => ({
		userInfo: state.userInfo,
	}));

	const [scanModalVisible, setScanModalVisible] = useState(false);
	const [product, setProduct] = useState(null);
	const [productNotFound, setProductNotFound] = useState(false);
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		if (route.params?.openScanModal) {
			setProduct(null);
			setScanModalVisible(true);
			route.params.openScanModal = false;
		}
	}, [route.params?.openScanModal]);

	// Resetting data and navigating after product scan
	const scanModalDismissed = () => {
		if (product) {
			navigation.navigate("Product", {
				product: product,
				productLoaded: true,
			});
		}

		// Reset these now that the modal has been dismissed
		setScanned(false);
		setProductNotFound(false);
	};

	// Handle save message eanimation
	const onSaveButtonPressed = () => {
		saveMessageAnimation.value = withTiming(1, {
			duration: 250,
			easing: Easing.inOut(Easing.quad),
		});

		setTimeout(() => {
			saveMessageAnimation.value = withTiming(0, {
				duration: 250,
				easing: Easing.inOut(Easing.quad),
			});
		}, 1500);
	};

	const slideDownAnimation = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY:
						saveMessageAnimation.value * (40 + statusBarHeight),
				},
			],
		};
	});

	// Processing Recent Scans into Components
	const renderRecentScans = () => {
		const rows = [];
		if (!userInfo?.recentScans) return null;

		for (let i = 0; i < userInfo?.recentScans.length; i += 2) {
			const item1 = userInfo?.recentScans[i];

			let item2;
			if (i + 1 < userInfo?.recentScans.length)
				item2 = userInfo?.recentScans[i + 1];
			else item2 = null;

			rows.push(
				<View style={styles.recentScansRow} key={i}>
					<ProductListing
						image_url={item1.image_url}
						name={item1.name}
						barcode={item1.barcode}
						avoid={item1.avoid}
						saved={item1.saved}
						setProduct={setProduct}
						navigation={navigation}
						onSaveButtonPressed={onSaveButtonPressed}
					/>
					{item2 && (
						<ProductListing
							image_url={item2.image_url}
							name={item2.name}
							barcode={item2.barcode}
							avoid={item2.avoid}
							saved={item2.saved}
							setProduct={setProduct}
							navigation={navigation}
							onSaveButtonPressed={onSaveButtonPressed}
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
			<StatusBar style={"light"} />
			<View style={styles.container}>
				<Animated.View
					style={[slideDownAnimation, styles.savedMessageContainer]}
				>
					<ProductSavedMessage
						fontColor={colors.navy}
						bgColor={"white"}
					/>
				</Animated.View>
				{/* <CustomStatusBar color={colors.headerGreen} border={false} /> */}
				<HomeScreenHeader name={userInfo?.firstname} />
				<ScrollView
					style={{
						width: "100%",
						paddingTop: 30,
					}}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
				>
					<View
						style={{
							flex: 1,
							paddingBottom: 160, // Accounting for navbar
						}}
					>
						<Text style={styles.sectionHeader}>Recent Scans</Text>
						<View style={styles.recentScansContainer}>
							{renderRecentScans()}
						</View>
					</View>
				</ScrollView>
				{/* NAVBAR */}
				<Navbar
					navigation={navigation}
					currScreen={"Home"}
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
	container: {
		flex: 1,
		backgroundColor: colors.appBackground,
	},
	sectionHeader: {
		width: "100%",
		fontFamily: "Inter-Bold",
		textAlign: "left",
		fontSize: 24,
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
	savedMessageContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		position: "absolute",
		top: -32, // Hide based on fixed height of the message
		zIndex: 100,
	},
});

export default HomeScreen;
