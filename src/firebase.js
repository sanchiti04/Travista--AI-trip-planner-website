// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgZpL5chF8lu5KvcbIbi5t8JG2CN-UBO4",
  authDomain: "travista-bad11.firebaseapp.com",
  projectId: "travista-bad11",
  storageBucket: "travista-bad11.firebasestorage.app",
  messagingSenderId: "623075407503",
  appId: "1:623075407503:web:2b343ed47715f372b462fa",
  measurementId: "G-2VEN0J217D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);