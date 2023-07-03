import {
	StyleSheet,
	Text,
	View,
	Image,
	Pressable,
	PixelRatio,
} from "react-native";
import { useUserStore } from "../util/userStore";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";
import ProfileInfoCardStatistic from "./ProfileInfoCardStatistic";

const ProfileInfoCard = ({ navigation }) => {
	const email = FIREBASE_AUTH?.currentUser?.email;
	const { userInfo } = useUserStore((state) => ({
		userInfo: state.userInfo,
	}));

	return (
		<View style={styles.wrapper}>
			<View style={styles.container}>
				<Pressable
					style={styles.settingsButton}
					hitSlop={30}
					onPress={() => {
						navigation.navigate("Settings");
					}}
				>
					<FontAwesome name="gear" size={24} color={colors.gray} />
				</Pressable>
				<Image
					source={require("../assets/img/default_profile_pic.png")}
					style={styles.profilePicture}
				/>
				<Text
					style={styles.name}
				>{`${userInfo?.firstname} ${userInfo?.lastname}`}</Text>
				<Text style={styles.email}>{email}</Text>
				<View style={styles.statsContainer}>
					<ProfileInfoCardStatistic
						number={userInfo?.scanCount}
						label={"Total\nScans"}
						margin={false}
					/>
					<ProfileInfoCardStatistic
						number={userInfo?.savedProducts?.length}
						label={"Products\nSaved"}
						margin={true}
					/>
					<ProfileInfoCardStatistic
						number={userInfo?.allergies?.length}
						label={"Allergies\nAdded"}
						margin={false}
					/>
				</View>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? colors.greenPressed
								: colors.green,
						},
						styles.editAllergiesButton,
					]}
					onPress={() => {
						navigation.navigate("EditAllergies");
					}}
				>
					<Text style={styles.editAllergiesButtonText}>
						Edit Allergies
					</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default ProfileInfoCard;

const styles = StyleSheet.create({
	wrapper: {
		paddingHorizontal: 25,
		width: "100%",
	},
	container: {
		backgroundColor: colors.appBackground,
		width: "100%",
		borderRadius: 10,
		paddingHorizontal: 15,
		paddingVertical: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	profilePicture: {
		width: 100,
		height: 100,
		aspectRatio: 1,
		borderRadius: 100 / 2,
	},
	name: {
		fontFamily: "Inter-Semi",
		fontSize: 22,
		color: colors.navy,
		marginTop: 6,
	},
	email: {
		fontFamily: "Inter",
		fontSize: 14,
		color: colors.navy,
		marginTop: 4,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
	},
	editAllergiesButton: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		borderRadius: 6,
		paddingVertical: 12,
		marginTop: 10,
	},
	editAllergiesButtonText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: "white",
	},
	settingsButton: {
		position: "absolute",
		right: 10,
		top: 10,
		height: 24,
		width: 24,
	},
});
