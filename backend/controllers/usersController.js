import { FIREBASE_AUTH } from "../config/firebase-config.js";

export const getUserByEmail = async (req, res) => {
	const email = req.query?.email;

	try {
		const user = await FIREBASE_AUTH.getUserByEmail(email);
		return res.status(200).json({ exists: true, email: user.email });
	} catch (err) {
		return res.status(200).json({ exists: false, error: err.message });
	}
};
