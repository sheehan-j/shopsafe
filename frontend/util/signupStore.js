import { create } from "zustand";

const store = (set) => ({
	signupFirstname: "",
	setSignupFirstname: (firstname) =>
		set(() => ({ signupFirstname: firstname })),
	signupLastname: "",
	setSignupLastname: (lastname) => set(() => ({ signupLastname: lastname })),
	signupEmail: "",
	setSignupEmail: (email) => set(() => ({ signupEmail: email })),
	signupPassword: "",
	setSignupPassword: (password) => set(() => ({ signupPassword: password })),
	setupIngredients: [],
	setSetupIngredients: (ingredients) =>
		set(() => ({
			setupIngredients: ingredients,
		})),
});

export const useSignupStore = create(store);
