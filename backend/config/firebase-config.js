import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import serviceAccountKey from "./serviceAccountKey.json" assert { type: "json" };

const app = initializeApp({
	credential: cert(serviceAccountKey),
	databaseURL: "https://shopsafe-e4a5b-default-rtdb.firebaseio.com",
});

const auth = getAuth(app);
export default auth;
