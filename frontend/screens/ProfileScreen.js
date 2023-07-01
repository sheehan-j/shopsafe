import {
	StyleSheet,
	View,
	ScrollView,
	Text,
	Dimensions,
	Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

import colors from "../config/colors";
import CustomStatusBar from "../components/CustomStatusBar";
import Navbar from "../components/Navbar";
import ProductListing from "../components/ProductListing";
import ProductSavedMessage from "../components/ProductSavedMessage";
import ProfileInfoCard from "../components/ProfileInfoCard";

import useStatusBarHeight from "../util/useStatusBarHeight";
import { useUserStore } from "../util/userStore";

const ProfileScreen = ({ navigation }) => {
	const statusBarHeight = useStatusBarHeight();
	const saveMessageAnimation = useSharedValue(0);
	const screenWidth = Dimensions.get("window").width;
	const translateMenu = useSharedValue(0);
	const translateMenuIndicator = useSharedValue(0);
	const [activePage, setActivePage] = useState("saved");
	const recentScans = useUserStore((state) => state.recentScans);
	const [allergies, setAllergies] = useState([
		{
			name: "test1",
		},
		{
			name: "test2",
		},
	]);

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
						// setProduct={setProduct}
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
							// setProduct={setProduct}
							navigation={navigation}
							onSaveButtonPressed={onSaveButtonPressed}
						/>
					)}
				</View>
			);
		}

		return rows;
	};

	const animatedMenuStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateMenu.value }],
	}));

	const animatedMenuIndicatorStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateMenuIndicator.value }],
	}));

	const setSavedActive = () => {
		setActivePage("saved");
		translateMenu.value = withTiming(0, { duration: 300 });
		translateMenuIndicator.value = withTiming(0, {
			duration: 300,
		});
	};

	const setAllergiesActive = () => {
		setActivePage("allergies");
		translateMenu.value = withTiming(-screenWidth, { duration: 300 });
		translateMenuIndicator.value = withTiming(screenWidth / 2, {
			duration: 300,
		});
	};

	const handleSwipe = (event) => {
		// Swipe right, change to saved page
		if (event.nativeEvent.translationX > 0) {
			if (activePage !== "saved") setSavedActive();
		} else {
			if (activePage !== "allergies") setAllergiesActive();
		}
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
					<ProductSavedMessage
						fontColor={"white"}
						bgColor={colors.green}
					/>
				</Animated.View>

				<CustomStatusBar color={"white"} border={false} />

				<ScrollView
					style={{ flex: 1, backgroundColor: "white" }}
					showsVerticalScrollIndicator={false}
				>
					<View
						style={{
							width: "100%",
							backgroundColor: "white",
							paddingTop: 20,
						}}
					>
						<ProfileInfoCard navigation={navigation} />
						<View style={styles.menuControlsContainer}>
							<Pressable
								style={styles.menuControl}
								onPress={
									activePage !== "saved"
										? setSavedActive
										: () => {}
								}
							>
								<Text style={styles.menuControlText}>
									Saved
								</Text>
							</Pressable>
							<Pressable
								style={styles.menuControl}
								onPress={
									activePage !== "allergies"
										? setAllergiesActive
										: () => {}
								}
							>
								<Text style={styles.menuControlText}>
									Allergies
								</Text>
							</Pressable>
							<Animated.View
								style={[
									styles.activeMenuIndicator,
									animatedMenuIndicatorStyle,
								]}
							/>
						</View>
					</View>

					<PanGestureHandler
						onGestureEvent={handleSwipe}
						activeOffsetX={[-50, 50]}
					>
						<Animated.View
							style={[
								{
									flex: 1,
									flexDirection: "row",
								},
								animatedMenuStyle,
							]}
						>
							{/* SAVED SECTION */}
							<View style={styles.menuContainer}>
								<Text style={styles.sectionHeader}>
									Saved Products
								</Text>
								<View style={styles.recentScansContainer}>
									{renderRecentScans()}
								</View>
							</View>
							<View
								style={{
									...styles.menuContainer,
									paddingHorizontal: 25,
								}}
							>
								<Text style={styles.sectionHeader}>
									Jordan's Allergies
								</Text>
								{allergies.map((allergy, index) => {
									return (
										<View
											key={index}
											style={styles.ingredient}
										>
											<Text style={styles.ingredientText}>
												{allergy.name}
											</Text>
										</View>
									);
								})}
							</View>
						</Animated.View>
					</PanGestureHandler>
				</ScrollView>

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
		fontSize: 24,
		color: colors.navy,
		marginBottom: 10,
	},
	recentScansContainer: {
		width: "100%",
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
	menuControlsContainer: {
		width: "100%",
		marginTop: 10,
		flexDirection: "row",
		paddingVertical: 10,
	},
	menuControl: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	menuControlText: {
		fontFamily: "Inter-Medium",
		fontSize: 16,
		color: colors.navy,
	},
	activeMenuIndicator: {
		backgroundColor: colors.navy,
		position: "absolute",
		left: 0,
		bottom: 0,
		width: "50%",
		height: 1.5,
	},
	recentScansContainer: {
		width: "100%",
	},
	recentScansRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginBottom: 10,
	},
	menuContainer: {
		width: "100%",
		paddingBottom: 160, // Accounting for navbar
		backgroundColor: colors.appBackground,
		paddingTop: 25,
		paddingHorizontal: 25,
	},
	ingredient: {
		width: "100%",
		backgroundColor: "white",
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 10,
		shadowColor: "#888888",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.03,
		shadowRadius: 1.5,
		marginBottom: 7,
	},
	ingredientText: {
		width: "100%",
		textAlign: "left",
		fontSize: 18,
		color: colors.navy,
		fontFamily: "Inter-Medium",
	},
});

export default ProfileScreen;
