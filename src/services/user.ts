import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function createUserProfile(user: any) {
    const userRef = doc(db, "users", user.uid);

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            xp: 0,
            streak: 0,
            level: 1,
            createdAt: serverTimestamp(),
        });

        console.log("✅ New user profile created!");
    } else {
        console.log("✅ User already exists.");
    }
}