import {
	StyleSheet,
	Text,
	View,
	Image,
	Pressable,
	PixelRatio,
} from "react-native";
import colors from "../config/colors";
import { useUserStore } from "../util/userStore";
import ProfileInfoCardStatistic from "./ProfileInfoCardStatistic";

const ProfileInfoCard = ({ navigation }) => {
	const {
		userFirstLastName,
		userEmail,
		totalScans,
		productsSaved,
		allergiesAdded,
	} = useUserStore((state) => ({
		userFirstLastName: state.userFirstLastName,
		userEmail: state.userEmail,
		totalScans: state.totalScans,
		productsSaved: state.productsSaved,
		allergiesAdded: state.allergiesAdded,
	}));

	return (
		<View style={styles.wrapper}>
			<View style={styles.container}>
				<Image
					source={require("../assets/img/profile_picture.jpg")}
					style={styles.profilePicture}
				/>
				<Text style={styles.name}>{userFirstLastName}</Text>
				<Text style={styles.email}>{userEmail}</Text>
				<View style={styles.statsContainer}>
					<ProfileInfoCardStatistic
						number={totalScans}
						label={"Total\nScans"}
						margin={false}
					/>
					<ProfileInfoCardStatistic
						number={productsSaved}
						label={"Products\nSaved"}
						margin={true}
					/>
					<ProfileInfoCardStatistic
						number={allergiesAdded}
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
});
