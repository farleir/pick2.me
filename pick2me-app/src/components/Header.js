import React from 'react';
import { BotIcon, HelpIcon } from './Icons';
import ThemeToggleButton from './ThemeToggleButton';

const Header = ({ onNavigate }) => {
  return (
    <header className="bg-indigo-600 text-white p-4 sm:p-5 rounded-t-none sm:rounded-t-xl flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-700 rounded-full">
          <BotIcon />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">Pick2.me Assistente</h1>
          <p className="text-xs sm:text-sm text-indigo-200">Seu guia de compras inteligente</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onNavigate('help')}
          className="p-2 rounded-full text-indigo-200 hover:bg-white/20 transition-colors"
          aria-label="Página de Ajuda"
        >
          <HelpIcon />
        </button>
        <ThemeToggleButton />
      </div>
    </header>
  );
};

export default Header;
