// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
