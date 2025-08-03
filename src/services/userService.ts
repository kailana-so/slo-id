import { database, auth } from "@/lib/adapters/firebase.client";
import { UserProps } from "@/types/user";
import { setDoc, doc, getDoc, increment, updateDoc } from "firebase/firestore";
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
):Promise<boolean> => {
    try {
        const userRef = doc(database, "users", userData.userId);
        await setDoc(userRef, userData); 
        const friendlyIdRef = doc(database, "friendlyIds", userData.friendlyId);
        await setDoc(friendlyIdRef, {
            userId: userData.userId,
            maxUses: 3,
            used: 0
        }); 
        return true;
    } catch (error) {
        console.error("[addUser] Error adding user: ", error);
        return false
    }
};

const getUser = async (
    userId: string,
): Promise<{
    userId: string,
    username: string,
    friendlyId: string,
}|null> => {
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
            return null;
        }
    } catch {
        return null;
    }
};

const validateRefCode = async (
    refCode: string
  ): Promise<boolean | null> => {
  
    try {
      const friendlyIdDocRef = doc(database, "friendlyIds", refCode);
      const friendlyIdDoc = await getDoc(friendlyIdDocRef);
  
      if (!friendlyIdDoc.exists()) {
        console.log("[validateRefCode] RefCode not found:", refCode);
        return null;
      }
  
      const data = friendlyIdDoc.data();
      const used = data.used || 0;
      const maxUses = data.maxUses || 3;
  
      if (used >= maxUses) {
        console.warn(`[validateRefCode] RefCode ${refCode} exceeded (${used}/${maxUses})`);
        return false;
      }
  
      await updateDoc(friendlyIdDocRef, {
        used: increment(1),
      });
  
      return true;
    } catch (error) {
      console.error("[validateRefCode] Error getting/updating refCode: ", error);
      return null;
    }
};


export { signUp, login, logout, getCurrentUser, addUser, getUser, validateRefCode };
