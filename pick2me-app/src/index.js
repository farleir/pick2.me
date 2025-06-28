import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// O ThemeProvider não é mais necessário aqui, pois foi movido para dentro do App.js
// para englobar toda a lógica de tema e navegação.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
