import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    Timestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function createTask(uid: string, task: any) {
    await addDoc(collection(db, "tasks"), {
        ...task,
        uid,
        createdAt: Timestamp.now(),
    });
}

export async function getTasks(uid: string) {
    const q = query(
        collection(db, "tasks"),
        where("uid", "==", uid)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}