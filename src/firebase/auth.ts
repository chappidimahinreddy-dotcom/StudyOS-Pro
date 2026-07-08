import { createUserProfile } from "../services/user";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        await createUserProfile(result.user);
        return result.user;
    } catch (error) {
        console.error(error);
    }
};

export const logout = async () => {
    await signOut(auth);
};