// src/App.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyLoginAsync } from './slices/authSlice';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyLoginAsync());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="App">
        <AppRouter />
      </div>
    </BrowserRouter>
    
  );
}

export default App;