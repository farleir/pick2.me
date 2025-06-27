import React from 'react';
import { BotIcon } from './Icons';

const Header = () => {
  return (
    <header className="bg-indigo-600 text-white p-4 sm:p-5 rounded-t-none sm:rounded-t-xl flex items-center space-x-4 shadow-lg">
      <div className="p-2 bg-indigo-700 rounded-full">
        <BotIcon />
      </div>
      <div>
        <h1 className="text-lg sm:text-xl font-semibold">Pick2.me Assistente</h1>
        <p className="text-xs sm:text-sm text-indigo-200">Seu guia de compras inteligente</p>
      </div>
    </header>
  );
};

export default Header;