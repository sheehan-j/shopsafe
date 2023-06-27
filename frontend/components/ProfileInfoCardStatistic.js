import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

const ProfileInfoCardStatistic = ({ number, label, margin }) => {
	return (
		<View style={{ ...styles.container, marginHorizontal: margin ? 7 : 0 }}>
			<Text style={styles.number}>{number}</Text>
			<Text style={styles.label}>{label}</Text>
		</View>
	);
};

export default ProfileInfoCardStatistic;
8;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 6,
		paddingVertical: 10,
		paddingHorizontal: 1,
	},
	number: {
		fontFamily: "Inter-Bold",
		fontSize: 21,
		color: colors.navy,
	},
	label: {
		marginTop: 2,
		fontFamily: "Inter",
		fontSize: 13,
		color: colors.navy,
		textAlign: "center",
	},
});
