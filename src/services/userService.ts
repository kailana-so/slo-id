import { database, auth } from "@/adapters/firebase";
import { UserProps } from "@/types/types";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
};

const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login error:", error); // Log the error to see the exact message
        throw error; // Rethrow the error to handle it in your LoginPage
    }
};


const logout = async () => {
    await signOut(auth);
};

const getCurrentUser = () => {
    return auth.currentUser;
};


const addUser = async (userData: UserProps) => {
    console.log("IN ADD USERS")
    try {
        const userRef = doc(database, "users", userData.user_id); // Specify the document ID
        await setDoc(userRef, userData); 
        console.log("User added with ID: ", userData.user_id);
    } catch (error) {
        console.error("Error adding user: ", error);
    }
};

const getUser = async (userId: string) => {
    try {
        const userDocRef = doc(database, "users", userId);

        // Fetch the user document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            return {
                user_id: userData?.user_id,
                username: userData?.username,
                friendly_id: userData?.friendly_id,
            };
        } else {
            console.log("No user found with id: ", userId);
            return null;
        }
    } catch (error) {
        console.error("Error getting user: ", error);
        return null;
    }
};

export { signUp, login, logout, getCurrentUser, addUser, getUser };
