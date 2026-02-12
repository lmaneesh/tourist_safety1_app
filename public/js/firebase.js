import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCC9fuy8Tx779Cw_yqMSCvLwsiKnpKV4Do",
  authDomain: "tourist-safety-app-88014.firebaseapp.com",
  projectId: "tourist-safety-app-88014",
  storageBucket: "tourist-safety-app-88014.firebasestorage.app",
  messagingSenderId: "928177581442",
  appId: "1:928177581442:web:9b0be9ba2dab6dd98f339b"
};

// 1️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2️⃣ Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
