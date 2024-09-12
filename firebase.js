import { getFirestore } from 'firebase/firestore';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcRYvTWcae2M1UBjWdWCMrArlMqDmbhSo",
  authDomain: "product-management-699f5.firebaseapp.com",
  projectId: "product-management-699f5",
  storageBucket: "product-management-699f5.appspot.com",
  messagingSenderId: "176286208471",
  appId: "1:176286208471:web:8a27cb47414bf8706a7b92"
};

// Sets up a connection between the web application and firebase 
const app = initializeApp(firebaseConfig);
// Get a reference to the database
const firestore = getFirestore(app);
// Get a reference to the authentication service 
const auth = getAuth(app);

export {app, firestore, auth}