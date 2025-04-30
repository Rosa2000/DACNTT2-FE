// src/App.js
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage, ForgotPassword } from './pages/auth';
import WelcomePage from './pages/welcome/WelcomePage';
import Dashboard from './pages/dashboard/Dashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="252976365448-nujo5mts3p67u715lif4drgjgsh3j7fl.apps.googleusercontent.com">
    <div>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/grammar" element={<div>Trang Học Ngữ Pháp (Chưa triển khai)</div>} />
          <Route path="/exercises" element={<div>Trang Bài Tập (Chưa triển khai)</div>} />
          <Route path="/test" element={<div>Trang Kiểm Tra Trình Độ (Chưa triển khai)</div>} />
          <Route path="/profile" element={<div>Trang Hồ Sơ (Chưa triển khai)</div>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AppRouter from './routes/AppRouter';
// import { store } from './store';

// ReactDOM.render(
//   <Provider store={store}>
//     <AppRouter />
//     <ToastContainer />
//   </Provider>,
//   document.getElementById('root')
// );
