// src/App.js
import React, { useState } from 'react';
import Dashboard from './components/dashboard';
import Login from './components/login';

function App() {
  const [user, setUser] = useState(null);
  

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} />
      ) : (
        
        <Login setUser={setUser} />
      )}
    </div>
  );
}

export default App;
