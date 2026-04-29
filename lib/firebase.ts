import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-LRN_ewB86eUx21JW80-l1siVwnbsb_I",
  authDomain: "xuong-in-1991.firebaseapp.com",
  projectId: "xuong-in-1991",
  storageBucket: "xuong-in-1991.firebasestorage.app",
  messagingSenderId: "250024162257",
  appId: "1:250024162257:web:c12c9478c86b2f4b8966f0"
};

// Khởi tạo Firebase (Tránh lỗi khởi tạo nhiều lần trong Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };