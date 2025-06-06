// src/App.jsx
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { verifyLoginAsync, clearMessages } from './slices/authSlice';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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

  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="App">
          <AppRouter />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;