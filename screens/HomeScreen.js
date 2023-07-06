import {
	StyleSheet,
	View,
	ScrollView,
	Text,
	TextInput,
	Pressable,
	Image,
	Keyboard,
} from "react-native";
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
import { FIREBASE_AUTH, FIRESTORE } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUserStore } from "../util/userStore";
import { config } from "../config/constants";

import colors from "../config/colors";
import Navbar from "../components/Navbar";
import ScanModal from "../components/ScanModal";
import HomeScreenHeader from "../components/HomeScreenHeader";
import ProductListing from "../components/ProductListing";

import useStatusBarHeight from "../util/useStatusBarHeight";
import ProductSavedMessage from "../components/ProductSavedMessage";
import NoDataFound from "../components/NoDataFound";

const HomeScreen = ({ navigation, route }) => {
	const { userInfo, setUserInfo, firstTimeLoad, setFirstTimeLoad } =
		useUserStore((state) => ({
			userInfo: state.userInfo,
			setUserInfo: state.setUserInfo,
			firstTimeLoad: state.firstTimeLoad,
			setFirstTimeLoad: state.setFirstTimeLoad,
		}));
	const statusBarHeight = useStatusBarHeight();
	const saveMessageAnimation = useSharedValue(0);
	const opacityAnimation = useSharedValue(firstTimeLoad ? 0 : 1);
	const [scanModalVisible, setScanModalVisible] = useState(false);
	const [product, setProduct] = useState(null);
	const [productNotFound, setProductNotFound] = useState(false);
	const [scanned, setScanned] = useState(false);
	const [saveStatusUpdating, setSaveStatusUpdating] = useState(false);
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		if (route.params?.openScanModal) {
			setProduct(null);
			setScanModalVisible(true);
			route.params.openScanModal = false;
		}
	}, [route.params?.openScanModal]);

	useEffect(() => {
		opacityAnimation.value = withTiming(1, {
			duration: 200,
		});
		setFirstTimeLoad(false);
	}, []);

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

	// Save product logic
	const onSaveButtonPressed = async (id) => {
		// Start animation
		setSaveStatusUpdating(true);
		saveMessageAnimation.value = withTiming(1, {
			duration: 250,
			easing: Easing.inOut(Easing.quad),
		});

		try {
			// Retrieve user info data from DB
			const docRef = doc(
				FIRESTORE,
				"users",
				FIREBASE_AUTH.currentUser.uid
			);
			const docSnap = await getDoc(docRef);
			let dbUserInfo;
			if (docSnap.exists()) {
				dbUserInfo = docSnap.data();
			} else {
				throw new Error("Document not found.");
			}

			let originalSaveStatus;
			let targetScan = null;
			dbUserInfo.recentScans = dbUserInfo.recentScans.map((scan) => {
				if (scan.id === id) {
					targetScan = scan;
					originalSaveStatus = scan.saved;
					scan.saved = !scan.saved;
				}
				return scan;
			});

			if (!targetScan) {
				throw new Error(
					"ID of scan where save button was pressed was not found in recentScans for the user. This should never happen."
				);
			}

			if (originalSaveStatus === true) {
				dbUserInfo.savedProducts = dbUserInfo.savedProducts.filter(
					(scan) => scan.id !== id
				);
			} else {
				if (
					dbUserInfo.savedProducts.length ===
					config.MAX_SAVED_PRODUCTS
				) {
					throw new Error("Max saved products exceeded");
				}

				dbUserInfo.savedProducts = [
					...dbUserInfo.savedProducts,
					targetScan,
				];
			}

			await setDoc(docRef, dbUserInfo);
			setUserInfo(dbUserInfo);
		} catch (err) {
			if (err.message === "Max saved products exceeded") {
				alert(
					`Sorry! You can only have ${config.MAX_SAVED_PRODUCTS} saved products at a time. Please unsave some other products to save new ones.`
				);
			} else {
				alert(
					"Sorry! We had an unexpected problem trying to update the save status of this product. Please try again."
				);
			}
		} finally {
			setSaveStatusUpdating(false);
			// End animation after 1.5 second delay
			setTimeout(() => {
				saveMessageAnimation.value = withTiming(0, {
					duration: 250,
					easing: Easing.inOut(Easing.quad),
				});
			}, 1500);
		}
	};

	// Search logic
	const handleSearch = () => {
		navigation.navigate("Product", {
			barcode: searchText,
			textSearch: true,
		});
	};

	// When user presses "X" icon in the searchbar
	const clearSearch = () => {
		setSearchText("");
		Keyboard.dismiss();
	};

	// Processing Recent Scans into Components
	const renderRecentScans = () => {
		if (!userInfo?.recentScans || userInfo?.recentScans?.length === 0) {
			return <NoDataFound />;
		}
		const rows = [];

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
						saveStatusUpdating={saveStatusUpdating}
						onSaveButtonPressed={() =>
							onSaveButtonPressed(item1.id)
						}
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
							onSaveButtonPressed={() =>
								onSaveButtonPressed(item2.id)
							}
						/>
					)}
				</View>
			);
		}

		return rows;
	};

	// Animation logic
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

	const fadeInAnimation = useAnimatedStyle(() => {
		return {
			opacity: opacityAnimation.value,
		};
	});

	return (
		<>
			{/* Set status bar content to dark */}
			<StatusBar style={"light"} />
			<Animated.View style={[styles.container, fadeInAnimation]}>
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
					{/* SEARCH BAR */}
					<View style={styles.searchWrapper}>
						<View style={styles.searchContainer}>
							<TextInput
								style={styles.searchBar}
								value={searchText}
								onChangeText={setSearchText}
								keyboardType="number-pad"
								returnKeyType={
									Platform.OS === "ios" ? "done" : "search"
								}
								placeholder="Enter a barcode number"
								onSubmitEditing={handleSearch}
							/>

							{/* CLEAR SEARCH BUTTON */}
							{searchText && (
								<Pressable
									style={styles.clearSearchIcon}
									hitSlop={20}
									onPress={clearSearch}
								>
									<Image
										source={require("../assets/img/x_icon_gray.png")}
										style={{
											width: "100%",
											height: "100%",
										}}
									/>
								</Pressable>
							)}
						</View>
					</View>

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
			</Animated.View>
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
	searchWrapper: {
		width: "100%",
		paddingHorizontal: 25,
		marginBottom: 20,
	},
	searchContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 7,
		shadowColor: "#888888",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.06,
		shadowRadius: 2,
	},
	searchBar: {
		flex: 1,
		fontFamily: "Inter-Medium",
		fontSize: 16,
		color: colors.navy,
		borderRadius: 5,
		paddingLeft: 15,
		paddingVertical: 10,
	},
	clearSearchIcon: {
		height: 16,
		aspectRatio: 1,
		marginRight: 12,
		marginLeft: 14,
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
