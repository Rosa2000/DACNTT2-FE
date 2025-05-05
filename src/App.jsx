// src/App.jsx
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { verifyLoginAsync, clearMessages } from './slices/authSlice';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!hasVerified.current) {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch(clearMessages());
        dispatch(verifyLoginAsync());
      }
      hasVerified.current = true;
    }
  }, [dispatch]);

  console.log('App component mounted. Verifying login status...', { hasVerified: hasVerified.current }, { token: localStorage.getItem('token') });
  return (
    <BrowserRouter>
      <div className="App">
        <AppRouter />
      </div>
    </BrowserRouter>
    
  );
}

export default App;