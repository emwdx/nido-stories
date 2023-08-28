import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import StoriesPage from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="406198787328-evg7t5sghl0h29pft8r7d95m7rkpf6pv.apps.googleusercontent.com">
  <React.StrictMode>
    <StoriesPage />
  </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
