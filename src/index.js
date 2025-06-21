// import reportWebVitals from './reportWebVitals';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Đang tải trạng thái...</div>} persistor={persistor}>
        <GoogleOAuthProvider clientId="252976365448-nujo5mts3p67u715lif4drgjgsh3j7fl.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// reportWebVitals();