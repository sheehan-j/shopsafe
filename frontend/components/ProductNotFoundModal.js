import { SafeAreaView, StyleSheet, View, Text, Pressable } from "react-native";
import colors from "../config/colors";

const ProductNotFoundModal = ({
	setScanned,
	setProductNotFound,
	setProduct,
	setProductNotFoundModalVisible,
}) => {
	const handleCancelPressed = () => {
		// barcode and productNotFound get set in useEffect for scanModalVisible
		setProductNotFoundModalVisible(false);
	};

	const handleRescanPressed = () => {
		setProductNotFound(false);
		setScanned(false);
		setProduct(null);
		setProductNotFoundModalVisible(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.modal}>
				<Text style={styles.header}>Uh oh :&#40;</Text>
				<Text style={styles.body}>
					Unforunately, we couldn't find that barcode anywhere. Please
					ensure there are no other nearby barcodes that you may have
					mistakenly scanned.
				</Text>
				<View style={styles.buttonContainer}>
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed
									? colors.transGrayPressed
									: colors.transGray,
								marginRight: 4,
							},
							styles.button,
						]}
						onPressOut={handleCancelPressed}
					>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</Pressable>
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed
									? colors.greenPressed
									: colors.green,
								marginLeft: 4,
							},
							styles.button,
						]}
						onPressOut={handleRescanPressed}
					>
						<Text style={styles.rescanButtonText}>Rescan</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 99,
	},
	modal: {
		width: "75%",
		padding: 16,
		backgroundColor: "white",
		borderRadius: 10,
	},
	header: {
		fontFamily: "Inter-Bold",
		fontSize: 23,
		color: colors.grayText,
		textAlign: "center",
		marginBottom: 4,
	},
	body: {
		fontFamily: "Inter",
		fontSize: 16,
		color: colors.grayText,
		textAlign: "center",
		marginBottom: 16,
	},
	buttonContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
	},
	button: {
		flex: 1,
		justifyContent: "center",
		alignContent: "center",
		padding: 11,
		borderRadius: 5,
	},
	cancelButtonText: {
		fontFamily: "Inter-Semi",
		fontSize: 17,
		color: colors.gray,
		textAlign: "center",
		textAlignVertical: "center",
	},
	rescanButtonText: {
		fontFamily: "Inter-Semi",
		fontSize: 16,
		color: "white",
		textAlign: "center",
		textAlignVertical: "center",
	},
});

export default ProductNotFoundModal;
