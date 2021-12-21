import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeQ6MAfSMRZPrzwPxnNYyt06qDSHienL0",
  authDomain: "suud-puhtaks.firebaseapp.com",
  projectId: "suud-puhtaks",
  storageBucket: "suud-puhtaks.appspot.com",
  messagingSenderId: "980060064834",
  appId: "1:980060064834:web:a7e184cc7cfbdcb32af1db"
};
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);
export default getFirestore();