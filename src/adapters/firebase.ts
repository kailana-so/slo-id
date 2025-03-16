import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey:process.env.NEXT_PUBLIC_apiKey,
    authDomain:process.env.NEXT_PUBLIC_authDomain,
    projectId:process.env.NEXT_PUBLIC_projectId,
    storageBucket:process.env.NEXT_PUBLIC_storageBucket,
    messagingSenderId:process.env.NEXT_PUBLIC_messagingSenderId,
    appId:process.env.NEXT_PUBLIC_appId,
    measurementId:process.env.NEXT_PUBLIC_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
const auth = getAuth(app);
const database = getFirestore(app);
// Initialize Analytics only if supported
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});


export { database, auth };
