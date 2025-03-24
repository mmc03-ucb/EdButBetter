// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqyasJWP5qn_j9EML1iic0QEGvdtNcU9Q",
  authDomain: "hack-a-byte-6cdd1.firebaseapp.com",
  projectId: "hack-a-byte-6cdd1",
  storageBucket: "hack-a-byte-6cdd1.firebasestorage.app",
  messagingSenderId: "1089614248473",
  appId: "1:1089614248473:web:4675f4d8a7a31010ab0888"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local (session remains on refresh)");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error.message);
  });
  
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();

export default app;
export { auth };