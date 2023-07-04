// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
	initializeAuth,
	getReactNativePersistence,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: "AIzaSyBRWvxAzkQFqAxGiI3a0TV31XTKKT4oRDA",
	authDomain: "shopsafe-e4a5b.firebaseapp.com",
	databaseURL: "https://shopsafe-e4a5b-default-rtdb.firebaseio.com",
	projectId: "shopsafe-e4a5b",
	storageBucket: "shopsafe-e4a5b.appspot.com",
	messagingSenderId: "1047876409921",
	appId: "1:1047876409921:web:9511cd89ac5b9a4f4184c0",
	measurementId: "G-VWEM672Q2W",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
	persistence: getReactNativePersistence(AsyncStorage),
});
