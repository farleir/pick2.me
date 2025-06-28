import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import ChatPage from './pages/ChatPage';
import HelpPage from './pages/HelpPage';

function App() {
  const [currentPage, setCurrentPage] = useState('chat'); // 'chat' ou 'help'

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <ThemeProvider>
      {/* Container principal que ocupa a tela toda */}
      <div className="font-sans bg-white dark:bg-slate-900 flex flex-col items-center justify-center min-h-screen p-0 sm:p-4 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Container do Chat que se adapta em altura */}
        {/* **CORREÇÃO:** 'h-screen' foi alterado para 'h-full' e o container exterior agora gere a altura máxima. */}
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-none sm:rounded-xl w-full max-w-2xl flex flex-col h-full sm:h-[calc(100vh-3rem)] sm:max-h-[800px]">
          <Header onNavigate={navigateTo} />
          
          {currentPage === 'chat' && <ChatPage />}
          {currentPage === 'help' && <HelpPage onNavigate={navigateTo} />}

        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;