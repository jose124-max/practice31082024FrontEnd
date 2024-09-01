import React from 'react';
import { signInWithGoogle, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import './login.css'; // Importa el archivo CSS

const Login = ({ setUser }) => {
  const handleLogin = () => {
    signInWithGoogle().then(result => {
      const user = result.user;
      setUser(user);

      // Enviar los datos del usuario al backend de Django
      axios.post('http://localhost:8000/api/register/', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      })
      .then(response => {
        console.log('Usuario registrado en Django:', response.data);
      })
      .catch(error => {
        console.error('Error al registrar el usuario en Django:', error);
      });
      
    }).catch(error => {
      console.error('Error during sign in:', error);
    });
  };

  onAuthStateChanged(auth, user => {
    if (user) {
      setUser(user);
    }
  });

  return (
    <div className="login-container">
      <h2>Login</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
