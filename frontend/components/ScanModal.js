import {
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	Pressable,
	Modal,
} from "react-native";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
} from "react-native-reanimated";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useState, useEffect, useRef } from "react";
import colors from "../config/colors";
import searchApi from "../api/searchApi";
import ProductNotFoundModal from "./ProductNotFoundModal";

const ScanModal = ({
	product,
	setProduct,
	scanModalVisible,
	setScanModalVisible,
}) => {
	const [scanned, setScanned] = useState(false);
	const [hasPermission, setHasPermission] = useState(false);
	const [productNotFound, setProductNotFound] = useState(false);
	const [productNotFoundModalVisible, setProductNotFoundModalVisible] =
		useState(false);

	// Aniamtion related values
	const animatedOpacity = useSharedValue(0);
	const animatedStyles = useAnimatedStyle(() => {
		return {
			opacity: withTiming(animatedOpacity.value),
		};
	});

	// Handle order of setting state variables for productNotFound modal
	// If productNotFoundModalVisible has been set false and productNotFound is still true,
	// then the cancel button has been pressed
	// This order makes the productNotFound modal fade out, THEN the scan modal closes
	useEffect(() => {
		if (!productNotFoundModalVisible) {
			if (productNotFound) {
				setScanModalVisible(false);
			}
		}
	}, [productNotFoundModalVisible]);

	// Reset scanned and productNotFound after scanModal has closed to prevent
	// weird visual effects with "searching.../barcode detected/product not found" text
	useEffect(() => {
		if (!scanModalVisible) {
			setProductNotFound(false);
			setScanned(false);
		}
	}, [scanModalVisible]);

	// Reset animatedOpacity value for the modal background
	useEffect(() => {
		if (!productNotFound) {
			animatedOpacity.value = 0;
		}
	}, [productNotFound]);

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	if (!hasPermission) {
		return (
			<View>
				<Text>Grant camera permissions to this app.</Text>
			</View>
		);
	}

	const handleBarCodeScanned = async ({ data }) => {
		setScanned(true);
		const result = await searchApi.search(data);

		if (result.status == "1") {
			setProduct(result.product.product_name);
		} else {
			setProductNotFound(true);
			animatedOpacity.value = animatedOpacity.value === 1 ? 0 : 1;
			setProductNotFoundModalVisible(true);
		}
	};

	const handleCancelPressed = async () => {
		setProduct(null);
		setScanModalVisible(false);
	};

	return (
		<View style={{ flex: 1 }}>
			<Animated.View
				style={[
					styles.modal_background,
					animatedStyles,
					{
						display: productNotFound ? "flex" : "none",
					},
				]}
				visible={productNotFound}
			/>
			<SafeAreaView style={styles.container}>
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
								color: productNotFound
									? colors.red
									: colors.green,
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
						onPressOut={handleCancelPressed}
					>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</Pressable>
				</View>
			</SafeAreaView>
			<Modal
				animationType="fade"
				transparent={true}
				visible={productNotFoundModalVisible}
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
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: "white",
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
