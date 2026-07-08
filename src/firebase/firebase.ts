import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDWcKia6LWNNlaPU6WWL7-WeYBOK9iW5Q0",
    authDomain: "studyos-6d24f.firebaseapp.com",
    projectId: "studyos-6d24f",
    storageBucket: "studyos-6d24f.firebasestorage.app",
    messagingSenderId: "151510593146",
    appId: "1:151510593146:web:ebf605170efb497925d5c3",
    measurementId: "G-T36XX5WF87",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
