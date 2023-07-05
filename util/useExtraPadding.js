/**
 * Hook for handling whether the device needs extra padding to compensensate for non-safe chin (newer iPhones)
 */
import { useEffect, useState } from "react";
import * as Device from "expo-device";

const useExtraPadding = () => {
	const [needsExtraPadding, setNeedsExtraPadding] = useState(false);

	useEffect(() => {
		const extraPaddingDevices = [
			"iPhone X",
			"iPhone 11",
			"iPhone 12",
			"iPhone 13",
			"iPhone 14",
		];

		const checkExtraPadding = () => {
			const deviceModel = Device?.modelName?.toLowerCase() || "";
			const needsPadding = extraPaddingDevices.some(
				(extraPaddingDevice) =>
					deviceModel.includes(extraPaddingDevice.toLowerCase())
			);
			setNeedsExtraPadding(needsPadding);
		};

		checkExtraPadding();
	}, []);

	return needsExtraPadding;
};

export default useExtraPadding;
