import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyBO8wP8thv8nOfp8CbtDBH4FXalAdamZ0U',
  authDomain: 'proiecttic-4d5ad.firebaseapp.com',
  projectId: 'proiecttic-4d5ad',
  storageBucket: 'proiecttic-4d5ad.firebasestorage.app',
  messagingSenderId: '759804280026',
  appId: '1:759804280026:web:0f8d07a964c1306482f9e3',
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;