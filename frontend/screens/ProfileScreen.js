import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
} from "react-native-reanimated";

import colors from "../config/colors";
import CustomStatusBar from "../components/CustomStatusBar";
import Navbar from "../components/Navbar";
import ProductListing from "../components/ProductListing";
import ProductSavedMessage from "../components/ProductSavedMessage";
import ProfileInfoCard from "../components/ProfileInfoCard";

import useStatusBarHeight from "../util/useStatusBarHeight";

const ProfileScreen = ({ navigation, route }) => {
	const statusBarHeight = useStatusBarHeight();
	const saveMessageAnimation = useSharedValue(0);

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
						saveMessageAnimation.value * (30 + statusBarHeight),
				},
			],
		};
	});

	// Processing Recent Scans into Components
	const renderRecentScans = () => {
		const rows = [];
		for (let i = 0; i < recentScans.length; i += 2) {
			const item1 = recentScans[i];

			let item2;
			if (i + 1 < recentScans.length) item2 = recentScans[i + 1];
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
			<StatusBar style={"dark"} />
			<View
				style={{
					...styles.container,
					paddingTop: statusBarHeight,
				}}
			>
				<Animated.View
					style={[slideDownAnimation, styles.savedMessageContainer]}
				>
					<ProductSavedMessage />
				</Animated.View>

				<CustomStatusBar color={"white"} border={false} />

				<View
					style={{
						width: "100%",
						backgroundColor: "white",
						paddingVertical: 20,
					}}
				>
					<ProfileInfoCard />
				</View>

				{/* <ScrollView
					style={{
						width: "100%",
						// paddingTop: statusBarHeight + 30,
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
						<Text style={styles.sectionHeader}>???</Text>
					</View>
				</ScrollView> */}
				{/* NAVBAR */}
				<Navbar navigation={navigation} currScreen={"Profile"} />
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
	savedMessageContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		position: "absolute",
		top: -32, // Hide based on fixed height of the message
		zIndex: 97,
	},
});

export default ProfileScreen;
