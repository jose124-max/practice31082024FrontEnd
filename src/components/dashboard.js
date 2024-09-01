import React, { useState, useEffect } from 'react';
import { auth, signOut } from '../firebase'; 
import AdminPanel from './AdminPanel';
import RoomList from './roomlist';
import './dashboard.css'

const Dashboard = ({ user }) => {

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user.email === 'ja625367@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
      window.location.href = '/';
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };


  return (
    <div>
      <div className='navbar'>
        <h1>Bienvenido, {user.displayName}</h1>
        <button onClick={handleSignOut}>Cerrar sesión</button>
      </div>

      {isAdmin ? (
        <AdminPanel />
      ) : (
        <RoomList />
      )}
    </div>
  );
};

export default Dashboard;
