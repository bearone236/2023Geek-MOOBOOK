import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PoseProvider } from './function/postcontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PoseProvider>
      {' '}
      <App />
    </PoseProvider>
  </React.StrictMode>
);
