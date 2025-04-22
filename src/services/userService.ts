import { database, auth } from "@/lib/adapters/firebase.client";
import { UserProps } from "@/types/user";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

const signUp = async (
    email: string, 
    password: string, 
    displayName: string,
) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
};

const login = async (
    email: string, 
    password: string,
) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};


const logout = async () => {
    await signOut(auth);
};

const getCurrentUser = () => {
    return auth.currentUser;
};


const addUser = async (
    userData: UserProps,
) => {
    console.log("[addUser] Adding User")
    try {
        const userRef = doc(database, "users", userData.userId);
        await setDoc(userRef, userData); 
        console.log("[addUser] User added with ID: ", userData.userId);
    } catch (error) {
        console.error("[addUser] Error adding user: ", error);
    }
};

const getUser = async (
    userId: string,
) => {
    console.log("[getUser] Getting user")
    try {
        const userDocRef = doc(database, "users", userId);

        // Fetch the user document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            return {
                userId: userData?.userId,
                username: userData?.username,
                friendlyId: userData?.friendlyId,
            };
        } else {
            console.log("[getUser] No user found with id: ", userId);
            return null;
        }
    } catch (error) {
        console.error("[getUser] Error getting user: ", error);
        return null;
    }
};

export { signUp, login, logout, getCurrentUser, addUser, getUser };
