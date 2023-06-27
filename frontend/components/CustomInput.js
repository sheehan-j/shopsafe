import { StyleSheet, TextInput, View, Text } from "react-native";
import { useState } from "react";
import colors from "../config/colors";

const CustomInput = (props) => {
	const [focused, setFocused] = useState(false);

	return (
		<View style={{ width: "100%", paddingHorizontal: 30 }}>
			<Text
				style={{
					...styles.label,
					color: focused ? colors.navy : colors.gray,
				}}
			>
				{props.label}
			</Text>
			<TextInput
				value={props.value}
				onChangeText={props.onChangeText}
				placeholder={props.placeholder}
				textContentType={props?.textContentType}
				autoCompleteType={props?.autoCompleteType}
				secureTextEntry={props?.secureTextEntry}
				style={{
					...styles.input,
					borderColor: focused ? colors.navy : colors.transGray,
				}}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
			/>
		</View>
	);
};

export default CustomInput;

const styles = StyleSheet.create({
	label: {
		fontFamily: "Inter",
		fontSize: 16,
		marginBottom: 5,
	},
	input: {
		width: "100%",
		fontFamily: "Inter",
		fontSize: 16,
		color: colors.navy,
		padding: 8,
		// borderColor: colors.transGray,
		borderWidth: 1,
		borderRadius: 6,
		backgroundColor: "white",
		marginBottom: 20,
	},
});
