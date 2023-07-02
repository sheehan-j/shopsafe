import {
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	Pressable,
	Platform,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { useUserStore } from "../util/userStore";
import { FIREBASE_AUTH, FIRESTORE } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Modal from "react-native-modal";
import colors from "../config/colors";
import searchApi from "../api/searchApi";
import ProductNotFoundModal from "./ProductNotFoundModal";

const ScanModal = ({
	product,
	setProduct,
	setScanModalVisible,
	scanned,
	setScanned,
	productNotFound,
	setProductNotFound,
}) => {
	const { userInfo, setUserInfo } = useUserStore((state) => ({
		userInfo: state.userInfo,
		setUserInfo: state.setUserInfo,
	}));
	const { height } = Dimensions.get("window");
	const [aspectRatio, setAspectRatio] = useState(null);
	const cameraRef = useRef(null);
	const [hasPermission, setHasPermission] = useState(false);
	const [permission, requestPermission] = Camera.useCameraPermissions(); // For android
	// Have a separate state for modal visibility from productNotFound
	// productNotFound signals the textbox to change, this signals modal visibility
	const [productNotFoundModalVisible, setProductNotFoundModalVisible] =
		useState(false);

	const getAspectRatio = async () => {
		if (cameraRef.current && Platform.OS !== "ios") {
			const ratios = await cameraRef.current.getSupportedRatiosAsync();
			if (ratios.includes("16:9")) {
				setAspectRatio("16:9");
			} else {
				setAspectRatio("4:3");
			}
		}
	};

	// Handle order of setting state variables for productNotFound modal
	// If productNotFoundModalVisible has been set false and productNotFound is still true,
	// then the cancel button has been pressed
	// This order makes the productNotFound modal fade out, THEN the scan modal closes
	const productNotFoundModalDismissed = () => {
		if (productNotFound) {
			setScanModalVisible(false);
		}
	};

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	if (!hasPermission || !permission || !permission?.granted) {
		return (
			<View>
				<Text>Grant camera permissions to this app.</Text>
			</View>
		);
	}

	const handleBarCodeScanned = async ({ data }) => {
		setScanned(true);
		const result = await searchApi.search(data);

		// If product not found was returned by API
		if (result.status == 0) {
			setProductNotFound(true);
			setProductNotFoundModalVisible(true);
			return;
		}

		try {
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
				alert(
					"Sorry! We ran into an error processing this barcode. Please try again."
				);
				return;
			}

			// Add the new scan into user's existing list of sans
			dbUserInfo.recentScans = [
				...dbUserInfo.recentScans,
				{
					id: dbUserInfo.scanCount + 1,
					image_url: result.image_url,
					name: result.name,
					barcode: data,
					avoid: result.avoid,
					saved: false,
				},
			];
			dbUserInfo.scanCount = dbUserInfo.scanCount + 1;

			// Update user info in db
			await setDoc(docRef, dbUserInfo);
			setUserInfo(dbUserInfo);
		} catch (err) {
			console.log(err);
			alert(
				"Sorry! We ran into an error processing this barcode. Please try again."
			);
			return;
		}

		setProduct(result);
		setScanModalVisible(false);
	};

	return (
		<View style={{ ...styles.container, height: height }}>
			{/* <SafeAreaView style={styles.container}> */}
			{Platform.OS === "ios" && (
				<BarCodeScanner
					style={StyleSheet.absoluteFillObject}
					onBarCodeScanned={
						scanned ? undefined : handleBarCodeScanned
					}
					barCodeTypes={[
						BarCodeScanner.Constants.BarCodeType.ean13,
						BarCodeScanner.Constants.BarCodeType.ean8,
						BarCodeScanner.Constants.BarCodeType.upc_e,
						BarCodeScanner.Constants.BarCodeType.ean13,
					]}
				/>
			)}
			{Platform.OS !== "ios" && (
				<Camera
					style={StyleSheet.absoluteFillObject}
					useCamera2Api={true}
					ratio={aspectRatio}
					ref={cameraRef}
					onCameraReady={getAspectRatio}
					onBarCodeScanned={
						scanned ? undefined : handleBarCodeScanned
					}
					barCodeTypes={[
						BarCodeScanner.Constants.BarCodeType.ean13,
						BarCodeScanner.Constants.BarCodeType.ean8,
						BarCodeScanner.Constants.BarCodeType.upc_e,
						BarCodeScanner.Constants.BarCodeType.ean13,
					]}
				/>
			)}
			<View style={styles.footer}>
				<View style={styles.smallRoundedRect} />
				<View
					style={{
						...styles.searchingMessageContainer,
						backgroundColor:
							(!product && !productNotFound) ||
							(product && !productNotFound)
								? colors.transGreen
								: colors.transRed,
					}}
				>
					<Text
						style={{
							...styles.searchingMessageText,
							color: productNotFound ? colors.red : colors.green,
						}}
					>
						{!product && !productNotFound && "Searching..."}
						{product && !productNotFound && "Barcode detected"}
						{productNotFound && "Product not found"}
					</Text>
				</View>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? colors.transGrayPressed
								: colors.transGray,
						},
						styles.cancelButton,
					]}
					onPressOut={() => {
						setScanModalVisible(false);
					}}
				>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</Pressable>
			</View>
			<Modal
				animationIn={"fadeIn"}
				animationOut={"fadeOut"}
				animationInTiming={200}
				animationOutTiming={200}
				isVisible={productNotFoundModalVisible}
				hasBackdrop={true}
				backdropColor={"black"}
				backdropOpacity={0.7}
				backdropTransitionOutTiming={0} // *** FIXES ANIMATION FLICKER
				style={{ margin: 0 }}
				onModalHide={productNotFoundModalDismissed}
			>
				<ProductNotFoundModal
					setProductNotFound={setProductNotFound}
					setProduct={setProduct}
					setProductNotFoundModalVisible={
						setProductNotFoundModalVisible
					}
					setScanned={setScanned}
				/>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// aspectRatio: 1,
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: "red",
		zIndex: 97,
	},
	modal_background: {
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.7)",
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 98,
		elevation: 1,
	},
	scanner: {
		flex: 1,
	},
	footer: {
		position: "absolute",
		backgroundColor: "white",
		width: "100%",
		bottom: 0,
		paddingLeft: 30,
		paddingRight: 30,
		paddingBottom: 50,
		paddingTop: 18,
		justifyContent: "center",
		alignItems: "center",
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	smallRoundedRect: {
		height: 5,
		width: 45,
		backgroundColor: colors.gray,
		opacity: 0.85,
		borderRadius: 3,
		marginBottom: 20,
	},
	searchingMessageContainer: {
		width: "100%",
		justifyContent: "center",
		alignContent: "center",
		padding: 15,
		borderRadius: 10,
		backgroundColor: colors.transGreen,
		marginBottom: 15,
	},
	searchingMessageText: {
		fontFamily: "Inter-Bold",
		fontSize: 21,
		textAlign: "center",
		textAlignVertical: "center",
	},
	cancelButton: {
		width: "100%",
		justifyContent: "center",
		alignContent: "center",
		padding: 15,
		borderRadius: 10,
	},
	cancelButtonText: {
		fontFamily: "Inter-Semi",
		fontSize: 21,
		color: colors.gray,
		textAlign: "center",
		textAlignVertical: "center",
	},
});

export default ScanModal;
