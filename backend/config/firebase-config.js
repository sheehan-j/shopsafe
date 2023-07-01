import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import serviceAccountKey from "./serviceAccountKey.json" assert { type: "json" };

export const FIREBASE_APP = initializeApp({
	credential: cert(serviceAccountKey),
	databaseURL: "https://shopsafe-e4a5b-default-rtdb.firebaseio.com",
});
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
