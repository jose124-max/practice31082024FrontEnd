import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';  // Importa `signOut` aquí
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAe3eCWizM5AzRf-NQmCz4oIZ-j4t_P3aM",
    authDomain: "practicehotel-79e8e.firebaseapp.com",
    projectId: "practicehotel-79e8e",
    storageBucket: "practicehotel-79e8e.appspot.com",
    messagingSenderId: "24770195240",
    appId: "1:24770195240:web:8ff20cebdd7429fc146a1d",
    measurementId: "G-ZZCGETQR6P"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export { auth, storage, signInWithGoogle,signOut };
