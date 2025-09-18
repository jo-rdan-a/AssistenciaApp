import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOfRT2TLjdlLlt8R-VbFpByb_nYDVNdrE",
  authDomain: "orgatech-2d089.firebaseapp.com",
  projectId: "orgatech-2d089",
  storageBucket: "orgatech-2d089.firebasestorage.app",
  messagingSenderId: "1024462622411",
  appId: "1:1024462622411:web:806129bb14fccc8378554e"
};

// Inicializar app apenas se não existir
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Configurar Firestore
const db = getFirestore(app);

// Configurar Auth
const auth = getAuth(app);

export { auth, db };
export default app;

