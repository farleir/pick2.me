import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importa o CSS principal (onde pode ter as diretivas do Tailwind)
import App from './App.js';

// Cria a raiz da aplicação React, apontando para o elemento com id 'root' no seu index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza o componente principal 'App' dentro da raiz
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
